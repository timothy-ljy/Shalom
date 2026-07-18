/* =========================================================
App
========================================================= */
function App() {
    const [tab, setTabState] = useState(() => {
        const h = (location.hash || '').replace('#', '');
        if (TABS.includes(h)) return h;
        try {
            const t = localStorage.getItem('selah-tab');
            if (TABS.includes(t)) return t;
        } catch (e) {}
        return 'search';
    });
    
    const setTab = t => {
        setTabState(t);
        try {
            localStorage.setItem('selah-tab', t);
        } catch (e) {}
        try {
            history.replaceState(null, '', '#' + t);
        } catch (e) {}
    };
    
    useEffect(() => {
        const onHash = () => {
            const h = (location.hash || '').replace('#', '');
            if (TABS.includes(h)) setTabState(h);
        };
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    const [lib, setLib] = useState([]);
    const [pls, setPls] = useState([]);
    const [curPl, setCurPl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [sheet, setSheet] = useState(null);
    const [toastMsg, setToastMsg] = useState('');
    const toastTimer = useRef(0);
    const [updateReady, setUpdateReady] = useState(false);
    
    useEffect(() => {
        const onUpdate = () => setUpdateReady(true);
        window.addEventListener('shalom:update-ready', onUpdate);
        return () => window.removeEventListener('shalom:update-ready', onUpdate);
    }, []);

    // Slide-down-to-close for the song sheet (Library / Setlist song view).
    const [dragY, setDragY] = useState(0);
    const dragInfo = useRef({ dragging: false, startY: 0, dy: 0 });
    const sheetElRef = useRef(null);
    const isSongSheet = !!sheet && sheet.type === 'song';

    const onSheetPointerDown = e => {
        if (!isSongSheet) return;
        const el = sheetElRef.current;
        if (el && el.scrollTop > 0) return; // only start the drag from the very top
        dragInfo.current = { dragging: true, startY: e.clientY, dy: 0 };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    };
    
    const onSheetPointerMove = e => {
        if (!dragInfo.current.dragging) return;
        const dy = Math.max(0, e.clientY - dragInfo.current.startY);
        dragInfo.current.dy = dy;
        setDragY(dy);
    };
    
    const onSheetPointerUp = () => {
        if (!dragInfo.current.dragging) return;
        const dy = dragInfo.current.dy;
        dragInfo.current.dragging = false;
        setDragY(0);
        if (dy > 90) setSheet(null);
    };

    useEffect(() => {
        (async () => {
            const l = (await store.get('selah-library')) || [];
            let p = (await store.get('selah-playlists')) || [];
            if (p.length === 0) {
                p = [{
                    id: 'pl-thisweek',
                    name: 'This Week',
                    songs: []
                }];
            }

            // One-time migration: older setlists stored `songIds` referencing the
            // shared library by id. Convert those into independent song copies so
            // each setlist (and the library) can be edited without affecting the
            // others going forward.
            let migrated = false;
            p = p.map(pl => {
                if (pl.songs) return pl;
                migrated = true;
                const songs = (pl.songIds || [])
                    .map(sid => l.find(x => x.id === sid))
                    .filter(Boolean)
                    .map(s => ({ ...s, id: uid() }));
                const { songIds, ...rest } = pl;
                return { ...rest, songs };
            });
            if (migrated) store.set('selah-playlists', p);

            setLib(l);
            setPls(p);
            setCurPl(p[0].id);
            setApiKey((await store.get('selah-apikey')) || '');
        })();
    }, []);

    const showToast = msg => {
        setToastMsg(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastMsg(''), 2400);
    };
    
    const persistLib = next => {
        setLib(next);
        store.set('selah-library', next);
    };
    
    const persistPls = next => {
        setPls(next);
        store.set('selah-playlists', next);
    };

    const saveNewSong = s => {
        const song = {
            id: uid(),
            title: s.title || 'Untitled',
            author: s.author || '',
            language: s.language || 'en',
            key: s.key || '',
            lyrics: s.lyrics || '',
            addedAt: Date.now()
        };
        persistLib([song, ...lib]);
        return song;
    };
    
    const deleteSong = id => {
        persistLib(lib.filter(x => x.id !== id));
        setSheet(null);
        showToast('Deleted');
    };

    return html`
        <${React.Fragment}>
            <header className="app">
            <h1>Shalom</h1>
            <button className="gear" aria-label="Settings" onClick=${() => setSheet({ type: 'settings' })}>⚙</button>
            </header>
            <main>
            <${SearchPanel} active=${tab === 'search'} apiKey=${apiKey}
                onSaveSong=${saveNewSong}
                onViewSong=${s => setSheet({ type: 'song', song: s, preview: true })}
                onAddManual=${() => setSheet({ type: 'edit', song: null })}
                showToast=${showToast}/>
            <${LibraryPanel} active=${tab === 'library'} lib=${lib} onOpen=${s => setSheet({ type: 'song', song: s, context: { kind: 'library' } })} onDelete=${deleteSong}/>
            <${SetlistPanel} active=${tab === 'setlist'} pls=${pls} curPl=${curPl} setCurPl=${setCurPl}
                onNewPl=${() => setSheet({ type: 'newpl' })}
                onDelPl=${id => { const next = pls.filter(x => x.id !== id); persistPls(next); setCurPl(next[0].id); showToast('Setlist deleted'); }}
                onMove=${(plId, i, d) => { persistPls(pls.map(p => { if (p.id !== plId) return p; const a = [...p.songs]; const j = i + d; if (j < 0 || j >= a.length) return p; [a[i], a[j]] = [a[j], a[i]]; return { ...p, songs: a }; })); }}
                onRemove=${(plId, i) => { persistPls(pls.map(p => { if (p.id !== plId) return p; const a = [...p.songs]; a.splice(i, 1); return { ...p, songs: a }; })); }}
                onOpen=${(p, s) => setSheet({ type: 'song', song: s, context: { kind: 'setlist', plId: p.id } })}/>
            <${KeyPanel} active=${tab === 'key'} showToast=${showToast}/>
            </main>

            <nav className="tabs">
            ${TABS.map(t => html`
                <button key=${t} className=${tab === t ? 'on' : ''} onClick=${() => setTab(t)}>
                ${ICONS[t]}
                ${t === 'search' ? 'Search' : t === 'library' ? 'Library' : t === 'setlist' ? 'Setlist' : 'Key'}
                </button>`)}
            </nav>

            ${sheet && html`
            <div className="overlay" onClick=${e => { if (e.target === e.currentTarget) setSheet(null); }}>
                <div className="sheet" ref=${sheetElRef}
                onPointerDown=${onSheetPointerDown}
                onPointerMove=${onSheetPointerMove}
                onPointerUp=${onSheetPointerUp}
                onPointerCancel=${onSheetPointerUp}
                style=${isSongSheet ? { transform: `translateY(${dragY}px)`, transition: dragInfo.current.dragging ? 'none' : 'transform 0.2s ease' } : undefined}>
                <div className="bar"></div>
                ${sheet.type === 'song' && html`<${SongSheet} song=${sheet.song} preview=${!!sheet.preview}
                    onEdit=${s => setSheet({ type: 'edit', song: s, context: sheet.context })}
                    onAddToPl=${s => setSheet({ type: 'pickpl', song: s })}
                    showToast=${showToast}
                    onClose=${() => setSheet(null)}/>`}
                ${sheet.type === 'edit' && html`<${EditSheet} song=${sheet.song} showToast=${showToast}
                    onClose=${() => setSheet(null)}
                    onSave=${f => {
                    if (sheet.song && sheet.context && sheet.context.kind === 'setlist') {
                        // Editing a song opened from a setlist only updates that
                        // setlist's own copy — the library and other setlists
                        // (and other copies of the same song) are untouched.
                        persistPls(pls.map(p => p.id === sheet.context.plId
                            ? { ...p, songs: p.songs.map(x => x.id === sheet.song.id ? { ...x, ...f } : x) }
                            : p));
                    } else if (sheet.song) {
                        persistLib(lib.map(x => x.id === sheet.song.id ? { ...x, ...f } : x));
                    } else {
                        saveNewSong(f);
                    }
                    setSheet(null); showToast('Saved');
                    }}/>`}
                ${sheet.type === 'settings' && html`<${SettingsSheet} apiKey=${apiKey}
                    onClose=${() => setSheet(null)}
                    onSave=${k => {
                    setApiKey(k);
                    store.set('selah-apikey', k);
                    setSheet(null); showToast(k ? 'Settings saved' : 'Settings saved (no API key)');
                    }}/>`}
                ${sheet.type === 'pickpl' && html`<${PickPlSheet} song=${sheet.song} pls=${pls}
                    onPick=${(plId, has) => {
                    if (!has) {
                        // Add an independent copy of the song to this setlist — it
                        // no longer shares an id with the library or other setlists,
                        // so later edits here won't affect them (or vice versa).
                        persistPls(pls.map(p => p.id === plId ? { ...p, songs: [...p.songs, { ...sheet.song, id: uid() }] } : p));
                        showToast('Added to ' + (pls.find(p => p.id === plId) || {}).name);
                    }
                    setSheet(null);
                    }}/>`}
                ${sheet.type === 'newpl' && html`<${NewPlSheet} showToast=${showToast}
                    onClose=${() => setSheet(null)}
                    onCreate=${name => {
                    const p = { id: uid(), name, songs: [] };
                    persistPls([...pls, p]); setCurPl(p.id); setSheet(null);
                    }}/>`}
                </div>
            </div>`}

            ${updateReady && html`<div className="toast" style=${{ cursor: 'pointer' }} onClick=${() => window.location.reload()}>A new version is ready — tap to refresh</div>`}
            ${toastMsg && html`<div className="toast">${toastMsg}</div>`}
        <//>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        // Re-check for a new version whenever the app is reopened/foregrounded.
        reg.update().catch(() => {});
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') reg.update().catch(() => {});
        });

        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
                // "installed" + an existing controller means this is an update,
                // not the first-ever install.
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    window.dispatchEvent(new CustomEvent('shalom:update-ready'));
                }
            });
        });
    }).catch(() => {});
}
