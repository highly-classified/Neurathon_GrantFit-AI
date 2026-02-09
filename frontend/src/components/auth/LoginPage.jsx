import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { AlertCircle, CircleDashed, Mail, Lock, User } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const checkProfileAndRedirect = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                navigate('/dashboard');
            } else {
                navigate('/profile-setup');
            }
        } catch (error) {
            console.error("Error checking profile:", error);
            // Fallback
            navigate('/profile-setup');
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await checkProfileAndRedirect(result.user);
        } catch (err) {
            console.error("Error signing in with Google", err);
            let msg = "Failed to sign in with Google.";
            if (err.code === 'auth/popup-closed-by-user') msg = "Sign-in cancelled.";
            if (err.code === 'auth/popup-blocked') msg = "Sign-in popup blocked. Please allow popups.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userCredential;
            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // New sign-ups always go to profile setup
                navigate('/profile-setup');
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                await checkProfileAndRedirect(userCredential.user);
            }
        } catch (err) {
            console.error("Auth error", err);
            let message = "Authentication failed.";
            if (err.code === 'auth/email-already-in-use') message = "Email already in use.";
            if (err.code === 'auth/weak-password') message = "Password should be at least 6 characters.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') message = "Invalid email or password.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#40484F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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
                    <div className="bg-[var(--color-primary)] p-3 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center">
                         <img 
                            src="/logo-white.png" 
                            alt="GrantFit AI Logo" 
                            className="h-14 w-auto" 
                        />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    {isSignUp ? 'Create your account' : 'Sign in to GrantFit AI'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-200">
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

                    <form className="space-y-6" onSubmit={handleEmailAuth}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    isSignUp ? 'Sign up' : 'Sign in'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[var(--color-surface)] text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
                                        Google
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                            <button 
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                            >
                                {isSignUp ? "Sign in" : "Sign up"}
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                            <p className="text-center text-xs text-gray-400">
                            By continuing, you agree to GrantFit AI's Terms of Service and Privacy Policy.
                            </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;