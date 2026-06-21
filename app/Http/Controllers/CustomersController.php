<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomersController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = User::where('role', 'customer')->with(['profile', 'orders']);
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhereHas('profile', function($pq) use ($search) {
                      $pq->where('phone_number', 'like', '%' . $search . '%')
                        ->orWhere('shop_name', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%');
                  });
            });
        }
        
        $paginator = $query->latest()->simplePaginate(15);
        
        $customers = collect($paginator->items())->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email ?? '—',
                'phone' => $user->profile?->phone_number ?? '—',
                'address' => $user->profile?->address ?? '—',
                'shop_name' => $user->profile?->shop_name ?? '—',
                'category_of_place' => $user->profile?->category_of_place ?? '—',
                'orders_count' => $user->orders->count(),
                'total_spent' => number_format($user->orders->sum('total_price'), 2) . ' ج',
                'status' => 'active', // default status
                'joined' => $user->created_at ? $user->created_at->translatedFormat('F Y') : '—',
            ];
        });

        return Inertia::render('customers/Index', [
            'customers' => [
                'data' => $customers,
                'next_page' => $paginator->hasMorePages() ? $paginator->currentPage() + 1 : null,
                'current_page' => $paginator->currentPage(),
            ],
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email|max:255',
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'shop_name' => 'required|string|max:255',
            'category_of_place' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => 'customer',
                'password' => Hash::make(Str::random(16)),
            ]);

            Profile::create([
                'user_id' => $user->id,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'shop_name' => $request->shop_name,
                'category_of_place' => $request->category_of_place,
            ]);

            DB::commit();
            session()->flash('success', 'تم إضافة العميل بنجاح!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to add customer: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء إضافة العميل: ' . $e->getMessage());
        }

        return redirect()->route('customers');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id . '|max:255',
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'shop_name' => 'required|string|max:255',
            'category_of_place' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            $profile = Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'phone_number' => $request->phone_number,
                    'address' => $request->address,
                    'shop_name' => $request->shop_name,
                    'category_of_place' => $request->category_of_place,
                ]
            );

            DB::commit();
            session()->flash('success', 'تم تحديث بيانات العميل بنجاح!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update customer {$id}: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء تحديث بيانات العميل: ' . $e->getMessage());
        }

        return redirect()->route('customers');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        try {
            // Check if user has orders
            if ($user->orders()->exists()) {
                session()->flash('error', 'لا يمكن حذف هذا العميل لوجود طلبات مسجلة باسمه!');
                return redirect()->route('customers');
            }
            
            $user->delete();
            session()->flash('success', 'تم حذف العميل بنجاح!');
        } catch (\Exception $e) {
            Log::error("Failed to delete customer {$id}: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء حذف العميل: ' . $e->getMessage());
        }

        return redirect()->route('customers');
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
                session()->flash('error', 'ملف الاستيراد فارغ أو غير صالح!');
                return redirect()->back();
            }

            // Read header row
            $header = array_shift($rows);

            // Clean headers (remove BOM or spaces)
            $header = array_map(function($h) {
                return trim(preg_replace('/[\x00-\x1F\x7F-\x9F\xEF\xBB\xBF]/', '', $h));
            }, $header);

            // Required headers mapping
            // English/Arabic options: name/الاسم, shop_name/المحل, email/البريد الالكتروني, phone/الهاتف, address/العنوان, category/التصنيف
            $map = [];
            foreach ($header as $index => $col) {
                $colLower = strtolower($col);
                if ($colLower === 'name' || $col === 'الاسم') {
                    $map['name'] = $index;
                } elseif ($colLower === 'shop_name' || $col === 'المحل' || $col === 'اسم المحل') {
                    $map['shop_name'] = $index;
                } elseif ($colLower === 'email' || $col === 'البريد الالكتروني' || $col === 'البريد') {
                    $map['email'] = $index;
                } elseif ($colLower === 'phone' || $colLower === 'phone_number' || $col === 'الهاتف' || $col === 'رقم الهاتف') {
                    $map['phone_number'] = $index;
                } elseif ($colLower === 'address' || $col === 'العنوان') {
                    $map['address'] = $index;
                } elseif ($colLower === 'category' || $colLower === 'category_of_place' || $col === 'تصنيف المحل' || $col === 'الفئة') {
                    $map['category_of_place'] = $index;
                }
            }

            // Validate headers: name and shop_name are required
            if (!isset($map['name']) || !isset($map['shop_name'])) {
                session()->flash('error', 'تنسيق الملف غير صحيح! يجب أن يحتوي الملف على عمودين باسم "الاسم" و "اسم المحل" (أو "name" و "shop_name").');
                return redirect()->back();
            }

            $imported = 0;
            $skipped = 0;

            DB::beginTransaction();
            foreach ($rows as $row) {
                if (empty($row) || !isset($row[$map['name']]) || !isset($row[$map['shop_name']])) {
                    $skipped++;
                    continue;
                }

                $name = trim($row[$map['name']]);
                $shopName = trim($row[$map['shop_name']]);

                if (!$name || !$shopName) {
                    $skipped++;
                    continue;
                }

                $email = isset($map['email']) ? trim($row[$map['email']] ?? '') : null;
                $phone = isset($map['phone_number']) ? trim($row[$map['phone_number']] ?? '') : null;
                $address = isset($map['address']) ? trim($row[$map['address']] ?? '') : null;
                $categoryOfPlace = isset($map['category_of_place']) ? trim($row[$map['category_of_place']] ?? '') : null;

                // Validate email uniqueness if present
                if ($email) {
                    $exists = User::where('email', $email)->exists();
                    if ($exists) {
                        $email = null; // ignore duplicate email to import the user anyway
                    }
                }

                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'role' => 'customer',
                    'password' => Hash::make(Str::random(16)),
                ]);

                Profile::create([
                    'user_id' => $user->id,
                    'phone_number' => $phone,
                    'address' => $address,
                    'shop_name' => $shopName,
                    'category_of_place' => $categoryOfPlace,
                ]);

                $imported++;
            }
            DB::commit();
            session()->flash('success', "تم استيراد {$imported} عميل بنجاح! تم تخطي {$skipped} عملاء بسبب بيانات غير مكتملة.");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to import customers: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء استيراد العملاء: ' . $e->getMessage());
        }

        return redirect()->route('customers');
    }
}
