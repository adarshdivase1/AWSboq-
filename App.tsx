
import React, { useState, useCallback, useEffect } from 'react';

import Header from './components/Header';
import ClientDetails from './components/ClientDetails';
import Questionnaire from './components/Questionnaire';
import BoqDisplay from './components/BoqDisplay';
import RoomCard from './components/RoomCard';
import TabButton from './components/TabButton';
import ConfirmModal from './components/ConfirmModal';
import AddRoomModal from './components/AddRoomModal';
import CompareModal from './components/CompareModal';
import Toast from './components/Toast';
import BrandingModal from './components/BrandingModal';
import PrintHeader from './components/PrintHeader';

import { BoqItem, ClientDetails as ClientDetailsType, Room, Toast as ToastType, Theme, BrandingSettings, Currency } from './types';
import { generateBoq, refineBoq, generateRoomVisualization, validateBoq, generateRoomSchematic } from './services/geminiService';
import { exportToXlsx } from './utils/exportToXlsx';
import { getExchangeRates } from './utils/currency';

import SparklesIcon from './components/icons/SparklesIcon';
import AuthGate from './components/AuthGate';
import LoaderIcon from './components/icons/LoaderIcon';
import SaveIcon from './components/icons/SaveIcon';
import LoadIcon from './components/icons/LoadIcon';
import CompareIcon from './components/icons/CompareIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import PlusIcon from './components/icons/PlusIcon';

type ActiveTab = 'details' | 'rooms';

const defaultBranding: BrandingSettings = {
  logoUrl: '',
  primaryColor: '#92D050', // Default green
  companyInfo: {
    name: 'Your Company Name',
    address: '123 Main Street, Suite 100, Anytown, USA 12345',
    phone: '555-123-4567',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
  },
};

