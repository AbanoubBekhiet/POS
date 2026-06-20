<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index(Request $request){
        $search = $request->input('search');
        $query = Category::with('media');
        
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }
        
        $categories = $query->get()->map(function($category) {
            $mediaUrl = $category->getFirstMediaUrl('categories');
            return [
                'id' => $category->id,
                'name' => $category->name,
                'image_url' => $mediaUrl ? parse_url($mediaUrl, PHP_URL_PATH) : null,
                'products_count' => $category->products()->count(),
            ];
        });

        return Inertia::render('categories/Index', [
            'categories' => $categories,
            'filters' => ['search' => $search]
        ]);
    }

    public function update(Request $request, $id){
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable',
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $request->name,
        ]);

        if ($request->hasFile('image')) {
            $category->clearMediaCollection('categories');
            $category->addMediaFromRequest('image')->toMediaCollection('categories');
        }

        session()->flash('success', 'تم تحديث التصنيف بنجاح!');
        return redirect()->route('categories');
    }

    public function destroy($id){
        $category = Category::findOrFail($id);
        
        if ($category->products()->exists()) {
            session()->flash('error', 'لا يمكن حذف التصنيف لأنه يحتوي على منتجات!');
            return redirect()->route('categories');
        }   

        $category->clearMediaCollection('categories');
        $category->delete();

        session()->flash('success', 'تم حذف التصنيف بنجاح!');
        return redirect()->route('categories');
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable',
        ]);

        $category = Category::create([
            'name' => $request->name,
        ]);

        if ($request->hasFile('image')) {
            $category->addMediaFromRequest('image')->toMediaCollection('categories');
        }

        session()->flash('success', 'تم إضافة التصنيف بنجاح!');
        return redirect()->route('categories');
    }
}
