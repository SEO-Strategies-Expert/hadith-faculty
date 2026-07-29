const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];

const menuToggle=qs('.menu-toggle');
const navLinks=qs('.nav-links');
menuToggle?.addEventListener('click',()=>{
  const open=navLinks?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(Boolean(open)));
});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}
}),{threshold:.1});
qsa('.reveal').forEach(el=>observer.observe(el));

const feesModal=qs('#feesModal');
function openFees(){feesModal?.classList.add('show');feesModal?.setAttribute('aria-hidden','false')}
function closeFees(){feesModal?.classList.remove('show');feesModal?.setAttribute('aria-hidden','true')}
qsa('.fees-trigger').forEach(btn=>btn.addEventListener('click',openFees));
qsa('.fees-close,.fees-close-secondary').forEach(btn=>btn.addEventListener('click',closeFees));
feesModal?.addEventListener('click',e=>{if(e.target===feesModal)closeFees()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFees()});
qsa('[data-fee-choice]').forEach(btn=>btn.addEventListener('click',()=>{
  localStorage.setItem('hadithCollegeFeeChoice',btn.dataset.feeChoice||'');
  location.href='admissions.html#fee-system';
}));

const applicationForm=qs('#applicationForm');
applicationForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const msg=qs('#formMessage');
  if(msg){msg.hidden=false;msg.textContent='تم حفظ نموذج العرض التجريبي. عند ربط الموقع بالنظام الخلفي سيُرسل الطلب إلى قسم القبول.'}
});
qs('.clear-fee-choice')?.addEventListener('click',()=>qsa('input[name="fee-option"]').forEach(i=>i.checked=false));

qsa('[data-count]').forEach(el=>{
  const target=Number(el.dataset.count||0);let n=0;
  const timer=setInterval(()=>{n++;el.textContent=String(n);if(n>=target)clearInterval(timer)},160);
});

window.HADITH_RESEARCH_DEFAULTS=[
  {id:'sunnah-one',name:'الباحث الحديثي',url:'https://sunnah.one/',category:'بحث حديثي',description:'محرك بحث حديثي سريع للوصول إلى نصوص الأحاديث ومصادرها ونتائجها البحثية.',icon:'بح',tags:['بحث','تخريج'],active:true,featured:true},
  {id:'dorar',name:'الموسوعة الحديثية — الدرر السنية',url:'https://dorar.net/hadith',category:'موسوعات',description:'بحث متقدم في الأحاديث وأحكام المحدثين والشروح والموضوعات والتراجم.',icon:'در',tags:['أحكام','شروح'],active:true,featured:true},
  {id:'shamela',name:'المكتبة الشاملة',url:'https://shamela.ws/',category:'مكتبات',description:'مكتبة نصية واسعة تضم كتب الحديث وشروحه والرجال والعلل والمصطلح وسائر علوم التراث.',icon:'شم',tags:['كتب','نصوص'],active:true,featured:true},
  {id:'hadithportal',name:'جامع السنة وشروحها',url:'https://hadithportal.com/',category:'موسوعات',description:'بوابة بحثية تجمع نصوص السنة وشروحها وخدمات الفهرسة والبحث الموضوعي.',icon:'جس',tags:['السنة','شروح'],active:true,featured:true},
  {id:'hadeethenc',name:'موسوعة الأحاديث النبوية',url:'https://hadeethenc.com/ar/home',category:'متعدد اللغات',description:'أحاديث مختارة موثقة مع ترجمات وشروح بعدة لغات، مناسبة للباحث والتعليم والدعوة.',icon:'حن',tags:['ترجمة','شروح'],active:true,featured:false},
  {id:'waqfeya',name:'المكتبة الوقفية',url:'https://waqfeya.net/',category:'مكتبات',description:'كتب مصورة وفهارس منظمة، وتضم أقسامًا واسعة لكتب الحديث والمصطلح والجرح والتعديل.',icon:'وق',tags:['PDF','مخطوطات'],active:true,featured:false},
  {id:'sunnah-com',name:'Sunnah.com',url:'https://sunnah.com/',category:'متعدد اللغات',description:'واجهة إنجليزية مشهورة للبحث والتصفح في دواوين السنة مع النص العربي والترجمة.',icon:'EN',tags:['English','Collections'],active:true,featured:false}
];

function researchSites(){
  try{
    const saved=JSON.parse(localStorage.getItem('hadithResearchSites')||'null');
    if(Array.isArray(saved)&&saved.length)return saved;
  }catch(e){}
  return window.HADITH_RESEARCH_DEFAULTS;
}
window.getHadithResearchSites=researchSites;

function renderResearchGrid(){
  const grid=qs('#researchSitesGrid');
  if(!grid)return;
  const search=qs('#researchSitesSearch');
  const filters=qsa('.research-filter');
  let current='الكل';
  const render=()=>{
    const query=(search?.value||'').trim().toLowerCase();
    const sites=researchSites().filter(s=>s.active!==false).filter(s=>current==='الكل'||s.category===current).filter(s=>{
      const hay=[s.name,s.description,s.category,...(s.tags||[])].join(' ').toLowerCase();
      return !query||hay.includes(query);
    });
    grid.innerHTML=sites.map(s=>{
      const domain=s.url?(()=>{try{return new URL(s.url).hostname.replace(/^www\./,'')}catch(e){return ''}})():'';
      return `<article class="research-card reveal visible" data-category="${escapeHtml(s.category||'عام')}">
        <div class="research-card-head"><span class="research-card-icon">${escapeHtml(s.icon||'م')}</span><div><h3>${escapeHtml(s.name)}</h3><div class="research-card-domain">${escapeHtml(domain)}</div></div></div>
        <p>${escapeHtml(s.description||'')}</p>
        <div class="research-tags">${(s.tags||[]).map(t=>`<span class="research-tag">${escapeHtml(t)}</span>`).join('')}</div>
        <div class="research-card-actions">${s.url?`<a class="external-link" href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer">زيارة الموقع</a>`:'<span class="disabled-link">الرابط يضاف من لوحة الإدارة</span>'}<span class="verified-badge">رابط بحثي خارجي</span></div>
      </article>`
    }).join('');
    const empty=qs('#researchNoResults');if(empty)empty.style.display=sites.length?'none':'block';
    const count=qs('#researchCount');if(count)count.textContent=String(sites.length);
  };
  search?.addEventListener('input',render);
  filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');current=btn.dataset.filter||'الكل';render()}));
  render();
}
function renderResearchPreview(){
  const box=qs('#researchPreview');if(!box)return;
  const sites=researchSites().filter(s=>s.active!==false).sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured))).slice(0,4);
  box.innerHTML=sites.map(s=>`<a class="research-mini-card" href="hadith-research-sites.html"><span class="research-card-icon">${escapeHtml(s.icon||'م')}</span><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.description||'')}</p></a>`).join('');
}
function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function escapeAttr(v=''){return escapeHtml(v)}
renderResearchGrid();renderResearchPreview();
