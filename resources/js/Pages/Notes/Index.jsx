import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import FlashMessage from '@/Components/FlashMessage';

export default function NotesIndex({ auth, notes, filters, labels }) {
    
    // --- STATE PENCARIAN (SEARCH) ---
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('notes.index'), { search: search }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [search]);

    // --- STATE & LOGIKA LABEL BARU ---
    const [newLabelName, setNewLabelName] = useState('');
    
    const createLabel = (e) => {
        e.preventDefault();
        if(!newLabelName.trim()) return;
        
        router.post(route('labels.store'), { name: newLabelName }, {
            onSuccess: () => setNewLabelName(''),
            preserveScroll: true
        });
    };

    const handleLabelChange = (id, currentData, currentSetData) => {
        if (currentData.selected_labels.includes(id)) {
            currentSetData('selected_labels', currentData.selected_labels.filter(l => l !== id));
        } else {
            currentSetData('selected_labels', [...currentData.selected_labels, id]);
        }
    };

    // --- STATE FORM CREATE ---
    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        content: '',
        color: 'bg-white',
        is_pinned: false,
        selected_labels: [] 
    });

    // --- STATE EDIT MODAL ---
    const [editingNote, setEditingNote] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const { 
        data: editData, 
        setData: setEditData, 
        put: putEdit, 
        processing: processingEdit, 
        reset: resetEdit
    } = useForm({
        title: '',
        content: '',
        color: '',
        is_pinned: false,
        selected_labels: []
    });

    // --- STATE DELETE MODAL ---
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // --- FUNGSI LOGIKA ---
    const submit = (e) => {
        e.preventDefault();
        post(route('notes.store'), { onSuccess: () => reset() });
    };

    const confirmDelete = (note) => {
        setNoteToDelete(note);
        setShowDeleteModal(true);
    };

    const executeDelete = () => {
        if (noteToDelete) {
            router.delete(route('notes.destroy', noteToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setNoteToDelete(null);
                }
            });
        }
    };

    const togglePin = (note) => {
        router.put(route('notes.update', note.id), {
            ...note, is_pinned: !note.is_pinned
        }, { preserveScroll: true });
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setEditData({
            title: note.title || '',
            content: note.content,
            color: note.color,
            is_pinned: note.is_pinned,
            selected_labels: note.labels ? note.labels.map(l => l.id) : [] 
        });
        setShowEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        putEdit(route('notes.update', editingNote.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingNote(null);
                resetEdit();
            }
        });
    };

    // Fungsi Hapus Label
    const deleteLabel = (id) => {
        if (confirm('Hapus label ini?')) {
            router.delete(route('labels.destroy', id), { preserveScroll: true });
        }
    };

    // Warna dengan style gradient halus untuk tampilan yang lebih fresh
    const colors = [
    { name: 'Putih', value: 'bg-white', class: 'bg-white border-gray-200' },
    { name: 'Hijau', value: 'bg-green-50', class: 'bg-green-100 border-green-200' },
    { name: 'Biru', value: 'bg-blue-50', class: 'bg-blue-100 border-blue-200' },
    { name: 'Merah', value: 'bg-red-50', class: 'bg-red-100 border-red-200' },
    { name: 'Ungu', value: 'bg-purple-50', class: 'bg-purple-100 border-purple-200' },
    { name: 'Merah Tua', value: 'bg-red-100', class: 'bg-red-200 border-red-300' },
    { name: 'Ungu Tua', value: 'bg-purple-100', class: 'bg-purple-200 border-purple-300' },
    { name: 'Coklat', value: 'bg-amber-50', class: 'bg-amber-100 border-amber-200' },
    { name: 'Biru Kehitaman', value: 'bg-slate-100', class: 'bg-slate-200 border-slate-300' },
];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold text-2xl text-gray-800 leading-tight tracking-tight">
                            My Notes 📒
                        </h2>
                        
                        {/* Filter Badge */}
                        {filters.label && (
                            <Link 
                                href={route('notes.index')}
                                className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-md hover:bg-indigo-700 transition"
                            >
                                {filters.label} <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">×</span>
                            </Link>
                        )}

                        <Link href={route('notes.trash')} className="text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-1 bg-white/50 px-4 py-1.5 rounded-full hover:bg-red-50 transition border border-gray-200/50 backdrop-blur-sm">
                            🗑️ Sampah
                        </Link>
                    </div>

                    {/* SEARCH BAR MODERN */}
                    <div className="relative group w-full md:w-auto">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text"
                            placeholder="Cari sesuatu..."
                            className="pl-10 pr-10 py-2 w-full md:w-72 bg-white/60 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/50 shadow-sm backdrop-blur-sm transition-all placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">✕</button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Notes" />
            <FlashMessage />

            {/* BACKGROUND GRADIENT UTAMA */}
            <div className="min-h-screen py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
                
                {/* Dekorasi Background (Lingkaran Blur) */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    
                    {/* --- FORM CREATE NOTE (GLASSMORPHISM) --- */}
                    <div className="mx-auto max-w-3xl mb-12 transform transition-all hover:scale-[1.01]">
                        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl overflow-hidden p-1">
                            <form onSubmit={submit} className="p-5 sm:p-7">
                                
                                {/* Input Judul */}
                                <input
                                    type="text"
                                    placeholder="Judul Catatan..."
                                    className={`w-full text-lg font-bold bg-transparent border-none p-0 mb-3 focus:ring-0 placeholder-gray-400 text-gray-800 ${data.color}`}
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                
                                {/* Input Isi */}
                                <textarea
                                    placeholder="Tulis ide cemerlangmu disini..."
                                    className={`w-full text-base bg-transparent border-none p-0 h-24 resize-none focus:ring-0 placeholder-gray-400 text-gray-700 leading-relaxed ${data.color}`}
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                ></textarea>

                                {/* Divider Halus */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

                                {/* Bagian Label & Warna */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    
                                    {/* Label Manager */}
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {labels.map(label => (
                                                <div key={label.id} className={`group inline-flex items-center text-xs rounded-full border transition-all duration-200 cursor-pointer select-none
                                                    ${data.selected_labels.includes(label.id) 
                                                        ? 'bg-indigo-100 border-indigo-200 text-indigo-700 font-bold shadow-sm' 
                                                        : 'bg-white/50 border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300'}`}
                                                >
                                                    <span onClick={() => handleLabelChange(label.id, data, setData)} className="px-3 py-1.5">
                                                        {label.name}
                                                    </span>
                                                    <button type="button" onClick={(e) => {e.stopPropagation(); deleteLabel(label.id);}} className="pr-2 pl-1 text-gray-300 group-hover:text-red-400 hover:text-red-600 transition">×</button>
                                                </div>
                                            ))}
                                            
                                            {/* Input Label Baru Mini */}
                                            <input 
                                                type="text" 
                                                className="bg-transparent border-b border-gray-300 focus:border-indigo-500 text-xs px-1 py-0.5 w-24 focus:ring-0 transition placeholder-gray-400"
                                                placeholder="+ Label baru..."
                                                value={newLabelName}
                                                onChange={e => setNewLabelName(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault(); 
                                                        createLabel(e);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Color Picker & Submit */}
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex items-center -space-x-1 hover:space-x-1 transition-all duration-300">
                                            {colors.map((c) => (
                                                <button
                                                    key={c.value}
                                                    type="button"
                                                    className={`w-8 h-8 rounded-full border-2 shadow-sm transition transform hover:scale-110 hover:z-10 ${c.class} ${data.color === c.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 z-10' : 'border-white'}`}
                                                    onClick={() => setData('color', c.value)}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                        
                                        <button 
                                            disabled={processing}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* PESAN JIKA KOSONG */}
                    {notes.length === 0 && search !== '' && (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-medium text-gray-600">Tidak ditemukan catatan "{search}"</h3>
                            <p className="text-gray-400 mt-2">Coba kata kunci lain atau buat baru!</p>
                        </div>
                    )}
                    
                    {notes.length === 0 && search === '' && (
                        <div className="text-center py-20 opacity-60">
                            <div className="text-6xl mb-4 grayscale">📝</div>
                            <h3 className="text-xl font-medium text-gray-500">Belum ada catatan</h3>
                            <p className="text-gray-400 mt-2">Mulai tulis idemu sekarang!</p>
                        </div>
                    )}

                    {/* LIST NOTES (MASONRY) */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"> 
                        {notes.map((note) => (
                            <div 
                                key={note.id} 
                                className={`break-inside-avoid group relative p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 flex flex-col justify-between min-h-[180px] hover:-translate-y-1 backdrop-blur-sm
                                    ${note.color === 'white' ? 'bg-white/80' : note.color.replace('bg-', 'bg-').replace('100', '50')}
                                `}
                            >
                                {/* Pin Button */}
                                <button 
                                    onClick={(e) => {e.stopPropagation(); togglePin(note);}}
                                    className={`absolute top-4 right-4 text-xl w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 
                                        ${note.is_pinned 
                                            ? 'opacity-100 bg-white shadow-sm text-yellow-500 scale-100' 
                                            : 'opacity-0 group-hover:opacity-50 hover:bg-white/50 hover:text-gray-600'}`}
                                    title={note.is_pinned ? "Lepas Pin" : "Sematkan"}
                                >
                                    {note.is_pinned ? '📌' : '📍'}
                                </button>
                                
                                <div onClick={() => openEditModal(note)} className="cursor-pointer">
                                    <h3 className={`font-bold text-xl text-gray-800 pr-8 mb-2 ${!note.title && 'italic text-gray-400'}`}>
                                        {note.title || 'Tanpa Judul'}
                                    </h3>
                                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm font-medium">
                                        {note.content.length > 200 ? note.content.substring(0, 200) + '...' : note.content}
                                    </p>
                                    
                                    {/* Label di Kartu */}
                                    {note.labels && note.labels.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {note.labels.map(lbl => (
                                                <Link 
                                                    key={lbl.id} 
                                                    href={route('notes.index', { label: lbl.name })}
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg font-bold transition shadow-sm
                                                        ${filters.label === lbl.name 
                                                            ? 'bg-indigo-600 text-white shadow-indigo-200' 
                                                            : 'bg-white/60 text-gray-500 hover:bg-white hover:text-indigo-600'
                                                        }`}
                                                >
                                                    {lbl.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-end">
                                    <span className="text-xs font-semibold text-gray-400 bg-white/30 px-2 py-1 rounded-md">
                                        {new Date(note.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </span>
                                    
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button onClick={() => openEditModal(note)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-full transition" title="Edit">
                                            ✏️
                                        </button>
                                        <button onClick={() => confirmDelete(note)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-full transition" title="Hapus">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL EDIT & DELETE (Styling disesuaikan agar konsisten) */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Catatan ✏️</h2>
                    <form onSubmit={submitEdit}>
                        <input
                            type="text"
                            className="w-full text-xl font-bold border-0 border-b-2 border-gray-100 focus:border-indigo-500 focus:ring-0 px-0 py-2 mb-4 placeholder-gray-300 transition"
                            value={editData.title}
                            onChange={e => setEditData('title', e.target.value)}
                            placeholder="Judul..."
                        />
                        <textarea
                            className="w-full h-64 border-0 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 text-gray-700 leading-relaxed resize-none mb-4"
                            value={editData.content}
                            onChange={e => setEditData('content', e.target.value)}
                        ></textarea>

                        <div className="mb-6">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Label</span>
                            <div className="flex flex-wrap gap-2">
                                {labels.map(label => (
                                    <button
                                        key={label.id}
                                        type="button"
                                        onClick={() => handleLabelChange(label.id, editData, setEditData)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all duration-200
                                            ${editData.selected_labels.includes(label.id) 
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {label.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex gap-2">
                                {colors.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        className={`w-6 h-6 rounded-full border shadow-sm ${c.class} ${editData.color === c.value ? 'ring-2 ring-indigo-500 scale-110' : ''}`}
                                        onClick={() => setEditData('color', c.value)}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition">Batal</button>
                                <button type="submit" disabled={processingEdit} className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition">Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        🗑️
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Pindahkan ke Sampah?</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Catatan ini akan dipindahkan ke folder sampah. <br/>Kamu masih bisa memulihkannya nanti.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition">Batal</button>
                        <button onClick={executeDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-lg shadow-red-200 transition">Ya, Hapus</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}