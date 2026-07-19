/* =========================================================
Song view sheet
========================================================= */
function SongSheet({
    song,
    preview,
    onEdit,
    onAddToPl,
    onClose,
    showToast
}) {
    const closeOnTap = e => {
        // Don't close if the tap was actually the tail end of a text selection.
        const sel = window.getSelection && window.getSelection().toString();
        if (sel) return;
        onClose();
    };
    
    async function shareSong() {
        const lyricsText = lyricsWithPinyinText(song.lyrics || '');
        const text = `${song.title}${song.key ? ' (Key ' + song.key + ')' : ''}\n${song.author}\n\n${lyricsText}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: song.title, text });
            } catch (e) {
                // user cancelled the share sheet, or share failed silently — no toast needed
            }
            return;
        }
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            if (showToast) showToast('Copied to clipboard');
        } catch (e) {
            if (showToast) showToast('Could not share');
        }
    }
    
    return html`
        <div>
            <div className="songview" onClick=${closeOnTap} role="button" tabIndex="0" aria-label="Close"
            onKeyDown=${e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }}>
            ${song.key ? html`<div className="keychip">${song.key}</div>` : null}
            <h3>${song.title}</h3>
            <div className="author">${song.author} · ${langLabel(song.language)}</div>
            <div className="rule"></div>
            <${Lyrics} text=${song.lyrics || ''} showPinyin=${true}/>
            </div>
            ${!preview && html`
            <div className="actions" style=${{ marginTop: '14px' }}>
                <button className="small" onClick=${() => onAddToPl(song)}>+ Add to setlist</button>
                <button className="small quiet" onClick=${() => onEdit(song)}>Edit</button>
                <button className="small quiet" onClick=${e => { e.stopPropagation(); shareSong(); }}>Share</button>
            </div>`}
        </div>`;
}
