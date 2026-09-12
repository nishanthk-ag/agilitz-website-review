
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
  window.addEventListener('pageshow',()=>{ show(0); });
})();


// v9 success-story filters
(()=>{
  const root=document.getElementById('story-filters');
  if(!root) return;
  const ind=document.getElementById('filter-industry');
  const svc=document.getElementById('filter-service');
  const plat=document.getElementById('filter-platform');
  const cards=[...document.querySelectorAll('.story-card')];
  const count=document.getElementById('story-count');
  const empty=document.getElementById('story-empty');
  const apply=()=>{
    let shown=0;
    cards.forEach(card=>{
      const services=(card.dataset.service||'').split('|');
      const ok=(!ind.value||card.dataset.industry===ind.value)&&(!svc.value||services.includes(svc.value))&&(!plat.value||card.dataset.platform===plat.value);
      card.hidden=!ok;if(ok)shown++;
    });
    if(count)count.textContent=`${shown} of ${cards.length} stories`;
    if(empty)empty.hidden=shown!==0;
  };
  [ind,svc,plat].forEach(el=>el?.addEventListener('change',apply));
})();


// v11 expert enquiry form interactions
(()=>{
  document.querySelectorAll('[data-expert-form] form').forEach(form=>{
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const wrap=form.closest('[data-expert-form]');
      wrap?.classList.add('is-submitted');
      wrap?.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
})();





// v15.1 locations map — filter markers and footprint regions without external map services
(()=>{
  const root=document.querySelector('[data-location-map]');
  if(!root) return;
  const filters=[...root.querySelectorAll('[data-map-filter]')];
  const items=[...root.querySelectorAll('[data-map-type]')];
  const markers=[...root.querySelectorAll('.geo-marker')];
  const info=root.querySelector('.geo-map-info');
  const copy={
    all:['Global delivery model','Office locations, delivery centres and delivery footprint. Select a filter for a clearer view.'],
    office:['Office locations','London — HQ, Wilmington and Bangalore.'],
    delivery:['Delivery centres','Bangalore and Bhubaneswar service delivery centres.'],
    footprint:['Delivery footprint','North America, Europe, Middle East and India.']
  };
  const apply=(type)=>{
    root.dataset.view=type;
    filters.forEach(btn=>{const active=btn.dataset.mapFilter===type;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
    items.forEach(el=>{
      const show=type==='all'||el.dataset.mapType===type;
      el.classList.toggle('is-hidden',!show);
    });
    if(info){const c=copy[type]||copy.all;info.innerHTML=`<b>${c[0]}</b><span>${c[1]}</span>`;}
  };
  filters.forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.mapFilter||'all')));
  markers.forEach(m=>m.addEventListener('click',()=>{if(info)info.innerHTML=`<b>${m.dataset.location}</b><span>${m.dataset.mapType==='office'?'Office location':'Service delivery centre'}</span>`;}));
  apply('all');
})();
