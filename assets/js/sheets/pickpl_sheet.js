/* =========================================================
Pick-a-setlist sheet
========================================================= */
function PickPlSheet({
    song,
    pls,
    onPick
}) {
    return html`
        <div>
            <h2 className="section">Add "${song.title}" to…</h2>
            <div style=${{ marginTop: '12px' }}>
            ${pls.map(p => {
                const has = p.songs.some(x => x.title === song.title && x.author === song.author);
                return html`
                <div className="songrow" key=${p.id} onClick=${() => onPick(p.id, has)}>
                <div className="grow"><div className="t">${p.name}</div><div className="a">${p.songs.length} song(s)</div></div>
                ${has ? html`<span className="badge">added ✓</span>` : null}
                </div>`;
            })}
            </div>
        </div>`;
}
