
import React, { useState, useEffect, useMemo } from 'react';
import { Boq, BoqItem, Currency, CURRENCIES, ValidationResult } from '../types';

import CurrencySelector from './CurrencySelector';
import RefineModal from './RefineModal';
import WebSearchModal from './WebSearchModal';
import ImagePreviewModal from './ImagePreviewModal';
import AutoResizeTextarea from './AutoResizeTextarea';
import RoomVisualizationModal from './RoomVisualizationModal';
import ValidationFeedback from './ValidationFeedback';
import SchematicModal from './SchematicModal';

import WandIcon from './icons/WandIcon';
import ImageIcon from './icons/ImageIcon';
import SearchIcon from './icons/SearchIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import EyeIcon from './icons/EyeIcon';
import LoaderIcon from './icons/LoaderIcon';
import PrintIcon from './icons/PrintIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import SchematicIcon from './icons/SchematicIcon';


interface BoqDisplayProps {
  boq: Boq | null;
  onRefine: (refinementPrompt: string) => void;
  isRefining: boolean;
  margin: number;
  onMarginChange: (margin: number) => void;
  onBoqItemUpdate: (itemIndex: number, updatedValues: Partial<BoqItem>) => void;
  onBoqItemAdd: () => void;
  onBoqItemDelete: (itemIndex: number) => void;
  onGenerateVisualization: () => void;
  onClearVisualization: () => void;
  onValidateBoq: () => void;
  isVisualizing: boolean;
  visualizationError: string | null;
  visualizationImageUrl: string | null;
  isValidating: boolean;
  validationResult: ValidationResult | null;
  onGenerateSchematic: () => void;
  onClearSchematic: () => void;
  isGeneratingSchematic: boolean;
  schematicError: string | null;
  schematicImageUrl: string | null;
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  exchangeRates: Record<Currency, number> | null;
}

