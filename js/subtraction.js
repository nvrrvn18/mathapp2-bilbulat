function renderSubtraction(){
  setLast('subtraction');
  const scenarios=[
    {id:'pp',label:'Positif − Positif',a:5,b:2,answer:3,pic:'🎟️',story:'Ada 5 tiket bonus. Dua tiket digunakan.'},
    {id:'pn',label:'Positif − Negatif',a:2,b:-3,answer:5,pic:'🌡️',story:'Mulai dari +2. Kita perlu mengambil 3 kartu negatif.'},
    {id:'nn',label:'Negatif − Negatif',a:-5,b:-2,answer:-3,pic:'🏦',story:'Posisi awal −5. Kita mengambil 2 kartu negatif.'},
    {id:'np',label:'Negatif − Positif',a:-2,b:3,answer:-5,pic:'🎮',story:'Posisi awal −2. Kita perlu mengambil 3 kartu positif.'}
  ];

  app.innerHTML=lessonShell(
    'Pengurangan Bilangan Bulat',
    'Pengurangan berarti mengambil kartu. Jika kartu yang akan diambil belum tersedia, tambahkan pasangan nol tanpa mengubah nilai.',
    `<div class="section">
      <p class="eyebrow">Eksplorasi Kartu Bilangan</p>
      <h2>Pilih jenis pengurangan</h2>
      <div class="scenario-grid four-scenarios">${scenarios.map(s=>`<button class="scenario-btn" data-s="${s.id}"><span class="scenario-pic">${s.pic}</span>${s.label}</button>`).join('')}</div>
      <div id="subLab" class="lab-area"><p class="feedback">Pilih salah satu jenis pengurangan di atas.</p></div>
      <div id="subDone" class="explored-status">Sudah dieksplorasi: 0 dari 4</div>
    </div>`
  );

  const done=new Set();
  document.querySelectorAll('.scenario-btn').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.scenario-btn').forEach(x=>x.classList.remove('selected'));
      btn.classList.add('selected');
      renderScenario(scenarios.find(x=>x.id===btn.dataset.s));
    };
  });

  function renderScenario(s){
    const neededSign=s.b>0?1:-1;
    const neededCount=Math.abs(s.b);
    let zeroCount=0,taken=0,dragged=null,finished=false;

    subLab.innerHTML=`
      <div class="story-strip"><span class="story-icon">${s.pic}</span><div><b>${s.story}</b><small>Model matematika: ${fmt(s.a)} − (${fmt(s.b)})</small></div></div>
      <div class="operation-flow"><span class="active">1. Nilai awal</span><span>2. Siapkan kartu</span><span>3. Ambil</span><span>4. Amati sisa</span></div>
      <div class="sub-target-card"><span>Yang harus diambil</span><strong>${neededCount} kartu ${neededSign>0?'positif (+1)':'negatif (−1)'}</strong></div>
      <p class="instruction">Seret kartu yang harus dikurangkan ke kotak <b>Diambil</b>. Di HP, kamu juga bisa mengetuk kartunya.</p>
      ${verticalBoard(Math.max(s.a,0),Math.max(-s.a,0),'subBoard')}
      <div class="zero-helper">
        <div><b>Apakah kartu yang diperlukan tersedia?</b><small>Jika belum cukup, tambahkan pasangan +1 dan −1. Nilainya 0 sehingga nilai awal tetap.</small></div>
        <button id="zeroBtn" class="btn secondary">+ Tambahkan pasangan nol</button>
      </div>
      <div id="takeZone" class="take-zone"><b>Diambil: 0 dari ${neededCount}</b><small>Seret kartu ke sini atau ketuk kartunya</small><div class="taken-cards"></div></div>
      <div id="subFeedback" class="feedback">Amati kartu awal, lalu ambil ${neededCount} kartu ${neededSign>0?'positif':'negatif'}.</div>
      <div id="subAnswer"></div>`;

    const board=document.getElementById('subBoard');
    const target=document.getElementById('takeZone');
    const zeroBtn=document.getElementById('zeroBtn');
    const pairList=board.querySelector('.zero-pairs');

    function availableNeeded(){return [...board.querySelectorAll(`.int-card.${neededSign>0?'pos':'neg'}`)].filter(c=>!c.classList.contains('removed'))}

    function updateStage(){
      const available=availableNeeded().length;
      if(available<neededCount-taken){
        document.querySelector('.operation-flow').innerHTML='<span>1. Nilai awal</span><span class="active">2. Siapkan kartu</span><span>3. Ambil</span><span>4. Amati sisa</span>';
        subFeedback.innerHTML=`Kartu ${neededSign>0?'positif':'negatif'} belum cukup. Tambahkan <b>pasangan nol</b> sampai kartu yang akan diambil tersedia.`;
      }else{
        document.querySelector('.operation-flow').innerHTML='<span>1. Nilai awal</span><span>2. Siapkan kartu</span><span class="active">3. Ambil</span><span>4. Amati sisa</span>';
        subFeedback.innerHTML=`Kartu sudah tersedia. Ambil <b>${neededCount-taken}</b> kartu ${neededSign>0?'positif':'negatif'} lagi.`;
      }
    }

    function addZeroPair(){
      if(finished)return;
      zeroCount++;
      const pos=htmlToElement(card(1,`zp${zeroCount}`));
      const neg=htmlToElement(card(-1,`zn${zeroCount}`));
      board.querySelector('.positive-lane .vertical-stack').appendChild(pos);
      board.querySelector('.negative-lane .vertical-stack').appendChild(neg);
      pos.classList.add('card-arrive');neg.classList.add('card-arrive');
      setTimeout(()=>{pos.classList.remove('card-arrive');neg.classList.remove('card-arrive')},350);
      const row=document.createElement('div');
      row.className='zero-pair-row pop';
      row.innerHTML='<span class="mini-pos">+1</span><span class="pair-link">+</span><span class="mini-neg">−1</span><b>= 0</b>';
      pairList.appendChild(row);
      updateStage();
    }

    function takeCard(c){
      if(finished || !c || c.classList.contains('removed'))return;
      if(+c.dataset.v!==neededSign){
        c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),300);
        subFeedback.innerHTML=`Belum tepat. Yang harus diambil adalah kartu <b>${neededSign>0?'positif (+1)':'negatif (−1)'}</b>.`;
        return;
      }
      if(taken>=neededCount)return;
      c.classList.add('removed','take-fly');
      taken++;
      const chip=document.createElement('span');
      chip.className=neededSign>0?'mini-pos':'mini-neg';
      chip.textContent=neededSign>0?'+1':'−1';
      target.querySelector('.taken-cards').appendChild(chip);
      target.querySelector('b').textContent=`Diambil: ${taken} dari ${neededCount}`;
      if(taken===neededCount)finish(); else updateStage();
    }

    board.addEventListener('click',e=>{const c=e.target.closest('.int-card');if(c)takeCard(c)});
    board.addEventListener('dragstart',e=>{const c=e.target.closest('.int-card');if(!c)return;dragged=c;c.classList.add('dragging');e.dataTransfer.setData('text/plain',c.dataset.i||'card')});
    board.addEventListener('dragend',e=>{const c=e.target.closest('.int-card');if(c)c.classList.remove('dragging');dragged=null});
    target.addEventListener('dragover',e=>{e.preventDefault();target.classList.add('drag-over')});
    target.addEventListener('dragleave',()=>target.classList.remove('drag-over'));
    target.addEventListener('drop',e=>{e.preventDefault();target.classList.remove('drag-over');takeCard(dragged);dragged=null});
    zeroBtn.onclick=addZeroPair;

    function finish(){
      finished=true;
      zeroBtn.disabled=true;
      document.querySelector('.operation-flow').innerHTML='<span>1. Nilai awal</span><span>2. Siapkan kartu</span><span>3. Ambil</span><span class="active">4. Amati sisa</span>';
      const remain=[...board.querySelectorAll('.int-card')].filter(c=>!c.classList.contains('removed')).reduce((t,c)=>t+(+c.dataset.v),0);
      subFeedback.innerHTML='✓ Kartu yang dikurangkan sudah diambil. Sekarang hitung nilai kartu yang masih tersisa.';
      subAnswer.innerHTML=`<div class="discover-box"><p><b>Berapa nilai kartu yang tersisa?</b></p>${choices(uniqueOpts(s.answer),s.answer)}</div>`;
      wireChoices(s.answer,()=>{
        done.add(s.id);
        subDone.textContent=`Sudah dieksplorasi: ${done.size} dari 4`;
        document.querySelector(`[data-s="${s.id}"]`).classList.add('completed');
        if(done.size===4){
          complete('subtraction');
          document.getElementById('nextArea').innerHTML='<button class="btn" onclick="go(\'multiplication\')">Lanjut ke Perkalian →</button>';
        }
      });
    }

    updateStage();
  }

  function htmlToElement(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild}
  function uniqueOpts(ans){let a=[ans,ans+1,ans-1,-ans].filter((v,i,x)=>x.indexOf(v)===i);while(a.length<4)a.push(ans+a.length+2);return a.slice(0,4).sort(()=>.5-Math.random())}
}
