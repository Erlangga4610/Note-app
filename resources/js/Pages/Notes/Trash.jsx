import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';

export default function Trash({ auth, notes }) {

    // Fungsi Restore
    const restoreNote = (id) => {
        router.put(route('notes.restore', id));
    };

    // Fungsi Hapus Permanen
    const forceDeleteNote = (id) => {
        if (confirm('Yakin hapus permanen? Data tidak bisa kembali.')) {
            router.delete(route('notes.force', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tong Sampah 🗑️</h2>
                    <Link href={route('notes.index')} className="text-sm text-indigo-600 hover:underline">
                        &larr; Kembali ke Notes
                    </Link>
                </div>
            }
        >
            <Head title="Trash" />
            <FlashMessage />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {notes.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            Tong sampah kosong. Bersih sekali! ✨
                        </div>
                    ) : (
                        // MASONRY LAYOUT
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {notes.map((note) => (
                                <div key={note.id} className={`break-inside-avoid mb-6 p-5 rounded-xl border border-gray-200 bg-gray-50 opacity-80 hover:opacity-100 transition`}>
                                    
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-600 line-through decoration-gray-400">{note.title || 'Tanpa Judul'}</h3>
                                        <p className="mt-2 text-gray-500 whitespace-pre-wrap">{note.content}</p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">
                                            Dihapus: {note.deleted_at ? new Date(note.deleted_at).toLocaleDateString() : 'Tanggal tidak tersedia'}
                                        </span>
                                        <div className="flex gap-2">
                                            {/* Tombol Restore */}
                                            <button 
                                                onClick={() => restoreNote(note.id)} 
                                                className="text-sm text-green-600 hover:text-green-800 font-medium bg-green-50 px-3 py-1 rounded"
                                            >
                                                Pulihkan
                                            </button>
                                            
                                            {/* Tombol Force Delete */}
                                            <button 
                                                onClick={() => forceDeleteNote(note.id)} 
                                                className="text-sm text-red-600 hover:text-red-800 font-medium px-2"
                                                title="Hapus Permanen"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}