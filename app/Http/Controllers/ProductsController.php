<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index(Request $request){
        $search = $request->input('search');
        $categoryId = $request->input('category_id');
        
        $query = Product::with(['category', 'media']);
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }
        
        if ($categoryId && $categoryId !== 'all') {
            $query->where('category_id', $categoryId);
        }
        
        $paginator = $query->latest()->simplePaginate(18);
        
        $products = collect($paginator->items())->map(function($product) {
            $mediaUrl = $product->getFirstMediaUrl('products');
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => floatval($product->price),
                'description' => $product->description,
                'stock' => intval($product->stock),
                'unit' => $product->unit,
                'number_of_items_in_unit' => intval($product->number_of_items_in_unit),
                'category_id' => $product->category_id,
                'category_name' => $product->category ? $product->category->name : 'بدون قسم',
                'image_url' => $mediaUrl ? parse_url($mediaUrl, PHP_URL_PATH) : null,
            ];
        });
        
        $categories = Category::all(['id', 'name']);
        
        return Inertia::render('products/Index', [
            'products' => [
                'data' => $products,
                'next_page' => $paginator->hasMorePages() ? $paginator->currentPage() + 1 : null,
                'current_page' => $paginator->currentPage(),
            ],
            'total_count' => Product::count(),
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId
            ]
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|in:شكارة,علبة,كرتونة,شريط,دستة,لفة',
            'number_of_items_in_unit' => 'required|integer|min:1',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable',
        ]);
        
        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
            'unit' => $request->unit,
            'number_of_items_in_unit' => $request->number_of_items_in_unit,
            'category_id' => $request->category_id,
            'description' => $request->description,
        ]);
        
        if ($request->hasFile('image')) {
            $product->addMediaFromRequest('image')->toMediaCollection('products');
        }
        
        session()->flash('success', 'تم إضافة المنتج بنجاح!');
        return redirect()->route('products');
    }

    public function update(Request $request, $id){
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|in:شكارة,علبة,كرتونة,شريط,دستة,لفة',
            'number_of_items_in_unit' => 'required|integer|min:1',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable',
        ]);
        
        $product = Product::findOrFail($id);
        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
            'unit' => $request->unit,
            'number_of_items_in_unit' => $request->number_of_items_in_unit,
            'category_id' => $request->category_id,
            'description' => $request->description,
        ]);
        
        if ($request->hasFile('image')) {
            $product->clearMediaCollection('products');
            $product->addMediaFromRequest('image')->toMediaCollection('products');
        }
        
        session()->flash('success', 'تم تحديث المنتج بنجاح!');
        return redirect()->route('products');
    }

    public function destroy($id){
        $product = Product::findOrFail($id);
        $product->clearMediaCollection('products');
        $product->delete();
        
        session()->flash('success', 'تم حذف المنتج بنجاح!');
        return redirect()->route('products');
    }
}
