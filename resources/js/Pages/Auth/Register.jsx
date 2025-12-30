import React, { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden py-10">
            <Head title="Register" />

            {/* Dekorasi Background (Sama seperti Login) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* CONTAINER GLASSMORPHISM */}
            <div className="w-full max-w-md p-8 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative z-10 mx-4">
                
                {/* Header Register */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 text-3xl">
                        🚀
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Buat Akun Baru</h2>
                    <p className="text-gray-500 mt-2 text-sm">Bergabung dan mulai mencatat idemu.</p>
                </div>

                <form onSubmit={submit}>
                    {/* Input Name */}
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all py-2.5 px-4"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="John Doe"
                        />

                        <InputError message={errors.name} className="mt-2 text-xs" />
                    </div>

                    {/* Input Email */}
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email Address" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all py-2.5 px-4"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder="nama@email.com"
                        />

                        <InputError message={errors.email} className="mt-2 text-xs" />
                    </div>

                    {/* Input Password */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all py-2.5 px-4"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2 text-xs" />
                    </div>

                    {/* Input Confirm Password */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-gray-600 font-medium ml-1" />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all py-2.5 px-4"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password_confirmation} className="mt-2 text-xs" />
                    </div>

                    <div className="mt-8">
                        <PrimaryButton 
                            className="w-full justify-center py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-xl shadow-lg shadow-pink-200 transition-all duration-200 transform hover:-translate-y-0.5 text-base font-bold" 
                            disabled={processing}
                        >
                            {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                        </PrimaryButton>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="font-bold text-indigo-600 hover:text-indigo-800 transition">
                            Login Disini
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}