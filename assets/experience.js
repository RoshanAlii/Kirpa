/* Kirpa Properties — immersive experience layer.
   Motion is progressive, GPU-friendly, and disabled when reduced motion is requested. */
(function(){
  var body=document.body;
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(pointer: fine)').matches;

  /* A brief brand curtain on the first homepage visit only. */
  if(body.classList.contains('home-page')&&!reduce){
    var showIntro=true;
    try{showIntro=sessionStorage.getItem('kirpa-intro')!=='seen';sessionStorage.setItem('kirpa-intro','seen');}catch(e){}
    if(showIntro){
      var intro=document.createElement('div');
      intro.className='kr-intro';
      intro.innerHTML='<div class="kr-intro-mark">✦</div><div class="kr-intro-word">KIRPA</div><span>Dubai · Private Brokerage</span>';
      body.appendChild(intro);
      requestAnimationFrame(function(){intro.classList.add('show');});
      setTimeout(function(){intro.classList.add('leave');},850);
      setTimeout(function(){intro.remove();},1500);
    }
  }

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

  /* Kirpa's star becomes a recognisable wipe between a collection and a residence. */
  var wipe=document.createElement('div');
  wipe.className='kr-star-wipe';
  wipe.setAttribute('aria-hidden','true');
  wipe.innerHTML='<i>✦</i>';
  body.appendChild(wipe);
  document.addEventListener('click',function(e){
    var anchor=e.target.closest&&e.target.closest('a[href*="properties/listing.html"]');
    if(!anchor||reduce||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||anchor.target==='_blank')return;
    var url;
    try{url=new URL(anchor.href,location.href);}catch(err){return;}
    if(url.origin!==location.origin)return;
    e.preventDefault();
    wipe.classList.add('active');
    setTimeout(function(){location.href=url.href;},430);
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

  if(fine&&!reduce){
    /* Restrained custom pointer: only a halo, never a replacement for the system cursor. */
    var halo=document.createElement('div');
    halo.className='kr-pointer-halo';
    halo.setAttribute('aria-hidden','true');
    body.appendChild(halo);
    var px=-80,py=-80,hx=-80,hy=-80;
    addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;halo.classList.add('visible');},{passive:true});
    addEventListener('pointerout',function(e){if(!e.relatedTarget)halo.classList.remove('visible');});
    function follow(){
      hx+=(px-hx)*.16;hy+=(py-hy)*.16;
      halo.style.transform='translate3d('+(hx-18)+'px,'+(hy-18)+'px,0)';
      requestAnimationFrame(follow);
    }
    follow();

    /* Small magnetic response for primary controls. */
    document.addEventListener('pointermove',function(e){
      var target=e.target.closest&&e.target.closest('.btn,.nav-cta,.sbar .go');
      if(!target)return;
      var rect=target.getBoundingClientRect();
      var x=(e.clientX-(rect.left+rect.width/2))*.08;
      var y=(e.clientY-(rect.top+rect.height/2))*.12;
      target.style.setProperty('--mag-x',x+'px');
      target.style.setProperty('--mag-y',y+'px');
    },{passive:true});
    document.addEventListener('pointerout',function(e){
      var target=e.target.closest&&e.target.closest('.btn,.nav-cta,.sbar .go');
      if(target){target.style.removeProperty('--mag-x');target.style.removeProperty('--mag-y');}
    },{passive:true});
  }
})();
