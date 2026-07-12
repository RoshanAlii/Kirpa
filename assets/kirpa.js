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
  return c==='AED'?('AED '+aed.toLocaleString()):(sym+n);
}
function fxEcho(aed){
  return cur==='AED'?('<span class="fx">(≈ '+fmt(aed,'USD')+')</span>'):('<span class="fx">('+fmt(aed,'AED')+')</span>');
}

/* ---------- card component (used by home + similar + indexes) ---------- */
function phImg(src,alt){return src?'<img class="ph-img" loading="lazy" src="'+src+'" alt="'+(alt||'')+'" onerror="this.remove()">':''}
function L(l,f){return (window.__lang==='ar'&&l[f+'_ar'])?l[f+'_ar']:l[f];}
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
    +'<div class="specs">'+l.beds+' '+t('label.bed','bed')+' · '+l.sqft.toLocaleString()+' '+t('label.sqft','sqft')+' · '+extra+'</div>'
    +'<div class="foot"><span class="permit">'+t('permit.for','Trakheesi')+' '+l.permit+'</span>'
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
  +'<div class="menu-foot"><button class="switch lang" style="background:none;border:1px solid #3a352f;border-radius:999px;padding:8px 16px;color:var(--cream)">EN / العربية</button><span>ORN 49046 · Dubai</span></div>'
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
  if(lang==='ar' && typeof I18N!=='undefined' && I18N.ar){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const v=I18N.ar[el.getAttribute('data-i18n')];
      if(v)el.textContent=v;
      const ph=el.getAttribute('data-i18n-ph');
      if(ph&&I18N.ar[ph])el.setAttribute('placeholder',I18N.ar[ph]);
    });
    document.querySelectorAll('[data-i18n-append]').forEach(el=>{
      const v=I18N.ar[el.getAttribute('data-i18n-append')];
      if(v)el.textContent='♡ '+v;
    });
  }
  const ll=document.querySelector('#langLabel');if(ll)ll.textContent=(lang==='ar'?'AR':'EN');
}
const LANGS=[['en','English'],['ar','العربية']];
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
document.querySelectorAll('.menu .switch.lang').forEach(b=>b.onclick=()=>setLang(lang==='ar'?'en':'ar'));
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
