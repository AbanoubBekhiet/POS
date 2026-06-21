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
        try {
            $product->clearMediaCollection('products');
            $product->delete();
            session()->flash('success', 'تم حذف المنتج بنجاح!');
        } catch (\Exception $e) {
            \Log::error("Failed to delete product {$id}: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء حذف المنتج: ' . $e->getMessage());
        }
        return redirect()->route('products');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:5120',
        ]);

        $file = $request->file('file');

        try {
            $sheets = \Maatwebsite\Excel\Facades\Excel::toArray([], $file);
            $rows = $sheets[0] ?? [];
            if (empty($rows)) {
                session()->flash('error', 'الملف فارغ أو غير صالح!');
                return redirect()->back();
            }

            // Read header row
            $header = array_shift($rows);

            // Clean headers (remove BOM or spaces)
            $header = array_map(function($h) {
                return trim(preg_replace('/[\x00-\x1F\x7F-\x9F\xEF\xBB\xBF]/', '', $h ?? ''));
            }, $header);

            // Required headers mapping
            // name/الاسم, price/السعر, category/التصنيف, stock/المخزون, unit/الوحدة, items_in_unit/القطع داخل الوحدة, description/الوصف
            $map = [];
            foreach ($header as $index => $col) {
                $colLower = strtolower($col);
                if ($colLower === 'name' || $col === 'الاسم' || $col === 'اسم المنتج') {
                    $map['name'] = $index;
                } elseif ($colLower === 'price' || $col === 'السعر' || $col === 'سعر البيع') {
                    $map['price'] = $index;
                } elseif ($colLower === 'category' || $col === 'التصنيف' || $col === 'القسم') {
                    $map['category'] = $index;
                } elseif ($colLower === 'stock' || $col === 'المخزون' || $col === 'الكمية') {
                    $map['stock'] = $index;
                } elseif ($colLower === 'unit' || $col === 'الوحدة') {
                    $map['unit'] = $index;
                } elseif ($colLower === 'number_of_items_in_unit' || $colLower === 'items_in_unit' || $col === 'القطع داخل الوحدة' || $col === 'عدد القطع') {
                    $map['number_of_items_in_unit'] = $index;
                } elseif ($colLower === 'description' || $col === 'الوصف' || $col === 'تفاصيل') {
                    $map['description'] = $index;
                }
            }

            // Validate headers: name, price, and category are required
            if (!isset($map['name']) || !isset($map['price']) || !isset($map['category'])) {
                session()->flash('error', 'تنسيق الملف غير صحيح! يجب أن يحتوي الملف على أعمدة: "الاسم"، "السعر"، و "التصنيف" (أو "name"، "price"، و "category").');
                return redirect()->back();
            }

            $imported = 0;
            $skipped = 0;
            $validUnits = ['شكارة', 'علبة', 'كرتونة', 'شريط', 'دستة', 'لفة'];

            \Illuminate\Support\Facades\DB::beginTransaction();
            foreach ($rows as $row) {
                if (empty($row) || !isset($row[$map['name']]) || !isset($row[$map['price']]) || !isset($row[$map['category']])) {
                    $skipped++;
                    continue;
                }

                $name = trim($row[$map['name']] ?? '');
                $priceInput = trim($row[$map['price']] ?? '');
                $price = floatval($priceInput);
                $categoryName = trim($row[$map['category']] ?? '');

                if (!$name || !$priceInput || !$categoryName) {
                    $skipped++;
                    continue;
                }

                $stock = isset($map['stock']) && isset($row[$map['stock']]) ? intval(trim($row[$map['stock']] ?? '0')) : 0;
                $unit = isset($map['unit']) && isset($row[$map['unit']]) ? trim($row[$map['unit']] ?? '') : 'علبة';
                if (!in_array($unit, $validUnits)) {
                    $unit = 'علبة'; // default back to valid enum value
                }
                $numberOfItems = isset($map['number_of_items_in_unit']) && isset($row[$map['number_of_items_in_unit']]) ? intval(trim($row[$map['number_of_items_in_unit']] ?? '1')) : 1;
                $description = isset($map['description']) && isset($row[$map['description']]) ? trim($row[$map['description']] ?? '') : null;

                // Find or create category
                $category = Category::firstOrCreate(['name' => $categoryName]);

                Product::create([
                    'name' => $name,
                    'price' => $price,
                    'stock' => $stock,
                    'unit' => $unit,
                    'number_of_items_in_unit' => $numberOfItems,
                    'category_id' => $category->id,
                    'description' => $description,
                ]);

                $imported++;
            }
            \Illuminate\Support\Facades\DB::commit();
            session()->flash('success', "تم استيراد {$imported} منتج بنجاح! تم تخطي {$skipped} منتجات بسبب بيانات غير مكتملة.");
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            \Log::error("Failed to import products: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء استيراد المنتجات: ' . $e->getMessage());
        }

        return redirect()->route('products');
    }

}

