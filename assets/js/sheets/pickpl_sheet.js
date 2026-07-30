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
            <h2 className=${SECTION_H2}>Add "${song.title}" to…</h2>
            <div className="mt-3">
            ${pls.map(p => {
                const has = p.songs.some(x => x.title === song.title && x.author === song.author);
                return html`
                <div className=${SONGROW} key=${p.id} onClick=${() => onPick(p.id, has)}>
                <div className=${GROW}><div className=${SONGROW_T}>${p.name}</div><div className=${SONGROW_A}>${p.songs.length} song(s)</div></div>
                ${has ? html`<span className=${BADGE}>added ✓</span>` : null}
                </div>`;
            })}
            </div>
        </div>`;
}
