# تشغيل ونشر منصة NexusAI على فيرسل (Deploy on Vercel Guide)

هذا المشروع مهيأ بالكامل للنشر الفوري والسلس على منصة **Vercel** بدعم كامل لواجهة المستخدم (Vite SPA) والوظائف الخادمة (Vercel Serverless Functions).

---

## ⚡ خيارات النشر المتاحة

### الخيار 1: النشر المباشر عبر مستودع GitHub (موصى به)

1. قم بإنشاء مستودع جديد على حسابك في GitHub (مثلاً: `nexus-ai-hub`).
2. افتح موجه الأوامر (Terminal) في مجلد المشروع وقم برفع الأكواد:
   ```bash
   git init
   git add .
   git commit -m "إطلاق منصة NexusAI الموحدة"
   git branch -M main
   git remote add origin https://github.com/USERNAME/nexus-ai-hub.git
   git push -u origin main
   ```
3. توجه إلى [vercel.com/new](https://vercel.com/new) واختر **Import** للمستودع.
4. سيتعرف Vercel تلقائياً على إعدادات المشروع:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(اختياري)* في قسم **Environment Variables**، يمكنك إضافة:
   - `GEMINI_API_KEY`: مفتاح Google Gemini API لتشغيل الاستجابات الحية (إذا لم تقم بإضافته، سيعمل النظام تلقائياً بالمحاكي العصبي الذكي المحلي وبدون أي أخطاء).
6. اضغط على **Deploy** وستحصل على رابط موقعك المباشر في أقل من دقيقة!

---

### الخيار 2: النشر السريع عبر سطر الأوامر (Vercel CLI)

إذا كان لديك Node.js مثبت على جهازك، يمكنك النشر بدون GitHub مباشرة:

```bash
# 1. تثبيت Vercel CLI عالمياً (إذا لم يكن مثبتاً)
npm i -g vercel

# 2. تسجيل الدخول وتشغيل أمر النشر
vercel

# 3. للنشر المباشر لبيئة الإنتاج (Production)
vercel --prod
```

لإضافة مفتاح الـ API عبر الـ CLI:
```bash
vercel env add GEMINI_API_KEY
```

---

## 🛠️ ملفات الإعداد المهيأة في المشروع

1. **`vercel.json`**:
   - توجيه كافة مسارات SPA إلى `/index.html` لمنع أخطاء 404 عند تحديث الصفحات.
   - توجيه مسارات `/api/*` تلقائياً إلى مجلد الدوال الخادمة `api/`.

2. **`api/health.ts`**:
   - دالة سحابية لفحص صحة النظام وحالة النماذج المتاحة.

3. **`api/models/generate.ts`**:
   - دالة سحابية بدون خادم (Serverless Function) تتولى التوليد الذكي والترحيل بين النماذج (Gemini, DeepSeek, Qwen, Llama).

---

تهانينا! تطبيقك جاهز الآن للعمل 24/7 بسرعة عالمية فائقة مع شهادة SSL مجانية وتوزيع CDN على شبكة Vercel Edge Network.
