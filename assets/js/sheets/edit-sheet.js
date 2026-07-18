/* =========================================================
Add / edit song sheet
========================================================= */
function EditSheet({
    song,
    onSave,
    onClose,
    showToast
}) {
    const [f, setF] = useState({
        title: song ? song.title : '',
        author: song ? song.author : '',
        key: song ? song.key : '',
        language: song ? song.language : 'en',
        lyrics: song ? song.lyrics : ''
    });
    
    const set = (k, v) => setF(o => ({
        ...o,
        [k]: v
    }));
    
    return html`
        <div>
            <h2 className="section">${song ? 'Edit song' : 'Add song'}</h2>
            <label className="f">Title *</label>
            <input type="text" value=${f.title} onChange=${e => set('title', e.target.value)}/>
            <label className="f">Author *</label>
            <input type="text" value=${f.author} onChange=${e => set('author', e.target.value)}/>
            <div className="row">
            <div style=${{ flex: 1 }}>
                <label className="f">Key</label>
                <input type="text" value=${f.key} placeholder="e.g. G" onChange=${e => set('key', e.target.value)}/>
            </div>
            <div style=${{ flex: 1 }}>
                <label className="f">Language</label>
                <select value=${f.language} onChange=${e => set('language', e.target.value)}>
                <option value="en">English</option>
                <option value="zh">Chinese</option>
                <option value="bilingual">Bilingual</option>
                </select>
            </div>
            </div>
            <label className="f">Lyrics *</label>
            <textarea value=${f.lyrics} onChange=${e => set('lyrics', e.target.value)}></textarea>
            <div className="actions" style=${{ marginTop: '14px' }}>
            <button onClick=${() => {
                if (!f.title.trim() || !f.author.trim() || !f.lyrics.trim()) { showToast('Title, author and lyrics are required'); return; }
                onSave(f);
            }}>Save</button>
            <button className="quiet" onClick=${onClose}>Cancel</button>
            </div>
        </div>`;
}
