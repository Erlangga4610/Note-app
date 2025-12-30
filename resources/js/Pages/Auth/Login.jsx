import React, { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
            <Head title="Log in" />

            {/* Dekorasi Background (Blobs Animasi) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* CONTAINER GLASSMORPHISM */}
            <div className="w-full max-w-md p-8 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative z-10 mx-4">
                
                {/* Header Login */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 text-3xl">
                        📒
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2 text-sm">Silakan login untuk mengelola catatanmu.</p>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 bg-green-100 px-4 py-2 rounded-lg border border-green-200 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all py-2.5 px-4"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                        />

                        <InputError message={errors.email} className="mt-2 text-xs" />
                    </div>

                    <div className="mt-5">
                        <InputLabel htmlFor="password" value="Password" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all py-2.5 px-4"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2 text-xs" />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="ms-2 text-sm text-gray-600 hover:text-gray-900 transition">Ingat saya</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition underline decoration-transparent hover:decoration-indigo-800"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>

                    <div className="mt-8">
                        <PrimaryButton 
                            className="w-full justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 transform hover:-translate-y-0.5 text-base font-bold" 
                            disabled={processing}
                        >
                            {processing ? 'Sedang Memuat...' : 'Masuk Sekarang'}
                        </PrimaryButton>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="font-bold text-indigo-600 hover:text-indigo-800 transition">
                            Daftar Disini
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}