import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import FlashMessage from '@/Components/FlashMessage';

export default function NotesIndex({ auth, notes, filters, labels }) {
    
    // --- STATE PENCARIAN ---
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

    // --- LOGIKA LABEL ---
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

    const deleteLabel = (id) => {
        if (confirm('Hapus label ini?')) {
            router.delete(route('labels.destroy', id), { preserveScroll: true });
        }
    };

    // --- FORM CREATE ---
    const { data, setData, post, reset, processing } = useForm({
        title: '',
        content: '',
        color: 'bg-white',
        is_pinned: false,
        selected_labels: [],
        image: null 
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e, setFormData, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFormData('image', file);
            setPreview(URL.createObjectURL(file));
            // Jika ini di form edit, pastikan flag delete dimatikan jika user memilih file baru
            if(setFormData === setEditData) {
                setEditData(curr => ({...curr, delete_image: false}));
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('notes.store'), { 
            onSuccess: () => {
                reset();
                setPreviewImage(null);
            }
        });
    };

    // --- FORM EDIT ---
    const [editingNote, setEditingNote] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPreviewImage, setEditPreviewImage] = useState(null);
    
    const { 
        data: editData, 
        setData: setEditData, 
        reset: resetEdit,
        processing: processingEdit,
    } = useForm({
        title: '',
        content: '',
        color: '',
        is_pinned: false,
        selected_labels: [],
        image: null,
        delete_image: false, // <--- 1. State baru untuk sinyal hapus gambar
        _method: 'PUT'
    });

    const openEditModal = (note) => {
        setEditingNote(note);
        setEditData({
            title: note.title || '',
            content: note.content,
            color: note.color,
            is_pinned: note.is_pinned,
            selected_labels: note.labels ? note.labels.map(l => l.id) : [],
            image: null,
            delete_image: false, // Reset flag saat membuka modal
            _method: 'PUT'
        });
        setEditPreviewImage(note.image ? `/storage/${note.image}` : null);
        setShowEditModal(true);
    };

    // FUNGSI BARU: Menangani klik tombol hapus gambar di edit modal
    const handleDeleteImageInEdit = () => {
        setEditPreviewImage(null); // Hilangkan preview visual
        setEditData(curr => ({
            ...curr,
            image: null, // Reset input file jika ada
            delete_image: true // <--- Set flag menjadi TRUE
        }));
    };

    const submitEdit = (e) => {
        e.preventDefault();
        router.post(route('notes.update', editingNote.id), editData, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingNote(null);
                resetEdit();
            },
            preserveScroll: true
        });
    };

    // --- DELETE & PIN ---
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const confirmDelete = (note) => {
        setNoteToDelete(note);
        setShowDeleteModal(true);
    };
    
    const executeDelete = () => {
        if (noteToDelete) {
            router.delete(route('notes.destroy', noteToDelete.id), {
                onSuccess: () => { setShowDeleteModal(false); setNoteToDelete(null); }
            });
        }
    };
    
    const togglePin = (note) => {
        router.put(route('notes.update', note.id), { ...note, is_pinned: !note.is_pinned }, { preserveScroll: true });
    };

    const colors = [
        { name: 'Putih', value: 'bg-white', class: 'bg-white border-gray-200' },
        { name: 'Kuning', value: 'bg-yellow-50', class: 'bg-yellow-100 border-yellow-200' },
        { name: 'Hijau', value: 'bg-green-50', class: 'bg-green-100 border-green-200' },
        { name: 'Biru', value: 'bg-blue-50', class: 'bg-blue-100 border-blue-200' },
        { name: 'Merah', value: 'bg-red-50', class: 'bg-red-100 border-red-200' },
        { name: 'Ungu', value: 'bg-purple-50', class: 'bg-purple-100 border-purple-200' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold text-2xl text-gray-800 leading-tight tracking-tight">My Notes 📒</h2>
                        {filters.label && (
                            <Link href={route('notes.index')} className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-md hover:bg-indigo-700 transition">
                                {filters.label} <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">×</span>
                            </Link>
                        )}
                        <Link href={route('notes.trash')} className="text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-1 bg-white/50 px-4 py-1.5 rounded-full hover:bg-red-50 transition border border-gray-200/50 backdrop-blur-sm">
                            🗑️ Sampah
                        </Link>
                    </div>
                    <div className="relative group w-full md:w-auto">
                        <input type="text" placeholder="Cari catatan..." className="pl-4 pr-10 py-2 w-full md:w-64 bg-white/60 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/50 shadow-sm backdrop-blur-sm transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
                        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-2 text-gray-400">✕</button>}
                    </div>
                </div>
            }
        >
            <Head title="Notes" />
            <FlashMessage />

            <div className="min-h-screen py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
                
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    
                    {/* --- FORM CREATE NOTE --- */}
                    <div className="mx-auto max-w-3xl mb-12">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl overflow-hidden">
                            <form onSubmit={submit} encType="multipart/form-data">
                                
                                <div className={`p-6 pb-2 transition-colors duration-300 ${data.color}`}>
                                    <input
                                        type="text"
                                        placeholder="Judul Catatan..."
                                        className="w-full text-xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400 text-gray-800 mb-2"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    
                                    <textarea
                                        placeholder="Tulis ide cemerlangmu disini..."
                                        className="w-full text-base bg-transparent border-none p-0 h-24 resize-none focus:ring-0 placeholder-gray-400 text-gray-700 leading-relaxed"
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                    ></textarea>
                                    
                                    {/* Preview Gambar Create */}
                                    {previewImage && (
                                        <div className="relative mt-4 rounded-xl overflow-hidden border border-black/5 inline-block group">
                                            <img src={previewImage} alt="Preview" className="h-32 w-auto object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => { setPreviewImage(null); setData('image', null); }}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Control Panel (Bawah) */}
                                <div className="bg-gray-50/80 p-4 border-t border-gray-100">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-1 hover:space-x-1 transition-all">
                                                    {colors.map((c) => (
                                                        <button 
                                                            key={c.value} 
                                                            type="button" 
                                                            className={`w-6 h-6 rounded-full border shadow-sm transition transform hover:scale-110 hover:z-10 ${c.class} ${data.color === c.value ? 'ring-2 ring-indigo-500 scale-110 z-10' : ''}`} 
                                                            onClick={() => setData('color', c.value)} 
                                                            title={c.name} 
                                                        />
                                                    ))}
                                                </div>

                                                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                                                <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition text-sm font-medium px-2 py-1 rounded-md hover:bg-white">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    <span>Upload Foto</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setData, setPreviewImage)} />
                                                </label>
                                            </div>

                                            <button disabled={processing} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition hover:-translate-y-0.5 disabled:opacity-50">
                                                Simpan Catatan
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap border-t border-gray-200 pt-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase mr-1">Label:</span>
                                            {labels.map(label => (
                                                <div 
                                                    key={label.id} 
                                                    onClick={() => handleLabelChange(label.id, data, setData)}
                                                    className={`cursor-pointer px-3 py-1 text-xs rounded-lg border transition select-none flex items-center gap-1
                                                        ${data.selected_labels.includes(label.id) 
                                                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-bold' 
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                                                >
                                                    {label.name}
                                                    <button type="button" onClick={(e) => {e.stopPropagation(); deleteLabel(label.id);}} className="text-gray-400 hover:text-red-500 ml-1 font-bold">×</button>
                                                </div>
                                            ))}
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    className="pl-2 pr-2 py-1 text-xs border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded-md bg-transparent focus:bg-white w-24 transition focus:ring-0 placeholder-gray-400"
                                                    placeholder="+ Buat Label"
                                                    value={newLabelName}
                                                    onChange={e => setNewLabelName(e.target.value)}
                                                    onKeyDown={e => {if (e.key === 'Enter') {e.preventDefault(); createLabel(e);}}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* --- LIST NOTES (GRID LAYOUT) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                        {notes.map((note) => (
                            <div 
                                key={note.id} 
                                className={`group relative rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 flex flex-col h-full hover:-translate-y-1 backdrop-blur-sm overflow-hidden 
                                ${note.color === 'white' ? 'bg-white/80' : note.color.replace('bg-', 'bg-').replace('100', '50')}`}
                            >
                                {note.image && (
                                    <div className="w-full h-48 overflow-hidden cursor-pointer bg-gray-100 flex-shrink-0" onClick={() => openEditModal(note)}>
                                        <img src={`/storage/${note.image}`} alt="Note" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                    </div>
                                )}

                                <div className="p-6 flex flex-col flex-1">
                                    <button onClick={(e) => {e.stopPropagation(); togglePin(note);}} className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${note.is_pinned ? 'opacity-100 bg-white shadow-sm text-yellow-500 scale-100' : 'opacity-0 group-hover:opacity-100 bg-white/50 hover:bg-white text-gray-400 hover:text-gray-600'}`}>
                                        {note.is_pinned ? '📌' : '📍'}
                                    </button>
                                    
                                    <div onClick={() => openEditModal(note)} className="cursor-pointer flex-1">
                                        <h3 className={`font-bold text-lg text-gray-800 pr-8 mb-2 ${!note.title && 'italic text-gray-400'}`}>{note.title || 'Tanpa Judul'}</h3>
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm line-clamp-4">
                                            {note.content}
                                        </p>
                                        
                                        {note.labels && note.labels.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-4">
                                                {note.labels.map(lbl => (
                                                    <Link key={lbl.id} href={route('notes.index', { label: lbl.name })} onClick={(e) => e.stopPropagation()} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition ${filters.label === lbl.name ? 'bg-indigo-600 text-white' : 'bg-white/60 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                                                        {lbl.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-black/5 flex justify-between items-center flex-shrink-0">
                                        <span className="text-xs font-semibold text-gray-400">{new Date(note.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button onClick={() => openEditModal(note)} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-white px-2 py-1 rounded-md shadow-sm">EDIT</button>
                                            <button onClick={() => confirmDelete(note)} className="text-xs font-bold text-red-500 hover:text-red-700 bg-white px-2 py-1 rounded-md shadow-sm">HAPUS</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL EDIT */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="bg-white rounded-2xl overflow-hidden">
                    <form onSubmit={submitEdit} encType="multipart/form-data">
                        
                        <div className={`p-6 pb-2 transition-colors duration-300 ${editData.color}`}>
                            
                            {/* Preview Gambar Edit & Tombol Hapus/Ganti */}
                            {editPreviewImage ? (
                                <div className="relative mb-4 rounded-xl overflow-hidden group border border-black/5">
                                    <img src={editPreviewImage} alt="Preview" className="w-full h-48 object-cover" />
                                    
                                    {/* Overlay Tombol Ganti & Hapus */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition gap-3">
                                        {/* Tombol Ganti Foto */}
                                        <label className="cursor-pointer">
                                            <span className="text-white font-bold border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                Ganti
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setEditData, setEditPreviewImage)} />
                                        </label>
                                        
                                        {/* TOMBOL HAPUS FOTO (BARU) */}
                                        <button 
                                            type="button" 
                                            onClick={handleDeleteImageInEdit}
                                            className="text-white font-bold border border-white bg-red-600/80 border-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-700 transition flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Jika tidak ada gambar, tampilkan area upload besar
                                <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:bg-white/50 transition group">
                                    <label className="cursor-pointer flex flex-col items-center gap-1 text-gray-500 group-hover:text-indigo-600">
                                        <svg className="w-8 h-8 transition transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span className="text-sm font-medium">Tambahkan Foto Sampul</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setEditData, setEditPreviewImage)} />
                                    </label>
                                </div>
                            )}

                            <input type="text" className="w-full text-xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400 text-gray-800 mb-2" value={editData.title} onChange={e => setEditData('title', e.target.value)} placeholder="Judul..." />
                            <textarea className="w-full text-base bg-transparent border-none p-0 h-40 resize-none focus:ring-0 placeholder-gray-400 text-gray-700 leading-relaxed" value={editData.content} onChange={e => setEditData('content', e.target.value)}></textarea>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {colors.map((c) => (
                                            <button key={c.value} type="button" className={`w-6 h-6 rounded-full border shadow-sm transition transform hover:scale-110 ${c.class} ${editData.color === c.value ? 'ring-2 ring-indigo-500 scale-110' : ''}`} onClick={() => setEditData('color', c.value)} />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-200 font-medium text-sm transition">Batal</button>
                                        <button type="submit" disabled={processingEdit} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition shadow-md">Simpan Perubahan</button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap border-t border-gray-200 pt-3">
                                    <span className="text-xs font-bold text-gray-400 uppercase mr-1">Label:</span>
                                    {labels.map(label => (
                                        <button key={label.id} type="button" onClick={() => handleLabelChange(label.id, editData, setEditData)} className={`px-3 py-1 text-xs rounded-lg border transition ${editData.selected_labels.includes(label.id) ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}>{label.name}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* MODAL DELETE */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🗑️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Pindahkan ke Sampah?</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">Catatan ini akan dipindahkan ke folder sampah. <br/>Kamu masih bisa memulihkannya nanti.</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition">Batal</button>
                        <button onClick={executeDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-lg shadow-red-200 transition">Ya, Hapus</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}