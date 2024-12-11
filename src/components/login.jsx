import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/api';
import { useUser } from '../context/UserContext';

const Login = () => {
    const { setUserInfo } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Added missing state
    const [rememberMe, setRememberMe] = useState(false); // Added missing state
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // If remember me is checked, store email
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            const response = await apiService.login({
                email: email,
                password: password
            });

            if (response.access_token) {
                localStorage.setItem('token', response.access_token);

                // Make sure we're handling the user data correctly
                const userData = {
                    id: response.user?.id,
                    email: response.user?.email,
                    name: response.user?.name || email
                };

                setUserInfo(userData);
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    // Load remembered email on component mount
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        Welcome to Vuexy! 👋
                    </h2>
                    <p className="text-gray-400">
                        Please sign-in to your account and start the adventure
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-100/10 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-gray-300">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required // Added required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-500 text-white"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="text-gray-300">Password</label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required // Added required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-500 text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-violet-500 focus:ring-violet-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                                Remember Me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-violet-500 hover:text-violet-400">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        New on our platform?{' '}
                        <Link to="/register" className="text-violet-500 hover:text-violet-400">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;