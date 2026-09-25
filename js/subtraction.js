function renderSubtraction(){
  setLast('subtraction');
  const scenarios=[
    {id:'pp',label:'Positif − Positif',a:5,b:2,answer:3},
    {id:'pn',label:'Positif − Negatif',a:2,b:-3,answer:5},
    {id:'nn',label:'Negatif − Negatif',a:-5,b:-2,answer:-3},
    {id:'np',label:'Negatif − Positif',a:-2,b:3,answer:-5}
  ];
  let currentIndex=0;

  app.innerHTML=lessonShell(
    'Pengurangan Bilangan Bulat',
    'Pengurangan berarti mengambil kartu. Jika kartu yang akan diambil belum tersedia, tambahkan pasangan nol tanpa mengubah nilai.',
    `<div class="section"><p class="eyebrow">Eksplorasi Kartu Bilangan</p><h2>Pengurangan</h2><p class="section-intro">Selesaikan bentuk pengurangan secara berurutan. Setelah jawaban benar, eksplorasi berikutnya muncul otomatis.</p><div class="explore-progress" id="subExploreProgress"></div><div id="subLab" class="lab-area"></div></div>`
  );

  function renderProgress(){
    document.getElementById('subExploreProgress').innerHTML=scenarios.map((s,i)=>`<span class="explore-chip ${i<currentIndex?'done':i===currentIndex?'active':''}">${i+1}. ${s.label}</span>`).join('');
  }
  function renderScenario(){
    renderProgress();
    const s=scenarios[currentIndex];
    const neededSign=s.b>0?1:-1,neededCount=Math.abs(s.b);
    let zeroCount=0,taken=0,dragged=null,finished=false;
    const subLab=document.getElementById('subLab');
    subLab.innerHTML=`
      <div class="math-model-card">
        <span class="math-model-label">Model matematika</span>
        <div class="math-model-expression">${plainNumber(s.a)} − ${resultTerm(s.b)} = ?</div>
      </div>
      <div class="operation-flow"><span class="active">1. Nilai awal</span><span>2. Siapkan kartu</span><span>3. Ambil</span><span>4. Temukan hasil</span></div>
      <div class="sub-target-card"><span>Yang harus diambil</span><strong>${neededCount} kartu ${neededSign>0?'positif (+1)':'negatif (−1)'}</strong></div>
      <p class="instruction">Seret kartu yang dikurangkan ke kotak <b>Diambil</b>. Di HP, kamu juga bisa mengetuk kartunya.</p>
      ${verticalBoard(Math.max(s.a,0),Math.max(-s.a,0),'subBoard')}
      <div class="zero-helper"><div><b>Jika kartu belum cukup</b><small>Tambahkan pasangan +1 dan −1. Nilainya 0, sehingga nilai awal tidak berubah.</small></div><button id="zeroBtn" class="btn secondary">+ Tambahkan pasangan nol</button></div>
      <div id="takeZone" class="take-zone"><b>Diambil: 0 dari ${neededCount}</b><small>Seret kartu ke sini atau ketuk kartunya</small><div class="taken-cards"></div></div>
      <div id="subFeedback" class="feedback">Ambil ${neededCount} kartu ${neededSign>0?'positif':'negatif'}.</div>
      <div id="subAnswer"></div>`;

    const board=document.getElementById('subBoard'),target=document.getElementById('takeZone'),zeroBtn=document.getElementById('zeroBtn'),pairList=board.querySelector('.zero-pairs');
    function availableNeeded(){return [...board.querySelectorAll(`.int-card.${neededSign>0?'pos':'neg'}`)].filter(c=>!c.classList.contains('removed'))}
    function updateStage(){
      const available=availableNeeded().length;
      if(available<neededCount-taken){
        document.querySelector('.operation-flow').innerHTML='<span>1. Nilai awal</span><span class="active">2. Siapkan kartu</span><span>3. Ambil</span><span>4. Temukan hasil</span>';
        document.getElementById('subFeedback').innerHTML=`Kartu ${neededSign>0?'positif':'negatif'} belum cukup. Tambahkan <b>pasangan nol</b>.`;
      }else{
        document.querySelector('.operation-flow').innerHTML='<span>1. Nilai awal</span><span>2. Siapkan kartu</span><span class="active">3. Ambil</span><span>4. Temukan hasil</span>';
        document.getElementById('subFeedback').innerHTML=`Kartu sudah tersedia. Ambil <b>${neededCount-taken}</b> kartu ${neededSign>0?'positif':'negatif'} lagi.`;
      }
    }
    function addZeroPair(){
      if(finished)return;
      zeroCount++;
      const pos=htmlToElement(card(1,`zp${zeroCount}`)),neg=htmlToElement(card(-1,`zn${zeroCount}`));
      board.querySelector('.positive-lane .vertical-stack').appendChild(pos);board.querySelector('.negative-lane .vertical-stack').appendChild(neg);
      pos.classList.add('card-arrive');neg.classList.add('card-arrive');setTimeout(()=>{pos.classList.remove('card-arrive');neg.classList.remove('card-arrive')},350);
      const row=document.createElement('div');row.className='zero-pair-row pop';row.innerHTML='<span class="mini-pos">+1</span><span class="pair-link">+</span><span class="mini-neg">−1</span><b>= 0</b>';pairList.appendChild(row);updateStage();
    }
    function takeCard(c){
      if(finished||!c||c.classList.contains('removed'))return;
      if(+c.dataset.v!==neededSign){c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),300);document.getElementById('subFeedback').innerHTML=`Belum tepat. Ambil kartu <b>${neededSign>0?'positif (+1)':'negatif (−1)'}</b>.`;return}
      if(taken>=neededCount)return;
      c.classList.add('removed','take-fly');taken++;
      const chip=document.createElement('span');chip.className=neededSign>0?'mini-pos':'mini-neg';chip.textContent=neededSign>0?'+1':'−1';target.querySelector('.taken-cards').appendChild(chip);target.querySelector('b').textContent=`Diambil: ${taken} dari ${neededCount}`;
      if(taken===neededCount)finish();else updateStage();
    }
    board.addEventListener('click',e=>{const c=e.target.closest('.int-card');if(c)takeCard(c)});
    board.addEventListener('dragstart',e=>{const c=e.target.closest('.int-card');if(!c)return;dragged=c;c.classList.add('dragging');e.dataTransfer.setData('text/plain',c.dataset.i||'card')});
    board.addEventListener('dragend',e=>{const c=e.target.closest('.int-card');if(c)c.classList.remove('dragging');dragged=null});
    target.addEventListener('dragover',e=>{e.preventDefault();target.classList.add('drag-over')});target.addEventListener('dragleave',()=>target.classList.remove('drag-over'));target.addEventListener('drop',e=>{e.preventDefault();target.classList.remove('drag-over');takeCard(dragged);dragged=null});zeroBtn.onclick=addZeroPair;

    function finish(){
      finished=true;zeroBtn.disabled=true;
      document.querySelector('.operation-flow').innerHTML='<span>1. Nilai awal</span><span>2. Siapkan kartu</span><span>3. Ambil</span><span class="active">4. Temukan hasil</span>';
      document.getElementById('subFeedback').innerHTML='✓ Kartu yang dikurangkan sudah diambil. Hitung nilai kartu yang tersisa.';
      document.getElementById('subAnswer').innerHTML=`<div class="discover-box"><p><b>Berapa hasilnya?</b></p>${choices(uniqueOpts(s.answer),s.answer)}<div id="subResultSentence"></div></div>`;
      wireChoices(s.answer,()=>{
        document.getElementById('subResultSentence').innerHTML=`<div class="result-sentence pop"><span class="result-check">✓</span><div><b>Benar!</b><p>Jadi hasil dari <strong>${plainNumber(s.a)} − ${resultTerm(s.b)}</strong> adalah <strong>${plainNumber(s.answer)}</strong>.</p></div></div>`;
        currentIndex++;
        if(currentIndex<scenarios.length){
          showLearningTransition({message:'Kita lanjut ke bentuk pengurangan berikutnya.',nextLabel:`Eksplorasi ${currentIndex+1} dari ${scenarios.length}`,onDone:()=>{renderScenario();document.getElementById('subLab')?.scrollIntoView({behavior:'smooth',block:'start'});}});
        }else{
          renderProgress();
          showLearningTransition({title:'Eksplorasi selesai!',message:'Semua bentuk pengurangan sudah kamu selesaikan.',nextLabel:'Masuk ke Latihan Pengurangan',onDone:()=>startTopicPractice({title:'Latihan Pengurangan',subtitle:'Kerjakan 5 soal acak.',count:5,makeQuestion:subtractionQuestion,onComplete:()=>{complete('subtraction');go('multiplication')}})});
        }
      });
    }
    updateStage();
  }
  function htmlToElement(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild}
  function uniqueOpts(ans){let a=[ans,ans+1,ans-1,-ans].filter((v,i,x)=>x.indexOf(v)===i);while(a.length<4)a.push(ans+a.length+2);return a.slice(0,4).sort(()=>.5-Math.random())}
  renderScenario();
}
