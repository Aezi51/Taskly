
document.addEventListener('DOMContentLoaded', () => {
    // Lucide Icons initialization
    lucide.createIcons();

    // Header scroll effect
    const header = document.getElementById('header-placeholder');
    if (header) {
        window.addEventListener('scroll', () => {
            const nav = header.querySelector('header');
            if (window.scrollY > 50) {
                nav.classList.add('bg-[#111814]/80', 'backdrop-blur-lg', 'border-b', 'border-slate-800');
            } else {
                nav.classList.remove('bg-[#111814]/80', 'backdrop-blur-lg', 'border-b', 'border-slate-800');
            }
        });
    }

    // Scroll-triggered fade-in animations for sections
    const faders = document.querySelectorAll('.scroll-fade-in');
    if (faders.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        faders.forEach(fade => observer.observe(fade));
    }

    // File drag-and-drop zone functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileListEl = document.getElementById('file-list');
    
    if (dropZone && fileInput && fileListEl) {
        const displayFiles = (files) => {
            if (!files || files.length === 0) return;
            
            fileListEl.innerHTML = ''; 
            document.getElementById('file-list-wrapper').classList.remove('hidden');
            document.getElementById('drop-zone-text').classList.add('hidden');
            
            Array.from(files).forEach(file => {
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center bg-slate-800/50 p-3 rounded-lg';
                li.innerHTML = `<div class="flex items-center gap-3 overflow-hidden"><i data-lucide="file" class="w-5 h-5 text-slate-400 flex-shrink-0"></i><span class="text-slate-300 truncate">${file.name}</span></div><span class="text-xs text-slate-500 flex-shrink-0">${(file.size / 1024 / 1024).toFixed(2)} MB</span>`;
                fileListEl.appendChild(li);
            });
            
            lucide.createIcons();
            
            // Show options and process button, hide reset button
            const toolOpts = document.getElementById('tool-options');
            if(toolOpts) toolOpts.classList.remove('hidden');
            
            document.getElementById('process-btn-wrapper')?.classList.remove('hidden');
            document.getElementById('reset-btn-wrapper')?.classList.add('hidden');
            document.getElementById('download-link')?.classList.add('hidden');
            const downloadLinks = document.getElementById('download-links');
            if (downloadLinks) downloadLinks.innerHTML = '';
        };

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-emerald-400', 'bg-emerald-900/10'); });
        dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('border-emerald-400', 'bg-emerald-900/10'); });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-emerald-400', 'bg-emerald-900/10');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                displayFiles(fileInput.files);
                
                // For cropper tool, trigger a custom event
                const event = new CustomEvent('filesDropped', { detail: fileInput.files });
                document.dispatchEvent(event);
            }
        });
        fileInput.addEventListener('change', () => {
            displayFiles(fileInput.files);
            // For cropper tool, trigger a custom event
            const event = new CustomEvent('filesDropped', { detail: fileInput.files });
            document.dispatchEvent(event);
        });
    }
    
    // Setup the reset functionality for all tools
    setupToolReset();
});

// Global UI reset function for tools
function setupToolReset() {
    const resetButton = document.getElementById('reset-btn');
    if (!resetButton) return;

    resetButton.addEventListener('click', () => {
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        
        const fileList = document.getElementById('file-list');
        if (fileList) fileList.innerHTML = '';

        document.getElementById('file-list-wrapper')?.classList.add('hidden');
        document.getElementById('drop-zone-text')?.classList.remove('hidden');
        document.getElementById('tool-options')?.classList.add('hidden');
        document.getElementById('download-link')?.classList.add('hidden');
        
        const downloadLinks = document.getElementById('download-links');
        if(downloadLinks) downloadLinks.innerHTML = '';
        
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.textContent = 'Ready';
        
        document.getElementById('process-btn-wrapper')?.classList.remove('hidden');
        resetButton.parentElement.classList.add('hidden');

        // Custom reset for cropper tool
        const cropperPreview = document.getElementById('cropper-preview');
        if (cropperPreview) {
            cropperPreview.innerHTML = '';
            cropperPreview.classList.add('hidden');
            document.getElementById('drop-zone').classList.remove('hidden');
        }
    });
}

// Function to call after a process completes to show the reset button
function showResetButton() {
    const processWrapper = document.getElementById('process-btn-wrapper');
    const resetWrapper = document.getElementById('reset-btn-wrapper');
    if(processWrapper && resetWrapper) {
        processWrapper.classList.add('hidden');
        resetWrapper.classList.remove('hidden');
    }
}
