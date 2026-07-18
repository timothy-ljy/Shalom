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
        <section className=${'panel' + (active ? ' active' : '')}>
            <h2 className="section">Setlists</h2>
            <p className="hint">Plan this week's worship. Reorder with the arrows, swipe left to remove.</p>
            <div className="row">
            <select value=${curPl} onChange=${e => setCurPl(e.target.value)}>
                ${pls.map(x => html`<option key=${x.id} value=${x.id}>${x.name}</option>`)}
            </select>
            <button className="quiet small" style=${{ whiteSpace: 'nowrap' }} onClick=${onNewPl}>+ New</button>
            <button className="quiet small" onClick=${() => {
                if (pls.length <= 1) return;
                if (!armDel) { setArmDel(true); return; }
                setArmDel(false); onDelPl(curPl);
            }}>${armDel ? 'Sure?' : '🗑'}</button>
            </div>
            <div style=${{ marginTop: '14px' }}>
            ${!p || p.songs.length === 0
                ? html`<div className="empty"><span className="big">♫</span>No songs yet.<br/>Open a song in the Library and tap "Add to setlist".</div>`
                : p.songs.map((s, i) => {
                    return html`
                    <${SwipeRow} key=${s.id + '-' + i} onRemove=${() => onRemove(p.id, i)}>
                        <div className="songrow" style=${{ marginBottom: 0 }}>
                        <div className="ordbtns">
                            <button aria-label="move up" onClick=${e => { e.stopPropagation(); onMove(p.id, i, -1) }}>▲</button>
                            <button aria-label="move down" onClick=${e => { e.stopPropagation(); onMove(p.id, i, 1) }}>▼</button>
                        </div>
                        <div className="grow" onClick=${() => onOpen(p, s)}>
                            <div className="t">${i + 1}. ${s.title}</div>
                            <div className="a">${s.author}${s.key ? ' · Key ' + s.key : ''}</div>
                        </div>
                        </div>
                    <//>`;
                })}
            </div>
        </section>`;
}
