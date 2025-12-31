<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Label;
use Illuminate\Support\Facades\Storage;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Note::where('user_id', auth()->id()); 

        // 1. Filter Pencarian
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // 2. Filter Label
        if ($labelName = $request->input('label')) {
            $query->whereHas('labels', function($q) use ($labelName) {
                $q->where('name', $labelName);
            });
        }

        // 3. Sorting & Get Data
        $notes = $query->with('labels') 
                    ->orderBy('is_pinned', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->get();

        $labels = Label::where('user_id', auth()->id())->get();

        return Inertia::render('Notes/Index', [
            'notes' => $notes,
            'labels' => $labels,
            'filters' => $request->only(['search', 'label']), 
        ]);
    }

   public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'content' => 'required|string',
            'color' => 'nullable|string',
            'selected_labels' => 'array',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        // Cek jika ada file gambar yang diupload
        if ($request->hasFile('image')) {
            // Simpan gambar ke storage folder 'notes'
            $validated['image'] = $request->file('image')->store('notes', 'public');
        }

        // PERBAIKAN: Create note dilakukan DI LUAR if(image) 
        // agar note tanpa gambar tetap tersimpan.
        $note = $request->user()->notes()->create($validated);

        // Hubungkan note dengan label yang dipilih
        if ($request->has('selected_labels')) {
            $note->labels()->attach($request->selected_labels);
        }

        return redirect()->back()->with('success', 'Catatan berhasil dibuat!');
    }

    public function update(Request $request, Note $note)
    {
        // Cek kepemilikan
        if ($note->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'content' => 'required|string',
            'color' => 'nullable|string',
            'is_pinned' => 'boolean',
            'selected_labels' => 'array',
            'image' => 'nullable|image|max:2048',
            'delete_image' => 'boolean|nullable', // <--- 1. Tambahkan validasi untuk flag baru
        ]);

        // --- LOGIKA GAMBAR BARU ---

        // Skenario A: User ingin MENGHAPUS gambar (Prioritas Tertinggi)
        if ($request->boolean('delete_image')) {
            // Hapus file fisik jika ada
            if ($note->image) {
                Storage::disk('public')->delete($note->image);
            }
            // Set nilai di database menjadi NULL
            $validated['image'] = null;
        }
        // Skenario B: User MENGGANTI dengan gambar baru
        elseif ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($note->image) {
                Storage::disk('public')->delete($note->image);
            }
            // Simpan gambar baru
            $validated['image'] = $request->file('image')->store('notes', 'public');
        }
        // Skenario C: User TIDAK melakukan apa-apa pada gambar
        else {
            // Buang key 'image' agar Laravel TIDAK menimpa gambar lama dengan null
            unset($validated['image']); 
        }

        // Hapus key 'delete_image' dari array sebelum update ke database (karena kolomnya tidak ada di tabel notes)
        unset($validated['delete_image']);

        $note->update($validated);

        // Sync label
        if ($request->has('selected_labels')) {
            $note->labels()->sync($request->selected_labels);
        }

        return redirect()->back()->with('success', 'Catatan berhasil diperbarui!');
    }

    // Hapus catatan (pindah ke sampah / Soft Delete)
    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) abort(403);
        
        $note->delete();

        return redirect()->back()->with('success', 'Catatan berhasil dihapus!'); 
    }

    // Halaman Sampah
    public function trash()
    {
        $notes = Note::onlyTrashed()
                    ->where('user_id', auth()->id())
                    ->orderBy('deleted_at', 'desc')
                    ->get();

        return Inertia::render('Notes/Trash', [
            'notes' => $notes
        ]);
    }

    // Pulihkan catatan dari sampah
    public function restore($id)
    {
        $note = Note::onlyTrashed()->where('id', $id)->first();
        if ($note && $note->user_id === auth()->id()) {
            $note->restore();
            return redirect()->back()->with('success', 'Catatan berhasil dipulihkan!');
        }
        abort(403);
    }

    // Hapus catatan secara permanen (Force Delete)
    public function forceDelete($id)
    {
        $note = Note::onlyTrashed()->where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        // Hapus file gambar dari storage jika ada
        if ($note->image) {
            Storage::disk('public')->delete($note->image);
        }

        $note->forceDelete(); 

        return redirect()->back()->with('success', 'Catatan dihapus permanen.');
    }

    // Buat Label Baru
    public function storeLabel(Request $request)
    {
        $request->validate(['name' => 'required|string|max:20']);
        
        Label::create([
            'user_id' => auth()->id(),
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Label baru dibuat!');
    }

    // Hapus Label
    public function destroyLabel($id)
    {
        $label = Label::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $label->delete();

        return redirect()->back()->with('success', 'Label berhasil dihapus.');
    }
}