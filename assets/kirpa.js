/* Kirpa Properties — shared runtime. Classic script (works on file:// and GitHub Pages).
   Pages set window.BASE ('' at root, '../' one level down) BEFORE this script. */
const $=s=>document.querySelector(s);
window.BASE=window.BASE||'';
const WA='971543673063';

/* ---------- state ---------- */
let favs=JSON.parse(localStorage.getItem('kirpa-favs')||'[]');
let cur=localStorage.getItem('kirpa-cur')||'AED';

/* ---------- money ---------- */
function fmt(aed,c){
  c=c||cur;const r=RATES[c][0],sym=RATES[c][1],v=aed*r;
  const n=v>=1e6?(v/1e6).toFixed(2).replace(/\.?0+$/,'')+'M':Math.round(v).toLocaleString();
  return c==='AED'?((window.__lang==='pa'?'ਦਿਰਹਮ ':'AED ')+aed.toLocaleString()):(sym+n);
}
function fxEcho(aed){
  return cur==='AED'?('<span class="fx">(≈ '+fmt(aed,'USD')+')</span>'):('<span class="fx">('+fmt(aed,'AED')+')</span>');
}

/* ---------- card component (used by home + similar + indexes) ---------- */
function phImg(src,alt){return src?'<img class="ph-img" loading="lazy" src="'+src+'" alt="'+(alt||'')+'" onerror="this.remove()">':''}
function L(l,f){return window.LF?window.LF(l,f):l[f];}
function cardHTML(l){
  const on=favs.includes(l.ref);
  const url=window.BASE+'properties/listing.html?ref='+l.ref;
  const title=L(l,'title'),comm=L(l,'community'),bld=L(l,'building'),extra=L(l,'extra');
  return '<article class="res">'
    +'<a href="'+url+'"><div class="photo '+l.skies[0]+'">'+phImg(l.imgs&&l.imgs[0],title)+'<span class="credit">'+l.ref+'</span></div></a>'
    +'<button class="fav '+(on?'on':'')+'" data-ref="'+l.ref+'" aria-label="Save '+l.ref+'">'+(on?'♥':'♡')+'</button>'
    +'<div class="res-pad">'
    +'<span class="ref">'+l.ref+' · '+(l.status==='rent'?t('label.forrent','For Rent'):t('label.forsale','For Sale'))+'</span>'
    +'<h3><a href="'+url+'">'+title+'</a></h3>'
    +'<div class="place">'+(bld?bld+'، ':'')+comm+'</div>'
    +'<div class="price">'+fmt(l.aed)+l.per+' '+fxEcho(l.aed)+'</div>'
    +'<div class="specs">'+(typeof l.beds==='number'?l.beds+' '+t('label.bed','bed'):l.beds)+' · '+l.sqft.toLocaleString()+' '+t('label.sqft','sqft')+' · '+extra+'</div>'
    +'<div class="foot"><span class="permit">'+(l.permit?t('permit.for','Trakheesi')+' '+l.permit:t('permit.req','Permit no. on request'))+'</span>'
    +'<button class="link book" data-ref="'+l.ref+'">'+t('label.book','Book a viewing')+'</button></div>'
    +'</div></article>';
}
function bindCards(scope){
  (scope||document).querySelectorAll('.fav').forEach(b=>b.onclick=()=>toggleFav(b.dataset.ref));
  (scope||document).querySelectorAll('.book').forEach(b=>b.onclick=()=>{
    const l=LISTINGS.find(x=>x.ref===b.dataset.ref);
    openSheet('viewing',l.ref,l.ref+' — '+l.title);
  });
}

/* ---------- shortlist ---------- */
function toggleFav(ref){
  favs=favs.includes(ref)?favs.filter(r=>r!==ref):favs.concat([ref]);
  localStorage.setItem('kirpa-favs',JSON.stringify(favs));
  renderDrawer();
  if(window.onFavsChanged)window.onFavsChanged();
}
function renderDrawer(){
  const c=$('#favCount');if(c)c.textContent=favs.length;
  const m=$('#mbarFav');if(m)m.textContent='♡ Shortlist ('+favs.length+')';
  const list=$('#drawerList');if(!list)return;
  if(!favs.length){
    list.innerHTML='<div class="drawer-empty">'+t('dr.empty','Nothing saved yet. Tap the heart on any residence — your shortlist stays on this device, no account needed.')+'</div>';
  }else{
    list.innerHTML=favs.map(ref=>{
      const l=LISTINGS.find(x=>x.ref===ref)||{title:ref,community:''};
      return '<div class="d-item"><div><b>'+ref+'</b><span>'+l.title+' — '+l.community+'</span></div><button data-ref="'+ref+'" aria-label="Remove">✕</button></div>';
    }).join('');
    list.querySelectorAll('button').forEach(b=>b.onclick=()=>toggleFav(b.dataset.ref));
  }
  const msg='Hello, I would like to discuss my shortlist: '+favs.join(', ');
  const s=$('#sendShortlist');if(s)s.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
}

/* ---------- widget markup (single source, injected on every page) ---------- */
document.body.insertAdjacentHTML('beforeend',
 '<div class="scrim" id="scrim"></div>'
+'<aside class="drawer" id="drawer" aria-label="Shortlist">'
+'<div class="drawer-head"><b data-i18n="dr.title">Your shortlist</b><button id="closeDrawer" aria-label="Close">✕</button></div>'
+'<div class="drawer-list" id="drawerList"></div>'
+'<div class="drawer-cta"><a class="btn coral" id="sendShortlist" href="#" target="_blank" rel="noopener" data-i18n="dr.send">Send my shortlist to an advisor</a>'
+'<div class="note" data-i18n="dr.note">Opens WhatsApp with your saved references attached — no account, no forms. Saved on this device only.</div></div>'
+'</aside>'
+'<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Book an appointment">'
+'<div class="sheet-box">'
+'<div class="sheet-head"><b id="sheetTitle">Book a viewing</b><button id="closeSheet" aria-label="Close">✕</button></div>'
+'<div class="sheet-sub" id="sheetSub"></div>'
+'<div class="sheet-lbl" data-i18n="sh.day">Preferred day</div>'
+'<div class="sheet-chips" id="dayChips"><button class="schip on" data-i18n="sh.today">Today</button><button class="schip" data-i18n="sh.tomorrow">Tomorrow</button><button class="schip" data-i18n="sh.weekend">This weekend</button><button class="schip" data-i18n="sh.nextweek">Next week</button></div>'
+'<div class="sheet-lbl" data-i18n="sh.time">Preferred time</div>'
+'<div class="sheet-chips" id="timeChips"><button class="schip on" data-i18n="sh.morning">Morning</button><button class="schip" data-i18n="sh.afternoon">Afternoon</button><button class="schip" data-i18n="sh.evening">Evening</button></div>'
+'<a class="btn coral" id="sheetConfirm" href="#" target="_blank" rel="noopener" data-i18n="sh.confirm">Confirm on WhatsApp</a>'
+'<div class="sheet-note" data-i18n="sh.note">This sends your request with the reference and preferred slot attached — an advisor confirms the exact time by reply.</div>'
+'</div></div>');

/* ---------- drawer open/close ---------- */
function closeDrawer(){$('#drawer').classList.remove('open');$('#scrim').classList.remove('on')}
function openDrawerFn(){$('#drawer').classList.add('open');$('#scrim').classList.add('on')}
if($('#openDrawer'))$('#openDrawer').onclick=openDrawerFn;
if($('#mbarFav'))$('#mbarFav').onclick=openDrawerFn;
$('#closeDrawer').onclick=closeDrawer;
$('#scrim').onclick=closeDrawer;

/* ---------- currency ---------- */
const CUR_NAMES={AED:'UAE Dirham',USD:'US Dollar',GBP:'British Pound',EUR:'Euro'};
function buildCurMenu(){
  const m=$('#curMenu');if(!m)return;
  m.innerHTML=CURS.map(c=>'<button class="dd-item '+(c===cur?'on':'')+'" data-c="'+c+'"><span>'+c+' <span class="sym">'+CUR_NAMES[c]+'</span></span><span class="tick">✓</span></button>').join('');
  m.querySelectorAll('.dd-item').forEach(b=>b.onclick=()=>{
    cur=b.dataset.c;localStorage.setItem('kirpa-cur',cur);
    $('#curLabel').textContent=cur;$('#curDD').classList.remove('open');buildCurMenu();
    if(window.onCurrencyChanged)window.onCurrencyChanged();
  });
}
if($('#curBtn')){
  $('#curLabel').textContent=cur;buildCurMenu();
  $('#curBtn').onclick=e=>{e.stopPropagation();$('#langDD')&&$('#langDD').classList.remove('open');$('#curDD').classList.toggle('open');};
}

