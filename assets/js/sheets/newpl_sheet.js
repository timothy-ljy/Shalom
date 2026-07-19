/* =========================================================
New setlist sheet
========================================================= */
function NewPlSheet({
    onCreate,
    onClose,
    showToast
}) {
    const [name, setName] = useState('Sunday ' + new Date().toLocaleDateString());
    
    return html`
        <div>
            <h2 className="section">New setlist</h2>
            <label className="f">Name</label>
            <input type="text" value=${name} onChange=${e => setName(e.target.value)}/>
            <div className="actions" style=${{ marginTop: '14px' }}>
            <button onClick=${() => { if (!name.trim()) { showToast('Name is required'); return; } onCreate(name.trim()); }}>Create</button>
            <button className="quiet" onClick=${onClose}>Cancel</button>
            </div>
        </div>`;
}
