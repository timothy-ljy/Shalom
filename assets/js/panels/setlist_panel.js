/* =========================================================
Setlist panel
========================================================= */
function SetlistPanel({
    active,
    pls,
    curPl,
    setCurPl,
    onNewPl,
    onDelPl,
    onMove,
    onRemove,
    onOpen
}) {
    const [armDel, setArmDel] = useState(false);
    
    useEffect(() => {
        if (armDel) {
            const t = setTimeout(() => setArmDel(false), 2500);
            return () => clearTimeout(t);
        }
    }, [armDel]);
    
    const p = pls.find(x => x.id === curPl);
    
    return html`
        <section className=${panelClass(active)}>
            <h2 className=${SECTION_H2}>Setlists</h2>
            <p className=${HINT_P}>Plan this week's worship. Reorder with the arrows, swipe left to remove.</p>
            <div className=${ROW}>
            <select className=${SELECT} value=${curPl} onChange=${e => setCurPl(e.target.value)}>
                ${pls.map(x => html`<option key=${x.id} value=${x.id}>${x.name}</option>`)}
            </select>
            <button className=${cx(btnClass('quiet small'), 'whitespace-nowrap')} onClick=${onNewPl}>+ New</button>
            <button className=${btnClass('quiet small')} onClick=${() => {
                if (pls.length <= 1) return;
                if (!armDel) { setArmDel(true); return; }
                setArmDel(false); onDelPl(curPl);
            }}>${armDel ? 'Sure?' : '🗑'}</button>
            </div>
            <div className="mt-3.5">
            ${!p || p.songs.length === 0
                ? html`<div className=${EMPTY}><span className=${EMPTY_BIG}>♫</span>No songs yet.<br/>Open a song in the Library and tap "Add to setlist".</div>`
                : p.songs.map((s, i) => {
                    return html`
                    <${SwipeRow} key=${s.id + '-' + i} onRemove=${() => onRemove(p.id, i)}>
                        <div className=${cx(SONGROW, 'mb-0')}>
                        <div className=${ORDBTNS}>
                            <button className=${ORDBTN} aria-label="move up" onClick=${e => { e.stopPropagation(); onMove(p.id, i, -1) }}>▲</button>
                            <button className=${ORDBTN} aria-label="move down" onClick=${e => { e.stopPropagation(); onMove(p.id, i, 1) }}>▼</button>
                        </div>
                        <div className=${GROW} onClick=${() => onOpen(p, s)}>
                            <div className=${SONGROW_T}>${i + 1}. ${s.title}</div>
                            <div className=${SONGROW_A}>${s.author}${s.key ? ' · Key ' + s.key : ''}</div>
                        </div>
                        </div>
                    <//>`;
                })}
            </div>
        </section>`;
}
