<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // ==========================================
            // CATEGORY 1: منتجات البان (Dairy Products - 34 Items)
            // ==========================================
            ['name' => 'لبن جهينة كامل الدسم', 'price' => 45.00, 'stock' => 120, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'لبن جهينة خالي الدسم', 'price' => 45.00, 'stock' => 80, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'لبن جهينة نصف دسم', 'price' => 45.00, 'stock' => 95, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'زبادي جهينة طبيعي', 'price' => 9.00, 'stock' => 300, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'زبادي جهينة لايت', 'price' => 9.50, 'stock' => 150, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'زبادي جهينة بالخلاط فراولة', 'price' => 15.00, 'stock' => 110, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'زبادي جهينة بالخلاط خوخ', 'price' => 15.00, 'stock' => 100, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'لبن رايب جهينة طبيعي الكبير', 'price' => 38.00, 'stock' => 85, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'لبن لمار كامل الدسم', 'price' => 48.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'لبن لمار خالي الدسم', 'price' => 48.00, 'stock' => 70, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'كريمة ططهي لمار', 'price' => 125.00, 'stock' => 40, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'كريمة خفق لمار', 'price' => 130.00, 'stock' => 35, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة دومتي فيتا علبة', 'price' => 35.00, 'stock' => 200, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة دومتي اسطنبولي علبة', 'price' => 36.00, 'stock' => 180, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة دومتي بلس زيتون', 'price' => 38.00, 'stock' => 150, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة عبور لاند فيتا صغير', 'price' => 18.00, 'stock' => 250, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة عبور لاند براميلي عبوة', 'price' => 72.00, 'stock' => 90, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة عبور لاند شيدر علبة', 'price' => 36.00, 'stock' => 110, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة كيري مربعات 6 قطع', 'price' => 45.00, 'stock' => 130, 'unit' => 'علبة', 'number_of_items_in_unit' => 6, 'category_id' => 1],
            ['name' => 'جبنة كيري مربعات 12 قطعة', 'price' => 85.00, 'stock' => 90, 'unit' => 'علبة', 'number_of_items_in_unit' => 12, 'category_id' => 1],
            ['name' => 'جبنة مثلثات لافاش كيري 8 قطع', 'price' => 32.00, 'stock' => 220, 'unit' => 'علبة', 'number_of_items_in_unit' => 8, 'category_id' => 1],
            ['name' => 'جبنة مثلثات طعمة 8 قطع', 'price' => 16.00, 'stock' => 300, 'unit' => 'علبة', 'number_of_items_in_unit' => 8, 'category_id' => 1],
            ['name' => 'جبنة مثلثات بريزيدن 8 قطع', 'price' => 50.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 8, 'category_id' => 1],
            ['name' => 'جبنة شيدر أفانتي بالكمون', 'price' => 65.00, 'stock' => 75, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة جودة أفانتي فيلمنك', 'price' => 80.00, 'stock' => 60, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة رومي مصري قديم وسط', 'price' => 95.00, 'stock' => 50, 'unit' => 'لفة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة موتزاريلا الأطباء مبشورة', 'price' => 85.00, 'stock' => 80, 'unit' => 'لفة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'جبنة موتزاريلا دومتي كيس', 'price' => 90.00, 'stock' => 95, 'unit' => 'لفة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'قشطة بوك مطبوخة علبة', 'price' => 55.00, 'stock' => 110, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'زبدة فيرن خليط قالب', 'price' => 110.00, 'stock' => 85, 'unit' => 'لفة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'زبدة كريستال قالب غير مملح', 'price' => 115.00, 'stock' => 70, 'unit' => 'لفة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'سمنة روابي بطعم الزبدة الفلاحي', 'price' => 145.00, 'stock' => 100, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'سمنة كريستال بيضاء علبة', 'price' => 145.00, 'stock' => 120, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],
            ['name' => 'سمنة الهانم علبة كلاسيك', 'price' => 135.00, 'stock' => 130, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 1],

            // ==========================================
            // CATEGORY 2: مستحضرات تجميل (Cosmetics - 33 Items)
            // ==========================================
            ['name' => 'كريم إيفا بالبنتينول مرطب', 'price' => 35.00, 'stock' => 150, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'كريم إيفا بالجلسرين للبشرة الجافة', 'price' => 38.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'غسول إيفا سكين كليك لتفتيح البشرة', 'price' => 85.00, 'stock' => 90, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'كريم إيفا كولاجين لشد التجاعيد', 'price' => 160.00, 'stock' => 50, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'سيرم إيفا كولاجين للوجه والرقبة', 'price' => 220.00, 'stock' => 45, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'شامبو بوبانا ببروتين الحرير', 'price' => 75.00, 'stock' => 110, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'بلسم بوبانا بالارجان المغذي', 'price' => 75.00, 'stock' => 95, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'ماسك بوبانا بالفحم لتقشير الوجه', 'price' => 45.00, 'stock' => 160, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'سكراب بوبانا بالمشمش لإزالة الجلد الميت', 'price' => 50.00, 'stock' => 130, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'سيرم جوفياليتي بحمض الهيالورونيك', 'price' => 280.00, 'stock' => 30, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'كريم ترطيب الجسم جوفياليتي زبدة الشيا', 'price' => 190.00, 'stock' => 55, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'مزيل عرق ألو إيفا ستيك حماية 48ساعة', 'price' => 65.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'سبراي معطر للجسم إيفا سكين كير كاندي', 'price' => 90.00, 'stock' => 85, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'شامبو بندولين للأطفال كيدز طبيعي', 'price' => 110.00, 'stock' => 120, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'كريم شعر بندولين كيدز كيرلي زبدة شيا', 'price' => 135.00, 'stock' => 80, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'زيت شعر بندولين لمنع التساقط', 'price' => 160.00, 'stock' => 65, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'شاور جيل سوفي بالورد والياسمين', 'price' => 60.00, 'stock' => 150, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'صابون إيفا بالجلسرين شفاف قطعتين', 'price' => 40.00, 'stock' => 200, 'unit' => 'علبة', 'number_of_items_in_unit' => 2, 'category_id' => 2],
            ['name' => 'كريم فاتيكا بالثوم والجرجير لتغذية الشعر', 'price' => 45.00, 'stock' => 170, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'شامبو فاتيكا لإصلاح وتجديد الشعر التالف', 'price' => 55.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'زيت دابر أملا الذهبي لتطويل الشعر', 'price' => 85.00, 'stock' => 105, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'كريم لونا لليدين والكعبين المرطب المركز', 'price' => 30.00, 'stock' => 250, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'زبدة كاكاو لونا مرطب شفايف فراولة', 'price' => 20.00, 'stock' => 400, 'unit' => 'شريط', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'غسول فم ميزواك مضاد للبكتيريا', 'price' => 45.00, 'stock' => 110, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'معجون أسنان سيجنال مكافحة التسوق كلاسيك', 'price' => 25.00, 'stock' => 230, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'زيت اللوز الحلو من ممتنان نقي 100%', 'price' => 120.00, 'stock' => 50, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'ماء ورد نقي من امتنان لتنظيف البشرة', 'price' => 45.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'لوشن نيفيا سوفت مرطب للجسم متكامل', 'price' => 95.00, 'stock' => 115, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'شاور جيل كامي معطر سحر الرومانسية', 'price' => 70.00, 'stock' => 160, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'صابونة دوف ترطيب عميق الأصلي ربع كريم', 'price' => 35.00, 'stock' => 240, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'سبراي فازلين لوشن سريع الامتصاص كاكاو', 'price' => 180.00, 'stock' => 40, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'حمام كريم كليوباترا بالنخاع العسلي للشعر', 'price' => 65.00, 'stock' => 85, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2],
            ['name' => 'مخمرية العروسة لتعطير الجسم والشعر كلاسيك', 'price' => 40.00, 'stock' => 190, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 2], // Typo Fixed here

            // ==========================================
            // CATEGORY 3: مساحيق (Detergents/Powders - 33 Items)
            // ==========================================
            ['name' => 'مسحوق إيريال أتوماتيك لافندر كيس كبير', 'price' => 499.00, 'stock' => 60, 'unit' => 'شكارة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مسحوق إيريال عادي للغسيل اليدوي', 'price' => 85.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مسحوق تايد أتوماتيك قوة البياض كيس', 'price' => 380.00, 'stock' => 75, 'unit' => 'شكارة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مسحوق برسيل أتوماتيك تكنولوجيا الأخضر', 'price' => 450.00, 'stock' => 80, 'unit' => 'شكارة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'برسيل جيل أتوماتيك منظف للغسيل الأسود', 'price' => 140.00, 'stock' => 110, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'برسيل جيل أتوماتيك برائحة اللافندر', 'price' => 145.00, 'stock' => 125, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مسحوق أوكسي أتوماتيك رائحة نسيم العليل', 'price' => 360.00, 'stock' => 90, 'unit' => 'شكارة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'أوكسي جيل غسيل الأطباق بالليمون', 'price' => 35.00, 'stock' => 200, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مسحوق باهار للغسالات العادية اقتصادي', 'price' => 55.00, 'stock' => 180, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مسحوق وفير اقتصادي للغسالات الأتوماتيك', 'price' => 290.00, 'stock' => 85, 'unit' => 'شكارة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'سائل تنظيف الأطباق بريل الأصلي جيل جركان', 'price' => 65.00, 'stock' => 150, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'سائل تنظيف الأطباق فيري بقوة بديلة للمبيض', 'price' => 85.00, 'stock' => 130, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'منظف أطباق فيبا بالليمون الأخضر اقتصادي', 'price' => 28.00, 'stock' => 220, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'كلوركس الأبيض مبيض ومطهر للملابس عبوة', 'price' => 25.00, 'stock' => 170, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'كلوركس الألوان سائل للملابس الملونة جالون', 'price' => 85.00, 'stock' => 95, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'سبراي كلوركس مطهر عام للمنزل والأسطح', 'price' => 55.00, 'stock' => 120, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'منعم ملابس داوني نسيم الوادي مركز زجاجة', 'price' => 110.00, 'stock' => 100, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'منعم ومعطر ملابس فريدا رائحة الخوخ جالون', 'price' => 199.00, 'stock' => 70, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'معطر جو فريدا سبراي رائحة العود الفاخر', 'price' => 65.00, 'stock' => 140, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مطهر ومنظف الأرضيات ديتول الأصلي حماية', 'price' => 160.00, 'stock' => 80, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'منظف تواليت هاربيك باور بلس إزالة التكلسات', 'price' => 75.00, 'stock' => 115, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'منظف زجاج جلانز كلاسيك مع بخاخ', 'price' => 35.00, 'stock' => 160, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'ملمع خشب بليدج برائحة برتقال طبيعي', 'price' => 85.00, 'stock' => 90, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'قراص غسالات الأطباق فينيش الكل في واحد 30قرص', 'price' => 380.00, 'stock' => 45, 'unit' => 'علبة', 'number_of_items_in_unit' => 30, 'category_id' => 3],
            ['name' => 'ملح غسالات الأطباق فينيش حماية الفلتر', 'price' => 140.00, 'stock' => 50, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مساعد شطف غسالات الأطباق فينيش لمعان', 'price' => 150.00, 'stock' => 55, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'منظف سجاد ومفروشات فانيش مزيل بقع كيس', 'price' => 65.00, 'stock' => 110, 'unit' => 'لفة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'سائل غسيل ملابس الأطفال بيجون لطيف', 'price' => 195.00, 'stock' => 40, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'كازان كلين منظف أقمشة قوي جداً', 'price' => 50.00, 'stock' => 130, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مذيب دهون المطبخ سترس 7 في 1 فوم بخاخ', 'price' => 95.00, 'stock' => 145, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'سائل ممسحة أرضيات جنرال عبير الزهور لتر', 'price' => 48.00, 'stock' => 165, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'ديتول جيل منظف ومطهر الأسطح متعدد الأغراض', 'price' => 90.00, 'stock' => 100, 'unit' => 'علبة', 'number_of_items_in_unit' => 1, 'category_id' => 3],
            ['name' => 'مكعبات تنظيف التواليت بريف نشاط الفراولة 2ق', 'price' => 60.00, 'stock' => 210, 'unit' => 'علبة', 'number_of_items_in_unit' => 2, 'category_id' => 3],
        ];

        foreach ($products as $product) {
            Product::create(array_merge($product, ['image' => null]));
        }
    }
}