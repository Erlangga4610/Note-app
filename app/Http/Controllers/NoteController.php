<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Label;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Note::where('user_id', auth()->id()); // Menggunakan auth()->id() lebih ringkas

        // Filter Pencarian
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // 2. Filter Label (BARU)
        if ($labelName = $request->input('label')) {
            $query->whereHas('labels', function($q) use ($labelName) {
                $q->where('name', $labelName);
            });
        }

        // Sorting: Pinned dulu, lalu yang terbaru
        $notes = $query->with('labels') // <--- Eager Load labels (PENTING)
                   ->orderBy('is_pinned', 'desc')
                   ->orderBy('created_at', 'desc')
                   ->get();

        $labels = Label::where('user_id', auth()->id())->get();

        return Inertia::render('Notes/Index', [
            'notes' => $notes,
            'labels' => $labels,
            'filters' => $request->only(['search']), 
        ]);
    }

   public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'content' => 'required|string',
            'color' => 'nullable|string',
            'selected_labels' => 'array' // <--- Validasi array label ID
        ]);

        $note = $request->user()->notes()->create($validated);

        // Hubungkan note dengan label yang dipilih
        if ($request->has('selected_labels')) {
            $note->labels()->attach($request->selected_labels);
        }

        return redirect()->back()->with('success', 'Catatan berhasil dibuat!');
    }

    public function update(Request $request, Note $note)
    {
        // ... cek permission manual ...

        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'content' => 'required|string',
            'color' => 'nullable|string',
            'is_pinned' => 'boolean',
            'selected_labels' => 'array' // <--- Validasi
        ]);

        $note->update($validated);

        // Sync label (hapus yang lama, pasang yang baru sesuai input)
        if ($request->has('selected_labels')) {
            $note->labels()->sync($request->selected_labels);
        }

        return redirect()->back()->with('success', 'Catatan berhasil diperbarui!');
    }

    // Hapus catatan (pindah ke sampah)
    public function trash()
    {
        // Ambil hanya data yang sudah dihapus (soft deleted)
        $notes = Note::onlyTrashed()
                    ->where('user_id', auth()->id())
                    ->orderBy('deleted_at', 'desc')
                    ->get();

        return Inertia::render('Notes/Trash', [
            'notes' => $notes
        ]);
    }

    // megembalikan catatan dari sampah
    public function restore($id)
    {
        $note = Note::onlyTrashed()->where('id', $id)->first();
        if ($note && $note->user_id === auth()->id()) {
            $note->restore();
            return redirect()->back()->with('success', 'Catatan berhasil dipulihkan!');
        }
        abort(403);
    }

    // Hapus catatan secara permanen
    public function forceDelete($id)
    {
        $note = Note::onlyTrashed()->where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $note->forceDelete(); // Ini akan menghapus total dari database

        return redirect()->back()->with('success', 'Catatan dihapus permanen.');
    }
    
    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) abort(403);
        
        $note->delete();

        return redirect()->back()->with('success', 'Catatan berhasil dihapus!'); 
    }

    public function storeLabel(Request $request)
    {
        $request->validate(['name' => 'required|string|max:20']);
        
        Label::create([
            'user_id' => auth()->id(),
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Label baru dibuat!');
    }

    // HAPUS LABEL
    public function destroyLabel($id)
    {
        $label = Label::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $label->delete();

        return redirect()->back()->with('success', 'Label berhasil dihapus.');
    }
}