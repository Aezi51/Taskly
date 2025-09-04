
let ffmpeg;
async function loadFFmpeg() {
    const statusEl = document.getElementById('status');
    const processBtn = document.getElementById('process-btn');
    if (!ffmpeg) {
        ffmpeg = new FFmpeg.FFmpeg();
        ffmpeg.on('log', ({ message }) => {
            // Avoid flooding the status with progress logs
            if (statusEl && !message.includes("frame=") && !message.includes("size=")) {
                 statusEl.textContent = message;
            }
        });
        statusEl.textContent = 'Loading FFmpeg Core (~31 MB)... Please wait.';
        processBtn.disabled = true;
        processBtn.textContent = 'Loading Core...';
        await ffmpeg.load({ coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js' });
        statusEl.textContent = 'FFmpeg Loaded. Ready to process files.';
        processBtn.disabled = false;
        processBtn.textContent = 'Process';
    }
    return ffmpeg;
}

async function runFFmpeg(inputFiles, args, outputFilename) {
    const statusEl = document.getElementById('status');
    const processBtn = document.getElementById('process-btn');
    const downloadLink = document.getElementById('download-link');
    try {
        const ffmpeg = await loadFFmpeg();
        statusEl.textContent = 'Writing file(s) to memory...';
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';
        downloadLink.classList.add('hidden');

        // Handle multiple input files for merging
        if (Array.isArray(inputFiles)) {
             if (args.includes('-f') && args.includes('concat')) {
                const fileList = inputFiles.map((file, i) => `file 'input${i}.${file.name.split('.').pop()}'`).join('\n');
                await ffmpeg.writeFile('list.txt', fileList);
            }
            for (let i = 0; i < inputFiles.length; i++) {
                await ffmpeg.writeFile(`input${i}.${inputFiles[i].name.split('.').pop()}`, await FFmpeg.fetchFile(inputFiles[i]));
            }
        } else { // Handle single input file
            await ffmpeg.writeFile(`input.${inputFiles.name.split('.').pop()}`, await FFmpeg.fetchFile(inputFiles));
        }
        
        statusEl.textContent = 'Executing FFmpeg command... This may take a moment.';
        let lastProgress = 0;
        ffmpeg.on('progress', ({ progress }) => {
            const progressPercent = Math.round(progress * 100);
            if(progressPercent > lastProgress && progressPercent <= 100) {
                 statusEl.textContent = `Processing: ${progressPercent}%`;
                 lastProgress = progressPercent;
            }
        });

        await ffmpeg.exec(args);
        
        statusEl.textContent = 'Complete. Reading output file from memory...';
        const data = await ffmpeg.readFile(outputFilename);
        
        const blob = new Blob([data.buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        downloadLink.href = url;
        downloadLink.download = outputFilename;
        downloadLink.classList.remove('hidden');
        downloadLink.textContent = `Download ${outputFilename}`;
        statusEl.textContent = 'Processing finished! Your file is ready for download.';
        showResetButton();

    } catch (error) {
        statusEl.textContent = `An error occurred: ${error.message}. Check console for details.`;
        console.error(error);
        showResetButton(); // Also show reset button on error
    } finally {
        processBtn.disabled = false;
        processBtn.textContent = 'Process';
    }
}
