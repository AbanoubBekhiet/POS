<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Inertia\Inertia;

class posController extends Controller
{
    public function pos(Request $request) {
        $carts = Cart::all();
        $customers = User::where('role','customer')->get();
        $categories = Category::all();

        $productQuery = Product::query();

        if ($request->filled('query')) {
            $productQuery->where('name', 'like', '%' . $request->input('query') . '%');
        }

        if ($request->filled('category_id')) {
            $productQuery->where('category_id', $request->input('category_id'));
        }

        $products = $productQuery->cursorPaginate(20)->withQueryString(); 

        return Inertia::render('pos/Index', [
            'carts' => $carts,
            'customers' => $customers,
            'products' =>  $products,
            'categories' => $categories,
        ]);
    }   
    public function clearCart($cartId){
        $cart = Cart::find($cartId);
        if($cart){
            $cart->delete();
            return redirect()->route('pos/Index')->with('success', 'تم حذف السلة');
        }
        return redirect()->route('pos/Index')->with('error', 'حدث خطأ في حذف السلة');
    }

    public function updateCartItem(Request $request){
        $request->validate([
            'user_id' => 'required',
            'product_id' => 'required',
            'quantity' => 'required',
            'price' => 'required',
        ]);
        $product=Product::find($request->product_id);
        if(!$product){
            return redirect()->route('pos/Index')->with('error', 'المنتج غير موجود');
        }
        if($product->stock < $request->quantity){
            return redirect()->route('pos/Index')->with('error', 'الكمية غير متوفرة');
        }
        if($request->quantity < 1){
            return redirect()->route('pos/Index')->with('error', 'الكمية يجب أن تكون أكبر من 0');
        }
        $totalPrice = $request->quantity * $request->price;
        $cart = Cart::where('user_id', $request->user_id)->where('product_id', $request->product_id)->first();
        if($cart){
            $cart->quantity += $request->quantity;
            $cart->save();
        }else{
            Cart::create([
                'user_id' => $request->user_id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'total_price' => $totalPrice,
            ]);
        }
        return redirect()->route('pos/Index')->with('success', 'تم إضافة عنصر للسلة');
    }

    public function deleteCartItem($cartId){
        $cart = Cart::find($cartId);
        if($cart){
            $cart->delete();
            return redirect()->route('pos/Index')->with('success', 'تم حذف عنصر من السلة');
        }
        return redirect()->route('pos/Index')->with('error', 'حدث خطأ في حذف عنصر من السلة');
    }

    
    
}
