/* Kirpa Properties — premium interaction layer.
   Progressive enhancement only: the site remains usable without this file. */
(function(){
  var root=document.documentElement;
  var body=document.body;

  requestAnimationFrame(function(){ body.classList.add('is-ready'); });

  if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.addEventListener('pointermove',function(e){
      root.style.setProperty('--pointer-x',Math.round(e.clientX)+'px');
      root.style.setProperty('--pointer-y',Math.round(e.clientY)+'px');
    },{passive:true});
  }

  var inventory=document.getElementById('inventoryCount');
  if(inventory && typeof LISTINGS!=='undefined'){
    inventory.textContent=LISTINGS.length;
  }

  var menu=document.getElementById('menu');
  var burger=document.getElementById('burger');
  var closeMenu=document.getElementById('closeMenu');
  function menuState(open){
    if(!menu)return;
    menu.classList.toggle('open',open);
    body.classList.toggle('menu-open',open);
    if(burger)burger.setAttribute('aria-expanded',open?'true':'false');
  }
  if(burger){
    burger.setAttribute('aria-expanded','false');
    burger.addEventListener('click',function(){menuState(true);});
  }
  if(closeMenu)closeMenu.addEventListener('click',function(){menuState(false);});
  if(menu)menu.querySelectorAll('nav a').forEach(function(a){
    a.addEventListener('click',function(){menuState(false);});
  });

  var menuCurrency=document.getElementById('menuCurrency');
  if(menuCurrency && typeof CURS!=='undefined'){
    menuCurrency.addEventListener('click',function(){
      var active=localStorage.getItem('kirpa-cur')||'AED';
      var next=CURS[(CURS.indexOf(active)+1)%CURS.length];
      localStorage.setItem('kirpa-cur',next);
      location.reload();
    });
  }

  var atlas=document.querySelector('.dubai-atlas');
  if(atlas && typeof COMMUNITIES!=='undefined'){
    var name=atlas.querySelector('[data-atlas-name]');
    var summary=atlas.querySelector('[data-atlas-summary]');
    var stats=atlas.querySelector('[data-atlas-stats]');
    var link=atlas.querySelector('[data-atlas-link]');
    var points=[].slice.call(atlas.querySelectorAll('[data-community]'));
    function setCommunity(slug,focus){
      var c=COMMUNITIES[slug]; if(!c)return;
      points.forEach(function(p){
        var on=p.getAttribute('data-community')===slug;
        p.classList.toggle('on',on);
        p.setAttribute('aria-pressed',on?'true':'false');
      });
      name.textContent=c.name;
      summary.textContent=(c.blurb&&c.blurb[0])||'';
      stats.innerHTML=(c.stats||[]).slice(0,4).map(function(s,i){return '<div><b>0'+(i+1)+'</b><span>'+s+'</span></div>';}).join('');
      link.href='communities/guide.html?c='+slug;
      if(focus)name.focus({preventScroll:true});
    }
    points.forEach(function(p){
      p.addEventListener('click',function(){setCommunity(p.getAttribute('data-community'),false);});
    });
    setCommunity('downtown',false);
  }

  document.addEventListener('pointermove',function(e){
    var card=e.target.closest&&e.target.closest('.res');
    if(!card)return;
    var r=card.getBoundingClientRect();
    card.style.setProperty('--card-x',Math.round(e.clientX-r.left)+'px');
    card.style.setProperty('--card-y',Math.round(e.clientY-r.top)+'px');
  },{passive:true});

  var social=document.querySelector('.kr-signal');
  if(social) social.setAttribute('aria-label','Kirpa social content');
})();
