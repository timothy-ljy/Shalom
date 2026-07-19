/* =========================================================
Library panel
========================================================= */
function LibraryPanel({
    active,
    lib,
    onOpen,
    onDelete
}) {
    const [filter, setFilter] = useState('');
    const f = filter.trim().toLowerCase();
    const list = lib.filter(s => !f || s.title.toLowerCase().includes(f) || (s.author || '').toLowerCase().includes(f) || (s.lyrics || '').toLowerCase().includes(f));
    
    return html`
        <section className=${'panel' + (active ? ' active' : '')}>
            <h2 className="section">Library</h2>
            <p className="hint">Songs you saved are stored on this device and searchable offline. Swipe left to delete a song.</p>
            <input type="text" value=${filter} onChange=${e => setFilter(e.target.value)} placeholder="Filter by title, author or lyrics…"/>
            <div style=${{ marginTop: '14px' }}>
            ${list.length === 0
                ? html`<div className="empty"><span className="big">♪</span>${lib.length === 0 ? 'Your library is empty — search for a song, or add one manually.' : 'No songs match this filter.'}</div>`
                : list.map(s => html`
                <${SwipeRow} key=${s.id} onRemove=${() => onDelete(s.id)}>
                    <div className="songrow" style=${{ marginBottom: 0 }} onClick=${() => onOpen(s)}>
                    <div className="grow"><div className="t">${s.title}</div><div className="a">${s.author}</div></div>
                    ${s.key ? html`<span className="badge">${s.key}</span>` : null}
                    <span className="badge lang">${langLabel(s.language)}</span>
                    </div>
                <//>`)}
            </div>
        </section>`;
}
