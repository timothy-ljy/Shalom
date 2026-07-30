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
            <h2 className=${SECTION_H2}>New setlist</h2>
            <label className=${LABEL_F}>Name</label>
            <input type="text" className=${FIELD} value=${name} onChange=${e => setName(e.target.value)}/>
            <div className=${cx(ACTIONS, 'mt-3.5')}>
            <button className=${btnClass()} onClick=${() => { if (!name.trim()) { showToast('Name is required'); return; } onCreate(name.trim()); }}>Create</button>
            <button className=${btnClass('quiet')} onClick=${onClose}>Cancel</button>
            </div>
        </div>`;
}
