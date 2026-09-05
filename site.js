
document.querySelector('.menu-btn')?.addEventListener('click',()=>{
  document.querySelector('.mobile-nav')?.classList.toggle('open');
});
document.querySelectorAll('a[href$=".html"]').forEach(a=>{
  a.addEventListener('click',()=>{ document.querySelector('.mobile-nav')?.classList.remove('open'); });
});
