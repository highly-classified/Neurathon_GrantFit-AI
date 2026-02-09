import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { AlertCircle, CircleDashed } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if user profile exists
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                navigate('/dashboard');
            } else {
                navigate('/profile-setup');
            }
        } catch (err) {
            console.error("Error signing in with Google", err);
            setError("Failed to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
             {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[float_6s_ease-in-out_infinite_reverse]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="flex justify-center">
                    <div className="bg-[var(--color-primary)] p-3 rounded-xl shadow-lg shadow-[var(--color-primary)]/20">
                         <CircleDashed className="h-10 w-10 text-white animate-spin-slow" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-main)]">
                    Sign in to GrantFit AI
                </h2>
                <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
                    Access AI-powered grant matching and pitch tools
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="bg-[var(--color-surface)] py-8 px-4 shadow-xl shadow-gray-200 border border-gray-100 sm:rounded-2xl sm:px-10">
                    
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-gray-400 border-t-[var(--color-primary)] rounded-full animate-spin" />
                            ) : (
                                <>
                                    <img 
                                        className="h-5 w-5 mr-3" 
                                        src="https://www.svgrepo.com/show/475656/google-color.svg" 
                                        alt="Google logo" 
                                    />
                                    Sign in with Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[var(--color-surface)] text-gray-500">
                                    New to GrantFit AI?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                             <p className="text-center text-xs text-gray-400">
                                By signing in, you agree to our Terms of Service and Privacy Policy.
                             </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;