import React, { useState, useEffect, useCallback } from 'react';
import { ProductDetails } from '../types';
import { fetchProductDetails } from '../services/geminiService';
import LoaderIcon from './icons/LoaderIcon';
import PlusIcon from './icons/PlusIcon';
import SearchIcon from './icons/SearchIcon';
import LinkIcon from './icons/LinkIcon';

interface WebSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductName: string;
  onAdd: (productName: string, productDescription: string) => void;
}

const WebSearchModal: React.FC<WebSearchModalProps> = ({ isOpen, onClose, initialProductName, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedProductName, setSearchedProductName] = useState('');

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setProductDetails(null);
    try {
      const details = await fetchProductDetails(query);
      setProductDetails(details);
      setSearchedProductName(query); // Store the name that was successfully searched
    } catch (error) {
      console.error("Failed to fetch product details", error);
      setProductDetails({ imageUrl: '', description: `Failed to load details for "${query}". Please try another search term.`, sources: [] });
      setSearchedProductName(query);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialProductName);
      setProductDetails(null); // Reset details on open
      if (initialProductName) {
        handleSearch(initialProductName);
      } else {
          setSearchedProductName(''); // Clear any previous search name
      }
    }
  }, [isOpen, initialProductName, handleSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  }

  const handleAddClick = () => {
    if (searchedProductName && productDetails?.description) {
        onAdd(searchedProductName, productDetails.description);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-full" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 p-6 pb-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Web Search</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="flex-shrink-0 p-6">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Crestron TSW-1070"
                    className="flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-500"
                    disabled={isLoading || !searchQuery.trim()}
                >
                    <SearchIcon className="h-5 w-5" />
                    <span className="ml-2">Search</span>
                </button>
            </form>
        </div>
        
        <div className="flex-grow overflow-y-auto px-6">
          {isLoading ? (
            <div className="text-center text-slate-500 dark:text-slate-400 p-8 flex flex-col items-center justify-center">
              <LoaderIcon />
              <p className="mt-2">Searching for "{searchQuery}"...</p>
            </div>
          ) : productDetails ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{searchedProductName}</h3>
              {productDetails.imageUrl && (
                <img src={productDetails.imageUrl} alt={searchedProductName} className="w-full h-64 object-contain rounded-lg mb-4 bg-slate-100 dark:bg-slate-700" />
              )}
              <p className="text-slate-700 dark:text-slate-300 mb-4">{productDetails.description}</p>
              {productDetails.sources && productDetails.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-3">Sources from Web Search:</h3>
                   <div className="space-y-3">
                    {productDetails.sources.map((source, index) =>
                      source.web ? (
                        <a
                          key={index}
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-all duration-200 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 group"
                        >
                          <p className="font-bold text-base text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
                            <LinkIcon /> 
                            <span className="ml-2">{source.web.title || "Untitled Source"}</span>
                          </p>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 break-all">
                            {source.web.uri}
                          </p>
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500 p-8">
                <p>Enter a product name above and click search to see details.</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-6 pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleAddClick}
              disabled={!productDetails || isLoading || productDetails.description.startsWith('Failed')}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              <PlusIcon /> Add to BOQ
            </button>
        </div>
      </div>
    </div>
  );
};

export default WebSearchModal;