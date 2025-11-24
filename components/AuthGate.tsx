import React, { useState } from 'react';

interface AuthGateProps {
    children: React.ReactNode;
}

const ALLOWED_DOMAINS = ['allwavegs.com', 'allwaveav.com'];

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Support both standard node process.env and Vite's import.meta.env
    const API_KEY = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;

    // API Key Check - This is a developer-facing check.
    if (!API_KEY) {
        return (
            <div className="flex items-center justify-center h-screen text-white bg-slate-900">
                <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
                    <p className="text-slate-300">
                        The Gemini API key is not configured.
                    </p>
                    <p className="text-slate-400 mt-2 text-sm">
                        Please set the <code className="bg-slate-700 px-1 py-0.5 rounded">VITE_API_KEY</code> environment variable in your hosting provider (AWS Amplify).
                    </p>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate a quick validation check
        setTimeout(() => {
            try {
                if (!email.includes('@')) {
                    throw new Error('Please enter a valid email address.');
                }
                const domain = email.split('@')[1];
                if (ALLOWED_DOMAINS.includes(domain)) {
                    setIsAuthenticated(true); // Grant access
                } else {
                    throw new Error('Access denied. Please use a valid company email.');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        }, 500);
    };

    // If authenticated, render the main application
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // If not authenticated, show the email login form
    return (
        <div className="flex items-center justify-center min-h-screen text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700">
                <div>
                    <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
                        <span className="text-blue-600 dark:text-blue-400">Gen</span>BOQ
                    </h1>
                    <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                        AI-Powered AV Bill of Quantities Generator
                    </p>
                    <p className="mt-4 text-center text-sm text-slate-400 dark:text-slate-500">
                        Please verify your identity with a company email.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="your.name@allwaveav.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm text-center pt-2">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed mt-4"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? 'Verifying...' : 'Grant Access'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthGate;