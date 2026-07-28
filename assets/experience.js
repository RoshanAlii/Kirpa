/* Kirpa Properties — immersive experience layer.
   Motion is progressive, GPU-friendly, and disabled when reduced motion is requested. */
(function(){
  var body=document.body;
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Native-feeling reading progress and directional navigation. */
  var progress=document.createElement('div');
  progress.className='kr-scroll-progress';
  progress.setAttribute('aria-hidden','true');
  body.appendChild(progress);
  var header=document.getElementById('hdr');
  var lastY=scrollY;
  var ticking=false;
  function onScroll(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(function(){
      var max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      root.style.setProperty('--scroll-progress',Math.min(1,scrollY/max));
      if(header&&scrollY>180){
        header.classList.toggle('nav-away',scrollY>lastY&&scrollY-lastY>3);
      }else if(header){header.classList.remove('nav-away');}
      lastY=scrollY;
      ticking=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  /* A quiet context label lets the navigation say where the visitor is. */
  var nav=document.querySelector('#hdr .nav');
  var navContext;
  if(nav){
    navContext=document.createElement('span');
    navContext.className='nav-context';
    navContext.setAttribute('aria-live','polite');
    var path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/$/,'');
    var contextMap={
      '/buy':'Dubai / Residences for sale',
      '/rent':'Dubai / Residences for rent',
      '/off-plan':'Dubai / Off-plan',
      '/communities':'Dubai / Communities',
      '/sell':'Dubai / Private client desk',
      '/tools':'Dubai / Buyer tools',
      '/team':'Dubai / Advisory team'
    };
    var context='Dubai / Private brokerage';
    Object.keys(contextMap).forEach(function(key){if(path.endsWith(key))context=contextMap[key];});
    if(body.classList.contains('property-detail'))context='Dubai / Residence';
    navContext.textContent=context;
    var links=nav.querySelector('.nav-links');
    nav.insertBefore(navContext,links||nav.lastChild);
    if(body.classList.contains('home-page')&&'IntersectionObserver' in window){
      var landmarks=[
        ['.hero','Dubai / Private brokerage'],
        ['#explore','Dubai / Community intelligence'],
        ['.private-edit','Dubai / Private edit'],
        ['#offplan','Dubai / Off-plan'],
        ['#sell','Dubai / Owner advisory'],
        ['#advisors','Dubai / Advisory team']
      ];
      var contextObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){if(entry.isIntersecting)navContext.textContent=entry.target.dataset.navContext;});
      },{threshold:.28,rootMargin:'-18% 0px -58% 0px'});
      landmarks.forEach(function(item){
        var section=document.querySelector(item[0]);
        if(section){section.dataset.navContext=item[1];contextObserver.observe(section);}
      });
    }
    if(body.classList.contains('property-detail')){
      var crumb=document.getElementById('crumbCommunity');
      if(crumb){
        var updateDetailContext=function(){
          if(crumb.textContent&&crumb.textContent!=='Community')navContext.textContent='Dubai / '+crumb.textContent;
        };
        new MutationObserver(updateDetailContext).observe(crumb,{childList:true,characterData:true,subtree:true});
        updateDetailContext();
      }
    }
  }

  /* Motion UI-inspired route handoff: a fast edge sweep followed by the
     browser's native cross-document View Transition when supported. */
  var route=document.createElement('div');
  route.className='kr-route-transition';
  route.setAttribute('aria-hidden','true');
  route.innerHTML='<i></i><span></span>';
  body.appendChild(route);
  var routePending=false;
  document.addEventListener('click',function(e){
    var anchor=e.target.closest&&e.target.closest('a[href]');
    if(!anchor||reduce||routePending||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||anchor.target==='_blank'||anchor.hasAttribute('download'))return;
    var href=anchor.getAttribute('href')||'';
    if(!href||href.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/i.test(href))return;
    var url;
    try{url=new URL(anchor.href,location.href);}catch(err){return;}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
    e.preventDefault();
    routePending=true;
    body.classList.add('route-leaving');
    setTimeout(function(){location.href=url.href;},110);
  });
  addEventListener('pageshow',function(){
    routePending=false;
    body.classList.remove('route-leaving');
  });

  /* Command-K opens the private concierge from anywhere on the site. */
  var command=document.getElementById('kcLaunch');
  if(command){
    command.setAttribute('aria-keyshortcuts','Meta+K Control+K');
    command.setAttribute('title','Ask Kirpa · Command K');
    document.addEventListener('keydown',function(e){
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){
        e.preventDefault();
        command.click();
      }
    });
  }

  /* Hero segmented control remains synced with the real search value. */
  var segments=document.getElementById('heroSegments');
  var intent=document.getElementById('intent');
  if(segments&&intent){
    var buttons=[].slice.call(segments.querySelectorAll('button'));
    function choose(value){
      var index=0;
      buttons.forEach(function(button,i){
        var on=button.dataset.intent===value;
        if(on)index=i;
        button.classList.toggle('on',on);
        button.setAttribute('aria-pressed',on?'true':'false');
      });
      segments.style.setProperty('--segment-index',index);
      intent.value=value;
    }
    buttons.forEach(function(button){button.addEventListener('click',function(){choose(button.dataset.intent);});});
    intent.addEventListener('change',function(){choose(intent.value);});
    choose(intent.value);
  }

  var heroInventory=document.getElementById('heroInventory');
  if(heroInventory&&typeof LISTINGS!=='undefined')heroInventory.textContent=LISTINGS.length;

  /* Enrich section choreography without changing document semantics. */
  var motionNodes=document.querySelectorAll('.sec-head h2,.atlas-panel h3,.sell h2,.lp-title-row h1,.page-head h1,.insight-grid article');
  motionNodes.forEach(function(node){node.classList.add('motion-node');});
  if(!reduce&&'IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('motion-in');observer.unobserve(entry.target);}
      });
    },{threshold:.18,rootMargin:'0px 0px -6% 0px'});
    motionNodes.forEach(function(node){observer.observe(node);});
  }else{
    motionNodes.forEach(function(node){node.classList.add('motion-in');});
  }

  /* Continuous decorative motion only runs while its section is visible. */
  var ambientNodes=document.querySelectorAll('.kr-ticker,.adv-marquee');
  if(!reduce&&'IntersectionObserver' in window){
    var ambientObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){entry.target.classList.toggle('is-motion-active',entry.isIntersecting);});
    },{rootMargin:'120px 0px'});
    ambientNodes.forEach(function(node){ambientObserver.observe(node);});
  }
})();
