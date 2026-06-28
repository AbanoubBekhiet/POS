<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'completed_order' => fn () => $request->session()->get('completed_order'),
                'resumed_cart' => fn () => $request->session()->get('resumed_cart'),
            ],
            'auth' => [
                'user' => fn () => $request->user() ? [
                    'id'    => $request->user()->id,
                    'name'  => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
            ],
            'appSettings' => fn () => $this->getAppSettings(),
        ];
    }

    private function getAppSettings(): array
    {
        try {
            $receiptName    = \App\Models\Setting::where('key', 'receipt_name')->value('value') ?? 'أبو الدهب';
            $receiptLogoVal = \App\Models\Setting::where('key', 'receipt_logo')->value('value');
            return [
                'receipt_name'     => $receiptName,
                'receipt_logo_url' => $receiptLogoVal ? asset('storage/' . $receiptLogoVal) : null,
            ];
        } catch (\Exception $e) {
            return ['receipt_name' => 'أبو الدهب', 'receipt_logo_url' => null];
        }
    }
}
