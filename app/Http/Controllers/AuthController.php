<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function loginPage(){
        return Inertia::render('auth/login');
    }
    public function login(Request $request){
        $request->validate([
            'password' => 'required|string',
        ]);
        $user = User::where('role', 'admin')->first();
        if($user && Hash::check($request->password, $user->password)){
            Auth::login($user);
            return redirect()->route('dashboard')->with('success', 'تم تسجيل الدخول بنجاح');
        }
        return redirect()->route('login')->with('error', 'كلمة المرور غير صحيحة');
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login')->with('success', 'تم تسجيل الخروج بنجاح');
    }
    
    public function resetPasswordPage(){
        return Inertia::render('auth/reset_password');
    }

    public function resetPassword(Request $request){
        $request->validate([
            'password' => 'required|string',
            'new_password' => 'required|string',
        ]);
        $user = User::where('role', 'admin')->first();
        if($user && Hash::check($request->password, $user->password)){
            $user->password = Hash::make($request->new_password);
            $user->save();
            return redirect()->route('dashboard')->with('success', 'تم تغيير كلمة المرور بنجاح');
        }
        return redirect()->route('reset-password')->with('error', 'كلمة المرور غير صحيحة');
    }
}

