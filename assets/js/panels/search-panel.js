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
        <section className=${'panel' + (active ? ' active' : '')}>
            <h2 className="section">Find a song</h2>
            <p className="hint">Search by song title or author, in English or Chinese. Results are fetched live from the web by AI.</p>
            <div className="row">
            <input type="text" value=${q} onChange=${e => setQ(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') run() }}
                placeholder="Song title or author (English or Chinese)"/>
            <button onClick=${run} disabled=${busy} style=${{ whiteSpace: 'nowrap' }}>Search</button>
            </div>
            <div style=${{ marginTop: '14px' }}>
            ${busy && html`<div className="card"><span className="spin"></span> Searching the web for "${q.trim()}"… this can take ~20–40s.</div>`}
            ${error && html`<div className="empty"><span className="big">!</span>Search failed: ${error}<br/>Check your connection and try again, or add the song manually.
                ${!apiKey && html`<br/><br/>? AI search needs an API key — tap the ⚙ icon (top right). A free one is available from Google (aistudio.google.com).`}</div>`}
            ${results && results.length === 0 && html`<div className="empty"><span className="big">◌</span>No matching song found. Try a different spelling, add the artist name, or add it manually below.</div>`}
            ${results && results.map((s, i) => html`
                <div className="card" key=${i}>
                <h3>${s.title || 'Untitled'}</h3>
                <div className="meta">${s.author || 'Unknown author'}</div>
                <div>
                    ${s.key ? html`<span className="badge">Key ${s.key}</span>` : null}
                    <span className="badge lang">${langLabel(s.language)}</span>
                </div>
                <div className="preview">${!s.lyrics ? '(no lyrics returned)' : hasChinese(s.lyrics) ? html`<${Lyrics} text=${s.lyrics} showPinyin=${true}/>` : s.lyrics}</div>
                <div className="actions">
                    <button className="small" disabled=${!!savedIdx[i]} onClick=${() => { onSaveSong(s); setSavedIdx(o => ({ ...o, [i]: true })); showToast('Saved to library'); }}>
                    ${savedIdx[i] ? 'Saved ✓' : 'Save to library'}
                    </button>
                    <button className="small quiet" onClick=${() => onViewSong(s)}>View full</button>
                </div>
                </div>`)}
            </div>
            <div style=${{ marginTop: '18px' }}>
            <button className="ghost" onClick=${onAddManual}>+ Add a song manually</button>
            </div>
        </section>`;
}