/* ---------- booking sheet ---------- */
let sheetCtx={kind:'viewing',ref:'',title:''};
function openSheet(kind,ref,title){
  sheetCtx={kind:kind,ref:ref,title:title};
  const heads={viewing:t('sh.viewing','Book a viewing'),suite:t('sh.suite','Book a sales-suite visit'),valuation:t('sh.valuation','Book a valuation visit'),call:t('sh.call','Book a call')};
  $('#sheetTitle').textContent=heads[kind]||heads.viewing;
  $('#sheetSub').textContent=title||'';
  $('#sheet').classList.add('open');
  updateSheetLink();
}
function pick(id){const el=document.querySelector('#'+id+' .on');return el?el.textContent:''}
function updateSheetLink(){
  const slot=pick('dayChips')+', '+pick('timeChips');
  const m={
    viewing:"I'd like to book a viewing of "+sheetCtx.title+". Preferred: "+slot+".",
    suite:"I'd like to book a sales-suite visit for "+sheetCtx.title+". Preferred: "+slot+".",
    valuation:"I'd like to book a valuation visit for my property. Preferred: "+slot+".",
    call:"I'd like to book "+sheetCtx.title+". Preferred: "+slot+"."
  };
  $('#sheetConfirm').href='https://wa.me/'+WA+'?text='+encodeURIComponent(m[sheetCtx.kind]||m.viewing);
  $('#sheetConfirm').onclick=()=>track('booking_request',{kind:sheetCtx.kind,ref:sheetCtx.ref||''});
}
document.querySelectorAll('.sheet-chips').forEach(g=>g.addEventListener('click',e=>{
  if(!e.target.classList.contains('schip'))return;
  g.querySelectorAll('.schip').forEach(x=>x.classList.remove('on'));
  e.target.classList.add('on');updateSheetLink();
}));
$('#closeSheet').onclick=()=>$('#sheet').classList.remove('open');
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')$('#sheet').classList.remove('open')});

/* ---------- mobile menu (injected on every page) ---------- */
(function(){
  const nr=document.querySelector('.nav-right');
  if(nr)nr.insertAdjacentHTML('beforeend','<button class="burger" id="burger" aria-label="Menu"><span></span><span></span></button>');
  const B=window.BASE;
  document.body.insertAdjacentHTML('beforeend',
   '<div class="menu" id="menu">'
  +'<div class="menu-head"><b>KIRPA</b><button id="closeMenu" aria-label="Close">✕</button></div>'
  +'<nav>'
  +'<a href="'+B+'buy/" data-i18n="nav.buy">Buy</a>'
  +'<a href="'+B+'rent/" data-i18n="nav.rent">Rent</a>'
  +'<a href="'+B+'off-plan/" data-i18n="nav.offplan">Off-Plan</a>'
  +'<a href="'+B+'communities/" data-i18n="nav.communities">Communities</a>'
  +'<a href="'+B+'sell/" data-i18n="nav.sell">Sell</a>'
  +'<a href="'+B+'index.html" data-i18n="nav.home">Home</a>'
  +'</nav>'
  +'<div class="menu-foot"><button class="switch lang" style="background:none;border:1px solid #3a352f;border-radius:999px;padding:8px 16px;color:var(--cream)">EN · ਪੰਜਾਬੀ · हिन्दी · العربية</button><span>ORN 49046 · Dubai</span></div>'
  +'</div>');
  const m=$('#menu');
  if($('#burger'))$('#burger').onclick=()=>m.classList.add('open');
  $('#closeMenu').onclick=()=>m.classList.remove('open');
})();

/* ---------- analytics: track every WhatsApp click with context ---------- */
window.dataLayer=window.dataLayer||[];
function track(event,detail){
  const payload=Object.assign({event:event,page:location.pathname+location.search,ts:Date.now()},detail||{});
  window.dataLayer.push(payload);
  if(window.gtag)try{window.gtag('event',event,detail||{})}catch(e){}
  /* visible in devtools until a real analytics ID is wired in */
  if(window.KIRPA_DEBUG)console.log('[track]',payload);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="https://wa.me/"], a[href^="mailto:"]');
  if(!a)return;
  const kind=a.href.indexOf('wa.me')>-1?'whatsapp_click':'email_click';
  /* infer intent from surrounding context */
  let ctx='generic';
  if(a.closest('.side-card'))ctx='listing_enquiry';
  else if(a.closest('.cta-band'))ctx='cta_band';
  else if(a.closest('.drawer'))ctx='shortlist_send';
  else if(a.closest('.sheet'))ctx='booking_confirm';
  else if(a.closest('.mbar'))ctx='mobile_bar';
  else if(a.closest('header'))ctx='nav';
  else if(a.closest('.sell'))ctx='valuation';
  track(kind,{context:ctx});
},true);

/* ---------- language (EN / AR) ---------- */
let lang=localStorage.getItem('kirpa-lang')||'en';
function applyLang(){
  const html=document.documentElement;
  html.setAttribute('lang',lang);
  html.setAttribute('dir',lang==='ar'?'rtl':'ltr');
  if(lang==='hi' && !document.getElementById('hi-font')){
    var hf=document.createElement('link');hf.id='hi-font';hf.rel='stylesheet';
    hf.href='https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&display=swap';
    document.head.appendChild(hf);
  }
  if(lang==='pa' && !document.getElementById('pa-font')){
    var pf=document.createElement('link');pf.id='pa-font';pf.rel='stylesheet';
    pf.href='https://fonts.googleapis.com/css2?family=Noto+Sans+Gurmukhi:wght@400;500;600&display=swap';
    document.head.appendChild(pf);
  }
  const D=(typeof I18N!=='undefined')?I18N[lang]:null;
  if(lang!=='en' && D){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const v=D[el.getAttribute('data-i18n')];
      if(v)el.textContent=v;
      const ph=el.getAttribute('data-i18n-ph');
      if(ph&&D[ph])el.setAttribute('placeholder',D[ph]);
    });
    document.querySelectorAll('[data-i18n-append]').forEach(el=>{
      const v=D[el.getAttribute('data-i18n-append')];
      if(v)el.textContent='♡ '+v;
    });
  }
  const ll=document.querySelector('#langLabel');if(ll)ll.textContent=lang.toUpperCase();
}
const LANGS=[['en','English'],['pa','ਪੰਜਾਬੀ'],['hi','हिन्दी'],['ar','العربية']];
function setLang(v){if(v===lang){return;}lang=v;localStorage.setItem('kirpa-lang',lang);location.reload();}
function buildLangMenu(){
  const m=$('#langMenu');if(!m)return;
  m.innerHTML=LANGS.map(([code,name])=>'<button class="dd-item '+(code===lang?'on':'')+'" data-l="'+code+'"><span>'+name+'</span><span class="tick">✓</span></button>').join('');
  m.querySelectorAll('.dd-item').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
}
if($('#langBtn')){
  buildLangMenu();
  $('#langBtn').onclick=e=>{e.stopPropagation();$('#curDD')&&$('#curDD').classList.remove('open');$('#langDD').classList.toggle('open');};
}
/* mobile menu language button (separate) still toggles */
document.querySelectorAll('.menu .switch.lang').forEach(b=>b.onclick=()=>{const o=LANGS.map(x=>x[0]);setLang(o[(o.indexOf(lang)+1)%o.length]);});
applyLang();
if(window.onLangReady)window.onLangReady();
/* close dropdowns on outside click */
document.addEventListener('click',()=>{['#curDD','#langDD'].forEach(s=>{const el=document.querySelector(s);if(el)el.classList.remove('open')})});

