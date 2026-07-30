/* =========================================================
Shared Tailwind class tokens
Kept in one place so panels/sheets read as markup + logic
instead of walls of repeated utility strings. Every value
here is plain Tailwind (standard + arbitrary values) — there
is no more hand-written CSS backing these names.
========================================================= */

// Joins classNames, skipping falsy values — e.g. cx('a', cond && 'b', 'c')
const cx = (...parts) => parts.filter(Boolean).join(' ');

/* ---------- bottom-nav panels (stay mounted, hidden via display) ---------- */
const panelClass = active => active ? 'block' : 'hidden';

/* ---------- layout / text ---------- */
const SECTION_H2 = 'text-[1.15rem] font-semibold mb-1';
const HINT_P = 'text-[0.85rem] text-muted mb-3.5 leading-[1.55]';
const ROW = 'flex gap-2';
const ACTIONS = 'flex gap-2 flex-wrap mt-2.5 items-center';
const LABEL_F = 'block text-[0.78rem] font-semibold tracking-wide my-3.5 mb-1.5 text-muted';

/* ---------- form controls ---------- */
const FIELD = 'w-full text-base px-3.5 py-3 border border-line rounded-xl bg-field text-ink ' +
    'placeholder:text-faint focus:outline-none focus:border-primary';
const TEXTAREA = cx(FIELD, 'min-h-[160px] resize-y leading-[1.6]');
const SELECT = cx(FIELD, 'select-arrow appearance-none');

/* ---------- buttons ---------- */
// variant: any space-separated combo of 'ghost' | 'quiet' | 'danger' | 'small'
function btnClass(variant = '') {
    const v = variant.split(' ').filter(Boolean);
    const isSmall = v.includes('small');

    const colors = v.includes('danger')
        ? 'bg-transparent text-danger border border-danger font-semibold'
        : v.includes('ghost')
        ? 'bg-transparent text-primary border border-primary font-semibold'
        : v.includes('quiet')
        ? 'bg-raised text-ink border border-line font-medium'
        : 'bg-primary text-bg border border-transparent font-semibold';

    const size = isSmall
        ? 'px-3 py-2 text-[0.82rem] rounded-[10px]'
        : 'px-[18px] py-3 text-[0.95rem] rounded-xl';

    return cx(
        'cursor-pointer active:opacity-85 disabled:opacity-45 disabled:cursor-default',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        size, colors
    );
}

/* ---------- cards / empty state ---------- */
const CARD = 'bg-surface border border-line rounded-[14px] py-4 px-[18px] mb-3';
const CARD_H3 = 'text-[1.05rem] font-semibold';
const CARD_META = 'text-[0.83rem] text-muted my-[3px] mb-2';
const EMPTY = 'text-center text-muted py-[46px] px-5 text-[0.92rem] leading-[1.65] border-[1.5px] border-dashed border-line rounded-[14px]';
const EMPTY_BIG = 'text-[1.6rem] text-[#47453c] block mb-1.5';
const PREVIEW = 'whitespace-pre-wrap leading-[1.7] max-h-[170px] overflow-hidden mt-2.5 text-[0.92rem] text-lyrics';

/* ---------- badges ---------- */
const BADGE = 'inline-block text-[0.72rem] font-semibold tracking-wide bg-accentsoft text-accent rounded-md py-[3px] px-[9px] mr-1.5';
const BADGE_LANG = 'inline-block text-[0.72rem] font-semibold tracking-wide bg-primarysoft text-[#9dc3e0] rounded-md py-[3px] px-[9px] mr-1.5';

/* ---------- song view (sheet) ---------- */
const SONGVIEW = 'bg-surface border border-line rounded-2xl py-[26px] px-[22px] relative cursor-pointer active:bg-raised';
const KEYCHIP = 'absolute top-[18px] right-[18px] font-bold text-[0.95rem] bg-accentsoft text-accent rounded-[10px] min-w-[44px] h-10 flex items-center justify-center px-3';
const SONGVIEW_H3 = 'text-2xl font-bold leading-[1.3] pr-14';
const SONGVIEW_AUTHOR = 'text-[0.9rem] text-muted mt-1.5 mb-0.5';
const SONGVIEW_RULE = 'h-[3px] w-10 bg-primary rounded-sm my-4 mb-[18px]';
const LYRICS = 'text-[1.02rem] leading-[1.5] text-lyrics';

/* pinyin-annotated lyrics: each Hanzi stacks on top of its reading */
const PYLINE = 'min-h-[0.5em] mb-3 last:mb-0';
const PYCHAR = 'inline-flex flex-col items-center align-bottom mx-px mb-1';
const PYCHAR_HZ = 'text-[1.02rem] leading-[1.25] text-lyrics';
const PYCHAR_PY = 'text-[0.6em] leading-[1.2] mt-0.5 text-accent font-medium whitespace-nowrap';
const PY_PLAIN = 'text-[1.02rem] leading-[1.95] text-lyrics whitespace-pre-wrap align-bottom';

