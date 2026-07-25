/* =========================================================
Settings sheet
========================================================= */
function SettingsSheet({
    apiKey,
    onSave,
    onClose
}) {
    const [k, setK] = useState(apiKey);
    
    return html`
        <div>
            <h2 className=${SECTION_H2}>Settings</h2>
            <label className=${LABEL_F}>Gemini API key</label>
            <input type="password" className=${FIELD} value=${k} onChange=${e => setK(e.target.value)} placeholder="Paste your key" autoComplete="off" autoCapitalize="off"/>
            <p className=${cx(HINT_P, 'mt-2')}>Go to aistudio.google.com, sign in with a Google account, and tap "Get API key" — it's free, no credit card needed, and includes web search.${' '}
            The key is stored only on this device — don't save it on a shared or public device. Library, setlists and the key finder all work without any key.</p>
            <div className=${cx(ACTIONS, 'mt-2.5')}>
            <button className=${btnClass()} onClick=${() => onSave(k.trim())}>Save</button>
            <button className=${btnClass('quiet')} onClick=${onClose}>Cancel</button>
            </div>
        </div>`;
}
