function renderAddition(){
  setLast('addition');
  const scenarios=[
    {id:'pp',label:'Positif + Positif',a:3,b:2,answer:5},
    {id:'pn1',label:'Positif + Negatif',a:5,b:-3,answer:2},
    {id:'pn2',label:'Positif + Negatif (negatif lebih banyak)',a:3,b:-5,answer:-2},
    {id:'nn',label:'Negatif + Negatif',a:-2,b:-3,answer:-5}
  ];
  let currentIndex=0;

  app.innerHTML=lessonShell(
    'Penjumlahan Bilangan Bulat',
    'Gabungkan kedua kelompok kartu. Jika tandanya berbeda, bentuk pasangan nol lalu perhatikan kartu yang tersisa.',
    `<div class="section pictorial-head">
      <p class="eyebrow">Eksplorasi Kartu Bilangan</p>
      <h2>Penjumlahan</h2>
      <p class="section-intro">Selesaikan bentuk penjumlahan secara berurutan. Setelah jawaban benar, eksplorasi berikutnya muncul otomatis.</p>
      <div class="explore-progress" id="addExploreProgress"></div>
      <div id="addLab" class="lab-area"></div>
    </div>`
  );

  function renderProgress(){
    const host=document.getElementById('addExploreProgress');
    host.innerHTML=scenarios.map((s,i)=>`<span class="explore-chip ${i<currentIndex?'done':i===currentIndex?'active':''}">${i+1}. ${s.label}</span>`).join('');
  }
  function stackFor(value,prefix){
    const sign=value>=0?1:-1;
    return Array.from({length:Math.abs(value)},(_,i)=>card(sign,`${prefix}${i}`)).join('');
  }
  function renderScenario(){
    renderProgress();
    const s=scenarios[currentIndex];
    const addLab=document.getElementById('addLab');
    addLab.innerHTML=`
      <div class="math-model-card">
        <span class="math-model-label">Model matematika</span>
        <div class="math-model-expression">${plainNumber(s.a)} + ${resultTerm(s.b)} = ?</div>
      </div>
      <div class="operation-flow"><span class="active">1. Gabungkan</span><span>2. Pasangkan nol</span><span>3. Temukan hasil</span></div>
      ${s.id.startsWith('pn')?`<div class="concept-note"><b>Perhatikan:</b> setelah pasangan nol dibentuk, tanda hasil mengikuti kelompok kartu yang masih tersisa. Jika kartu negatif lebih banyak, hasilnya negatif.</div>`:''}
      <p class="instruction"><b>Seret</b> semua kartu ke Area Gabungan. Di HP, cukup ketuk kartunya.</p>
      <div class="operand-layout">
        <div class="operand-box"><div class="operand-title">Kelompok 1 <strong>${fmt(s.a)}</strong></div><div class="vertical-stack source-stack" id="addSourceA">${stackFor(s.a,'a')}</div></div>
        <div class="operator-symbol">+</div>
        <div class="operand-box"><div class="operand-title">Kelompok 2 <strong>${fmt(s.b)}</strong></div><div class="vertical-stack source-stack" id="addSourceB">${stackFor(s.b,'b')}</div></div>
      </div>
      <div class="combine-arrow">↓ gabungkan ↓</div>
      <div class="combine-drop" id="addCombineDrop"><b>Area Gabungan</b><small>Letakkan semua kartu di sini</small>${verticalBoard(0,0,'addBoard')}</div>
      <div id="addPairInfo" class="feedback">Kartu digabungkan: 0 dari ${Math.abs(s.a)+Math.abs(s.b)}</div>
      <div id="addStep"></div>`;

    const board=document.getElementById('addBoard');
    const drop=document.getElementById('addCombineDrop');
    const sources=[...document.querySelectorAll('#addSourceA .int-card, #addSourceB .int-card')];
    const total=sources.length;
    let moved=0,dragged=null,pairingStarted=false,pairs=0;

    function moveCard(c){
      if(!c||c.dataset.moved==='1')return;
      c.dataset.moved='1';c.classList.remove('selected','dragging');
      const lane=+c.dataset.v>0?board.querySelector('.positive-lane .vertical-stack'):board.querySelector('.negative-lane .vertical-stack');
      lane.appendChild(c);c.classList.add('card-arrive');setTimeout(()=>c.classList.remove('card-arrive'),350);
      moved++;
      document.getElementById('addPairInfo').innerHTML=`Kartu digabungkan: <b>${moved}</b> dari ${total}`;
      if(moved===total)startResultStage();
    }
    sources.forEach(c=>{
      c.addEventListener('click',()=>moveCard(c));
      c.addEventListener('dragstart',e=>{dragged=c;c.classList.add('dragging');e.dataTransfer.setData('text/plain',c.dataset.i||'card')});
      c.addEventListener('dragend',()=>{c.classList.remove('dragging');dragged=null});
    });
    drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-over')});
    drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));
    drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-over');moveCard(dragged);dragged=null});

    function startResultStage(){
      const p=board.querySelectorAll('.positive-lane .int-card').length;
      const n=board.querySelectorAll('.negative-lane .int-card').length;
      const need=Math.min(p,n);
      if(!need){
        document.querySelector('.operation-flow').innerHTML='<span>1. Gabungkan</span><span>2. Pasangkan nol</span><span class="active">3. Temukan hasil</span>';
        document.getElementById('addPairInfo').innerHTML='✓ Semua kartu sudah digabungkan. Tidak ada pasangan nol karena tandanya sama.';
        showAnswer();return;
      }
      if(pairingStarted)return;
      pairingStarted=true;
      document.querySelector('.operation-flow').innerHTML='<span>1. Gabungkan</span><span class="active">2. Pasangkan nol</span><span>3. Temukan hasil</span>';
      document.getElementById('addPairInfo').innerHTML=`Bentuk <b>${need} pasangan nol</b>: +1 dengan −1.`;
      enableZeroPairing(board,()=>{
        pairs++;
        document.getElementById('addPairInfo').innerHTML=`Pasangan nol: <b>${pairs} dari ${need}</b>.`;
        if(pairs===need)showAnswer();
      },()=>{});
    }
    function showAnswer(){
      if(document.getElementById('addAnswer'))return;
      document.querySelector('.operation-flow').innerHTML='<span>1. Gabungkan</span><span>2. Pasangkan nol</span><span class="active">3. Temukan hasil</span>';
      document.getElementById('addStep').innerHTML=`<div id="addAnswer" class="discover-box"><p><b>Berapa hasilnya?</b></p>${choices(uniqueOpts(s.answer),s.answer)}<div id="addResultSentence"></div></div>`;
      wireChoices(s.answer,()=>{
        document.getElementById('addResultSentence').innerHTML=`<div class="result-sentence pop"><span class="result-check">✓</span><div><b>Benar!</b><p>Jadi hasil dari <strong>${plainNumber(s.a)} + ${resultTerm(s.b)}</strong> adalah <strong>${plainNumber(s.answer)}</strong>.</p></div></div>`;
        currentIndex++;
        if(currentIndex<scenarios.length){
          showLearningTransition({message:'Kita lanjut ke bentuk penjumlahan berikutnya.',nextLabel:`Eksplorasi ${currentIndex+1} dari ${scenarios.length}`,onDone:()=>{renderScenario();document.getElementById('addLab')?.scrollIntoView({behavior:'smooth',block:'start'});}});
        }else{
          renderProgress();
          showLearningTransition({title:'Eksplorasi selesai!',message:'Semua bentuk penjumlahan sudah kamu selesaikan.',nextLabel:'Masuk ke Latihan Penjumlahan',onDone:()=>startTopicPractice({title:'Latihan Penjumlahan',subtitle:'Kerjakan 5 soal acak.',count:5,makeQuestion:additionQuestion,onComplete:()=>{complete('addition');go('subtraction')}})});
        }
      });
    }
  }
  function uniqueOpts(ans){let a=[ans,ans+1,ans-1,-ans].filter((v,i,x)=>x.indexOf(v)===i);while(a.length<4)a.push(ans+a.length+2);return a.slice(0,4).sort(()=>.5-Math.random())}
  renderScenario();
}
function fmt(n){return n>0?'+'+n:String(n).replace('-','−')}