const BoqDisplay: React.FC<BoqDisplayProps> = ({ 
    boq, onRefine, isRefining, margin, onMarginChange, onBoqItemUpdate, onBoqItemAdd, onBoqItemDelete,
    onGenerateVisualization, onClearVisualization, isVisualizing, visualizationError, visualizationImageUrl,
    onValidateBoq, isValidating, validationResult,
    onGenerateSchematic, onClearSchematic, isGeneratingSchematic, schematicError, schematicImageUrl,
    selectedCurrency, onCurrencyChange, exchangeRates
}) => {
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isWebSearchModalOpen, setIsWebSearchModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isVisualizationModalOpen, setIsVisualizationModalOpen] = useState(false);
  const [isSchematicModalOpen, setIsSchematicModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BoqItem | null>(null);

  useEffect(() => {
    // Open the modal automatically only when a new visualization process starts
    if (isVisualizing) {
      setIsVisualizationModalOpen(true);
    }
  }, [isVisualizing]);

  useEffect(() => {
    if (isGeneratingSchematic) {
      setIsSchematicModalOpen(true);
    }
  }, [isGeneratingSchematic]);

  const handleVisualizationModalClose = () => {
    setIsVisualizationModalOpen(false);
    // State is no longer cleared on close, allowing the image to persist.
  };

  const handleSchematicModalClose = () => {
    setIsSchematicModalOpen(false);
  };

  const handleVisualizeButtonClick = () => {
    if (visualizationImageUrl) {
      // If an image already exists, just open the modal to view it.
      setIsVisualizationModalOpen(true);
    } else {
      // Otherwise, start the generation process (which will also open the modal via useEffect).
      onGenerateVisualization();
    }
  };
  
  const handleSchematicButtonClick = () => {
    if (schematicImageUrl) {
      setIsSchematicModalOpen(true);
    } else {
      onGenerateSchematic();
    }
  };


  const currencySymbol = useMemo(() => {
    return CURRENCIES.find(c => c.value === selectedCurrency)?.symbol || '$';
  }, [selectedCurrency]);

  const { processedBoq, totals, groupedBoq, categoryOrder } = useMemo(() => {
    if (!exchangeRates || !boq) {
        return { 
            processedBoq: [], 
            totals: { subTotal: 0, marginAmount: 0, gstAmount: 0, grandTotal: 0 },
            groupedBoq: {},
            categoryOrder: []
        };
    }
    
    const rate = exchangeRates[selectedCurrency] || 1;
    const gstRate = 0.18;

    let subTotal = 0;
    let totalAfterMargin = 0;

    const processedItems = boq.map((item, originalIndex) => {
      const baseTotalPrice = item.totalPrice * rate;
      const currentItemMarginPercent = typeof item.margin === 'number' ? item.margin : margin;
      const itemMarginMultiplier = 1 + currentItemMarginPercent / 100;
      const totalPriceWithMargin = baseTotalPrice * itemMarginMultiplier;
      const unitPriceWithMargin = (item.unitPrice * rate) * itemMarginMultiplier;
      const gstAmountForItem = totalPriceWithMargin * gstRate;
      const finalTotalPrice = totalPriceWithMargin + gstAmountForItem;
      const finalUnitPrice = unitPriceWithMargin * (1 + gstRate);

      subTotal += baseTotalPrice;
      totalAfterMargin += totalPriceWithMargin;

      return {
          ...item,
          unitPrice: finalUnitPrice,
          totalPrice: finalTotalPrice,
          originalIndex: originalIndex,
      };
    });
    
    const marginAmount = totalAfterMargin - subTotal;
    const gstAmount = totalAfterMargin * gstRate;
    const grandTotal = totalAfterMargin + gstAmount;

    // Group items by category for structured display
    const grouped = processedItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, (BoqItem & { originalIndex: number })[]>);
    
    // Maintain the sorted order from the service
    const orderedCategories = [...new Set(processedItems.map(item => item.category))];


    return { 
        processedBoq: processedItems, 
        totals: { subTotal, marginAmount, gstAmount, grandTotal },
        groupedBoq: grouped,
        categoryOrder: orderedCategories,
    };
  }, [boq, selectedCurrency, exchangeRates, margin]);

  
  const handleAddProductFromSearch = (productName: string, productDescription: string) => {
    const prompt = `CRITICAL COMMAND: Add a single item to the BOQ based on the following details. DO NOT substitute the brand or model.
- Searched Product Name: "${productName}"
- Detailed Product Description from Web Search: "${productDescription}"
- Quantity: 1
- Action: From the detailed description, extract the precise Brand and Model. Find the most logical category for this item. Provide a realistic unit price in USD. Add this single item to the existing list and return the complete, updated BOQ. Do not add any other items.`;
    onRefine(prompt);
    setIsWebSearchModalOpen(false);
  };

  const handleFetchDetails = (item: BoqItem) => {
    setSelectedProduct(item);
    setIsWebSearchModalOpen(true);
  };
  
  const handleOpenWebSearch = () => {
    setSelectedProduct(null);
    setIsWebSearchModalOpen(true);
  };

  const handleImageClick = (item: BoqItem) => {
    setSelectedProduct(item);
    setIsImagePreviewOpen(true);
  };

  const inputClass = "block w-full text-sm bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-slate-900 dark:text-white py-1 px-2";
  const numberInputClass = `${inputClass} text-center`;

  const SourceBadge: React.FC<{ source: 'database' | 'web', priceSource?: 'database' | 'estimated' }> = ({ source, priceSource }) => {
    const isDb = source === 'database';
    const isPriceDb = priceSource === 'database';
    
    return (
      <div className="flex flex-col gap-1 items-center justify-center">
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${isDb ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
          Prod: {isDb ? 'DB' : 'Web'}
        </span>
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${isPriceDb ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
          Price: {isPriceDb ? 'DB' : 'Est'}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700" id="boq-display-section">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 no-print">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generated Bill of Quantities</h2>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-2">
                <label htmlFor="margin-input" className="text-sm font-medium text-slate-600 dark:text-slate-300">Project Margin:</label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type="number"
                        name="margin-input"
                        id="margin-input"
                        className="block w-24 pl-3 pr-8 py-2 text-base bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-slate-900 dark:text-white"
                        placeholder="0"
                        value={margin}
                        onChange={(e) => onMarginChange(parseFloat(e.target.value) || 0)}
                        min="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm">%</span>
                    </div>
                </div>
            </div>
            <CurrencySelector selectedCurrency={selectedCurrency} onCurrencyChange={onCurrencyChange} disabled={!exchangeRates} />
            <button
                onClick={handleOpenWebSearch}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
            >
                <SearchIcon className="h-5 w-5 mr-2" /> Web Search
            </button>
            <button
                onClick={() => setIsRefineModalOpen(true)}
                disabled={!boq || boq.length === 0}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                <WandIcon /> Refine with AI
            </button>
            <button
                onClick={onValidateBoq}
                disabled={!boq || boq.length === 0 || isValidating}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {isValidating ? <LoaderIcon /> : <CheckCircleIcon className="h-5 w-5 mr-2" />}
                {isValidating ? 'Validating...' : (validationResult ? 'Re-validate BOQ' : 'Validate BOQ')}
            </button>
             <button
                onClick={handleVisualizeButtonClick}
                disabled={!boq || boq.length === 0 || isVisualizing}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {isVisualizing ? <LoaderIcon /> : <EyeIcon />}
                {isVisualizing ? 'Visualizing...' : (visualizationImageUrl ? 'View Visualization' : 'Visualize Room')}
            </button>
            <button
                onClick={handleSchematicButtonClick}
                disabled={!boq || boq.length === 0 || isGeneratingSchematic}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {isGeneratingSchematic ? <LoaderIcon /> : <SchematicIcon />}
                {isGeneratingSchematic ? 'Generating...' : (schematicImageUrl ? 'View Schematic' : 'Generate Schematic')}
            </button>
            <button
                onClick={() => window.print()}
                disabled={!boq || boq.length === 0}
                title="Print BOQ"
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                <PrintIcon /> Print
            </button>
          </div>
        </div>

        {isValidating && (
            <div className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-lg relative my-4 flex items-center justify-center no-print" role="status">
                <LoaderIcon />
                <span className="ml-2">Validating BOQ against best practices...</span>
            </div>
        )}
        
        {validationResult && !isValidating && <ValidationFeedback result={validationResult} />}


        {boq && boq.length > 0 ? (
            <>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border-separate border-spacing-0">
                <thead className="bg-slate-100 dark:bg-slate-900">
                <tr>
                    {['Item Description', 'Brand', 'Model', 'Qty', 'Source/Price', 'Unit Price (USD)', 'Item Margin (%)', 'Final Unit Price', 'Final Total Price', 'Actions'].map(header => (
                    <th key={header} scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        {header}
                    </th>
                    ))}
                </tr>
                </thead>
                {categoryOrder.map(category => (
                    <tbody key={category} className="bg-white dark:bg-slate-800">
                        <tr className="bg-slate-200 dark:bg-slate-700/50">
                            <th colSpan={10} className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">
                                {category}
                            </th>
                        </tr>
                        {(groupedBoq[category] || []).map(item => (
                            <tr key={item.originalIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 align-top">
                            <td className="px-3 py-2">
                                <AutoResizeTextarea
                                    value={item.itemDescription}
                                    onChange={(e) => onBoqItemUpdate(item.originalIndex, { itemDescription: e.target.value })}
                                    className={`${inputClass} resize-none overflow-hidden`}
                                    style={{minWidth: '250px'}}
                                />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap"><input type="text" value={item.brand} onChange={(e) => onBoqItemUpdate(item.originalIndex, { brand: e.target.value })} className={inputClass} style={{minWidth: '120px'}} /></td>
                            <td className="px-3 py-2 whitespace-nowrap"><input type="text" value={item.model} onChange={(e) => onBoqItemUpdate(item.originalIndex, { model: e.target.value })} className={inputClass} style={{minWidth: '120px'}}/></td>
                            <td className="px-3 py-2 whitespace-nowrap">
                                <input type="number" value={item.quantity} onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value, 10) || 0;
                                    const originalItem = boq[item.originalIndex];
                                    onBoqItemUpdate(item.originalIndex, {
                                        quantity: newQuantity,
                                        totalPrice: newQuantity * originalItem.unitPrice,
                                    });
                                }} className={numberInputClass} style={{width: '70px'}} min="0" />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                                <SourceBadge source={item.source} priceSource={item.priceSource} />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                                <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">$</span>
                                <input
                                    type="number"
                                    className="block w-full text-sm bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-slate-900 dark:text-white py-1 pl-5 pr-2"
                                    value={boq[item.originalIndex].unitPrice}
                                    onChange={(e) => {
                                        const newUnitPrice = parseFloat(e.target.value) || 0;
                                        const originalItem = boq[item.originalIndex];
                                        onBoqItemUpdate(item.originalIndex, {
                                            unitPrice: newUnitPrice,
                                            totalPrice: newUnitPrice * originalItem.quantity,
                                        });
                                    }}
                                    min="0"
                                    step="0.01"
                                    style={{width: '120px'}}
                                />
                                </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                                <div className="relative">
                                <input
                                    type="number"
                                    className={numberInputClass}
                                    style={{width: '80px'}}
                                    value={item.margin ?? ''}
                                    onChange={(e) => onBoqItemUpdate(item.originalIndex, { margin: parseFloat(e.target.value) })}
                                    placeholder={`${margin}`}
                                    min="0"
                                />
                                </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-800 dark:text-slate-300 text-right font-semibold">{currencySymbol}{item.totalPrice.toFixed(2)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 space-x-1 flex items-center no-print">
                                <button onClick={() => handleImageClick(item)} className="p-1 hover:text-blue-500 dark:hover:text-blue-400" title="Preview Image"><ImageIcon /></button>
                                <button onClick={() => handleFetchDetails(item)} className="p-1 hover:text-green-500 dark:hover:text-green-400" title="Fetch Details"><SearchIcon /></button>
                                <button onClick={() => onBoqItemDelete(item.originalIndex)} className="p-1 hover:text-red-600 dark:hover:text-red-500" title="Delete Item"><TrashIcon /></button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                ))}
                <tfoot className="bg-slate-100 dark:bg-slate-900">
                    <tr>
                        <td colSpan={8} className="px-6 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-300 uppercase">Subtotal</td>
                        <td className="px-6 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">{currencySymbol}{totals.subTotal.toFixed(2)}</td>
                        <td colSpan={1}></td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="px-6 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-300 uppercase">Total Margin</td>
                        <td className="px-6 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">{currencySymbol}{totals.marginAmount.toFixed(2)}</td>
                        <td colSpan={1}></td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="px-6 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-300 uppercase">GST (18%)</td>
                        <td className="px-6 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">{currencySymbol}{totals.gstAmount.toFixed(2)}</td>
                        <td colSpan={1}></td>
                    </tr>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                        <td colSpan={8} className="px-6 py-3 text-right text-sm font-bold text-slate-900 dark:text-white uppercase">Grand Total</td>
                        <td className="px-6 py-3 text-right text-sm font-bold text-slate-900 dark:text-white">{currencySymbol}{totals.grandTotal.toFixed(2)}</td>
                        <td colSpan={1}></td>
                    </tr>
                </tfoot>
            </table>
            </div>
            <div className="mt-4 no-print">
                <button
                    onClick={onBoqItemAdd}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
                >
                    <PlusIcon /> Add Item
                </button>
            </div>
            </>
        ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 mt-4 no-print">
                <h3 className="text-lg font-semibold">This BOQ is empty.</h3>
                <p>Generate a full BOQ using the questionnaire, or add individual items using "Web Search".</p>
            </div>
        )}

      </div>
      <RefineModal
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
        onSubmit={(prompt) => {
          onRefine(prompt);
          setIsRefineModalOpen(false);
        }}
        isLoading={isRefining}
      />
      <WebSearchModal
        isOpen={isWebSearchModalOpen}
        onClose={() => setIsWebSearchModalOpen(false)}
        initialProductName={selectedProduct ? `${selectedProduct.brand} ${selectedProduct.model}` : ''}
        onAdd={handleAddProductFromSearch}
      />
       {isImagePreviewOpen && selectedProduct && (
        <ImagePreviewModal
          imageUrl={`https://source.unsplash.com/800x600/?${encodeURIComponent(selectedProduct.itemDescription)}`}
          onClose={() => setIsImagePreviewOpen(false)}
        />
      )}
      <RoomVisualizationModal
        isOpen={isVisualizationModalOpen}
        onClose={handleVisualizationModalClose}
        isLoading={isVisualizing}
        error={visualizationError}
        imageUrl={visualizationImageUrl}
        onRegenerate={onGenerateVisualization}
        onDelete={onClearVisualization}
      />
      <SchematicModal
        isOpen={isSchematicModalOpen}
        onClose={handleSchematicModalClose}
        isLoading={isGeneratingSchematic}
        error={schematicError}
        imageUrl={schematicImageUrl}
        onRegenerate={onGenerateSchematic}
        onDelete={onClearSchematic}
      />
    </>
  );
};

export default BoqDisplay;
