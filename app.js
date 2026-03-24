// تعريف العناصر
const imageUpload = document.getElementById('imageUpload');
const welcomeScreen = document.getElementById('welcomeScreen');
const editorScreen = document.getElementById('editorScreen');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let currentImage = new Image(); // متغير لحفظ الصورة الحالية

// الاستماع لحدث اختيار صورة من الجهاز
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // قراءة ملف الصورة
    const reader = new FileReader();
    reader.onload = function(event) {
        currentImage.onload = function() {
            // إخفاء شاشة الترحيب وإظهار شاشة التحرير
            welcomeScreen.style.display = 'none';
            editorScreen.style.display = 'flex';

            // ضبط حجم الكانفاس على نفس حجم الصورة الحقيقي
            canvas.width = currentImage.width;
            canvas.height = currentImage.height;

            // رسم الصورة داخل الكانفاس
            ctx.drawImage(currentImage, 0, 0);
        }
        // إعطاء مسار الصورة للكائن
        currentImage.src = event.target.result;
    }
    reader.readAsDataURL(file);
});
