<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            'email' => 'required|email',
        ]);
        $user = User::where('email', $request->email)->first();
        if(!$user){
            return redirect()->route('reset-password')->with('error', 'البريد الالكتروني غير موجود');
        }
        
        $token = \Illuminate\Support\Str::random(6);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => now(),
            ]
        );
        
        return redirect()->route('verify-reset-code')->with('success', 'تم إرسال رمز التحقق إلى بريدك الالكتروني: ' . $token);
    }

    public function verifyResetCodePage(Request $request){
        return Inertia::render('auth/verify_reset_code');
    }
    
    public function verifyResetCode(Request $request){
        $request->validate([
            'code' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);
        
        $reset = DB::table('password_reset_tokens')->where('token', $request->code)->first();
        if(!$reset){
            return redirect()->route('verify-reset-code')->with('error', 'رمز التحقق غير صحيح');
        }
        
        $user = User::where('email', $reset->email)->first();
        if($user){
            $user->password = Hash::make($request->password);
            $user->save();
        }
        
        DB::table('password_reset_tokens')->where('token', $request->code)->delete();
        
        return redirect()->route('login')->with('success', 'تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.');
    }
}
