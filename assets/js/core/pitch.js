/* =========================================================
Pitch detection (ACF2+)
========================================================= */
function autoCorrelate(b, sampleRate) {
    let size = b.length, rms = 0;
    
    for (let i = 0; i < size; i++) {
        rms += b[i] * b[i];
    }
    
    rms = Math.sqrt(rms / size);
    if (rms < 0.012) return -1;
    
    let r1 = 0, r2 = size - 1, thres = 0.2;
    
    for (let i = 0; i < size / 2; i++) {
        if (Math.abs(b[i]) < thres) {
            r1 = i;
            break;
        }
    }
        
    for (let i = 1; i < size / 2; i++) {
        if (Math.abs(b[size - i]) < thres) {
            r2 = size - i;
            break;
        }
    }
        
    const sig = b.slice(r1, r2);
    size = sig.length;
    
    if (size < 32) return -1;
    
    const c = new Float32Array(size);
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - i; j++) {
            c[i] += sig[j] * sig[j + i];
        }
    }
            
    let d = 0;
    while (d + 1 < size && c[d] > c[d + 1]) {
        d++;
    }
        
    let maxval = -1, maxpos = -1;
    
    for (let i = d; i < size; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
        
    if (maxpos <= 0) return -1;
    
    let T0 = maxpos;
    const x1 = c[T0 - 1] || 0, x2 = c[T0], x3 = c[T0 + 1] || 0;
    const a = (x1 + x3 - 2 * x2) / 2, bq = (x3 - x1) / 2;
    
    if (a) T0 = T0 - bq / (2 * a);
    return sampleRate / T0;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const midiName = m => NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
