import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`${className} bg-white rounded-3xl p-8 border border-gray-100 shadow-sm`}>
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">👤</span> Informasi Profil
                </h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                    Perbarui informasi profil akun dan alamat email Anda di sini untuk menjaga data tetap akurat.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6 max-w-xl">
                {/* Input Name */}
                <div className="group">
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700 font-semibold mb-2 ml-1" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 py-3 px-4 shadow-sm group-hover:border-indigo-300"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Masukkan nama lengkap Anda"
                    />
                    <InputError className="mt-2 text-sm font-medium" message={errors.name} />
                </div>

                {/* Input Email */}
                <div className="group">
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-gray-700 font-semibold mb-2 ml-1" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 py-3 px-4 shadow-sm group-hover:border-indigo-300"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="contoh@email.com"
                    />
                    <InputError className="mt-2 text-sm font-medium" message={errors.email} />
                </div>

                {/* Verifikasi Email (Jika Perlu) */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="text-amber-500 text-xl">⚠️</div>
                        <div className="flex-1">
                            <p className="text-sm text-amber-800 font-medium">
                                Alamat email Anda belum diverifikasi.
                            </p>
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 font-bold underline decoration-indigo-300 hover:decoration-indigo-800 underline-offset-2 transition-colors"
                            >
                                Kirim ulang email verifikasi
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'verification-link-sent' && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm font-medium flex items-center gap-2 animate-in fade-in duration-300">
                        <span>✅</span> Tautan verifikasi baru telah dikirim ke email Anda.
                    </div>
                )}

                {/* Tombol Simpan & Status */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                    <PrimaryButton 
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Menyimpan...
                            </span>
                        ) : 'Simpan Perubahan'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-y-2 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-1000"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            Berhasil Disimpan!
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}