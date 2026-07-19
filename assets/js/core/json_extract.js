/* =========================================================
JSON extraction (handles fences + truncated tails)
========================================================= */
function extractJSON(text) {
    if (!text) return null;

    let t = text.replace(/```json|```/g, '').trim();
    const a = t.indexOf('{'), b = t.lastIndexOf('}');

    if (a === -1) return null;

    for (const cand of [t.slice(a, b + 1), t.slice(a)]) {
        try {
            return JSON.parse(cand);
        } catch (e) {}
    }

    let s = t.slice(a);
    const closers = [];
    
    let inStr = false, escp = false;
    
    for (const ch of s) {
        if (escp) {
            escp = false;
            continue;
        }

        if (ch === '\\') {
            escp = true;
            continue;
        }

        if (ch === '"') {
            inStr = !inStr;
            continue;
        }
        
        if (!inStr) {
            if (ch === '{') closers.push('}');
            else if (ch === '[') closers.push(']');
            else if (ch === '}' || ch === ']') closers.pop();
        }
    }
    
    if (inStr) s += '"';
    s += closers.reverse().join('');
    
    try {
        return JSON.parse(s);
    } catch (e) {
        return null;
    }
}
