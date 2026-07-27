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