/* ---------- lists / rows ---------- */
const SONGROW = 'flex items-center gap-3 bg-surface border border-line rounded-[13px] py-[13px] px-[15px] mb-2.5 cursor-pointer hover:border-primary';
const SONGROW_T = 'font-semibold text-[0.98rem] overflow-hidden text-ellipsis whitespace-nowrap';
const SONGROW_A = 'text-[0.8rem] text-muted overflow-hidden text-ellipsis whitespace-nowrap';
const GROW = 'flex-1 min-w-0';

const ORDBTNS = 'flex flex-col gap-[3px]';
const ORDBTN = 'py-0.5 px-[9px] bg-raised text-muted text-[0.68rem] rounded-[7px] border border-line cursor-pointer active:opacity-85';
const XBTN = 'bg-transparent border-0 text-danger text-base py-1.5 px-2 cursor-pointer';

/* ---------- swipe-to-remove row ---------- */
const SWIPEROW = 'relative rounded-[13px] mb-2.5 overflow-hidden [touch-action:pan-y]';
const SWIPEDEL = 'absolute top-1/2 right-3.5 w-11 h-11 bg-danger text-bg rounded-full p-0 text-[1.1rem] font-bold leading-none origin-center border-0 cursor-pointer';
const SWIPECONTENT = 'relative [will-change:transform]';

/* ---------- bottom nav ---------- */
const NAV_TABS = 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] flex bg-surface border-t border-line pb-[env(safe-area-inset-bottom,0px)] z-30';
const NAV_BTN = 'flex-1 bg-transparent border-0 rounded-none text-muted font-medium py-[10px] px-1 pb-[11px] text-[0.7rem] flex flex-col items-center gap-[3px] relative cursor-pointer';
const NAV_BTN_ON = 'text-primary';
// the little top-bar indicator on the active tab, done with an absolutely
// positioned pseudo-el in the original CSS — here it's a real span.
const NAV_INDICATOR = 'absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-b-sm';

/* ---------- tuner ---------- */
const TUNER = 'bg-surface border border-line rounded-2xl py-[26px] px-5 text-center';
const NOTERING = 'w-[180px] h-[180px] rounded-full border-[3px] bg-field mx-auto flex flex-col items-center justify-center gap-0.5';
const NOTERING_ACTIVE = 'border-primary';
const NOTERING_IDLE = 'border-line';
const NOTERING_NOTE = 'text-[3.2rem] font-bold leading-none';
const NOTERING_NOTE_SMALL = 'text-[1.3rem] text-accent';
const NOTERING_HZ = 'text-[0.78rem] text-muted min-h-[1.1em]';
const CENTSBAR = 'relative h-2 bg-field border border-line rounded-[5px] mx-6 mt-5 mb-1.5 overflow-hidden';
const CENTSBAR_MID = 'absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent';
const CENTSBAR_DOT = 'absolute top-0 bottom-0 w-2 rounded-sm bg-primary transition-[left] duration-[80ms] ease-linear';
const CENTSLBL = 'flex justify-between text-[0.68rem] text-muted mx-6 mb-4';
const RANGEBOX = 'flex gap-2.5 mt-3.5';
const RANGEBOX_CELL = 'flex-1 bg-surface border border-line rounded-[13px] p-3.5 text-center';
const RANGEBOX_LBL = 'text-[0.68rem] tracking-[0.12em] uppercase text-muted';
const RANGEBOX_VAL = 'text-2xl font-bold text-accent';
const MICNOTE = 'text-[0.8rem] text-muted mt-3 leading-[1.55]';
const RECDOT = 'inline-block w-[9px] h-[9px] rounded-full bg-danger mr-1.5 animate-blink motion-reduce:animate-none align-[1px]';
const TAKE = 'flex items-center gap-2.5 bg-surface border border-line rounded-[13px] py-2.5 px-3 mb-2 flex-wrap';
const TAKE_TN = 'font-semibold text-[0.88rem]';
const TAKE_TM = 'text-[0.75rem] text-muted';
const TAKE_LINK = 'text-primary text-[0.82rem] font-semibold no-underline';

/* ---------- modal / toast ---------- */
const OVERLAY = 'fixed inset-0 bg-[rgba(8,9,14,0.7)] flex items-end justify-center z-40';
const SHEET = 'bg-sheetbg w-full max-w-[720px] max-h-[92vh] overflow-y-auto border border-line border-b-0 rounded-t-[18px] pt-4 px-4 pb-[calc(26px+env(safe-area-inset-bottom,0px))]';
const SHEET_BAR = 'w-11 h-1 rounded-sm bg-track mx-auto mb-4';
const SPIN = 'inline-block w-4 h-4 border-[2.5px] border-track border-t-primary rounded-full animate-spin motion-reduce:animate-none align-[-3px] mr-1.5';
const TOAST = 'fixed left-1/2 -translate-x-1/2 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] bg-raised border border-line text-ink py-[11px] px-[18px] rounded-xl text-[0.88rem] z-[60] max-w-[88%] text-center';
