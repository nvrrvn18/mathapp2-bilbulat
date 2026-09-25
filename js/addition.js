function renderAddition(){
  setLast('addition');
  const scenarios=[
    {id:'pp',label:'Positif + Positif',a:3,b:2,answer:5,pic:'⭐',story:'Raka memiliki 3 bintang, lalu mendapat 2 bintang lagi.'},
    {id:'pn',label:'Positif + Negatif',a:4,b:-3,answer:1,pic:'🎮',story:'Skor permainan naik 4 poin, lalu turun 3 poin.'},
    {id:'nn',label:'Negatif + Negatif',a:-2,b:-3,answer:-5,pic:'🌡️',story:'Suhu turun 2°C, lalu turun lagi 3°C.'}
  ];

  app.innerHTML=lessonShell('Penjumlahan Bilangan Bulat','Gabungkan dua kelompok kartu. Jika tanda berbeda, bentuk pasangan nol lalu amati kartu yang tersisa.',`<div class="section pictorial-head"><p class="eyebrow">Eksplorasi Kartu Bilangan</p><h2>Pilih jenis penjumlahan</h2><p class="section-intro">Selesaikan ketiga eksplorasi. Kartu tetap disusun vertikal agar pasangan positif dan negatif mudah diamati.</p><div class="scenario-grid">${scenarios.map(s=>`<button class="scenario-btn" data-s="${s.id}"><span class="scenario-pic">${s.pic}</span><span>${s.label}</span></button>`).join('')}</div><div id="addLab" class="lab-area"><div class="empty-lab"><span>👆</span><p>Pilih salah satu jenis penjumlahan di atas.</p></div></div><div id="addDone" class="explored-status">Sudah dieksplorasi: 0 dari 3</div></div>`);

  const done=new Set();
  document.querySelectorAll('.scenario-btn').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.scenario-btn').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    renderScenario(scenarios.find(x=>x.id===btn.dataset.s));
  });

  function stackFor(value,prefix){const sign=value>=0?1:-1;return Array.from({length:Math.abs(value)},(_,i)=>card(sign,`${prefix}${i}`)).join('')}

  function renderScenario(s){
    addLab.innerHTML=`<div class="story-strip"><span class="story-icon">${s.pic}</span><div><b>${s.story}</b><small>Model matematika: ${fmt(s.a)} + ${mathNumber(s.b)}</small></div></div><div class="operation-flow"><span class="active">1. Amati</span><span>2. Gabungkan</span><span>3. Pasangkan</span><span>4. Temukan hasil</span></div><p class="instruction"><b>Seret</b> kartu dari Kelompok 1 dan Kelompok 2 ke Area Gabungan. Di HP, cukup ketuk kartunya.</p>${s.id==='pn'?`<div class="concept-note"><b>Perhatikan:</b> pada penjumlahan positif dan negatif, hasil bergantung pada bilangan yang <b>lebih besar atau lebih banyak kartunya</b>. Setelah pasangan nol dibentuk, tanda hasil mengikuti kartu yang masih tersisa.</div>`:''}<div class="operand-layout"><div class="operand-box"><div class="operand-title">Kelompok 1 <strong>${fmt(s.a)}</strong></div><div class="vertical-stack source-stack" id="addSourceA">${stackFor(s.a,'a')}</div></div><div class="operator-symbol">+</div><div class="operand-box"><div class="operand-title">Kelompok 2 <strong>${fmt(s.b)}</strong></div><div class="vertical-stack source-stack" id="addSourceB">${stackFor(s.b,'b')}</div></div></div><div class="combine-arrow">↓ gabungkan ↓</div><div class="combine-drop" id="addCombineDrop"><b>Area Gabungan</b><small>Letakkan semua kartu di sini</small>${verticalBoard(0,0,'addBoard')}</div><div id="addPairInfo" class="feedback">Kartu digabungkan: 0 dari ${Math.abs(s.a)+Math.abs(s.b)}</div><div id="addStep"></div>`;

    const board=document.getElementById('addBoard'),drop=document.getElementById('addCombineDrop');
    const sources=[...document.querySelectorAll('#addSourceA .int-card, #addSourceB .int-card')];
    const total=sources.length;let moved=0,dragged=null,pairingStarted=false,pairs=0;
    function moveCard(c){if(!c||c.dataset.moved==='1')return;c.dataset.moved='1';c.classList.remove('selected','dragging');const lane=+c.dataset.v>0?board.querySelector('.positive-lane .vertical-stack'):board.querySelector('.negative-lane .vertical-stack');lane.appendChild(c);c.classList.add('card-arrive');setTimeout(()=>c.classList.remove('card-arrive'),350);moved++;addPairInfo.innerHTML=`Kartu digabungkan: <b>${moved}</b> dari ${total}`;if(moved===total)startResultStage()}
    sources.forEach(c=>{c.addEventListener('click',()=>moveCard(c));c.addEventListener('dragstart',e=>{dragged=c;c.classList.add('dragging');e.dataTransfer.setData('text/plain',c.dataset.i||'card')});c.addEventListener('dragend',()=>{c.classList.remove('dragging');dragged=null})});
    drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-over')});drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-over');moveCard(dragged);dragged=null});
    function startResultStage(){document.querySelector('.operation-flow').innerHTML='<span>1. Amati</span><span class="active">2. Gabungkan</span><span>3. Pasangkan</span><span>4. Temukan hasil</span>';const p=board.querySelectorAll('.positive-lane .int-card').length,n=board.querySelectorAll('.negative-lane .int-card').length,need=Math.min(p,n);if(!need){addPairInfo.innerHTML='✓ Semua kartu sudah digabungkan. <b>Tidak ada pasangan nol</b> karena tandanya sama.';showAnswer(s,board);return}if(pairingStarted)return;pairingStarted=true;document.querySelector('.operation-flow').innerHTML='<span>1. Amati</span><span>2. Gabungkan</span><span class="active">3. Pasangkan</span><span>4. Temukan hasil</span>';addPairInfo.innerHTML=`Sekarang bentuk <b>${need} pasangan nol</b>. Seret +1 atau −1 ke bagian Pasangan Nol, atau ketuk satu kartu positif lalu satu kartu negatif.`;enableZeroPairing(board,()=>{pairs++;addPairInfo.innerHTML=`Pasangan nol: <b>${pairs} dari ${need}</b>. Setiap +1 dan −1 bernilai 0.`;if(pairs===need)showAnswer(s,board)},()=>{})}
  }

  function showAnswer(s,board){
    if(document.getElementById('addAnswer'))return;
    document.querySelector('.operation-flow').innerHTML='<span>1. Amati</span><span>2. Gabungkan</span><span>3. Pasangkan</span><span class="active">4. Temukan hasil</span>';
    const live=[...board.querySelectorAll('.int-card')].filter(c=>!c.classList.contains('paired'));
    const remain=live.reduce((t,c)=>t+(+c.dataset.v),0),signText=remain>0?'positif':remain<0?'negatif':'nol';
    addStep.innerHTML=`<div id="addAnswer" class="discover-box"><p><b>Amati kartu yang tersisa.</b> Nilainya ${signText}. Berapa hasil penjumlahannya?</p>${choices(uniqueOpts(s.answer),s.answer)}<div id="addResultSentence"></div></div>`;
    wireChoices(s.answer,()=>{
      document.getElementById('addResultSentence').innerHTML=`<div class="result-sentence pop"><span class="result-check">✓</span><div><b>Benar!</b><p>Jadi hasil dari <strong>${plainNumber(s.a)} + ${resultTerm(s.b)}</strong> adalah <strong>${plainNumber(s.answer)}</strong>.</p></div></div>`;
      done.add(s.id);addDone.textContent=`Sudah dieksplorasi: ${done.size} dari 3`;document.querySelector(`[data-s="${s.id}"]`).classList.add('completed');
      if(done.size===3){startTopicPractice({title:'Latihan Penjumlahan',subtitle:'Kerjakan 5 soal acak. Soal akan berubah setiap kali latihan dibuka kembali.',count:5,makeQuestion:additionQuestion,onComplete:()=>{complete('addition');go('subtraction')}})}
    });
  }
  function uniqueOpts(ans){let a=[ans,ans+1,ans-1,-ans].filter((v,i,x)=>x.indexOf(v)===i);while(a.length<4)a.push(ans+a.length+2);return a.slice(0,4).sort(()=>.5-Math.random())}
}
function fmt(n){return n>0?'+'+n:String(n).replace('-','−')}