/* ---------- global Escape closes any open overlay ---------- */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  ['#drawer','#menu'].forEach(s=>{const el=document.querySelector(s);if(el)el.classList.remove('open')});
  ['#sheet','#searchSheet'].forEach(s=>{const el=document.querySelector(s);if(el)el.classList.remove('open')});
  const sc=document.querySelector('#scrim');if(sc)sc.classList.remove('on');
});

/* ---------- highlight the current page in the nav ---------- */
(function(){
  const path=location.pathname.replace(/index\.html$/,'').replace(/\/$/,'/');
  document.querySelectorAll('.nav-links a, .menu nav a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    const target=href.replace('../','/').replace(/index\.html$/,'').replace(/^\.\//,'');
    if(target && target!=='#' && path.indexOf(target.replace(/\/$/,''))>-1 && target!=='/' && target.length>1){
      a.classList.add('current');
    }
  });
})();

/* ---------- header states + reveals ---------- */
const hdr=$('#hdr');
if(hdr){
  if(window.HEADER_SOLID){hdr.classList.add('solid');}
  else{
    const onScroll=()=>{
      const y=window.scrollY,past=y>window.innerHeight-140;
      hdr.classList.toggle('solid',past);
      hdr.classList.toggle('tint',!past&&y>10);
    };
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  }
}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ---------- init ---------- */
renderDrawer();


/* ===================================================================
   CONCIERGE + LOGO + RIBBON (home only) + link repairs.
   =================================================================== */
/* Kirpa Properties — AI-style Concierge (fully static, no backend, no API key).
   Load AFTER listings.js and kirpa.js on every page. Uses the site's own
   globals: LISTINGS, PROJECTS, COMMUNITIES, fmt(), openSheet(), WA, track(), BASE.
   A guided lead-qualifier that matches live inventory and hands a warm lead to
   WhatsApp — everything runs in the visitor's browser, hosted entirely on GitHub. */
