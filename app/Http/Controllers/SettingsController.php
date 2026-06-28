<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $receiptName    = Setting::get('receipt_name', 'أبو الدهب');
        $receiptLogoVal = Setting::get('receipt_logo');
        $receiptLogoUrl = $receiptLogoVal ? asset('storage/' . $receiptLogoVal) : null;

        return Inertia::render('settings/Index', [
            'settings' => [
                'receipt_name'     => $receiptName,
                'receipt_logo_url' => $receiptLogoUrl,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'receipt_name' => 'required|string|max:255',
            'receipt_logo' => 'nullable|image|mimes:png,jpg,jpeg,gif,svg|max:2048',
        ]);

        Setting::set('receipt_name', $request->receipt_name);

        if ($request->hasFile('receipt_logo')) {
            // Delete old logo
            $oldLogo = Setting::get('receipt_logo');
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }
            $path = $request->file('receipt_logo')->store('settings', 'public');
            Setting::set('receipt_logo', $path);
        }

        session()->flash('success', 'تم حفظ الإعدادات بنجاح!');
        return redirect()->route('settings');
    }
}
