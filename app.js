let textLayers = []; // مصفوفة لحفظ كل كلمة أو جملة كطبقة منفصلة
let selectedLayerIndex = null;

// 1. وظيفة رفع خط من الجهاز
function loadCustomFont(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        const fontName = 'CustomFont_' + Date.now();
        const fontFace = new FontFace(fontName, e.target.result);
        await fontFace.load();
        document.fonts.add(fontFace);
        if(selectedLayerIndex !== null) {
            textLayers[selectedLayerIndex].fontFamily = fontName;
            renderCanvas();
        }
    };
    reader.readAsArrayBuffer(file);
}

// 2. المحاكاة الدقيقة (تحريك بالبكسل)
function moveText(dx, dy) {
    if(selectedLayerIndex === null) return;
    const step = parseInt(document.getElementById('moveStep').value);
    textLayers[selectedLayerIndex].x += dx * step;
    textLayers[selectedLayerIndex].y += dy * step;
    renderCanvas();
}

// 3. تصدير الصورة بدقة 4K
function export4K() {
    // ننشئ كانفاس وهمي بحجم 4K
    const offscreenCanvas = document.createElement('canvas');
    const targetWidth = 3840; 
    const targetHeight = 2160;
    offscreenCanvas.width = targetWidth;
    offscreenCanvas.height = targetHeight;
    const octx = offscreenCanvas.getContext('2d');

    // نرسم كل شيء بنفس الترتيب لكن بمقاييس أكبر
    // (هنا نحتاج معادلة تناسب الحجم)
    octx.drawImage(currentImage, 0, 0, targetWidth, targetHeight);
    
    // حفظ الصورة
    const link = document.createElement('a');
    link.download = 'design-4k.png';
    link.href = offscreenCanvas.toDataURL('image/png', 1.0);
    link.click();
}

// وظيفة الرسم الأساسية (تحدث الشاشة عند أي تغيير)
function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0);
    
    textLayers.forEach((layer, index) => {
        ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.color;
        
        // إضافة حد للخط (Stroke)
        if(layer.strokeWidth > 0) {
            ctx.strokeStyle = layer.strokeColor;
            ctx.lineWidth = layer.strokeWidth;
            ctx.strokeText(layer.text, layer.x, layer.y);
        }
        
        ctx.fillText(layer.text, layer.x, layer.y);
    });
}
