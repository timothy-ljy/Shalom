/* =========================================================
Vocal key panel (tuner + range + recording)
========================================================= */
function KeyPanel({
    active,
    showToast
}) {
    const [listening, setListening] = useState(false);
    const [disp, setDisp] = useState(null); // {name,oct,hz,cents}
    const [range, setRange] = useState({
        low: null,
        high: null
    });
    const [recording, setRecording] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [takes, setTakes] = useState([]);

    const streamRef = useRef(null),
        ctxRef = useRef(null),
        anaRef = useRef(null),
        rafRef = useRef(0);
        
    const recRef = useRef(null),
        chunksRef = useRef([]);
        
    const rangeRef = useRef({
        low: null,
        high: null
    });
    
    const bufRef = useRef(new Float32Array(2048));
    const takeNo = useRef(1);

    useEffect(() => {
        if (!recording) return;
        setElapsed(0);
        const t = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(t);
    }, [recording]);

    async function ensureMic() {
        if (streamRef.current) return streamRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false
            }
        });
        streamRef.current = stream;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const ana = ctx.createAnalyser();
        ana.fftSize = 2048;
        src.connect(ana);
        anaRef.current = ana;
        return stream;
    }

    function tick() {
        const ana = anaRef.current, ctx = ctxRef.current;
        if (!ana || !ctx) return;
        
        ana.getFloatTimeDomainData(bufRef.current);
        const f = autoCorrelate(bufRef.current, ctx.sampleRate);
        
        if (f > 60 && f < 1200) {
            const midi = 69 + 12 * Math.log2(f / 440);
            const rounded = Math.round(midi);
            const cents = Math.round((midi - rounded) * 100);
            setDisp({
                name: NOTE_NAMES[((rounded % 12) + 12) % 12],
                oct: Math.floor(rounded / 12) - 1,
                hz: f.toFixed(1),
                cents
            });
            const r = rangeRef.current;
            let changed = false;
            
            if (r.low === null || rounded < r.low) {
                r.low = rounded;
                changed = true;
            }
            if (r.high === null || rounded > r.high) {
                r.high = rounded;
                changed = true;
            }
            
            if (changed) setRange({ ...r });
        }
        rafRef.current = requestAnimationFrame(tick);
    }

    async function toggleListen() {
        if (listening) {
            stopAll();
            return;
        }
        try {
            await ensureMic();
            setListening(true);
            rafRef.current = requestAnimationFrame(tick);
        } catch (err) {
            showToast('Microphone unavailable: ' + err.message + '. Try opening the app in its own browser tab.');
        }
    }

    function stopAll() {
        if (recRef.current && recRef.current.state !== 'inactive') {
            try {
                recRef.current.stop();
            } catch (e) {}
        }
        cancelAnimationFrame(rafRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (ctxRef.current) ctxRef.current.close();
        streamRef.current = ctxRef.current = anaRef.current = null;
        setListening(false);
        setDisp(null);
        setRecording(false);
    }

    async function toggleRecord() {
        if (recording) {
            try {
                recRef.current.stop();
            } catch (e) {}
            return;
        }
        try {
            const stream = await ensureMic();
            if (!listening) {
                setListening(true);
                rafRef.current = requestAnimationFrame(tick);
            }
            const mr = new MediaRecorder(stream);
            chunksRef.current = [];
            const startRange = { ...rangeRef.current };
            mr.ondataavailable = e => {
                if (e.data && e.data.size) chunksRef.current.push(e.data);
            };
            mr.onstop = () => {
                const type = mr.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type });
                const url = URL.createObjectURL(blob);
                const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
                const r = rangeRef.current;
                const rangeTxt = (r.low !== null && r.high !== null) ? `${midiName(r.low)}–${midiName(r.high)}` : '';
                
                setTakes(t => [{
                    id: uid(),
                    n: takeNo.current++,
                    url,
                    ext,
                    rangeTxt,
                    at: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }, ...t]);
                setRecording(false);
            };
            mr.start();
            recRef.current = mr;
            setRecording(true);
        } catch (err) {
            showToast('Recording unavailable: ' + err.message);
        }
    }

    function deleteTake(id) {
        setTakes(t => {
            const x = t.find(k => k.id === id);
            if (x) URL.revokeObjectURL(x.url);
            return t.filter(k => k.id !== id);
        });
    }

    const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    
    const advice = (range.low !== null && range.high !== null && range.high > range.low) ?
        {
            span: range.high - range.low,
            low: midiName(range.low),
            high: midiName(range.high),
            comfyLow: midiName(range.low + 1),
            comfyTop: midiName(range.high - 2)
        } :
        null;

    return html`
        <section className=${panelClass(active)}>
            <h2 className=${SECTION_H2}>Vocal key finder</h2>
            <p className=${HINT_P}>Sing or hum into the microphone. It shows the note you're on and tracks your lowest and highest notes to suggest a comfortable range. You can record takes to listen back.</p>
            <div className=${TUNER}>
            <div className=${cx(NOTERING, disp ? NOTERING_ACTIVE : NOTERING_IDLE)}>
                <div className=${NOTERING_NOTE}>${disp ? html`${disp.name}<small className=${NOTERING_NOTE_SMALL}>${disp.oct}</small>` : '–'}</div>
                <div className=${NOTERING_HZ}>${disp ? disp.hz + ' Hz · ' + (disp.cents >= 0 ? '+' : '') + disp.cents + '¢' : ''}</div>
            </div>
            <div className=${CENTSBAR}>
                <div className=${CENTSBAR_MID}></div>
                <div className=${CENTSBAR_DOT} style=${{ left: 'calc(' + (50 + (disp ? disp.cents : 0)) + '% - 4px)' }}></div>
            </div>
            <div className=${CENTSLBL}><span>♭ flat</span><span>in tune</span><span>sharp ♯</span></div>
            <div className=${cx(ACTIONS, 'justify-center')}>
                <button className=${btnClass()} onClick=${toggleListen}>${listening ? 'Stop' : 'Start listening'}</button>
                <button className=${btnClass(recording ? 'danger' : 'quiet')} onClick=${toggleRecord}>
                ${recording ? html`<span className=${RECDOT}></span>Stop recording ${fmt(elapsed)}` : '● Record'}
                </button>
            </div>
            </div>
            <div className=${RANGEBOX}>
            <div className=${RANGEBOX_CELL}><div className=${RANGEBOX_LBL}>Lowest</div><div className=${RANGEBOX_VAL}>${range.low !== null ? midiName(range.low) : '–'}</div></div>
            <div className=${RANGEBOX_CELL}><div className=${RANGEBOX_LBL}>Highest</div><div className=${RANGEBOX_VAL}>${range.high !== null ? midiName(range.high) : '–'}</div></div>
            </div>
            ${advice && html`
            <div className=${cx(CARD, 'mt-3')}>
                <h3 className=${CARD_H3}>Your range so far</h3>
                <div className=${CARD_META}>${advice.low} – ${advice.high} (${advice.span} semitones ≈ ${(advice.span / 12).toFixed(1)} octaves)</div>
                <div className="text-[0.9rem] leading-[1.6]">A comfortable melody for you likely sits between <b>${advice.comfyLow}</b> and <b>${advice.comfyTop}</b>. When choosing a song key, check the melody's highest note and transpose so it lands at or below <b>${advice.comfyTop}</b>.</div>
            </div>`}
            <div className=${ACTIONS}>
            <button className=${btnClass('quiet small')} onClick=${() => { rangeRef.current = { low: null, high: null }; setRange({ low: null, high: null }); }}>Reset range</button>
            </div>
            ${takes.length > 0 && html`
            <h2 className=${cx(SECTION_H2, 'mt-5')}>Recordings</h2>
            <p className=${HINT_P}>Kept until you close the app — tap Save to keep a copy on your device.</p>
            ${takes.map(t => html`
                <div className=${TAKE} key=${t.id}>
                <div>
                    <div className=${TAKE_TN}>Take ${t.n}</div>
                    <div className=${TAKE_TM}>${t.at}${t.rangeTxt ? ' · ' + t.rangeTxt : ''}</div>
                </div>
                <audio controls className="h-[34px] flex-1 min-w-[160px]" src=${t.url}></audio>
                <a className=${TAKE_LINK} href=${t.url} download=${'take-' + t.n + '.' + t.ext}>Save</a>
                <button className=${XBTN} onClick=${() => deleteTake(t.id)}>✕</button>
                </div>`)}`}
            <p className=${MICNOTE}>Tip: sing a comfortable low note, then slide up gradually to your highest comfortable note. If the microphone can't start here, open this app in its own browser tab and allow mic access.</p>
        </section>`;
}
