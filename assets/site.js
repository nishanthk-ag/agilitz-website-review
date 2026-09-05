
document.querySelector('.menu-btn')?.addEventListener('click',()=>{
  document.querySelector('.mobile-nav')?.classList.toggle('open');
});
document.querySelectorAll('a[href$=".html"]').forEach(a=>{
  a.addEventListener('click',()=>{ document.querySelector('.mobile-nav')?.classList.remove('open'); });
});

// v8 homepage capability carousel
(()=>{
  const carousel=document.querySelector('[data-carousel]');
  if(!carousel) return;
  const slides=[...carousel.querySelectorAll('.carousel-slide')];
  const dots=[...carousel.querySelectorAll('.carousel-dot')];
  const prev=carousel.querySelector('.carousel-prev');
  const next=carousel.querySelector('.carousel-next');
  let current=0;
  let timer=null;
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const show=(index)=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===current));
    dots.forEach((dot,i)=>{
      const active=i===current;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-selected',String(active));
    });
  };
  const stop=()=>{ if(timer){clearInterval(timer);timer=null;} };
  const start=()=>{ if(reduce||timer) return; timer=setInterval(()=>show(current+1),6500); };

  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);stop();start();}));
  prev?.addEventListener('click',()=>{show(current-1);stop();start();});
  next?.addEventListener('click',()=>{show(current+1);stop();start();});
  carousel.addEventListener('mouseenter',stop);
  carousel.addEventListener('mouseleave',start);
  carousel.addEventListener('focusin',stop);
  carousel.addEventListener('focusout',start);
  carousel.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}
    if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}
  });
  let touchX=null;
  carousel.addEventListener('touchstart',(e)=>{touchX=e.touches?.[0]?.clientX ?? null;},{passive:true});
  carousel.addEventListener('touchend',(e)=>{
    if(touchX===null) return;
    const end=e.changedTouches?.[0]?.clientX ?? touchX;
    const diff=end-touchX;
    if(Math.abs(diff)>45) show(current+(diff<0?1:-1));
    touchX=null;
  },{passive:true});
  show(0);
  start();
})();
