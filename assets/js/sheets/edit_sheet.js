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
            <h2 className=${SECTION_H2}>${song ? 'Edit song' : 'Add song'}</h2>
            <label className=${LABEL_F}>Title *</label>
            <input type="text" className=${FIELD} value=${f.title} onChange=${e => set('title', e.target.value)}/>
            <label className=${LABEL_F}>Author *</label>
            <input type="text" className=${FIELD} value=${f.author} onChange=${e => set('author', e.target.value)}/>
            <div className=${ROW}>
            <div className="flex-1">
                <label className=${LABEL_F}>Key</label>
                <input type="text" className=${FIELD} value=${f.key} placeholder="e.g. G" onChange=${e => set('key', e.target.value)}/>
            </div>
            <div className="flex-1">
                <label className=${LABEL_F}>Language</label>
                <select className=${SELECT} value=${f.language} onChange=${e => set('language', e.target.value)}>
                <option value="en">English</option>
                <option value="zh">Chinese</option>
                <option value="bilingual">Bilingual</option>
                </select>
            </div>
            </div>
            <label className=${LABEL_F}>Lyrics *</label>
            <textarea className=${TEXTAREA} value=${f.lyrics} onChange=${e => set('lyrics', e.target.value)}></textarea>
            <div className=${cx(ACTIONS, 'mt-3.5')}>
            <button className=${btnClass()} onClick=${() => {
                if (!f.title.trim() || !f.author.trim() || !f.lyrics.trim()) { showToast('Title, author and lyrics are required'); return; }
                onSave(f);
            }}>Save</button>
            <button className=${btnClass('quiet')} onClick=${onClose}>Cancel</button>
            </div>
        </div>`;
}
