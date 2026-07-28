/* Kirpa Properties — premium interaction layer.
   Progressive enhancement only: the site remains usable without this file. */
(function(){
  var body=document.body;

  requestAnimationFrame(function(){ body.classList.add('is-ready'); });

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
    var count=atlas.querySelector('[data-atlas-count]');
    var matches=atlas.querySelector('[data-atlas-matches]');
    var link=atlas.querySelector('[data-atlas-link]');
    var points=[].slice.call(atlas.querySelectorAll('[data-community]'));
    var layers=[].slice.call(atlas.querySelectorAll('[data-atlas-layer]'));
    var activeCommunity='downtown';
    var activeLayer='overview';
    function communityListings(c){
      if(typeof LISTINGS==='undefined')return [];
      return LISTINGS.filter(function(l){return l.community===c.name;})
        .sort(function(a,b){return b.aed-a.aed;});
    }
    function paintMatches(c){
      var pool=communityListings(c);
      if(count)count.textContent=pool.length;
      if(!matches)return;
      if(!pool.length){
        matches.innerHTML='<p>No public inventory is recorded here. Ask Kirpa for private or upcoming availability.</p>';
        return;
      }
      matches.innerHTML=pool.slice(0,3).map(function(l){
        var href=(window.BASE||'')+'properties/listing.html?ref='+encodeURIComponent(l.ref);
        return '<a href="'+href+'"><span>'+fmt(l.aed)+l.per+'</span><b>'+l.title+'</b><small>'+l.beds+' bed · '+l.sqft.toLocaleString()+' sq ft <i>↗</i></small></a>';
      }).join('');
    }
    function setCommunity(slug,focus){
      var c=COMMUNITIES[slug]; if(!c)return;
      activeCommunity=slug;
      points.forEach(function(p){
        var on=p.getAttribute('data-community')===slug;
        p.classList.toggle('on',on);
        p.setAttribute('aria-pressed',on?'true':'false');
      });
      name.textContent=c.name;
      summary.textContent=(c.blurb&&c.blurb[0])||'';
      stats.innerHTML=(c.stats||[]).slice(0,4).map(function(s,i){return '<div><b>0'+(i+1)+'</b><span>'+s+'</span></div>';}).join('');
      paintMatches(c);
      link.href='communities/guide.html?c='+slug;
      if(focus)name.focus({preventScroll:true});
    }
    function setLayer(layer){
      activeLayer=layer;
      atlas.classList.remove('layer-overview','layer-residences','layer-lifestyle');
      atlas.classList.add('layer-'+layer);
      layers.forEach(function(button){
        var on=button.getAttribute('data-atlas-layer')===layer;
        button.classList.toggle('on',on);
        button.setAttribute('aria-pressed',on?'true':'false');
      });
      setCommunity(activeCommunity,false);
    }
    points.forEach(function(p){
      p.addEventListener('click',function(){setCommunity(p.getAttribute('data-community'),false);});
    });
    layers.forEach(function(button){
      button.addEventListener('click',function(){setLayer(button.getAttribute('data-atlas-layer'));});
    });
    setCommunity('downtown',false);
    setLayer(activeLayer);
  }

  var social=document.querySelector('.kr-signal');
  if(social) social.setAttribute('aria-label','Kirpa social content');
})();
