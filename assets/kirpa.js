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
function cardHTML(l){
  const on=favs.includes(l.ref);
  const url=window.BASE+'properties/listing.html?ref='+l.ref;
  return '<article class="res">'
    +'<a href="'+url+'"><div class="photo '+l.skies[0]+'">'+phImg(l.imgs&&l.imgs[0],l.title)+'<span class="credit">'+l.ref+'</span></div></a>'
    +'<button class="fav '+(on?'on':'')+'" data-ref="'+l.ref+'" aria-label="Save '+l.ref+'">'+(on?'♥':'♡')+'</button>'
    +'<div class="res-pad">'
    +'<span class="ref">'+l.ref+' · '+(l.status==='rent'?'For Rent':'For Sale')+'</span>'
    +'<h3><a href="'+url+'">'+l.title+'</a></h3>'
    +'<div class="place">'+(l.building?l.building+', ':'')+l.community+'</div>'
    +'<div class="price">'+fmt(l.aed)+l.per+' '+fxEcho(l.aed)+'</div>'
    +'<div class="specs">'+l.beds+' bed · '+l.sqft.toLocaleString()+' sqft · '+l.extra+'</div>'
    +'<div class="foot"><span class="permit">Trakheesi '+l.permit+'</span>'
    +'<button class="link book" data-ref="'+l.ref+'">Book a viewing</button></div>'
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
    list.innerHTML='<div class="drawer-empty">Nothing saved yet. Tap the heart on any residence — your shortlist stays on this device, no account needed.</div>';
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
+'<div class="drawer-head"><b>Your shortlist</b><button id="closeDrawer" aria-label="Close">✕</button></div>'
+'<div class="drawer-list" id="drawerList"></div>'
+'<div class="drawer-cta"><a class="btn coral" id="sendShortlist" href="#" target="_blank" rel="noopener">Send my shortlist to an advisor</a>'
+'<div class="note">Opens WhatsApp with your saved references attached — no account, no forms. Saved on this device only.</div></div>'
+'</aside>'
+'<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Book an appointment">'
+'<div class="sheet-box">'
+'<div class="sheet-head"><b id="sheetTitle">Book a viewing</b><button id="closeSheet" aria-label="Close">✕</button></div>'
+'<div class="sheet-sub" id="sheetSub"></div>'
+'<div class="sheet-lbl">Preferred day</div>'
+'<div class="sheet-chips" id="dayChips"><button class="schip on">Today</button><button class="schip">Tomorrow</button><button class="schip">This weekend</button><button class="schip">Next week</button></div>'
+'<div class="sheet-lbl">Preferred time</div>'
+'<div class="sheet-chips" id="timeChips"><button class="schip on">Morning</button><button class="schip">Afternoon</button><button class="schip">Evening</button></div>'
+'<a class="btn coral" id="sheetConfirm" href="#" target="_blank" rel="noopener">Confirm on WhatsApp</a>'
+'<div class="sheet-note">This sends your request with the reference and preferred slot attached — an advisor confirms the exact time by reply.</div>'
+'</div></div>');

/* ---------- drawer open/close ---------- */
function closeDrawer(){$('#drawer').classList.remove('open');$('#scrim').classList.remove('on')}
function openDrawerFn(){$('#drawer').classList.add('open');$('#scrim').classList.add('on')}
if($('#openDrawer'))$('#openDrawer').onclick=openDrawerFn;
if($('#mbarFav'))$('#mbarFav').onclick=openDrawerFn;
$('#closeDrawer').onclick=closeDrawer;
$('#scrim').onclick=closeDrawer;

/* ---------- currency ---------- */
if($('#curBtn')){
  $('#curBtn').textContent=cur+' ▾';
  $('#curBtn').onclick=()=>{
    cur=CURS[(CURS.indexOf(cur)+1)%CURS.length];
    localStorage.setItem('kirpa-cur',cur);
    $('#curBtn').textContent=cur+' ▾';
    if(window.onCurrencyChanged)window.onCurrencyChanged();
  };
}

/* ---------- booking sheet ---------- */
let sheetCtx={kind:'viewing',ref:'',title:''};
function openSheet(kind,ref,title){
  sheetCtx={kind:kind,ref:ref,title:title};
  const heads={viewing:'Book a viewing',suite:'Book a sales-suite visit',valuation:'Book a valuation visit',call:'Book a call'};
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
}
document.querySelectorAll('.sheet-chips').forEach(g=>g.addEventListener('click',e=>{
  if(!e.target.classList.contains('schip'))return;
  g.querySelectorAll('.schip').forEach(x=>x.classList.remove('on'));
  e.target.classList.add('on');updateSheetLink();
}));
$('#closeSheet').onclick=()=>$('#sheet').classList.remove('open');
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')$('#sheet').classList.remove('open')});

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
