/* =========================================================
Swipe-to-remove row wrapper (swipe left to reveal a remove action)
========================================================= */
function SwipeRow({
    onRemove,
    children
}) {
    const ACTION_W = 72;
    const [dx, setDx] = useState(0);
    const [dragging, setDragging] = useState(false);
    const st = useRef({ active: false, moved: false, startX: 0, startY: 0, baseDx: 0 });

    function onDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        st.current = { active: true, moved: false, startX: e.clientX, startY: e.clientY, baseDx: dx };
    }
    
    function onMove(e) {
        const s = st.current;
        if (!s.active) return;
        
        const ddx = e.clientX - s.startX, ddy = e.clientY - s.startY;
        
        if (!s.moved) {
            // small deadzone + require a mostly-horizontal gesture before treating it as a swipe
            if (Math.abs(ddx) < 8 || Math.abs(ddx) < Math.abs(ddy)) return;
            s.moved = true;
            setDragging(true);
            try {
                e.currentTarget.setPointerCapture(e.pointerId);
            } catch (err) {}
        }
        
        let next = s.baseDx + ddx;
        next = Math.max(-ACTION_W, Math.min(0, next));
        setDx(next);
    }
    
    function onUp() {
        const s = st.current;
        if (s.moved) setDx(v => v < -ACTION_W * 0.5 ? -ACTION_W : 0);
        st.current.active = false;
        st.current.moved = false;
        setDragging(false);
    }
    
    const prog = Math.min(1, -dx / ACTION_W);
    
    return html`
        <div className=${SWIPEROW}>
            <button className=${SWIPEDEL} aria-label="Remove"
            style=${{ transform: `translateY(-50%) scale(${prog})`, opacity: prog, transition: dragging ? 'none' : 'transform .22s cubic-bezier(.22,.8,.2,1), opacity .22s ease' }}
            onClick=${() => { setDx(0); onRemove(); }}>✕</button>
            <div className=${SWIPECONTENT}
            style=${{ transform: `translateX(${dx}px)`, transition: dragging ? 'none' : 'transform .22s cubic-bezier(.22,.8,.2,1)' }}
            onPointerDown=${onDown} onPointerMove=${onMove} onPointerUp=${onUp} onPointerCancel=${onUp}>
            ${children}
            </div>
        </div>`;
}
