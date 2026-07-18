/* =========================================================
Pinyin annotation for Chinese lyrics (uses window.pinyinPro, loaded via CDN)
========================================================= */
const CJK_CHAR_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const CJK_RUN_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+/g;
const hasChinese = t => CJK_CHAR_RE.test(t || '');

// Cache pinyin lookups per run of Hanzi so re-renders / repeated runs across a
// song don't keep re-invoking the conversion library.
const pyCache = new Map();

function pinyinForRun(run) {
    if (pyCache.has(run)) return pyCache.get(run);
    
    const chars = [...run];
    let out;
    
    try {
        const pp = window.pinyinPro;
        out = pp ? pp.pinyin(run, {
            type: 'array',
            toneType: 'symbol',
            nonZh: 'removed'
        }) : null;
        
        if (!Array.isArray(out) || out.length !== chars.length) {
            out = chars.map(() => '');
        }
    } catch (e) {
        out = chars.map(() => '');
    }
    
    pyCache.set(run, out);
    return out;
}

// Split one line into alternating {zh:true, chars, py} / {zh:false, text} tokens.
function tokenizeLineForPinyin(line) {
    const tokens = [];
    let last = 0, m;
    
    CJK_RUN_RE.lastIndex = 0;
    
    while ((m = CJK_RUN_RE.exec(line))) {
        if (m.index > last) {
            tokens.push({
                zh: false,
                text: line.slice(last, m.index)
            });
        }
        
        tokens.push({
            zh: true,
            chars: [...m[0]],
            py: pinyinForRun(m[0])
        });
        
        last = m.index + m[0].length;
    }
    
    if (last < line.length) {
        tokens.push({
            zh: false,
            text: line.slice(last)
        });
    }
    
    return tokens;
}

// Renders song lyrics; when showPinyin is on and the text contains Hanzi,
// stacks each Chinese character above its pinyin reading.
function Lyrics({ text, showPinyin }) {
    const t = text || '';
    const pyReady = typeof window !== 'undefined' && !!window.pinyinPro;
    
    if (!showPinyin || !pyReady || !hasChinese(t)) {
        return html`<div className="lyrics">${t}</div>`;
    }

    const lines = t.split('\n');

    return html`
        <div className="lyrics pinyin">
            ${lines.map((line, i) => line.trim() === ''
                ? html`<div className="pyline" key=${i}>${' '}</div>`
                : html`
                    <div className="pyline" key=${i}>
                    ${tokenizeLineForPinyin(line).flatMap((tok, j) => tok.zh
                        ? tok.chars.map((c, k) => html`
                        <span className="pychar" key=${j + '-' + k}>
                            <span className="hz">${c}</span>
                            <span className="py">${tok.py[k] || ''}</span>
                        </span>`)
                        : [html`<span className="plain" key=${j}>${tok.text}</span>`]
                    )}
                    </div>`
            )}
        </div>`;
}