const App: React.FC = () => {
  const [clientDetails, setClientDetails] = useState<ClientDetailsType>({
    clientName: '',
    projectName: '',
    preparedBy: '',
    date: new Date().toISOString().split('T')[0],
    designEngineer: '',
    accountManager: '',
    keyClientPersonnel: '',
    location: '',
    keyComments: '',
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  const [isRefining, setIsRefining] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [margin, setMargin] = useState<number>(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>(defaultBranding);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number> | null>(null);

  const activeRoom = rooms.find(room => room.id === activeRoomId);

  // --- Theme Management ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Fetch Exchange Rates ---
  useEffect(() => {
    const fetchRates = async () => {
      const rates = await getExchangeRates();
      setExchangeRates(rates);
    };
    fetchRates();
  }, []);

  const canExport = rooms.some(r => r.boq && r.boq.length > 0);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSaveProject();
            break;
          case 'e':
            event.preventDefault();
            if(canExport) handleExport();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rooms, clientDetails, margin, brandingSettings, canExport, selectedCurrency]); 

  // --- Toast Timeout ---
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddRoom = (templateAnswers: Record<string, any> = {}, templateName?: string) => {
    const newRoomId = Math.random().toString(36).substring(2, 9);
    const finalAnswers = { ...templateAnswers };

    // If it's a blank room (no template), set default required systems
    if (Object.keys(templateAnswers).length === 0) {
      finalAnswers.requiredSystems = [
        'display', 'video_conferencing', 'audio', 
        'connectivity_control', 'infrastructure', 'acoustics'
      ];
    }

    const newRoom: Room = {
      id: newRoomId,
      name: templateName ? templateName : `Room ${rooms.length + 1}`,
      answers: finalAnswers,
      boq: null,
      isLoading: false,
      error: null,
      isVisualizing: false,
      visualizationImageUrl: null,
      visualizationError: null,
      isValidating: false,
      validationResult: null,
      isGeneratingSchematic: false,
      schematicImageUrl: null,
      schematicError: null,
    };
    setRooms([...rooms, newRoom]);
    setActiveRoomId(newRoomId);
    setActiveTab('rooms');
    setIsAddRoomModalOpen(false); // Close modal after adding
  };
  
  const handleDuplicateRoom = (id: string) => {
    const roomToDuplicate = rooms.find(room => room.id === id);
    if (!roomToDuplicate) return;

    const newRoom: Room = JSON.parse(JSON.stringify(roomToDuplicate));

    newRoom.id = Math.random().toString(36).substring(2, 9);
    newRoom.name = `${roomToDuplicate.name} (Copy)`;
    newRoom.isValidating = false;
    newRoom.validationResult = null; // Reset validation on copy
    newRoom.isGeneratingSchematic = false;
    newRoom.schematicImageUrl = null;
    newRoom.schematicError = null;
    
    const originalRoomIndex = rooms.findIndex(room => room.id === id);

    const updatedRooms = [
      ...rooms.slice(0, originalRoomIndex + 1),
      newRoom,
      ...rooms.slice(originalRoomIndex + 1),
    ];

    setRooms(updatedRooms);
    setActiveRoomId(newRoom.id);
  };

  const handleDeleteRequest = (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (room) {
        setRoomToDelete(room);
        setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
      if (!roomToDelete) return;

      const newRooms = rooms.filter(room => room.id !== roomToDelete.id);
      setRooms(newRooms);
      if (activeRoomId === roomToDelete.id) {
          setActiveRoomId(newRooms.length > 0 ? newRooms[0].id : null);
      }
      setIsConfirmModalOpen(false);
      setRoomToDelete(null);
  };
  
  const updateRoomName = (id: string, newName: string) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, name: newName } : room));
  };
  
  const handleAnswersChange = useCallback((answers: Record<string, any>) => {
    if (!activeRoomId) return;
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === activeRoomId ? { ...room, answers, validationResult: null } : room // Clear validation on change
      )
    );
  }, [activeRoomId]);

  const answersToRequirements = (answers: Record<string, any>): string => {
    return Object.entries(answers)
      .map(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return `${key}: ${value.join(', ')}`;
        }
        if (value) {
            return `${key}: ${value}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('; ');
  };

  const handleGenerateBoq = async () => {
    if (!activeRoom) return;

    setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isLoading: true, validationResult: null, error: null } : r));

    try {
      const requirements = answersToRequirements(activeRoom.answers);
      if (!requirements) {
        throw new Error("Please fill out the questionnaire before generating.");
      }
      const newBoq = await generateBoq(activeRoom.answers);
      
      setRooms(prevRooms => prevRooms.map(r => r.id === activeRoomId ? { ...r, boq: newBoq, isLoading: false } : r));

    } catch (error) {
      console.error('Failed to generate BOQ:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isLoading: false, error: `Operation failed: ${errorMessage}` } : r));
    }
  };

  const handleValidateBoq = async () => {
    if (!activeRoom || !activeRoom.boq) return;

    setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isValidating: true, validationResult: null, error: null } : r));

    try {
        const requirements = answersToRequirements(activeRoom.answers);
        const validation = await validateBoq(activeRoom.boq, requirements);
        setRooms(prevRooms => prevRooms.map(r => r.id === activeRoomId ? { ...r, isValidating: false, validationResult: validation } : r));
    } catch (error) {
        console.error('Failed to validate BOQ:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isValidating: false, error: `Validation failed: ${errorMessage}` } : r));
    }
  };

  const handleRefineBoq = async (refinementPrompt: string) => {
    if (!activeRoom) return;

    const currentBoq = activeRoom.boq || [];
    setIsRefining(true);
    setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, validationResult: null } : r));
    try {
        const refinedBoq = await refineBoq(currentBoq, refinementPrompt);
        setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, boq: refinedBoq, error: null } : r));
    } catch (error) {
        console.error('Failed to refine BOQ:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, error: `Failed to refine: ${errorMessage}` } : r));
    } finally {
        setIsRefining(false);
    }
  };

  const handleGenerateVisualization = async () => {
    if (!activeRoom || !activeRoom.boq) return;

    setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isVisualizing: true, visualizationError: null, visualizationImageUrl: null } : r));

    try {
      const imageUrl = await generateRoomVisualization(activeRoom.answers, activeRoom.boq);
      setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, visualizationImageUrl: imageUrl, isVisualizing: false } : r));
    } catch (error) {
      console.error('Failed to generate visualization:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isVisualizing: false, visualizationError: `Failed to generate visualization: ${errorMessage}` } : r));
    }
  };

  const handleClearVisualization = () => {
    if (!activeRoomId) return;
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === activeRoomId ? { ...room, visualizationImageUrl: null, visualizationError: null } : room
      )
    );
  };

  const handleGenerateSchematic = async () => {
    if (!activeRoom || !activeRoom.boq) return;

    setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isGeneratingSchematic: true, schematicError: null, schematicImageUrl: null } : r));

    try {
      const imageUrl = await generateRoomSchematic(activeRoom.answers, activeRoom.boq);
      setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, schematicImageUrl: imageUrl, isGeneratingSchematic: false } : r));
    } catch (error) {
      console.error('Failed to generate schematic:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setRooms(rooms.map(r => r.id === activeRoomId ? { ...r, isGeneratingSchematic: false, schematicError: `Failed to generate schematic: ${errorMessage}` } : r));
    }
  };

  const handleClearSchematic = () => {
    if (!activeRoomId) return;
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === activeRoomId ? { ...room, schematicImageUrl: null, schematicError: null } : room
      )
    );
  };

  const handleBoqItemUpdate = (itemIndex: number, updatedValues: Partial<BoqItem>) => {
    if (!activeRoomId) return;
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === activeRoomId && room.boq) {
          const newBoq = [...room.boq];
          if (updatedValues.margin !== undefined && updatedValues.margin < 0) {
            updatedValues.margin = 0;
          }
          newBoq[itemIndex] = { ...newBoq[itemIndex], ...updatedValues };
          return { ...room, boq: newBoq, validationResult: null };
        }
        return room;
      })
    );
  };

  const handleBoqItemDelete = (itemIndex: number) => {
    if (!activeRoomId) return;
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === activeRoomId && room.boq) {
          const newBoq = room.boq.filter((_, index) => index !== itemIndex);
          return { ...room, boq: newBoq, validationResult: null };
        }
        return room;
      })
    );
  };

  const handleBoqItemAdd = () => {
    if (!activeRoomId) return;
    // Fix: Add the required 'source' property to the new BoqItem.
    const newItem: BoqItem = {
      category: '',
      itemDescription: 'New Item',
      brand: '',
      model: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      source: 'web',
      priceSource: 'estimated',
    };
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === activeRoomId) {
          const currentBoq = room.boq || [];
          const newBoq = [...currentBoq, newItem];
          return { ...room, boq: newBoq, validationResult: null };
        }
        return room;
      })
    );
  };
  
  const handleExport = async () => {
    if (rooms.some(r => r.boq !== null)) {
      setIsExporting(true);
      setToast({ message: 'Generating Excel file...', type: 'success' });
      try {
        await exportToXlsx(rooms, clientDetails, margin, brandingSettings, selectedCurrency);
        setToast({ message: 'BOQ exported successfully!', type: 'success' });
      } catch (error) {
        console.error("Export failed:", error);
        setToast({ message: 'Failed to export BOQ.', type: 'error' });
      } finally {
        setIsExporting(false);
      }
    } else {
      setToast({ message: 'Please generate at least one BOQ before exporting.', type: 'error' });
    }
  };

  const handleSaveProject = () => {
    try {
      const projectState = {
        clientDetails,
        rooms,
        margin,
        brandingSettings,
        selectedCurrency,
      };
      localStorage.setItem('genboq_project', JSON.stringify(projectState));
      setToast({ message: 'Project saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to save project:', error);
      setToast({ message: 'Error saving project.', type: 'error' });
    }
  };

  const handleLoadProject = () => {
    if (window.confirm('Are you sure you want to load a project? Any unsaved changes will be lost.')) {
      try {
        const savedStateJSON = localStorage.getItem('genboq_project');
        if (savedStateJSON) {
          const savedState = JSON.parse(savedStateJSON);
          if (savedState.clientDetails && Array.isArray(savedState.rooms)) {
            setClientDetails(savedState.clientDetails);
            setRooms(savedState.rooms);
            setMargin(savedState.margin || 0);
            setBrandingSettings(savedState.brandingSettings || defaultBranding);
            setSelectedCurrency(savedState.selectedCurrency || 'USD');
            setActiveRoomId(savedState.rooms.length > 0 ? savedState.rooms[0].id : null);
            setActiveTab('details');
            setToast({ message: 'Project loaded successfully!', type: 'success' });
          } else {
            throw new Error('Invalid project data format.');
          }
        } else {
          setToast({ message: 'No saved project found.', type: 'error' });
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        setToast({ message: 'Error loading project. Data might be corrupted.', type: 'error' });
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSaveBranding = (newSettings: BrandingSettings) => {
    setBrandingSettings(newSettings);
    setIsBrandingModalOpen(false);
    setToast({ message: 'Branding settings saved!', type: 'success' });
  };
  
  return (
    <AuthGate>
      <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
        <PrintHeader branding={brandingSettings} client={clientDetails} />
        <Header 
          theme={theme} 
          onThemeToggle={toggleTheme} 
          onOpenBrandingModal={() => setIsBrandingModalOpen(true)} 
        />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Column: Rooms List & Global Actions */}
            <aside className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 no-print">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">Project Controls</h2>
                <button onClick={handleSaveProject} className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600">
                  <SaveIcon /> Save Project
                </button>
                <button onClick={handleLoadProject} className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600">
                  <LoadIcon /> Load Project
                </button>
                <button onClick={handleExport} disabled={!canExport || isExporting} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-500 disabled:cursor-not-allowed">
                  {isExporting ? <LoaderIcon /> : <DownloadIcon />}
                  {isExporting ? 'Exporting...' : 'Export to XLSX'}
                </button>
                <button onClick={() => setIsCompareModalOpen(true)} disabled={rooms.filter(r => r.boq && r.boq.length > 0).length < 2} className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed">
                  <CompareIcon /> Compare Rooms
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 no-print">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Rooms</h2>
                    <button onClick={() => setIsAddRoomModalOpen(true)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <PlusIcon /> <span className="ml-2">Add Room</span>
                    </button>
                </div>
                <div className="space-y-3">
                  {rooms.length > 0 ? rooms.map(room => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isActive={room.id === activeRoomId}
                      onSelect={setActiveRoomId}
                      onDelete={handleDeleteRequest}
                      onDuplicate={handleDuplicateRoom}
                      onUpdateName={updateRoomName}
                    />
                  )) : (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">No rooms added yet. Click 'Add Room' to start.</p>
                  )}
                </div>
              </div>
            </aside>

            {/* Right Column: Main Content */}
            <div className="md:col-span-3">
              <div className="border-b border-slate-200 dark:border-slate-700 mb-6 no-print">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <TabButton isActive={activeTab === 'details'} onClick={() => setActiveTab('details')}>
                    Project Details
                  </TabButton>
                  <TabButton isActive={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')}>
                    Room Configuration
                  </TabButton>
                </nav>
              </div>

              {activeTab === 'details' && (
                <ClientDetails details={clientDetails} onDetailsChange={setClientDetails} />
              )}
              
              {activeTab === 'rooms' && (
                <>
                  {activeRoom ? (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                          <Questionnaire 
                              key={activeRoom.id} // Re-mounts component on room change
                              initialAnswers={activeRoom.answers}
                              onAnswersChange={handleAnswersChange}
                          />
                           <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button
                              onClick={handleGenerateBoq}
                              disabled={activeRoom.isLoading || Object.values(activeRoom.answers).every(v => !v || (Array.isArray(v) && v.length === 0))}
                              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
                            >
                              {activeRoom.isLoading ? (
                                <>
                                  <LoaderIcon />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <SparklesIcon />
                                  {activeRoom.boq ? 'Re-generate BOQ' : 'Generate BOQ'}
                                </>
                              )}
                            </button>
                          </div>
                      </div>
                      
                      {activeRoom.error && (
                         <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{activeRoom.error}</span>
                        </div>
                      )}
                      
                      <BoqDisplay
                        boq={activeRoom.boq}
                        onRefine={handleRefineBoq}
                        isRefining={isRefining}
                        margin={margin}
                        onMarginChange={setMargin}
                        onBoqItemUpdate={handleBoqItemUpdate}
                        onBoqItemAdd={handleBoqItemAdd}
                        onBoqItemDelete={handleBoqItemDelete}
                        onGenerateVisualization={handleGenerateVisualization}
                        onClearVisualization={handleClearVisualization}
                        onValidateBoq={handleValidateBoq}
                        isVisualizing={activeRoom.isVisualizing}
                        visualizationError={activeRoom.visualizationError}
                        visualizationImageUrl={activeRoom.visualizationImageUrl}
                        isValidating={activeRoom.isValidating}
                        validationResult={activeRoom.validationResult}
                        onGenerateSchematic={handleGenerateSchematic}
                        onClearSchematic={handleClearSchematic}
                        isGeneratingSchematic={activeRoom.isGeneratingSchematic}
                        schematicError={activeRoom.schematicError}
                        schematicImageUrl={activeRoom.schematicImageUrl}
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={setSelectedCurrency}
                        exchangeRates={exchangeRates}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300">No Room Selected</h2>
                      <p className="mt-2 text-slate-500 dark:text-slate-400">Please add a room or select one from the list to begin.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Modals & Toasts */}
        <AddRoomModal
            isOpen={isAddRoomModalOpen}
            onClose={() => setIsAddRoomModalOpen(false)}
            onAddRoom={handleAddRoom}
        />
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete Room: ${roomToDelete?.name || ''}?`}
          message={<p>Are you sure you want to delete this room and its associated BOQ? This action cannot be undone.</p>}
        />
        <CompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          rooms={rooms}
        />
        <BrandingModal
          isOpen={isBrandingModalOpen}
          onClose={() => setIsBrandingModalOpen(false)}
          settings={brandingSettings}
          onSave={handleSaveBranding}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </AuthGate>
  );
};

export default App;
