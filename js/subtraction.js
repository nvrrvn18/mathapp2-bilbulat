function renderSubtraction(){
  setLast('subtraction');
  const scenarios=[
    {id:'pp',label:'Positif − Positif',a:5,b:2,answer:3},
    {id:'pn',label:'Positif − Negatif',a:2,b:-3,answer:5},
    {id:'nn',label:'Negatif − Negatif',a:-2,b:-3,answer:1}
  ];
  app.innerHTML=lessonShell('Pengurangan Bilangan Bulat','Pilih kasus, siapkan kartu nilai awal, lalu ambil kartu yang dikurangkan.',`
    <div class="section"><p class="eyebrow">Laboratorium Kartu</p><h2>Eksplorasi tiga jenis pengurangan</h2>
    <div class="scenario-grid">${scenarios.map(s=>`<button class="scenario-btn" data-s="${s.id}">${s.label}</button>`).join('')}</div>
    <p class="small">Biru = +1 &nbsp; • &nbsp; Merah = −1. Jika kartu yang akan diambil belum cukup, tambahkan pasangan nol.</p>
    <div id="subLab" class="lab-area"><p class="feedback">Pilih salah satu jenis pengurangan di atas.</p></div>
    <div id="subDone" class="explored-status">Sudah dieksplorasi: 0 dari 3</div></div>`);
  const done=new Set();
  document.querySelectorAll('.scenario-btn').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.scenario-btn').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');
    renderSubScenario(scenarios.find(x=>x.id===btn.dataset.s));
  });
  function renderSubScenario(s){
    let pairs=0;
    subLab.innerHTML=`<h3>${fmt(s.a)} − (${fmt(s.b)})</h3><p>Nilai awal:</p><div id="subCards" class="cards result-box">${cards(Math.max(s.a,0),Math.max(-s.a,0))}</div>
      <p>Ambil <b>${Math.abs(s.b)} kartu ${s.b>0?'positif (biru)':'negatif (merah)'}</b>.</p>
      <div class="lab-controls"><button id="zeroBtn" class="btn secondary">+ Tambahkan pasangan nol</button><button id="takeBtn" class="btn">Ambil kartunya</button></div>
      <div id="subFeedback"></div>`;
    zeroBtn.onclick=()=>{pairs++;subCards.insertAdjacentHTML('beforeend',card(1,'zp'+pairs)+card(-1,'zn'+pairs));subFeedback.innerHTML='<div class="feedback">+1 dan −1 ditambahkan bersama. Nilai awal tetap sama karena pasangan ini bernilai 0.</div>'};
    takeBtn.onclick=()=>{
      const cls=s.b>0?'.pos':'.neg',available=[...subCards.querySelectorAll(cls)].filter(c=>!c.classList.contains('paired'));
      if(available.length<Math.abs(s.b)){subFeedback.innerHTML='<div class="feedback">Belum cukup kartu untuk diambil. Tambahkan pasangan nol terlebih dahulu.</div>';return}
      available.slice(0,Math.abs(s.b)).forEach(c=>c.classList.add('paired'));
      const remaining=[...subCards.querySelectorAll('.int-card')].filter(c=>!c.classList.contains('paired'));
      const value=remaining.reduce((t,c)=>t+(+c.dataset.v),0);
      const opts=[s.answer,s.answer+1,s.answer-1,-s.answer].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);while(opts.length<4)opts.push(s.answer+opts.length+2);
      subFeedback.innerHTML=`<div class="feedback">Kartu yang dikurangkan sudah diambil. Sekarang hitung nilai kartu yang tersisa.</div><p>Pilih hasilnya:</p>${choices(opts.sort(()=>0.5-Math.random()),s.answer)}`;
      wireChoices(s.answer,()=>{done.add(s.id);subDone.textContent=`Sudah dieksplorasi: ${done.size} dari 3`;document.querySelector(`[data-s="${s.id}"]`).classList.add('completed');if(done.size===3){complete('subtraction');document.getElementById('nextArea').innerHTML='<button class="btn" onclick="go(\'multiplication\')">Lanjut ke Perkalian →</button>'}});
    };
  }
}
