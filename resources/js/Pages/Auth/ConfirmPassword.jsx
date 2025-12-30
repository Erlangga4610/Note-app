import React, { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
            <Head title="Konfirmasi Password" />

            {/* Dekorasi Background (Konsisten dengan Login/Register) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* CONTAINER GLASSMORPHISM */}
            <div className="w-full max-w-md p-8 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative z-10 mx-4 text-center">
                
                {/* Header Icon */}
                <div className="w-16 h-16 bg-gradient-to-tr from-gray-700 to-gray-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 text-3xl">
                    🔒
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Akses</h2>
                
                <div className="mb-6 text-sm text-gray-600 leading-relaxed">
                    Ini adalah area aman aplikasi. Harap konfirmasi password Anda sebelum melanjutkan untuk alasan keamanan.
                </div>

                <form onSubmit={submit} className="text-left">
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all py-2.5 px-4"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2 text-xs" />
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <PrimaryButton 
                            className="w-full justify-center py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black rounded-xl shadow-lg shadow-gray-400/50 transition-all duration-200 transform hover:-translate-y-0.5 text-base font-bold" 
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Konfirmasi'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}