const {
    useState,
    useEffect,
    useRef
} = React;

const html = htm.bind(React.createElement);

/* =========================================================
Persistence: window.storage (Claude) -> localStorage -> memory
========================================================= */
const memStore = {};

const store = {
    async get(k) {
        try {
            if (window.storage) {
                const r = await window.storage.get(k);
                return r ? JSON.parse(r.value) : null;
            }
        } catch (e) {}
        try {
            const v = localStorage.getItem(k);
            if (v !== null) return JSON.parse(v);
        } catch (e) {}
        
        return memStore[k] ?? null;
    },
    async set(k, v) {
        let ok = false;
        try {
            if (window.storage) {
                await window.storage.set(k, JSON.stringify(v));
                ok = true;
            }
        } catch (e) {}
        try {
            localStorage.setItem(k, JSON.stringify(v));
            ok = true;
        } catch (e) {}
        
        if (!ok) memStore[k] = v;
    }
};

const uid = () => 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const langLabel = l => l === 'zh' ? 'Chinese' : l === 'bilingual' ? 'Bilingual' : 'English';
const TABS = ['search', 'library', 'setlist', 'key'];
