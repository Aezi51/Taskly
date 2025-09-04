
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const cropperPreview = document.getElementById('cropper-preview');
    const downloadLink = document.getElementById('download-link');
    const processBtn = document.getElementById('process-btn');
    let cropper;
    let originalFileName;

    document.addEventListener('filesDropped', (e) => {
        const file = e.detail[0];
        if (!file || !file.type.startsWith('image')) return;
        originalFileName = file.name;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            cropperPreview.innerHTML = '<img id="image-to-crop" class="max-w-full">';
            const image = document.getElementById('image-to-crop');
            image.src = event.target.result;
            
            dropZone.classList.add('hidden');
            cropperPreview.classList.remove('hidden');
            
            if(cropper) cropper.destroy();
            cropper = new Cropper(image, {
                aspectRatio: NaN, // Free aspect ratio
                viewMode: 1,
            });
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('aspect-16-9').addEventListener('click', () => cropper.setAspectRatio(16/9));
    document.getElementById('aspect-4-3').addEventListener('click', () => cropper.setAspectRatio(4/3));
    document.getElementById('aspect-1-1').addEventListener('click', () => cropper.setAspectRatio(1));
    document.getElementById('aspect-free').addEventListener('click', () => cropper.setAspectRatio(NaN));
    document.getElementById('rotate-left').addEventListener('click', () => cropper.rotate(-90));
    document.getElementById('rotate-right').addEventListener('click', () => cropper.rotate(90));

    processBtn.addEventListener('click', () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas();
        canvas.toBlob((blob) => {
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `cropped-${originalFileName}`;
            downloadLink.classList.remove('hidden');
            showResetButton();
        });
    });
});