(function(){
  var WA   = (typeof window.WA!=='undefined')?window.WA:'971543673063';
  var BASE = window.BASE||'';
  var LANG = document.documentElement.getAttribute('lang')||'en';
  var RTL  = LANG==='ar';
  var PA_C={"Ask Kirpa": "ਕਿਰਪਾ ਨੂੰ ਪੁੱਛੋ", "Concierge · here to help": "ਕਨਸੀਅਰਜ · ਮਦਦ ਲਈ ਹਾਜ਼ਰ", "Connect me with an advisor": "ਮੈਨੂੰ ਸਲਾਹਕਾਰ ਨਾਲ ਜੋੜੋ", "Prefer to talk now? ": "ਹੁਣੇ ਗੱਲ ਕਰਨੀ ਹੈ? ", "Message us on WhatsApp": "ਵਟਸਐਪ ’ਤੇ ਸਾਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ", "Hi Kirpa — your concierge qualified me. ": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਰਪਾ — ਤੁਹਾਡੇ ਕਨਸੀਅਰਜ ਨੇ ਮੇਰੀ ਜਾਣਕਾਰੀ ਲੈ ਲਈ। ", "Can an advisor take it from here?": "ਕੀ ਕੋਈ ਸਲਾਹਕਾਰ ਅੱਗੇ ਸੰਭਾਲ ਸਕਦਾ ਹੈ?", "For Rent": "ਕਿਰਾਏ ਲਈ", "For Sale": "ਵਿਕਰੀ ਲਈ", "Book": "ਬੁੱਕ ਕਰੋ", "Off-Plan": "ਆਫ਼-ਪਲਾਨ", "From ": "ਸ਼ੁਰੂ ", "Visit": "ਵਿਜ਼ਿਟ ਕਰੋ", "Hello — I'm Kirpa's concierge. What brings you in today?": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ — ਮੈਂ ਕਿਰਪਾ ਦਾ ਕਨਸੀਅਰਜ ਹਾਂ। ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਲੱਭ ਰਹੇ ਹੋ?", "Buy a home": "ਘਰ ਖਰੀਦੋ", "Rent a home": "ਘਰ ਕਿਰਾਏ ’ਤੇ ਲਵੋ", "Off-plan / investment": "ਆਫ਼-ਪਲਾਨ / ਨਿਵੇਸ਼", "Just a question": "ਬੱਸ ਇੱਕ ਸਵਾਲ", "What budget are we working with?": "ਅਸੀਂ ਕਿੰਨੇ ਬਜਟ ਨਾਲ ਕੰਮ ਕਰ ਰਹੇ ਹਾਂ?", " (per year)": " (ਪ੍ਰਤੀ ਸਾਲ)", "Any budget": "ਕੋਈ ਵੀ ਬਜਟ", "Any": "ਕੋਈ ਵੀ", "Anywhere in Dubai": "ਦੁਬਈ ਵਿੱਚ ਕਿਤੇ ਵੀ", "Any particular area, or shall I show the best across Dubai?": "ਕੋਈ ਖ਼ਾਸ ਇਲਾਕਾ, ਜਾਂ ਮੈਂ ਪੂਰੇ ਦੁਬਈ ’ਚੋਂ ਵਧੀਆ ਵਿਖਾਵਾਂ?", "How many bedrooms?": "ਕਿੰਨੇ ਬੈੱਡਰੂਮ?", "I don't have a live match for that right now — but a lot of our best stock never hits the portals. Shall I have an advisor find it off-market?": "ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਇਸ ਦਾ ਕੋਈ ਲਾਈਵ ਮੇਲ ਨਹੀਂ — ਪਰ ਸਾਡਾ ਬਹੁਤ ਵਧੀਆ ਸਟਾਕ ਪੋਰਟਲਾਂ ’ਤੇ ਕਦੇ ਨਹੀਂ ਆਉਂਦਾ। ਕੀ ਮੈਂ ਕਿਸੇ ਸਲਾਹਕਾਰ ਤੋਂ ਇਸ ਨੂੰ ਬਜ਼ਾਰ ਤੋਂ ਬਾਹਰੋਂ ਲੱਭਵਾਵਾਂ?", "Yes, find it for me": "ਹਾਂ, ਮੇਰੇ ਲਈ ਲੱਭੋ", "Start over": "ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ", "in": "ਵਿੱਚ", "When are you hoping to move or buy?": "ਤੁਸੀਂ ਕਦੋਂ ਤੱਕ ਸ਼ਿਫ਼ਟ ਜਾਂ ਖਰੀਦਣ ਦੀ ਉਮੀਦ ਕਰ ਰਹੇ ਹੋ?", "Ready now": "ਹੁਣੇ ਤਿਆਰ", "1–3 months": "1–3 ਮਹੀਨੇ", "Just researching": "ਬੱਸ ਖੋਜ ਕਰ ਰਿਹਾ", "Researching": "ਖੋਜ", "Last thing — are you a UAE resident?": "ਆਖ਼ਰੀ ਗੱਲ — ਕੀ ਤੁਸੀਂ ਯੂਏਈ ਦੇ ਨਿਵਾਸੀ ਹੋ?", "UAE resident": "ਯੂਏਈ ਨਿਵਾਸੀ", "Resident": "ਨਿਵਾਸੀ", "Non-resident": "ਗ਼ੈਰ-ਨਿਵਾਸੀ", "Perfect — I've put your brief together. Tap below and an advisor picks it up on WhatsApp, usually within 15 minutes. Anything else in the meantime?": "ਵਧੀਆ — ਮੈਂ ਤੁਹਾਡਾ ਸੰਖੇਪ ਤਿਆਰ ਕਰ ਲਿਆ। ਹੇਠਾਂ ਟੈਪ ਕਰੋ ਅਤੇ ਇੱਕ ਸਲਾਹਕਾਰ ਵਟਸਐਪ ’ਤੇ ਇਸ ਨੂੰ ਸੰਭਾਲ ਲਵੇਗਾ, ਆਮ ਤੌਰ ’ਤੇ 15 ਮਿੰਟਾਂ ਵਿੱਚ। ਇਸ ਦੌਰਾਨ ਹੋਰ ਕੁਝ?", "Show similar homes": "ਮਿਲਦੇ-ਜੁਲਦੇ ਘਰ ਵਿਖਾਓ", "Ask about fees": "ਫ਼ੀਸਾਂ ਬਾਰੇ ਪੁੱਛੋ", "Done — tap below and an advisor will reach out on WhatsApp.": "ਹੋ ਗਿਆ — ਹੇਠਾਂ ਟੈਪ ਕਰੋ ਅਤੇ ਇੱਕ ਸਲਾਹਕਾਰ ਵਟਸਐਪ ’ਤੇ ਸੰਪਰਕ ਕਰੇਗਾ।", "Buying property in Dubai can put you on the path to a renewable investor residence visa, and higher-value purchases can qualify for a long-term Golden Visa. The exact thresholds change from time to time — an advisor will confirm what your budget qualifies for.": "ਦੁਬਈ ਵਿੱਚ ਜਾਇਦਾਦ ਖਰੀਦਣਾ ਤੁਹਾਨੂੰ ਨਵਿਆਉਣਯੋਗ ਨਿਵੇਸ਼ਕ ਰਿਹਾਇਸ਼ੀ ਵੀਜ਼ੇ ਦੇ ਰਾਹ ’ਤੇ ਪਾ ਸਕਦਾ ਹੈ, ਅਤੇ ਵੱਧ-ਕੀਮਤ ਵਾਲੀਆਂ ਖਰੀਦਾਂ ਲੰਬੇ ਸਮੇਂ ਦੇ ਗੋਲਡਨ ਵੀਜ਼ੇ ਲਈ ਯੋਗ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਸਹੀ ਹੱਦਾਂ ਸਮੇਂ-ਸਮੇਂ ’ਤੇ ਬਦਲਦੀਆਂ ਹਨ — ਇੱਕ ਸਲਾਹਕਾਰ ਪੁਸ਼ਟੀ ਕਰੇਗਾ ਕਿ ਤੁਹਾਡਾ ਬਜਟ ਕਿਸ ਲਈ ਯੋਗ ਹੈ।", "Beyond the price, budget for the Dubai Land Department transfer fee, an agency fee, and — if you're financing — bank arrangement fees. Your advisor gives you the exact all-in number for a specific unit.": "ਕੀਮਤ ਤੋਂ ਇਲਾਵਾ, ਦੁਬਈ ਲੈਂਡ ਵਿਭਾਗ ਦੀ ਟ੍ਰਾਂਸਫ਼ਰ ਫ਼ੀਸ, ਏਜੰਸੀ ਫ਼ੀਸ, ਅਤੇ — ਜੇ ਤੁਸੀਂ ਵਿੱਤ ਲੈ ਰਹੇ ਹੋ — ਬੈਂਕ ਦੀ ਪ੍ਰਬੰਧ ਫ਼ੀਸ ਲਈ ਵੀ ਬਜਟ ਰੱਖੋ। ਤੁਹਾਡਾ ਸਲਾਹਕਾਰ ਕਿਸੇ ਖ਼ਾਸ ਯੂਨਿਟ ਲਈ ਸਹੀ ਕੁੱਲ ਰਕਮ ਦੱਸੇਗਾ।", "Short version: shortlist and view, agree a price, sign an MOU with a deposit, then transfer at the Land Department. Off-plan runs on a payment plan through handover. An advisor walks you through each step.": "ਸੰਖੇਪ ਵਿੱਚ: ਸ਼ਾਰਟਲਿਸਟ ਬਣਾਓ ਤੇ ਵੇਖੋ, ਕੀਮਤ ’ਤੇ ਸਹਿਮਤ ਹੋਵੋ, ਇੱਕ ਡਿਪਾਜ਼ਿਟ ਨਾਲ MOU ’ਤੇ ਦਸਤਖ਼ਤ ਕਰੋ, ਫਿਰ ਲੈਂਡ ਵਿਭਾਗ ਵਿਖੇ ਟ੍ਰਾਂਸਫ਼ਰ ਕਰੋ। ਆਫ਼-ਪਲਾਨ ਹੈਂਡਓਵਰ ਤੱਕ ਭੁਗਤਾਨ ਯੋਜਨਾ ’ਤੇ ਚੱਲਦਾ ਹੈ। ਇੱਕ ਸਲਾਹਕਾਰ ਹਰ ਕਦਮ ’ਤੇ ਤੁਹਾਡੀ ਅਗਵਾਈ ਕਰੇਗਾ।", "Happy to help — what would you like to know?": "ਮਦਦ ਲਈ ਖ਼ੁਸ਼ ਹਾਂ — ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੋਗੇ?", "Do I get residency if I buy?": "ਕੀ ਖਰੀਦਣ ’ਤੇ ਰਿਹਾਇਸ਼ ਮਿਲਦੀ ਹੈ?", "What are the fees?": "ਫ਼ੀਸਾਂ ਕੀ ਹਨ?", "How does buying work?": "ਖਰੀਦਦਾਰੀ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ?", "Actually, show me homes": "ਦਰਅਸਲ, ਮੈਨੂੰ ਘਰ ਵਿਖਾਓ", "Another question": "ਇੱਕ ਹੋਰ ਸਵਾਲ", "Show me homes": "ਮੈਨੂੰ ਘਰ ਵਿਖਾਓ", "Talk to an advisor": "ਸਲਾਹਕਾਰ ਨਾਲ ਗੱਲ ਕਰੋ", "bed": "ਬੈੱਡ", "Interested in": "ਰੁਚੀ"};
  var T = function(en,ar,pa){ return LANG==='ar'?ar:(LANG==='pa'?(pa||PA_C[en]||en):en); };
  function curPre(){ return LANG==='pa'?'ਦਿਰਹਮ ':'AED '; }
  function bandTxt(b){ if(LANG!=='pa')return b; if(b==='Under 1M')return '1M ਤੋਂ ਘੱਟ'; if(b==='Under 100k')return '100k ਤੋਂ ਘੱਟ'; return b; }
  function commLbl(n){ if(!n)return n; try{ for(var k in COMMUNITIES){ if(COMMUNITIES[k].name===n) return window.LF?window.LF(COMMUNITIES[k],'name'):n; } }catch(e){} return n; }
  function intentLbl(v){ if(LANG!=='pa')return v; return v==='Buy'?'ਖਰੀਦ':v==='Rent'?'ਕਿਰਾਇਆ':v==='Off-plan'?'ਆਫ਼-ਪਲਾਨ':v; }
  function pillKey(k){ if(LANG!=='pa')return k.charAt(0).toUpperCase()+k.slice(1); return {intent:'ਇਰਾਦਾ',budget:'ਬਜਟ',area:'ਇਲਾਕਾ',beds:'ਬੈੱਡਰੂਮ',timeline:'ਸਮਾਂ',residency:'ਰਿਹਾਇਸ਼'}[k]||k; }
  /* safety net: repair any stale mortgage-calculator links */
  document.querySelectorAll('a[href*="tools/mortgage-calculator"]').forEach(function(a){a.href=a.href.replace('tools/mortgage-calculator/','tools/').replace('tools/mortgage-calculator','tools/');});
  var STAR='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M98 50L55.73 52.37L75.46 75.46L52.37 55.73L50 98L47.63 55.73L24.54 75.46L44.27 52.37L2 50L44.27 47.63L24.54 24.54L47.63 44.27L50 2L52.37 44.27L75.46 24.54L55.73 47.63Z" fill="currentColor"/></svg>';

  /* Replace the nav logo "K" with the starburst + style it, so this single
     file fixes both the nav and the concierge (no HTML edits needed). */
  (function(){
    var ns=document.createElement('style');
    ns.textContent='.logo .mark{border:none!important;background:none!important;color:var(--coral,#FF6633)!important;transition:transform .25s}.logo .mark svg{width:86%;height:86%;display:block}.logo:hover .mark{background:none!important;transform:scale(1.06)}';
    document.head.appendChild(ns);
    document.querySelectorAll('.logo .mark').forEach(function(m){ m.innerHTML=STAR; });
  })();

  function money(aed){ return (typeof window.fmt==='function')?fmt(aed):('AED '+aed.toLocaleString()); }
  function book(kind,ref,title){ if(typeof window.openSheet==='function') openSheet(kind,ref,title);
    else window.open('https://wa.me/'+WA+'?text='+encodeURIComponent("I'd like to book: "+title),'_blank'); }
  function track(ev,d){ if(typeof window.track==='function'){ try{ window.track(ev,d||{}); }catch(e){} } }

  /* listings.js declares these with const, so they live in the shared script
     scope, NOT on window. Read them as bare identifiers, guarded. */
  function _listings(){ return (typeof LISTINGS!=='undefined'&&LISTINGS)?LISTINGS:[]; }
  function _projects(){ return (typeof PROJECTS!=='undefined'&&PROJECTS)?PROJECTS:[]; }
  function _agents(){ return (typeof AGENTS!=='undefined'&&AGENTS)?AGENTS:{}; }

  /* ---------- styles (scoped kc-) ---------- */
  var css=''
  +'.kc-launch{position:fixed;right:22px;bottom:22px;z-index:9998;width:56px;height:56px;border-radius:50%;background:var(--ink,#171412);color:var(--coral,#FF6633);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .18s,background .18s,color .18s;animation:kc-ring 2.6s infinite}'
  +'.kc-launch:hover{transform:translateY(-2px) scale(1.05);background:var(--coral,#FF6633);color:#fff}'
  +'.kc-launch i{font-style:normal;font-family:var(--display,serif);font-size:23px;line-height:1}'
  +'.kc-launch svg{width:28px;height:28px;display:block}'
  +'@keyframes kc-ring{0%{box-shadow:0 14px 30px -12px rgba(23,20,18,.5),0 0 0 0 rgba(255,102,51,.45)}70%{box-shadow:0 14px 30px -12px rgba(23,20,18,.5),0 0 0 12px rgba(255,102,51,0)}100%{box-shadow:0 14px 30px -12px rgba(23,20,18,.5),0 0 0 0 rgba(255,102,51,0)}}'
  +'.kc-panel{position:fixed;right:22px;bottom:22px;width:380px;height:auto;max-height:min(78vh,600px);min-height:300px;z-index:9999;padding:0;background:var(--paper,#FFFDFB);border:1px solid var(--sand,#E5DBD0);border-radius:18px;overflow:hidden;display:none;flex-direction:column;box-shadow:0 30px 70px -28px rgba(23,20,18,.5);font-family:var(--body,sans-serif);color:var(--ink,#171412)}'
  +'.kc-panel.kc-open{display:flex}.kc-panel[dir="rtl"]{text-align:right}'
  +'.kc-top{display:flex;align-items:center;gap:11px;padding:14px 16px;border-bottom:1px solid var(--sand,#E5DBD0);flex:0 0 auto}'
  +'.kc-mark{width:32px;height:32px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;color:var(--coral,#FF6633)}'
  +'.kc-mark svg{width:27px;height:27px;display:block}'
  +'.kc-mark i{font-style:normal;font-family:var(--display,serif);font-size:14px}'
  +'.kc-top b{font-family:var(--display,serif);font-weight:400;letter-spacing:.26em;font-size:13px;display:block;line-height:1.2}'
  +'.kc-top small{font-size:10.5px;color:var(--stone,#8F857A);letter-spacing:.03em}'
  +'.kc-x{margin-inline-start:auto;background:none;border:none;font-size:17px;color:var(--stone,#8F857A);cursor:pointer;line-height:1}'
  +'.kc-brief{flex:0 0 auto;display:none;gap:6px;flex-wrap:wrap;padding:9px 16px;border-bottom:1px solid var(--sand,#E5DBD0);background:var(--cream,#FBF6F1)}'
  +'.kc-brief.kc-show{display:flex}'
  +'.kc-brief .kc-pill{font-size:10.5px;background:var(--paper,#fff);border:1px solid var(--sand,#E5DBD0);border-radius:999px;padding:3px 9px}'
  +'.kc-brief .kc-pill b{color:var(--coral,#FF6633);font-weight:600}'
  +'.kc-stream{flex:1 1 auto;min-height:0;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:11px}'
  +'.kc-msg{max-width:86%;font-size:13.5px;line-height:1.55;padding:10px 13px;border-radius:14px}'
  +'.kc-bot{background:var(--cream,#FBF6F1);border:1px solid var(--sand,#E5DBD0);align-self:flex-start;border-bottom-left-radius:4px}'
  +'.kc-me{background:var(--ink,#171412);color:var(--paper,#fff);align-self:flex-end;border-bottom-right-radius:4px}'
  +'.kc-panel[dir="rtl"] .kc-bot{align-self:flex-end;border-bottom-left-radius:14px;border-bottom-right-radius:4px}'
  +'.kc-panel[dir="rtl"] .kc-me{align-self:flex-start;border-bottom-right-radius:14px;border-bottom-left-radius:4px}'
  +'.kc-type{align-self:flex-start;color:var(--stone,#8F857A);padding:2px 4px}'
  +'.kc-type i{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--stone,#8F857A);margin-right:3px;animation:kc-b 1.2s infinite}'
  +'.kc-type i:nth-child(2){animation-delay:.15s}.kc-type i:nth-child(3){animation-delay:.3s}'
  +'@keyframes kc-b{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}'
  +'.kc-cards{align-self:stretch;display:flex;flex-direction:column;gap:8px}'
  +'.kc-card{display:flex;align-items:center;gap:10px;border:1px solid var(--sand,#E5DBD0);border-radius:12px;padding:10px 11px;background:var(--paper,#fff)}'
  +'.kc-card-main{flex:1;min-width:0;text-decoration:none;color:inherit;display:block}'
  +'.kc-card .kc-cref{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--stone,#8F857A);display:block}'
  +'.kc-card b{font-size:13px;font-weight:600;display:block;margin:1px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  +'.kc-card .kc-cplace{font-size:11.5px;color:var(--stone,#8F857A);display:block}'
  +'.kc-card .kc-cprice{font-size:12.5px;font-weight:600;color:var(--coral,#FF6633);display:block;margin-top:2px}'
  +'.kc-book{flex:0 0 auto;border:1px solid var(--coral,#FF6633);background:none;color:var(--coral,#FF6633);border-radius:8px;padding:7px 10px;font-size:11.5px;font-family:var(--body,sans-serif);cursor:pointer}'
  +'.kc-book:hover{background:var(--coral,#FF6633);color:#fff}'
  +'.kc-seeall{align-self:flex-start;font-size:12px;color:var(--coral,#FF6633);text-decoration:none;border-bottom:1px solid currentColor}'
  +'.kc-suggest{flex:0 0 auto;display:none;gap:7px;flex-wrap:wrap;padding:0 16px 10px}'
  +'.kc-chip{font-size:12px;padding:7px 12px;border:1px solid rgba(255,102,51,.35);background:var(--paper,#fff);border-radius:999px;cursor:pointer;color:var(--coral,#FF6633);font-family:var(--body,sans-serif);transition:.15s}'
  +'.kc-chip:hover{background:rgba(255,102,51,.08)}'
  +'.kc-chip.kc-plain{border-color:var(--sand,#E5DBD0);color:var(--ink,#171412)}'
  +'.kc-handoff{flex:0 0 auto;display:none;padding:0 16px 12px}'
  +'.kc-handoff a{display:block;text-align:center;background:var(--coral,#FF6633);color:#fff;text-decoration:none;border-radius:10px;padding:11px;font-size:13px;font-weight:500}'
  +'.kc-foot{flex:0 0 auto;padding:9px 16px;border-top:1px solid var(--sand,#E5DBD0);font-size:11px;color:var(--stone,#8F857A);text-align:center}'
  +'.kc-foot a{color:var(--coral,#FF6633);text-decoration:none}'
  +'@media(max-width:600px){.kc-launch{bottom:76px;right:16px;width:52px;height:52px}.kc-launch i{font-size:21px}.kc-panel{right:0;left:0;bottom:0;width:100%;height:auto;max-height:86vh;min-height:56vh;border-radius:18px 18px 0 0}}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---------- markup ---------- */
  var launchLabel=T('Ask Kirpa','اسأل كِربا');
  var wrap=document.createElement('div');
  wrap.innerHTML=
    '<button class="kc-launch" id="kcLaunch" aria-label="'+launchLabel+'" title="'+launchLabel+'">'+STAR+'</button>'
  + '<section class="kc-panel" id="kcPanel" role="dialog" aria-label="Kirpa Concierge"'+(RTL?' dir="rtl"':'')+'>'
  +   '<div class="kc-top"><span class="kc-mark">'+STAR+'</span><div><b>KIRPA</b><small>'+T('Concierge · here to help','مساعدك العقاري')+'</small></div><button class="kc-x" id="kcClose" aria-label="Close">&times;</button></div>'
  +   '<div class="kc-brief" id="kcBrief"></div>'
  +   '<div class="kc-stream" id="kcStream"></div>'
  +   '<div class="kc-suggest" id="kcSuggest"></div>'
  +   '<div class="kc-handoff" id="kcHandoff"><a id="kcHandoffLink" href="#" target="_blank" rel="noopener">'+T('Connect me with an advisor','تواصل مع مستشار')+'</a></div>'
  +   '<div class="kc-foot">'+T('Prefer to talk now? ','تفضل التحدث الآن؟ ')+'<a href="https://wa.me/'+WA+'" target="_blank" rel="noopener">'+T('Message us on WhatsApp','راسلنا على واتساب')+'</a></div>'
  +  '</section>';
  document.body.appendChild(wrap);

  var $=function(id){return document.getElementById(id);};
  var panel=$('kcPanel'),stream=$('kcStream'),suggestEl=$('kcSuggest'),briefEl=$('kcBrief'),
      handoffEl=$('kcHandoff'),handoffLink=$('kcHandoffLink');
  var lead={intent:null,budget:null,budgetRange:[0,0],area:null,beds:null,timeline:null,residency:null,refs:[]};
  var opened=false;

  function addMsg(html,who){var d=document.createElement('div');d.className='kc-msg '+(who==='me'?'kc-me':'kc-bot');d.innerHTML=html;stream.appendChild(d);stream.scrollTop=stream.scrollHeight;return d;}
  function typing(cb){var t=document.createElement('div');t.className='kc-msg kc-bot kc-type';t.innerHTML='<i></i><i></i><i></i>';stream.appendChild(t);stream.scrollTop=stream.scrollHeight;setTimeout(function(){t.remove();cb();},420);}
  function botSay(html){ typing(function(){ addMsg(html,'bot'); }); }
  function options(arr){ // [{label, plain?, fn}]
    suggestEl.innerHTML='';
    arr.forEach(function(o){var b=document.createElement('button');b.className='kc-chip'+(o.plain?' kc-plain':'');b.textContent=o.label;b.onclick=function(){pick(o);};suggestEl.appendChild(b);});
    suggestEl.style.display=arr.length?'flex':'none';
  }
  function pick(o){ addMsg(o.label,'me'); suggestEl.style.display='none'; o.fn(); }

  function paintBrief(){
    var order=['intent','budget','area','beds','timeline','residency'];
    var pills=order.filter(function(k){return lead[k];}).map(function(k){
      var v=lead[k]; if(k==='beds')v=(v==='4'?'4+':v)+' '+(LANG==='pa'?'ਬੈੱਡ':LANG==='ar'?'غرفة':'bed'); if(k==='area')v=commLbl(v); if(k==='intent')v=intentLbl(v);
      return '<span class="kc-pill"><b>'+pillKey(k)+'</b> '+v+'</span>';});
    if(pills.length){briefEl.innerHTML=pills.join('');briefEl.classList.add('kc-show');}
    if(lead.intent&&(lead.budget||lead.area)){
      var parts=[]; order.forEach(function(k){if(lead[k]){var vv=(k==='beds'?(lead[k]==='4'?'4+':lead[k]):lead[k]); if(k==='area')vv=commLbl(vv); if(k==='intent')vv=intentLbl(vv); parts.push(pillKey(k)+': '+vv);}});
      if(lead.refs.length)parts.push(T('Interested in','مهتم بـ')+': '+lead.refs.join(', '));
      var msg=T('Hi Kirpa — your concierge qualified me. ','مرحباً كِربا — أكمل مساعدكم بياناتي. ')+parts.join(' · ')+'. '+T('Can an advisor take it from here?','هل يمكن لمستشار المتابعة؟');
      handoffLink.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
      if(handoffEl.style.display!=='block'){handoffEl.style.display='block';track('concierge_lead_ready',{});}
      handoffLink.onclick=function(){track('concierge_handoff',{intent:lead.intent,budget:lead.budget,area:lead.area});};
    }
  }

  /* ---------- data helpers ---------- */
  function communities(intent){
    if(intent==='Off-plan'){ return _projects().map(function(p){return p.community;}).filter(uniq); }
    var status=intent==='Rent'?'rent':'sale';
    return _listings().filter(function(l){return l.status===status;}).map(function(l){return l.community;}).filter(uniq);
  }
  function uniq(v,i,a){return a.indexOf(v)===i;}
  function matchListings(){
    var status=lead.intent==='Rent'?'rent':'sale';
    return _listings().filter(function(l){
      if(l.status!==status)return false;
      if(lead.area&&l.community!==lead.area)return false;
      if(lead.beds){ if(lead.beds==='4'){ if(l.beds<4)return false; } else if(l.beds==='studio'){ if(l.beds>0)return false; } else if(l.beds!=='any'&&l.beds!==String(l.beds)&&+lead.beds!==l.beds)return false; }
      var mn=lead.budgetRange[0],mx=lead.budgetRange[1];
      if(mn&&l.aed<mn)return false; if(mx&&l.aed>=mx)return false;
      return true;
    });
  }
  function matchProjects(){ return _projects().filter(function(p){ return !lead.area||p.community===lead.area; }); }

  function listingCard(l){
    var title=(window.LF?window.LF(l,'title'):l.title);
    return '<div class="kc-card"><a class="kc-card-main" href="'+BASE+'properties/listing.html?ref='+l.ref+'">'
      +'<span class="kc-cref">'+l.ref+' · '+(l.status==='rent'?T('For Rent','للإيجار'):T('For Sale','للبيع'))+'</span>'
      +'<b>'+title+'</b><span class="kc-cplace">'+(l.building?l.building+', ':'')+l.community+'</span>'
      +'<span class="kc-cprice">'+money(l.aed)+(l.per||'')+'</span></a>'
      +'<button class="kc-book" data-r="'+l.ref+'" data-t="'+(l.ref+' — '+String(title).replace(/"/g,'&quot;'))+'">'+T('Book','حجز')+'</button></div>';
  }
  function projectCard(p){
    return '<div class="kc-card"><a class="kc-card-main" href="'+BASE+'off-plan/">'
      +'<span class="kc-cref">'+T('Off-Plan','على الخارطة')+' · '+p.community+'</span>'
      +'<b>'+p.name+'</b><span class="kc-cplace">'+p.plan+' · '+p.handover+'</span>'
      +'<span class="kc-cprice">'+T('From ','من ')+money(p.fromAed)+'</span></a>'
      +'<button class="kc-book" data-suite="'+p.id+'" data-t="'+p.name+', '+p.community+'">'+T('Visit','زيارة')+'</button></div>';
  }
  function bindCards(scope){
    scope.querySelectorAll('.kc-book').forEach(function(b){
      b.onclick=function(){ if(b.dataset.suite) book('suite',b.dataset.suite,b.dataset.t); else book('viewing',b.dataset.r,b.dataset.t); };
    });
  }
  function seeAllURL(){
    var p=[]; if(lead.area)p.push('community='+encodeURIComponent(lead.area));
    if(lead.beds&&lead.beds!=='any')p.push('beds='+(lead.beds==='4'?'4':lead.beds));
    if(lead.budgetRange[0])p.push('min='+lead.budgetRange[0]); if(lead.budgetRange[1])p.push('max='+lead.budgetRange[1]);
    return BASE+(lead.intent==='Rent'?'rent/':'buy/')+(p.length?'?'+p.join('&'):'');
  }

  /* ---------- flow ---------- */
  function askIntent(){
    botSay(T("Hello — I'm Kirpa's concierge. What brings you in today?","مرحباً — أنا مساعد كِربا. كيف أساعدك اليوم؟"));
    options([
      {label:T('Buy a home','شراء منزل'),fn:function(){setIntent('Buy');}},
      {label:T('Rent a home','استئجار منزل'),fn:function(){setIntent('Rent');}},
      {label:T('Off-plan / investment','على الخارطة / استثمار'),fn:function(){setIntent('Off-plan');}},
      {label:T('Just a question','لدي سؤال'),plain:true,fn:askFaq}
    ]);
  }
  function setIntent(v){ lead.intent=v; paintBrief(); askBudget(); }

  function askBudget(){
    var bands = lead.intent==='Rent'
      ? [['Any budget',0,0],['Under 100k',0,100000],['100–200k',100000,200000],['200–300k',200000,300000],['300k+',300000,0]]
      : [['Any budget',0,0],['Under 1M',0,1000000],['1–3M',1000000,3000000],['3–8M',3000000,8000000],['8M+',8000000,0]];
    botSay(T('What budget are we working with?','ما الميزانية التقريبية؟')+(lead.intent==='Rent'?T(' (per year)',' (سنوياً)'):''));
    options(bands.map(function(b){return {label:(b[0]==='Any budget'?T('Any budget','أي ميزانية'):(curPre()+bandTxt(b[0]))),fn:function(){lead.budget=b[0]==='Any budget'?T('Any','أي'):(curPre()+bandTxt(b[0]));lead.budgetRange=[b[1],b[2]];paintBrief();askArea();}};}));
  }

  function askArea(){
    var comms=communities(lead.intent).slice(0,6);
    botSay(T('Any particular area, or shall I show the best across Dubai?','هل لديك منطقة مفضّلة، أم أعرض الأفضل في دبي؟'));
    var opts=[{label:T('Anywhere in Dubai','أي مكان في دبي'),plain:true,fn:function(){lead.area=null;askBeds();}}];
    comms.forEach(function(c){opts.push({label:commLbl(c),fn:function(){lead.area=c;paintBrief();askBeds();}});});
    options(opts);
  }

  function askBeds(){
    if(lead.intent==='Off-plan'){ showResults(); return; }
    botSay(T('How many bedrooms?','كم عدد غرف النوم؟'));
    options([['any',T('Any','أي')],['1','1'],['2','2'],['3','3'],['4','4+']].map(function(b){
      return {label:b[1],fn:function(){lead.beds=b[0];if(b[0]!=='any')paintBrief();showResults();}};
    }));
  }

  function showResults(){
    var isOff=lead.intent==='Off-plan';
    var matches=isOff?matchProjects():matchListings();
    if(!matches.length){
      botSay(T("I don't have a live match for that right now — but a lot of our best stock never hits the portals. Shall I have an advisor find it off-market?","لا يوجد تطابق مباشر الآن — لكن الكثير من أفضل وحداتنا لا يُنشر. هل يبحث لك مستشار خارج المنصات؟"));
      lead.refs=[]; paintBrief();
      options([{label:T('Yes, find it for me','نعم، ابحثوا لي'),fn:doneHandoff},{label:T('Start over','ابدأ من جديد'),plain:true,fn:reset}]);
      return;
    }
    var show=matches.slice(0,4);
    lead.refs=isOff?[]:show.map(function(l){return l.ref;});
    var line=T('Here'+(show.length>1?' are':"'s")+' '+show.length+' that fit','إليك '+show.length+' وحدة مناسبة','ਇੱਥੇ '+show.length+' ਮਿਲਦੇ ਹਨ')+(lead.area?' '+T('in','في')+' '+commLbl(lead.area):'')+':';
    typing(function(){
      addMsg(line,'bot');
      var box=document.createElement('div'); box.className='kc-cards';
      box.innerHTML=show.map(isOff?projectCard:listingCard).join('');
      if(!isOff&&matches.length>show.length){
        box.innerHTML+='<a class="kc-seeall" href="'+seeAllURL()+'">'+T('See all '+matches.length+' →','عرض كل '+matches.length+' ←','ਸਾਰੇ '+matches.length+' ਵੇਖੋ →')+'</a>';
      }
      stream.appendChild(box); bindCards(box); stream.scrollTop=stream.scrollHeight;
      paintBrief();
      askTimeline();
    });
  }

  function askTimeline(){
    botSay(T('When are you hoping to move or buy?','متى تنوي الانتقال أو الشراء؟'));
    options([
      {label:T('Ready now','جاهز الآن'),fn:function(){lead.timeline=T('Ready now','جاهز الآن');paintBrief();askResidency();}},
      {label:T('1–3 months','خلال ١–٣ أشهر'),fn:function(){lead.timeline='1–3 months';paintBrief();askResidency();}},
      {label:T('Just researching','مجرد اطلاع'),fn:function(){lead.timeline=T('Researching','اطلاع');paintBrief();askResidency();}}
    ]);
  }
  function askResidency(){
    botSay(T('Last thing — are you a UAE resident?','سؤال أخير — هل أنت مقيم في الإمارات؟'));
    options([
      {label:T('UAE resident','مقيم'),fn:function(){lead.residency=T('Resident','مقيم');finish();}},
      {label:T('Non-resident','غير مقيم'),fn:function(){lead.residency=T('Non-resident','غير مقيم');finish();}}
    ]);
  }
  function finish(){
    paintBrief();
    botSay(T("Perfect — I've put your brief together. Tap below and an advisor picks it up on WhatsApp, usually within 15 minutes. Anything else in the meantime?","ممتاز — جهّزت ملخصك. اضغط بالأسفل وسيتابع مستشار عبر واتساب خلال ١٥ دقيقة عادةً. هل من شيء آخر؟"));
    options([
      {label:T('Show similar homes','وحدات مشابهة'),plain:true,fn:function(){lead.beds='any';showResults();}},
      {label:T('Ask about fees','عن الرسوم'),plain:true,fn:function(){faqAnswer('fees');}},
      {label:T('Start over','ابدأ من جديد'),plain:true,fn:reset}
    ]);
  }
  function doneHandoff(){ paintBrief(); botSay(T('Done — tap below and an advisor will reach out on WhatsApp.','تم — اضغط بالأسفل وسيتواصل مستشار عبر واتساب.')); options([{label:T('Start over','ابدأ من جديد'),plain:true,fn:reset}]); }

  /* ---------- FAQ (honest, defers specifics) ---------- */
  var FAQ={
    residency:T("Buying property in Dubai can put you on the path to a renewable investor residence visa, and higher-value purchases can qualify for a long-term Golden Visa. The exact thresholds change from time to time — an advisor will confirm what your budget qualifies for.","قد يفتح شراء عقار في دبي طريقاً لتأشيرة إقامة مستثمر قابلة للتجديد، وقد تؤهّل المشتريات الأعلى قيمة للإقامة الذهبية طويلة الأمد. تتغيّر الحدود أحياناً — وسيؤكد لك المستشار ما يناسب ميزانيتك."),
    fees:T("Beyond the price, budget for the Dubai Land Department transfer fee, an agency fee, and — if you're financing — bank arrangement fees. Your advisor gives you the exact all-in number for a specific unit.","إلى جانب السعر، احسب رسوم نقل الملكية لدى دائرة الأراضي، وعمولة الوساطة، ورسوم ترتيب البنك عند التمويل. سيعطيك المستشار الرقم الإجمالي الدقيق لوحدة محددة."),
    process:T("Short version: shortlist and view, agree a price, sign an MOU with a deposit, then transfer at the Land Department. Off-plan runs on a payment plan through handover. An advisor walks you through each step.","باختصار: تختار وتعاين، تتفق على السعر، توقّع مذكرة تفاهم مع دفعة، ثم تنقل الملكية لدى دائرة الأراضي. أما على الخارطة فبخطة سداد حتى التسليم. يرافقك المستشار في كل خطوة.")
  };
  function askFaq(){
    botSay(T('Happy to help — what would you like to know?','بكل سرور — ماذا تود أن تعرف؟'));
    options([
      {label:T('Do I get residency if I buy?','هل أحصل على إقامة عند الشراء؟'),fn:function(){faqAnswer('residency');}},
      {label:T('What are the fees?','ما هي الرسوم؟'),fn:function(){faqAnswer('fees');}},
      {label:T('How does buying work?','كيف تتم عملية الشراء؟'),fn:function(){faqAnswer('process');}},
      {label:T('Actually, show me homes','أرني الوحدات'),plain:true,fn:askIntent}
    ]);
  }
  function faqAnswer(k){
    botSay(FAQ[k]);
    options([
      {label:T('Another question','سؤال آخر'),plain:true,fn:askFaq},
      {label:T('Show me homes','أرني الوحدات'),fn:askIntent},
      {label:T('Talk to an advisor','تحدث مع مستشار'),fn:function(){window.open('https://wa.me/'+WA,'_blank');}}
    ]);
  }

  function reset(){ lead={intent:null,budget:null,budgetRange:[0,0],area:null,beds:null,timeline:null,residency:null,refs:[]};
    briefEl.className='kc-brief'; briefEl.innerHTML=''; handoffEl.style.display='none'; stream.innerHTML=''; askIntent(); }

  function open(){ panel.classList.add('kc-open'); $('kcLaunch').style.display='none';
    if(!opened){opened=true; askIntent(); track('concierge_open',{});} }
  function close(){ panel.classList.remove('kc-open'); $('kcLaunch').style.display='flex'; }
  $('kcLaunch').onclick=open; $('kcClose').onclick=close;
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('kc-open'))close();});
})();


/* ===================================================================
   SOCIAL + REELS RIBBON — injected just above the <footer> on every page.
   Fully static. Hover-to-play works when you supply short muted .mp4 clips.
   =================================================================== */
(function(){
  if(document.getElementById('krBand'))return;
  var BASE=window.BASE||'';
  if(BASE!=='')return; /* homepage only */
  var AR=(document.documentElement.getAttribute('lang')||'en')==='ar';
  var tt=function(en,ar){return AR?ar:en;};

  var SOCIALS={
    instagram:'https://www.instagram.com/kirpa.properties/',
    tiktok:'https://www.tiktok.com/@manpreet.kirpa',
    linkedin:'https://www.linkedin.com/company/kirpa-properties',
    facebook:'https://www.facebook.com/p/Kirpa-Properties-61576583315557/',
    whatsapp:'https://wa.me/971543673063'
  };

  /* ---- REELS: fill these in ----
     link  = the Instagram reel URL (opens when the tile is clicked)
     poster= thumbnail image path in your repo (shown before hover)   [optional]
     video = short muted .mp4 path in your repo (plays on hover)       [optional]
     Put media in an assets/reels/ folder. A tile works with just a link
     (branded placeholder); add poster for a thumbnail; add video for hover-play. */
  var REELS=[
    {link:SOCIALS.instagram, poster:'', video:''},
    {link:SOCIALS.instagram, poster:'', video:''},
    {link:SOCIALS.instagram, poster:'', video:''},
    {link:SOCIALS.instagram, poster:'', video:''},
    {link:SOCIALS.instagram, poster:'', video:''}
  ];

  var ICON={
    instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>',
    tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 3c.3 2.2 1.8 3.9 4 4.2v2.5c-1.5 0-2.9-.5-4-1.3v6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.6a2.7 2.7 0 1 0 1.9 2.6V3H14z"/></svg>',
    linkedin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.3 2 4.3 5.5V21h-4v-6c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H9z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7c0-.9.2-1.3 1.3-1.3H17V2.2C16.5 2.1 15.4 2 14.4 2 11.8 2 10 3.6 10 6.5V9H7v3.6h3V22h4v-9.4h2.9l.6-3.6H14z"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1 1 12 20zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.2-.4v-.4c0-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6s1.7 2.7 4.2 3.8c1.5.6 2.1.7 2.8.6.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1l-.4-.3z"/></svg>'
  };

  var css=''
  +'.kr-band{background:var(--cream,#FBF6F1);border-top:1px solid var(--sand,#E5DBD0);padding:56px 0 60px}'
  +'.kr-wrap{max-width:1240px;margin:0 auto;padding:0 40px}'
  +'.kr-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:28px}'
  +'.kr-eyebrow{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--coral,#FF6633);display:block;margin-bottom:10px}'
  +'.kr-head h3{font-family:var(--display,serif);font-weight:400;font-size:clamp(23px,3vw,33px);margin:0;line-height:1.12;max-width:16ch}'
  +'.kr-socials{display:flex;gap:11px;align-items:center}'
  +'.kr-socials a{width:42px;height:42px;border-radius:50%;border:1px solid var(--sand,#E5DBD0);display:flex;align-items:center;justify-content:center;color:var(--ink,#171412);background:var(--paper,#fff);transition:all .2s}'
  +'.kr-socials a:hover{background:var(--coral,#FF6633);border-color:var(--coral,#FF6633);color:#fff;transform:translateY(-2px)}'
  +'.kr-socials svg{width:19px;height:19px}'
  +'.kr-reels{display:flex;gap:14px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}'
  +'.kr-reels::-webkit-scrollbar{height:6px}.kr-reels::-webkit-scrollbar-thumb{background:var(--sand,#E5DBD0);border-radius:3px}'
  +'.kr-reel{position:relative;flex:0 0 auto;width:192px;aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#33292E,#7A4A3A);text-decoration:none;scroll-snap-align:start;box-shadow:0 18px 40px -24px rgba(23,20,18,.55);transition:transform .25s}'
  +'.kr-reel:hover{transform:translateY(-4px)}'
  +'.kr-reel img,.kr-reel video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}'
  +'.kr-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.42)}'
  +'.kr-ph svg{width:34px;height:34px}'
  +'.kr-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,13,12,.55),transparent 46%);z-index:1;pointer-events:none}'
  +'.kr-badge{position:absolute;left:12px;bottom:12px;width:34px;height:34px;border-radius:50%;background:rgba(23,20,18,.5);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;z-index:2;pointer-events:none}'
  +'[dir="rtl"] .kr-badge{left:auto;right:12px}'
  +'@media(max-width:600px){.kr-wrap{padding:0 20px}.kr-reel{width:152px}.kr-band{padding:44px 0 48px}}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  function reelHTML(r){
    var media = r.video
      ? '<video muted loop playsinline preload="metadata"'+(r.poster?' poster="'+BASE+r.poster+'"':'')+'><source src="'+BASE+r.video+'" type="video/mp4"></video>'
      : (r.poster ? '<img loading="lazy" src="'+BASE+r.poster+'" alt="Kirpa reel">' : '<div class="kr-ph">'+ICON.instagram+'</div>');
    return '<a class="kr-reel" href="'+r.link+'" target="_blank" rel="noopener">'+media+'<span class="kr-grad"></span><span class="kr-badge">&#9654;</span></a>';
  }

  var band=document.createElement('div');
  band.id='krBand'; band.className='kr-band';
  band.innerHTML=
    '<div class="kr-wrap">'
    +'<div class="kr-head"><div>'
    +'<span class="kr-eyebrow">'+tt('Follow the journey','تابعوا الرحلة')+'</span>'
    +'<h3>'+tt("Dubai's most-followed agency — on every feed","الوكالة الأكثر متابعة في دبي — على كل منصة")+'</h3>'
    +'</div><div class="kr-socials">'
    +'<a href="'+SOCIALS.instagram+'" target="_blank" rel="noopener" aria-label="Instagram">'+ICON.instagram+'</a>'
    +'<a href="'+SOCIALS.tiktok+'" target="_blank" rel="noopener" aria-label="TikTok">'+ICON.tiktok+'</a>'
    +'<a href="'+SOCIALS.linkedin+'" target="_blank" rel="noopener" aria-label="LinkedIn">'+ICON.linkedin+'</a>'
    +'<a href="'+SOCIALS.facebook+'" target="_blank" rel="noopener" aria-label="Facebook">'+ICON.facebook+'</a>'
    +'<a href="'+SOCIALS.whatsapp+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+ICON.whatsapp+'</a>'
    +'</div></div>'
    +'<div class="kr-reels">'+REELS.map(reelHTML).join('')+'</div>'
    +'</div>';

  var footer=document.querySelector('footer');
  if(footer&&footer.parentNode){ footer.parentNode.insertBefore(band,footer); }
  else { document.body.appendChild(band); }

  /* hover-to-play */
  band.querySelectorAll('.kr-reel video').forEach(function(v){
    var tile=v.closest('.kr-reel');
    tile.addEventListener('mouseenter',function(){ var p=v.play(); if(p&&p.catch)p.catch(function(){}); });
    tile.addEventListener('mouseleave',function(){ v.pause(); try{v.currentTime=0;}catch(e){} });
  });
})();
