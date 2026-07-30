/* =========================================================
Search panel
========================================================= */
function SearchPanel({
    active,
    apiKey,
    onSaveSong,
    onViewSong,
    showToast,
    onAddManual
}) {
    const [q, setQ] = useState('');
    const [busy, setBusy] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [savedIdx, setSavedIdx] = useState({});

    async function run() {
        const query = q.trim();
        if (!query || busy) return;
        
        setBusy(true);
        setError('');
        setResults(null);
        setSavedIdx({});
        
        try {
            const songs = await aiSearch(query, apiKey);
            setResults(songs);
        } catch (err) {
            setError(err.message || 'Search failed');
        } finally {
            setBusy(false);
        }
    }

    return html`
        <section className=${panelClass(active)}>
            <h2 className=${SECTION_H2}>Find a song</h2>
            <p className=${HINT_P}>Search by song title or author, in English or Chinese. Results are fetched live from the web by AI.</p>
            <div className=${ROW}>
            <input type="text" className=${FIELD} value=${q} onChange=${e => setQ(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') run() }}
                placeholder="Song title or author (English or Chinese)"/>
            <button className=${cx(btnClass(), 'whitespace-nowrap')} onClick=${run} disabled=${busy}>Search</button>
            </div>
            <div className="mt-3.5">
            ${busy && html`<div className=${CARD}><span className=${SPIN}></span> Searching the web for "${q.trim()}"… this can take ~20–40s.</div>`}
            ${error && html`<div className=${EMPTY}><span className=${EMPTY_BIG}>!</span>Search failed: ${error}<br/>Check your connection and try again, or add the song manually.
                ${!apiKey && html`<br/><br/>? AI search needs an API key — tap the ⚙ icon (top right). A free one is available from Google (aistudio.google.com).`}</div>`}
            ${results && results.length === 0 && html`<div className=${EMPTY}><span className=${EMPTY_BIG}>◌</span>No matching song found. Try a different spelling, add the artist name, or add it manually below.</div>`}
            ${results && results.map((s, i) => html`
                <div className=${CARD} key=${i}>
                <h3 className=${CARD_H3}>${s.title || 'Untitled'}</h3>
                <div className=${CARD_META}>${s.author || 'Unknown author'}</div>
                <div>
                    ${s.key ? html`<span className=${BADGE}>Key ${s.key}</span>` : null}
                    <span className=${BADGE_LANG}>${langLabel(s.language)}</span>
                </div>
                <div className=${PREVIEW}>${!s.lyrics ? '(no lyrics returned)' : hasChinese(s.lyrics) ? html`<${Lyrics} text=${s.lyrics} showPinyin=${true}/>` : s.lyrics}</div>
                <div className=${ACTIONS}>
                    <button className=${btnClass('small')} disabled=${!!savedIdx[i]} onClick=${() => { onSaveSong(s); setSavedIdx(o => ({ ...o, [i]: true })); showToast('Saved to library'); }}>
                    ${savedIdx[i] ? 'Saved ✓' : 'Save to library'}
                    </button>
                    <button className=${btnClass('small quiet')} onClick=${() => onViewSong(s)}>View full</button>
                </div>
                </div>`)}
            </div>
            <div className="mt-[18px]">
            <button className=${btnClass('ghost')} onClick=${onAddManual}>+ Add a song manually</button>
            </div>
        </section>`;
}
