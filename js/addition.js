function renderAddition(){
  setLast('addition');
  const scenarios=[
    {id:'pp',label:'Positif + Positif',a:3,b:2,answer:5},
    {id:'pn',label:'Positif + Negatif',a:4,b:-3,answer:1},
    {id:'nn',label:'Negatif + Negatif',a:-2,b:-3,answer:-5}
  ];
  app.innerHTML=lessonShell('Penjumlahan Bilangan Bulat','Pilih jenis penjumlahan, susun kartunya, lalu temukan sendiri hasilnya.',`
    <div class="section">
      <p class="eyebrow">Laboratorium Kartu</p>
      <h2>Pilih yang ingin kamu eksplorasi</h2>
      <div class="scenario-grid">${scenarios.map(s=>`<button class="scenario-btn" data-s="${s.id}">${s.label}</button>`).join('')}</div>
      <p class="small">Biru = +1 &nbsp; • &nbsp; Merah = −1</p>
      <div id="addLab" class="lab-area"><p class="feedback">Pilih salah satu jenis penjumlahan di atas.</p></div>
      <div id="addDone" class="explored-status">Sudah dieksplorasi: 0 dari 3</div>
    </div>`);
  const done=new Set();
  document.querySelectorAll('.scenario-btn').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.scenario-btn').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    const s=scenarios.find(x=>x.id===btn.dataset.s); renderAddScenario(s);
  });
  function renderAddScenario(s){
    const p1=s.a>0?s.a:0,n1=s.a<0?-s.a:0,p2=s.b>0?s.b:0,n2=s.b<0?-s.b:0;
    addLab.innerHTML=`<h3>${fmt(s.a)} + (${fmt(s.b)})</h3>
      <p>Kelompok pertama</p><div class="cards group-box">${cards(p1,n1)}</div>
      <p>Tambahkan kelompok kedua</p><div class="cards group-box">${cards(p2,n2)}</div>
      <button id="combineAdd" class="btn secondary">Gabungkan kartu</button>
      <div id="combinedAdd"></div>`;
    combineAdd.onclick=()=>{
      const pos=p1+p2,neg=n1+n2;
      combinedAdd.innerHTML=`<p><b>Semua kartu sudah digabung.</b></p><div id="addCards" class="cards result-box">${cards(pos,neg)}</div><div id="addStep"></div>`;
      if(pos&&neg){
        addStep.innerHTML='<p>Ketuk satu kartu biru dan satu kartu merah untuk membuat pasangan nol.</p><p id="addPairInfo" class="feedback">Pasangan nol: 0</p>';
        let pairs=0,need=Math.min(pos,neg);
        pairGame(addCards,()=>{pairs++;addPairInfo.textContent=`Pasangan nol: ${pairs}`;if(pairs===need)showAnswer(s)});
      }else showAnswer(s);
    };
  }
  function showAnswer(s){
    const options=[s.answer,s.answer+1,s.answer-1,-s.answer].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
    while(options.length<4) options.push(s.answer+options.length+2);
    addStep.innerHTML+=`<p>Kartu apa yang tersisa?</p>${choices(options.sort(()=>0.5-Math.random()),s.answer)}`;
    wireChoices(s.answer,()=>{
      done.add(s.id); document.getElementById('addDone').textContent=`Sudah dieksplorasi: ${done.size} dari 3`;
      document.querySelector(`[data-s="${s.id}"]`).classList.add('completed');
      if(done.size===3){complete('addition');document.getElementById('nextArea').innerHTML='<button class="btn" onclick="go(\'subtraction\')">Lanjut ke Pengurangan →</button>'}
    });
  }
}
function fmt(n){return n>0?'+'+n:String(n).replace('-','−')}
