# نکس‌سل

آکادمی فروش و مذاکره با قفل آزمون سه‌سؤالی و دستیار زندهٔ پشت خط. گفتار به سرویس ابری می‌رود؛ اگر کلید OpenAI نباشد، پاسخ از کتاب اعتراض‌های فارسی و تشخیص گفتار مرورگر می‌آید. پایگاه داده با `DATABASE_URL` روی PostgreSQL است و بدون آن، Postgres توکار (PGlite) در `data/pglite` بالا می‌آید.

داده‌ها فقط در مرورگر ذخیره می‌شوند. پرداخت و پاسخ پشتیبان شبیه‌سازی شده است.

## اجرا

```bash
npm install
cp .env.example .env.local
npm run dev -- -H 0.0.0.0 -p 43123
```

`npm run dev` هم Next را روی پورت ۴۳۱۲۳ بالا می‌آورد و هم سرویس HTTP/WebSocket کوپایلوت را روی ۴۳۱۲۴. متغیرها در `.env.example` است.

سپس در مرورگر [http://127.0.0.1:43123](http://127.0.0.1:43123) را باز کنید. دستیار زنده در [http://127.0.0.1:43123/dashboard/copilot](http://127.0.0.1:43123/dashboard/copilot) است. مسیر مرحله‌به‌مرحله در [http://127.0.0.1:43123/academy](http://127.0.0.1:43123/academy) است.

## ساختار

```
src/db/schema.ts          مدل‌های Drizzle: کاربر، نقش، اشتراک، درس، آزمون، پیشرفت
src/db/repo.ts            نشست، نمره‌دهی ۲ از ۳، سهمیه دقیقه
src/lib/lms/rules.ts      قانون دسترسی و سقف سهمیه
src/lib/copilot/          فیلتر اعتراض، کتاب جواب، ضبط ۱۶کیلوهرتز
src/server/stt.ts         Whisper ابری و نویسندهٔ اختیاری، با سقف ۱٫۶ ثانیه
server/platform.ts        HTTP و WebSocket
server/dev-stack.mjs      اجرای هم‌زمان Next و پلتفرم
src/app/dashboard/copilot صفحهٔ HUD
src/components/copilot/   دموی صفحهٔ اول و HUD
src/components/lms/       نوار پیشرفت درس و پیوال کوپایلوت
```

نسخهٔ عمومی: [https://amirhos3in.github.io/sales-pro/](https://amirhos3in.github.io/sales-pro/)

برای ساخت همان خروجی ثابت:

```bash
npm run export:pages
```

ورود با موبایل و کد آزمایشی است. هر کد ۴ تا ۶ رقمی، مثلاً `1234`، قبول می‌شود. درس رایگان بعد از ورود باز است. مسیر پولی اشتراک می‌خواهد. ویدیوی بعدی فقط بعد از حداقل دو پاسخ درست از سه سؤال باز می‌شود. پلن ماهانه فقط آکادمی است؛ پلن فصلی ۳۰۰ دقیقه کوپایلوت و پلن سالانه ۲۰۰۰ دقیقه می‌دهد. بدون `OPENAI_API_KEY` هم دمو و HUD جواب می‌دهند.
