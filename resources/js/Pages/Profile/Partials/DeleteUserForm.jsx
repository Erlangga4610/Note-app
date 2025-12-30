import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={`${className} bg-white rounded-3xl p-8 border border-red-100 shadow-sm relative overflow-hidden`}>
            {/* Dekorasi Latar Belakang Merah Tipis */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

            <header className="mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span> Hapus Akun
                </h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. 
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </header>

            <div className="relative z-10">
                <DangerButton 
                    onClick={confirmUserDeletion}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5"
                >
                    Hapus Akun Saya
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 text-center">
                    
                    {/* Ikon Sampah Besar */}
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce-slow">
                        🗑️
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Yakin ingin menghapus akun?
                    </h2>

                    <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                        Setelah akun dihapus, semua data akan hilang selamanya. Silakan masukkan password Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun ini secara permanen.
                    </p>

                    <div className="mb-6 text-left max-w-sm mx-auto">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all py-3 px-4 text-center"
                            isFocused
                            placeholder="Masukkan Password Anda"
                        />

                        <InputError message={errors.password} className="mt-2 text-center" />
                    </div>

                    <div className="flex justify-center gap-4">
                        <SecondaryButton 
                            onClick={closeModal}
                            className="px-6 py-2.5 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-all"
                        >
                            Batal
                        </SecondaryButton>

                        <DangerButton 
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5 font-bold" 
                            disabled={processing}
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Permanen'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}