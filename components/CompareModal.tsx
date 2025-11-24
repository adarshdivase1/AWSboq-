import React, { useState, useMemo } from 'react';
import { Room, BoqItem } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
}

interface CommonItem {
  item: BoqItem;
  qtyA: number;
  qtyB: number;
}

interface ComparisonData {
  commonItems: CommonItem[];
  onlyInA: BoqItem[];
  onlyInB: BoqItem[];
  totalA: number;
  totalB: number;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, rooms }) => {
  const [roomAId, setRoomAId] = useState<string>('');
  const [roomBId, setRoomBId] = useState<string>('');

  const roomsWithBoq = useMemo(() => rooms.filter(r => r.boq && r.boq.length > 0), [rooms]);

  const roomA = useMemo(() => roomsWithBoq.find(r => r.id === roomAId), [roomsWithBoq, roomAId]);
  const roomB = useMemo(() => roomsWithBoq.find(r => r.id === roomBId), [roomsWithBoq, roomBId]);

  const comparisonData: ComparisonData | null = useMemo(() => {
    if (!roomA || !roomB || !roomA.boq || !roomB.boq) return null;

    const boqA = roomA.boq;
    const boqB = roomB.boq;
    
    const totalA = boqA.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalB = boqB.reduce((sum, item) => sum + item.totalPrice, 0);

    const commonItems: CommonItem[] = [];
    const onlyInA: BoqItem[] = [];
    
    const boqBMap = new Map<string, BoqItem>();
    boqB.forEach(item => {
        const key = `${item.brand}|${item.model}`.toLowerCase();
        boqBMap.set(key, item);
    });

    boqA.forEach(itemA => {
        const key = `${itemA.brand}|${itemA.model}`.toLowerCase();
        if (boqBMap.has(key)) {
            const itemB = boqBMap.get(key)!;
            commonItems.push({ item: itemA, qtyA: itemA.quantity, qtyB: itemB.quantity });
            boqBMap.delete(key); // Remove from map to find items only in B later
        } else {
            onlyInA.push(itemA);
        }
    });

    const onlyInB = Array.from(boqBMap.values());

    return { commonItems, onlyInA, onlyInB, totalA, totalB };

  }, [roomA, roomB]);

  if (!isOpen) return null;
  
  const selectClass = "block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-5xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compare Room BOQs</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="flex-shrink-0 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="roomA" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Select Room A</label>
                <select id="roomA" value={roomAId} onChange={e => setRoomAId(e.target.value)} className={selectClass} disabled={roomBId === '' && roomsWithBoq.length > 0 && roomAId !== ''}>
                    <option value="">-- Choose a room --</option>
                    {roomsWithBoq.filter(r => r.id !== roomBId).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="roomB" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Select Room B</label>
                <select id="roomB" value={roomBId} onChange={e => setRoomBId(e.target.value)} className={selectClass} disabled={!roomAId}>
                    <option value="">-- Choose a room --</option>
                    {roomsWithBoq.filter(r => r.id !== roomAId).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto px-6 pb-6">
            {comparisonData ? (
                 <div className="space-y-6">
                    {/* Common Items */}
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2">Common Items</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-100 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Item</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{roomA?.name} Qty</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{roomB?.name} Qty</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Unit Price (USD)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
                                    {comparisonData.commonItems.map(({ item, qtyA, qtyB }, i) => (
                                        <tr key={`common-${i}`} className={qtyA !== qtyB ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}>
                                            <td className="px-4 py-2 text-sm text-slate-800 dark:text-slate-200">{item.brand} {item.model}</td>
                                            <td className="px-4 py-2 text-center text-sm">{qtyA}</td>
                                            <td className="px-4 py-2 text-center text-sm">{qtyB}</td>
                                            <td className="px-4 py-2 text-right text-sm">${item.unitPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items only in A */}
                        <div>
                            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Items Only in {roomA?.name}</h3>
                            <div className="overflow-x-auto bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                                <table className="min-w-full">
                                    <tbody>
                                        {comparisonData.onlyInA.map((item, i) => (
                                            <tr key={`a-${i}`} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                                                <td className="px-4 py-2 text-sm text-slate-800 dark:text-slate-200">{item.brand} {item.model}</td>
                                                <td className="px-4 py-2 text-center text-sm">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right text-sm">${item.totalPrice.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Items only in B */}
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Items Only in {roomB?.name}</h3>
                            <div className="overflow-x-auto bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                                <table className="min-w-full">
                                    <tbody>
                                        {comparisonData.onlyInB.map((item, i) => (
                                            <tr key={`b-${i}`} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                                                <td className="px-4 py-2 text-sm text-slate-800 dark:text-slate-200">{item.brand} {item.model}</td>
                                                <td className="px-4 py-2 text-center text-sm">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right text-sm">${item.totalPrice.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 text-right">
                        <div className="text-lg"><span className="font-semibold text-slate-600 dark:text-slate-300">{roomA?.name} Total:</span> <span className="text-slate-900 dark:text-white font-bold">${comparisonData.totalA.toFixed(2)}</span></div>
                        <div className="text-lg"><span className="font-semibold text-slate-600 dark:text-slate-300">{roomB?.name} Total:</span> <span className="text-slate-900 dark:text-white font-bold">${comparisonData.totalB.toFixed(2)}</span></div>
                        <div className="text-xl mt-2">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Difference:</span> 
                            <span className={`font-bold ml-2 ${comparisonData.totalB - comparisonData.totalA > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                ${Math.abs(comparisonData.totalB - comparisonData.totalA).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-400 dark:text-slate-500 py-20">
                    <p>Select two rooms with generated BOQs to see a comparison.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;