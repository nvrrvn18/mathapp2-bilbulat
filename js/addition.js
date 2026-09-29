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
    'Bangun kartu sesuai model matematika, amati hubungan kartunya, lalu hitung hasilnya.',
    `<div class="section pictorial-head">
      <p class="eyebrow">Eksplorasi Kartu Bilangan</p>
      <h2>Penjumlahan</h2>
      <p class="section-intro">Tekan tombol kartu sesuai banyak bilangan pada model. Setiap ketukan akan memunculkan satu kartu dengan animasi.</p>
      <div class="explore-progress" id="addExploreProgress"></div>
      <div id="addLab" class="lab-area guided-add-lab"></div>
    </div>`
  );

  function renderProgress(){
    const host=document.getElementById('addExploreProgress');
    host.innerHTML=scenarios.map((s,i)=>`<span class="explore-chip ${i<currentIndex?'done':i===currentIndex?'active':''}">${i+1}. ${s.label}</span>`).join('');
  }

  function signName(v){return v>0?'positif':'negatif'}
  function signedOne(v){return v>0?'+1':'−1'}
  function countText(count,v){return `${count} kartu ${signName(v)}`}
  function buttonText(v,count,target){return `Tekan ${signedOne(v)} • ${count}/${target}`}

  function renderScenario(){
    renderProgress();
    const s=scenarios[currentIndex];
    const lab=document.getElementById('addLab');
    const firstTarget=Math.abs(s.a), secondTarget=Math.abs(s.b);
    let firstCount=0, secondCount=0, paired=false, calculating=false;

    lab.innerHTML=`
      <div class="math-model-card add-model-card">
        <span class="math-model-label">Model matematika</span>
        <div class="math-model-expression">${plainNumber(s.a)} + ${resultTerm(s.b)} = ?</div>
      </div>

      <div class="guided-stepper" id="guidedStepper">
        <span class="active" data-step="1">1. Bentuk bilangan pertama</span>
        <span data-step="2">2. Bentuk bilangan kedua</span>
        <span data-step="3">3. Amati</span>
        <span data-step="4">4. Hitung</span>
      </div>

      <div class="guided-card-builder">
        <section class="build-column active" id="buildFirst">
          <div class="build-heading"><small>Bilangan pertama</small><strong>${plainNumber(s.a)}</strong></div>
          <div class="build-stack ${s.a>0?'positive-build':'negative-build'}" id="firstStack" aria-live="polite"></div>
          <button class="build-card-btn ${s.a>0?'positive':'negative'}" id="firstAddBtn" type="button">
            <span>${signedOne(s.a)}</span><small>${buttonText(s.a,0,firstTarget)}</small>
          </button>
        </section>

        <div class="builder-plus" aria-hidden="true">+</div>

        <section class="build-column locked" id="buildSecond">
          <div class="build-heading"><small>Bilangan kedua</small><strong>${plainNumber(s.b)}</strong></div>
          <div class="build-stack ${s.b>0?'positive-build':'negative-build'}" id="secondStack" aria-live="polite"></div>
          <button class="build-card-btn ${s.b>0?'positive':'negative'}" id="secondAddBtn" type="button" disabled>
            <span>${signedOne(s.b)}</span><small>${buttonText(s.b,0,secondTarget)}</small>
          </button>
        </section>
      </div>

      <div class="guided-message" id="addGuideMessage">
        Tekan tombol <b>${signedOne(s.a)}</b> sebanyak <b>${firstTarget} kali</b> untuk membentuk bilangan ${plainNumber(s.a)}.
      </div>

      <div class="zero-pair-auto-zone" id="addAutoPairZone" hidden>
        <div class="auto-pair-title">Pasangan nol</div>
        <div class="auto-pair-list" id="addAutoPairList"></div>
      </div>

      <div class="guided-action-zone" id="addActionZone"></div>
      <div id="addResultZone"></div>`;

    const firstBtn=document.getElementById('firstAddBtn');
    const secondBtn=document.getElementById('secondAddBtn');
    const firstStack=document.getElementById('firstStack');
    const secondStack=document.getElementById('secondStack');
    const firstCol=document.getElementById('buildFirst');
    const secondCol=document.getElementById('buildSecond');
    const guide=document.getElementById('addGuideMessage');
    const action=document.getElementById('addActionZone');

    function setStep(n){
      document.querySelectorAll('#guidedStepper span').forEach(el=>{
        const step=+el.dataset.step;
        el.classList.toggle('active',step===n);
        el.classList.toggle('done',step<n);
      });
    }

    function appendCard(stack,v,index){
      const wrap=document.createElement('div');
      wrap.className='guided-card-pop';
      wrap.innerHTML=card(v,`guided-${currentIndex}-${v}-${index}-${Date.now()}`);
      const el=wrap.firstElementChild;
      el.draggable=false;
      stack.appendChild(el);
      requestAnimationFrame(()=>el.classList.add('card-born'));
      setTimeout(()=>el.classList.remove('card-born'),450);
    }

    firstBtn.onclick=()=>{
      if(firstCount>=firstTarget)return;
      firstCount++;
      appendCard(firstStack,s.a>0?1:-1,firstCount);
      firstBtn.querySelector('small').textContent=buttonText(s.a,firstCount,firstTarget);
      if(firstCount===firstTarget){
        firstBtn.disabled=true;
        firstCol.classList.remove('active');firstCol.classList.add('complete');
        secondCol.classList.remove('locked');secondCol.classList.add('active');
        secondBtn.disabled=false;
        setStep(2);
        guide.innerHTML=`✓ Bilangan <b>${plainNumber(s.a)}</b> sudah terbentuk. Sekarang tekan tombol <b>${signedOne(s.b)}</b> sebanyak <b>${secondTarget} kali</b>.`;
        secondBtn.focus({preventScroll:true});
      }
    };

    secondBtn.onclick=()=>{
      if(secondCount>=secondTarget)return;
      secondCount++;
      appendCard(secondStack,s.b>0?1:-1,secondCount);
      secondBtn.querySelector('small').textContent=buttonText(s.b,secondCount,secondTarget);
      if(secondCount===secondTarget){
        secondBtn.disabled=true;
        secondCol.classList.remove('active');secondCol.classList.add('complete');
        setStep(3);
        showObserveStage();
      }
    };

    function showObserveStage(){
      const sameSign=Math.sign(s.a)===Math.sign(s.b);
      if(sameSign){
        const total=firstTarget+secondTarget;
        guide.innerHTML=`<b>Perhatikan kartu sekarang.</b><br>Ada ${total} kartu ${signName(s.a)}. Tekan <b>Hitung</b> untuk mengetahui hasil penjumlahannya.`;
        action.innerHTML=`<button class="btn guided-main-action" id="addCountBtn" type="button">Hitung kartu</button>`;
        document.getElementById('addCountBtn').onclick=showResult;
      }else{
        guide.innerHTML=`<b>Perhatikan kedua kelompok kartu.</b><br>Ada ${firstTarget} kartu ${signName(s.a)} dan ${secondTarget} kartu ${signName(s.b)}. Sebelum menghitung, bentuk pasangan nol.`;
        action.innerHTML=`<button class="btn guided-main-action" id="addPairBtn" type="button">Pasangkan kartu nol</button>`;
        document.getElementById('addPairBtn').onclick=runAutoPairing;
      }
    }

    function runAutoPairing(){
      if(paired)return;paired=true;
      const btn=document.getElementById('addPairBtn');
      btn.disabled=true;
      const positives=[...lab.querySelectorAll('.int-card.pos')];
      const negatives=[...lab.querySelectorAll('.int-card.neg')];
      const pairCount=Math.min(positives.length,negatives.length);
      const pairZone=document.getElementById('addAutoPairZone');
      const pairList=document.getElementById('addAutoPairList');
      pairZone.hidden=false;
      setStep(3);
      guide.innerHTML=`Amati: setiap <b>+1</b> dipasangkan dengan <b>−1</b>, sehingga nilainya menjadi <b>0</b>.`;

      let i=0;
      function nextPair(){
        if(i>=pairCount){
          const remainPos=positives.length-pairCount;
          const remainNeg=negatives.length-pairCount;
          const remain=remainPos||remainNeg;
          const remainSign=remainPos?1:-1;
          guide.innerHTML=`✓ Pasangan nol selesai. Sekarang tersisa <b>${remain} kartu ${signName(remainSign)}</b>. Tekan <b>Hitung</b>.`;
          action.innerHTML=`<button class="btn guided-main-action" id="addCountBtn" type="button">Hitung kartu yang tersisa</button>`;
          document.getElementById('addCountBtn').onclick=showResult;
          return;
        }
        const p=positives[i],n=negatives[i];
        p.classList.add('auto-pair-pos');n.classList.add('auto-pair-neg');
        setTimeout(()=>{
          p.classList.add('auto-paired');n.classList.add('auto-paired');
          const row=document.createElement('div');
          row.className='auto-zero-row pop';
          row.innerHTML='<span class="mini-pos">+1</span><span>+</span><span class="mini-neg">−1</span><b>= 0</b>';
          pairList.appendChild(row);
          i++;
          setTimeout(nextPair,300);
        },520);
      }
      nextPair();
    }

    function showResult(){
      if(calculating)return;calculating=true;
      setStep(4);
      action.innerHTML='';
      const resultZone=document.getElementById('addResultZone');
      const sign=s.answer>0?'positif':s.answer<0?'negatif':'nol';
      const remaining=Math.abs(s.answer);
      let visual='';
      if(s.answer!==0){
        visual=`<div class="final-card-count">${Array.from({length:remaining},(_,i)=>card(s.answer>0?1:-1,`final-${i}`)).join('')}</div>`;
      }else{
        visual='<div class="final-zero-badge">0</div>';
      }
      resultZone.innerHTML=`
        <div class="guided-result pop">
          <span class="result-check">✓</span>
          <div>
            <b>Hasil ditemukan</b>
            ${visual}
            <p>${s.answer===0?'Tidak ada kartu yang tersisa.':`Ada <strong>${remaining} kartu ${sign}</strong>.`}</p>
            <div class="final-equation">${plainNumber(s.a)} + ${resultTerm(s.b)} = <strong>${plainNumber(s.answer)}</strong></div>
            <p class="result-conclusion">Jadi hasil dari <strong>${plainNumber(s.a)} + ${resultTerm(s.b)}</strong> adalah <strong>${plainNumber(s.answer)}</strong>.</p>
          </div>
        </div>`;
      resultZone.querySelectorAll('.int-card').forEach(c=>c.draggable=false);
      const isLast=currentIndex===scenarios.length-1;
      resultZone.insertAdjacentHTML('beforeend',`<div class="explore-actions pop"><button id="repeatAddExplore" class="btn secondary" type="button">↻ Ulangi eksplorasi</button><button id="nextAddExplore" class="btn" type="button">${isLast?'Lihat Kesimpulan Penjumlahan →':'Lanjut ke eksplorasi berikutnya →'}</button></div>`);
      document.getElementById('repeatAddExplore').onclick=()=>{
        renderScenario();
        document.getElementById('addLab')?.scrollIntoView({behavior:'smooth',block:'start'});
      };
      document.getElementById('nextAddExplore').onclick=()=>{
        if(!isLast){
          currentIndex++;
          renderScenario();
          document.getElementById('addLab')?.scrollIntoView({behavior:'smooth',block:'start'});
        }else{
          currentIndex=scenarios.length;
          renderProgress();
          renderAdditionConclusion();
        }
      };
    }
  }

  function renderAdditionConclusion(){
    const lab=document.getElementById('addLab');
    lab.innerHTML=`
      <section class="topic-conclusion pop">
        <p class="eyebrow">Kesimpulan Penjumlahan</p>
        <h3>Apa yang kamu temukan?</h3>
        <p class="conclusion-intro">Perhatikan kembali model matematika dari setiap eksplorasi.</p>
        <div class="conclusion-equation-grid">
          ${scenarios.map((s,i)=>`<div class="conclusion-equation-card"><small>Eksplorasi ${i+1}</small><strong>${plainNumber(s.a)} + ${resultTerm(s.b)} = ${plainNumber(s.answer)}</strong><span>${Math.sign(s.a)===Math.sign(s.b)?`Tandanya sama, kartu digabung menjadi ${Math.abs(s.answer)} kartu ${s.answer>0?'positif':'negatif'}.`:`Pasangan +1 dan −1 menjadi 0. Tersisa ${Math.abs(s.answer)} kartu ${s.answer>0?'positif':'negatif'}.`}</span></div>`).join('')}
        </div>
        <div class="conclusion-rule-box">
          <b>Kesimpulan</b>
          <p>Jika tandanya sama, jumlahkan banyak kartunya dan pertahankan tandanya. Jika tandanya berbeda, bentuk pasangan nol. Tanda hasil mengikuti kartu yang masih tersisa.</p>
        </div>
        <div class="explore-actions">
          <button class="btn secondary" id="reviewAddExplore" type="button">← Ulangi eksplorasi</button>
          <button class="btn" id="startAddPractice" type="button">Mulai Latihan Penjumlahan →</button>
        </div>
      </section>`;
    document.getElementById('reviewAddExplore').onclick=()=>{currentIndex=0;renderScenario();document.getElementById('addLab')?.scrollIntoView({behavior:'smooth',block:'start'});};
    document.getElementById('startAddPractice').onclick=()=>startTopicPractice({title:'Latihan Penjumlahan',subtitle:'Kerjakan 5 soal acak.',count:5,makeQuestion:additionQuestion,onComplete:()=>{complete('addition');go('subtraction')}});
    lab.scrollIntoView({behavior:'smooth',block:'start'});
  }

  renderScenario();
}

function fmt(n){return n>0?'+'+n:String(n).replace('-','−')}
