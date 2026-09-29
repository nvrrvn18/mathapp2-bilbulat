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
    'Bangun nilai awal dengan kartu, ambil kartu sesuai model matematika, dan tambahkan pasangan nol jika kartu yang akan diambil belum tersedia.',
    `<div class="section pictorial-head">
      <p class="eyebrow">Eksplorasi Kartu Bilangan</p>
      <h2>Pengurangan</h2>
      <p class="section-intro">Tekan tombol kartu untuk membentuk nilai awal. Setelah itu ikuti langkah mengambil kartu yang dikurangkan.</p>
      <div class="explore-progress" id="subExploreProgress"></div>
      <div id="subLab" class="lab-area guided-sub-lab"></div>
    </div>`
  );

  function renderProgress(){
    const host=document.getElementById('subExploreProgress');
    host.innerHTML=scenarios.map((s,i)=>`<span class="explore-chip ${i<currentIndex?'done':i===currentIndex?'active':''}">${i+1}. ${s.label}</span>`).join('');
  }
  function signName(v){return v>0?'positif':'negatif'}
  function signedOne(v){return v>0?'+1':'−1'}
  function buildButtonText(v,count,target){return `Tekan ${signedOne(v)} • ${count}/${target}`}
  function makeCard(v,id){
    const wrap=document.createElement('div');
    wrap.innerHTML=card(v,id);
    const el=wrap.firstElementChild;
    el.draggable=false;
    return el;
  }

  function renderScenario(){
    renderProgress();
    const s=scenarios[currentIndex];
    const lab=document.getElementById('subLab');
    const initialTarget=Math.abs(s.a);
    const neededSign=s.b>0?1:-1;
    const neededCount=Math.abs(s.b);
    const initialSign=s.a>0?1:-1;
    const initialAvailable=initialSign===neededSign?initialTarget:0;
    const zeroPairsNeeded=Math.max(0,neededCount-initialAvailable);

    let initialCount=0;
    let zeroPairsAdded=0;
    let taking=false;
    let finished=false;

    lab.innerHTML=`
      <div class="math-model-card add-model-card">
        <span class="math-model-label">Model matematika</span>
        <div class="math-model-expression">${plainNumber(s.a)} − ${resultTerm(s.b)} = ?</div>
      </div>

      <div class="guided-stepper" id="subGuidedStepper">
        <span class="active" data-step="1">1. Bentuk nilai awal</span>
        <span data-step="2">2. Siapkan kartu</span>
        <span data-step="3">3. Ambil kartu</span>
        <span data-step="4">4. Hitung sisa</span>
      </div>

      <div class="sub-guided-builder">
        <section class="build-column active" id="subInitialColumn">
          <div class="build-heading"><small>Nilai awal</small><strong>${plainNumber(s.a)}</strong></div>
          <div class="build-stack ${s.a>0?'positive-build':'negative-build'}" id="subInitialStack" aria-live="polite"></div>
          <button class="build-card-btn ${s.a>0?'positive':'negative'}" id="subInitialBtn" type="button">
            <span>${signedOne(s.a)}</span><small>${buildButtonText(s.a,0,initialTarget)}</small>
          </button>
        </section>
      </div>

      <div class="guided-message" id="subGuideMessage">
        Tekan tombol <b>${signedOne(s.a)}</b> sebanyak <b>${initialTarget} kali</b> untuk membentuk nilai awal ${plainNumber(s.a)}.
      </div>

      <div class="sub-zero-builder" id="subZeroBuilder" hidden>
        <div class="zero-builder-head">
          <div><b>Tambahkan pasangan nol</b><small>Satu pasangan terdiri dari +1 dan −1, sehingga nilainya tetap 0.</small></div>
          <span id="zeroPairCounter">0/${zeroPairsNeeded}</span>
        </div>
        <div class="zero-pair-columns">
          <div><span class="mini-label">Kartu positif tambahan</span><div class="build-stack positive-build compact" id="subZeroPos"></div></div>
          <div><span class="mini-label">Kartu negatif tambahan</span><div class="build-stack negative-build compact" id="subZeroNeg"></div></div>
        </div>
        <button class="btn secondary zero-add-main" id="subAddZeroBtn" type="button">+ Tambah pasangan nol</button>
      </div>

      <div class="take-zone guided-take-zone" id="subTakeZone" hidden>
        <b id="subTakeTitle">Kartu yang diambil</b>
        <small id="subTakeHint"></small>
        <div class="taken-cards" id="subTakenCards"></div>
      </div>

      <div class="guided-action-zone" id="subActionZone"></div>
      <div id="subResultZone"></div>`;

    const initialBtn=document.getElementById('subInitialBtn');
    const initialStack=document.getElementById('subInitialStack');
    const guide=document.getElementById('subGuideMessage');
    const action=document.getElementById('subActionZone');
    const zeroBuilder=document.getElementById('subZeroBuilder');
    const zeroBtn=document.getElementById('subAddZeroBtn');
    const zeroPos=document.getElementById('subZeroPos');
    const zeroNeg=document.getElementById('subZeroNeg');
    const takeZone=document.getElementById('subTakeZone');

    function setStep(n){
      document.querySelectorAll('#subGuidedStepper span').forEach(el=>{
        const step=+el.dataset.step;
        el.classList.toggle('active',step===n);
        el.classList.toggle('done',step<n);
      });
    }

    function animateIn(el){
      requestAnimationFrame(()=>el.classList.add('card-born'));
      setTimeout(()=>el.classList.remove('card-born'),450);
    }

    initialBtn.onclick=()=>{
      if(initialCount>=initialTarget)return;
      initialCount++;
      const el=makeCard(initialSign,`sub-start-${currentIndex}-${initialCount}`);
      initialStack.appendChild(el);
      animateIn(el);
      initialBtn.querySelector('small').textContent=buildButtonText(s.a,initialCount,initialTarget);
      if(initialCount===initialTarget){
        initialBtn.disabled=true;
        document.getElementById('subInitialColumn').classList.remove('active');
        document.getElementById('subInitialColumn').classList.add('complete');
        setStep(2);
        showTakeStatement();
      }
    };

    function showTakeStatement(){
      const availableNow=initialAvailable+zeroPairsAdded;
      guide.innerHTML=`Dari <b>${initialTarget} kartu ${signName(s.a)}</b> akan diambil <b>${neededCount} kartu ${signName(s.b)}</b>.`;

      if(availableNow>=neededCount){
        action.innerHTML=`<button class="btn guided-main-action" id="subCountBtn" type="button">Hitung dan ambil ${neededCount} kartu ${signName(s.b)}</button>`;
        document.getElementById('subCountBtn').onclick=runTakeAnimation;
      }else{
        zeroBuilder.hidden=false;
        guide.innerHTML+=`<br><span class="need-zero-note">Kartu ${signName(s.b)} belum tersedia dalam jumlah yang cukup. Tambahkan <b>${zeroPairsNeeded} pasangan nol</b>.</span>`;
        action.innerHTML='';
        zeroBtn.disabled=false;
        zeroBtn.focus({preventScroll:true});
      }
    }

    zeroBtn.onclick=()=>{
      if(zeroPairsAdded>=zeroPairsNeeded)return;
      zeroPairsAdded++;
      const p=makeCard(1,`sub-zp-${currentIndex}-${zeroPairsAdded}`);
      const n=makeCard(-1,`sub-zn-${currentIndex}-${zeroPairsAdded}`);
      zeroPos.appendChild(p);zeroNeg.appendChild(n);
      animateIn(p);animateIn(n);
      document.getElementById('zeroPairCounter').textContent=`${zeroPairsAdded}/${zeroPairsNeeded}`;

      const availableNow=initialAvailable+zeroPairsAdded;
      const stillNeeded=Math.max(0,neededCount-availableNow);
      if(stillNeeded>0){
        guide.innerHTML=`Pasangan nol ke-${zeroPairsAdded} sudah ditambahkan. Tambahkan <b>${stillNeeded} pasangan nol lagi</b> agar tersedia ${neededCount} kartu ${signName(s.b)}.`;
      }else{
        zeroBtn.disabled=true;
        guide.innerHTML=`✓ Sekarang <b>${neededCount} kartu ${signName(s.b)}</b> sudah tersedia dan bisa diambil.`;
        action.innerHTML=`<button class="btn guided-main-action" id="subCountBtn" type="button">Hitung dan ambil ${neededCount} kartu ${signName(s.b)}</button>`;
        document.getElementById('subCountBtn').onclick=runTakeAnimation;
      }
    };

    function allLiveCards(){
      return [
        ...initialStack.querySelectorAll('.int-card'),
        ...zeroPos.querySelectorAll('.int-card'),
        ...zeroNeg.querySelectorAll('.int-card')
      ].filter(c=>!c.classList.contains('removed'));
    }

    function runTakeAnimation(){
      if(taking||finished)return;
      taking=true;
      setStep(3);
      action.innerHTML='';
      zeroBtn.disabled=true;
      takeZone.hidden=false;
      document.getElementById('subTakeHint').textContent=`Perhatikan ${neededCount} kartu ${signName(s.b)} yang diambil.`;
      guide.innerHTML=`Sekarang ambil <b>${neededCount} kartu ${signName(s.b)}</b>.`;

      const candidates=allLiveCards().filter(c=>+c.dataset.v===neededSign).slice(0,neededCount);
      let i=0;
      function takeNext(){
        if(i>=candidates.length){
          setTimeout(showRemaining,350);
          return;
        }
        const c=candidates[i];
        c.classList.add('sub-taking');
        setTimeout(()=>{
          c.classList.add('removed');
          const chip=document.createElement('span');
          chip.className=neededSign>0?'mini-pos':'mini-neg';
          chip.textContent=neededSign>0?'+1':'−1';
          document.getElementById('subTakenCards').appendChild(chip);
          i++;
          setTimeout(takeNext,220);
        },360);
      }
      takeNext();
    }

    function showRemaining(){
      setStep(4);
      guide.innerHTML=`<b>Perhatikan jumlah kartu yang tersisa.</b><br>Kartu yang diambil sudah sesuai dengan model pengurangan.`;
      action.innerHTML=`<button class="btn guided-main-action" id="subShowResultBtn" type="button">Hitung kartu yang tersisa</button>`;
      document.getElementById('subShowResultBtn').onclick=showResult;
    }

    function showResult(){
      if(finished)return;
      finished=true;
      action.innerHTML='';
      const resultZone=document.getElementById('subResultZone');
      const remaining=Math.abs(s.answer);
      let visual='';
      if(s.answer===0){
        visual='<div class="final-zero-badge">0</div>';
      }else{
        visual=`<div class="final-card-count">${Array.from({length:remaining},(_,i)=>card(s.answer>0?1:-1,`sub-final-${i}`)).join('')}</div>`;
      }
      resultZone.innerHTML=`
        <div class="guided-result pop">
          <span class="result-check">✓</span>
          <div>
            <b>Hasil ditemukan</b>
            ${visual}
            <p>${s.answer===0?'Tidak ada kartu yang tersisa.':`Tersisa <strong>${remaining} kartu ${signName(s.answer)}</strong>.`}</p>
            <div class="final-equation">${plainNumber(s.a)} − ${resultTerm(s.b)} = <strong>${plainNumber(s.answer)}</strong></div>
            <p class="result-conclusion">Jadi hasil dari <strong>${plainNumber(s.a)} − ${resultTerm(s.b)}</strong> adalah <strong>${plainNumber(s.answer)}</strong>.</p>
          </div>
        </div>`;
      resultZone.querySelectorAll('.int-card').forEach(c=>c.draggable=false);
      const isLast=currentIndex===scenarios.length-1;
      resultZone.insertAdjacentHTML('beforeend',`<div class="explore-actions pop"><button id="repeatSubExplore" class="btn secondary" type="button">↻ Ulangi eksplorasi</button><button id="nextSubExplore" class="btn" type="button">${isLast?'Lanjut ke Latihan Pengurangan →':'Lanjut ke eksplorasi berikutnya →'}</button></div>`);
      document.getElementById('repeatSubExplore').onclick=()=>{
        renderScenario();
        document.getElementById('subLab')?.scrollIntoView({behavior:'smooth',block:'start'});
      };
      document.getElementById('nextSubExplore').onclick=()=>{
        if(!isLast){
          currentIndex++;
          renderScenario();
          document.getElementById('subLab')?.scrollIntoView({behavior:'smooth',block:'start'});
        }else{
          currentIndex=scenarios.length;
          renderProgress();
          startTopicPractice({title:'Latihan Pengurangan',subtitle:'Kerjakan 5 soal acak.',count:5,makeQuestion:subtractionQuestion,onComplete:()=>{complete('subtraction');go('multiplication')}});
        }
      };
    }
  }

  renderScenario();
}
