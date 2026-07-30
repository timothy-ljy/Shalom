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
        <section className=${panelClass(active)}>
            <h2 className=${SECTION_H2}>Library</h2>
            <p className=${HINT_P}>Songs you saved are stored on this device and searchable offline. Swipe left to delete a song.</p>
            <input type="text" className=${FIELD} value=${filter} onChange=${e => setFilter(e.target.value)} placeholder="Filter by title, author or lyrics…"/>
            <div className="mt-3.5">
            ${list.length === 0
                ? html`<div className=${EMPTY}><span className=${EMPTY_BIG}>♪</span>${lib.length === 0 ? 'Your library is empty — search for a song, or add one manually.' : 'No songs match this filter.'}</div>`
                : list.map(s => html`
                <${SwipeRow} key=${s.id} onRemove=${() => onDelete(s.id)}>
                    <div className=${cx(SONGROW, 'mb-0')} onClick=${() => onOpen(s)}>
                    <div className=${GROW}><div className=${SONGROW_T}>${s.title}</div><div className=${SONGROW_A}>${s.author}</div></div>
                    ${s.key ? html`<span className=${BADGE}>${s.key}</span>` : null}
                    <span className=${BADGE_LANG}>${langLabel(s.language)}</span>
                    </div>
                <//>`)}
            </div>
        </section>`;
}
