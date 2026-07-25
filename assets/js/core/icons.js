/* =========================================================
Icons
========================================================= */
const NAV_ICON_CLASS = "w-[21px] h-[21px] stroke-current fill-none stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]";

const Icon = ({ d, extra }) => html`<svg viewBox="0 0 24 24" className=${NAV_ICON_CLASS}>${d.map((p, i) => html`<path key=${i} d=${p}/>`)}${extra || null}</svg>`;

const ICONS = {
    search: html`<svg viewBox="0 0 24 24" className=${NAV_ICON_CLASS}><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>`,
    library: html`<svg viewBox="0 0 24 24" className=${NAV_ICON_CLASS}><path d="M4 4h6v16H4zM10 4h6v16h-6zM16 5l4-1v16l-4 1z"/></svg>`,
    setlist: html`<svg viewBox="0 0 24 24" className=${NAV_ICON_CLASS}><line x1="4" y1="6" x2="14" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/><path d="M18 6v8.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>`,
    key: html`<svg viewBox="0 0 24 24" className=${NAV_ICON_CLASS}><path d="M12 3v10.5"/><circle cx="9.5" cy="15.5" r="3.5"/><path d="M12 3l5 2v3l-5-2"/></svg>`,
};
