const app=document.getElementById('app');

function setLast(x){
  const p=loadProgress();
  p.last=x;
  saveProgress(p);
}

function lessonShell(title,sub,body){
  return `<div class="stepper">${CONTENT.modules.map((m,i)=>`<span class="${loadProgress().done.includes(m[0])?'active':''}">${i+1}. ${m[1]}</span>`).join('')}</div>
    <div class="section lesson-heading">
      <p class="eyebrow">Eksperimen Matematika</p>
      <h1>${title}</h1>
      <p class="lesson-subtitle">${sub}</p>
    </div>
    ${body}
    <div id="nextArea"></div>`;
}

function nextButton(id,label='Lanjut →'){
  const nextArea=document.getElementById('nextArea');
  if(!nextArea)return;
  nextArea.innerHTML=`<div class="next-card"><button class="btn" onclick="go('${id}')">${label}</button></div>`;
}

function wireChoices(answer,cb){
  document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected','wrong'));
    b.classList.add('selected');
    const ok=+b.dataset.a===answer;
    b.classList.add(ok?'correct':'wrong');
    const f=document.getElementById('feedback');
    if(f)f.innerHTML=`<div class="feedback ${ok?'feedback-success':'feedback-warning'}">${ok?'✓ Benar!':'Belum tepat. Perhatikan kembali pola atau kartu yang tersedia.'}</div>`;
    if(ok){
      document.querySelectorAll('.choice').forEach(x=>x.disabled=true);
      cb?.(true);
    }
  });
}

function formatNumber(n){return n>0?`+${n}`:String(n).replace('-', '−')}
function mathNumber(n){return n<0?`(${formatNumber(n)})`:String(n)}
function plainNumber(n){return String(n).replace('-', '−')}
function resultTerm(n){return n<0?`(${plainNumber(n)})`:plainNumber(n)}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function optionSet(answer){
  const values=new Set([answer]);
  const offsets=shuffle([-3,-2,-1,1,2,3,4,-4]);
  for(const d of offsets){if(values.size>=4)break;values.add(answer+d)}
  return shuffle([...values]).slice(0,4);
}

function startTopicPractice({title,subtitle,count=5,makeQuestion,onComplete}){
  const host=document.getElementById('nextArea');
  if(!host)return;
  let index=0,score=0,current=null,locked=false;
  host.innerHTML=`<section class="section practice-section" id="topicPractice">
    <div class="practice-header">
      <div><p class="eyebrow">Latihan Acak</p><h2>${title}</h2><p>${subtitle}</p></div>
      <div class="practice-counter" id="practiceCounter">1 / ${count}</div>
    </div>
    <div class="practice-progress"><i id="practiceBar"></i></div>
    <div id="practiceBody"></div>
  </section>`;
  host.scrollIntoView({behavior:'smooth',block:'start'});

  function nextQuestion(){
    locked=false;
    current=makeQuestion(index);
    const body=document.getElementById('practiceBody');
    document.getElementById('practiceCounter').textContent=`${index+1} / ${count}`;
    document.getElementById('practiceBar').style.width=`${index/count*100}%`;
    body.innerHTML=`
      ${current.context?`<div class="practice-context"><span>${current.icon||'💡'}</span><p>${current.context}</p></div>`:''}
      <div class="practice-question"><small>Soal ${index+1}</small><strong>${current.question}</strong></div>
      <div class="practice-options">${optionSet(current.answer).map(v=>`<button class="practice-choice" data-v="${v}">${formatNumber(v)}</button>`).join('')}</div>
      <div id="practiceFeedback"></div>`;
    body.querySelectorAll('.practice-choice').forEach(btn=>btn.onclick=()=>answer(btn));
  }

  function answer(btn){
    if(locked)return;
    const value=+btn.dataset.v;
    const fb=document.getElementById('practiceFeedback');
    if(value!==current.answer){
      btn.classList.add('wrong');
      fb.innerHTML='<div class="feedback feedback-warning">Belum tepat. Coba hitung kembali.</div>';
      return;
    }
    locked=true;score++;
    btn.classList.add('correct');
    document.querySelectorAll('.practice-choice').forEach(x=>x.disabled=true);
    fb.innerHTML=`<div class="result-sentence pop"><span class="result-check">✓</span><div><b>Benar!</b><p>${current.resultText}</p>${current.explanation?`<small>${current.explanation}</small>`:''}</div></div>
      <button class="btn practice-next" id="practiceNext">${index===count-1?'Lihat hasil latihan':'Soal berikutnya →'}</button>`;
    document.getElementById('practiceNext').onclick=()=>{
      index++;
      if(index<count){nextQuestion();return;}
      finish();
    };
  }

  function finish(){
    document.getElementById('practiceBar').style.width='100%';
    document.getElementById('practiceCounter').textContent=`${count} / ${count}`;
    document.getElementById('practiceBody').innerHTML=`<div class="practice-finish pop"><div class="finish-icon">🎯</div><h3>Latihan selesai</h3><p>Kamu menjawab benar ${score} dari ${count} soal.</p><button id="practiceContinue" class="btn">Lanjut →</button></div>`;
    document.getElementById('practiceContinue').onclick=onComplete;
  }
  nextQuestion();
}

function additionQuestion(){
  const types=['pp','pn','nn'];
  const t=types[randomInt(0,types.length-1)];
  let a,b;
  if(t==='pp'){a=randomInt(1,8);b=randomInt(1,8)}
  if(t==='pn'){a=randomInt(1,9);b=-randomInt(1,9)}
  if(t==='nn'){a=-randomInt(1,8);b=-randomInt(1,8)}
  const answer=a+b;
  return {question:`${formatNumber(a)} + ${mathNumber(b)} = ...`,answer,resultText:`Jadi hasil dari ${plainNumber(a)} + ${resultTerm(b)} adalah ${plainNumber(answer)}.`,explanation:t==='pn'?'Pasangkan +1 dan −1. Tanda hasil mengikuti kartu yang tersisa.':'Karena tandanya sama, jumlahkan banyak kartunya dan pertahankan tandanya.'};
}

function subtractionQuestion(){
  const types=['pp','pn','nn','np'];
  const t=types[randomInt(0,types.length-1)];
  let a,b;
  if(t==='pp'){a=randomInt(2,9);b=randomInt(1,8)}
  if(t==='pn'){a=randomInt(1,8);b=-randomInt(1,8)}
  if(t==='nn'){a=-randomInt(2,9);b=-randomInt(1,8)}
  if(t==='np'){a=-randomInt(1,8);b=randomInt(1,8)}
  const answer=a-b;
  return {question:`${formatNumber(a)} − ${mathNumber(b)} = ...`,answer,resultText:`Jadi hasil dari ${plainNumber(a)} − ${resultTerm(b)} adalah ${plainNumber(answer)}.`,explanation:'Pengurangan berarti mengambil kartu. Jika kartu yang dibutuhkan belum tersedia, gunakan pasangan nol.'};
}

function multiplicationQuestion(i){
  const contexts=[
    {icon:'🎮',make:()=>{const groups=randomInt(2,5),change=-randomInt(1,5),answer=groups*change;return {context:`Dalam permainan, skor berkurang ${Math.abs(change)} poin pada setiap ronde selama ${groups} ronde. Berapa perubahan skor seluruhnya?`,question:`${groups} × (${formatNumber(change)}) = ...`,answer,resultText:`Jadi hasil dari ${groups} × (${plainNumber(change)}) adalah ${plainNumber(answer)}.`}}},
    {icon:'💰',make:()=>{const days=randomInt(2,5),gain=randomInt(2,6),answer=days*gain;return {context:`Tabungan bertambah ${gain} ribu rupiah per hari selama ${days} hari. Berapa total pertambahannya?`,question:`${days} × ${gain} = ...`,answer,resultText:`Jadi hasil dari ${days} × ${gain} adalah ${answer}.`}}},
    {icon:'🌡️',make:()=>{const hours=randomInt(2,5),drop=-randomInt(1,4),answer=hours*drop;return {context:`Suhu berubah ${formatNumber(drop)}°C setiap jam selama ${hours} jam. Berapa perubahan suhu seluruhnya?`,question:`${hours} × (${formatNumber(drop)}) = ...`,answer,resultText:`Jadi hasil dari ${hours} × (${plainNumber(drop)}) adalah ${plainNumber(answer)}.`}}}
  ];
  return contexts[i%contexts.length].make();
}

function divisionQuestion(i){
  const contexts=[
    {icon:'💳',make:()=>{const d=randomInt(2,5),q=-randomInt(1,6),total=d*q;return {context:`Perubahan saldo sebesar ${formatNumber(total)} ribu rupiah terjadi merata selama ${d} hari. Berapa perubahan per hari?`,question:`${formatNumber(total)} ÷ ${d} = ...`,answer:q,resultText:`Jadi hasil dari ${plainNumber(total)} ÷ ${d} adalah ${plainNumber(q)}.`}}},
    {icon:'📦',make:()=>{const d=randomInt(2,5),q=randomInt(2,6),total=d*q;return {context:`Ada ${total} benda yang dibagi rata ke ${d} kelompok. Berapa isi tiap kelompok?`,question:`${total} ÷ ${d} = ...`,answer:q,resultText:`Jadi hasil dari ${total} ÷ ${d} adalah ${q}.`}}},
    {icon:'🎮',make:()=>{const d=-randomInt(2,5),q=randomInt(1,5),total=d*q;return {context:`Total perubahan skor ${formatNumber(total)} dibagi menjadi ${Math.abs(d)} bagian dengan tanda pembagi negatif pada model matematika. Tentukan hasil pembagiannya.`,question:`${formatNumber(total)} ÷ (${formatNumber(d)}) = ...`,answer:q,resultText:`Jadi hasil dari ${plainNumber(total)} ÷ (${plainNumber(d)}) adalah ${plainNumber(q)}.`}}}
  ];
  return contexts[i%contexts.length].make();
}

function renderHome(){
  updateProgressUI();
  const p=loadProgress();
  app.innerHTML=`<section class="hero"><div class="visual">➕ <span class="hero-positive">+1</span> <span class="hero-negative">−1</span> ➖</div><p class="eyebrow">Interactive Digital Learning Book</p><h1>${CONTENT.title}</h1><p class="lead">${CONTENT.subtitle}</p><button class="btn hero-btn" onclick="go('${p.done.length?p.last==='home'?'intro':p.last:'intro'}')">${p.done.length?'Lanjutkan Belajar':'Mulai Belajar'}</button></section><div class="grid">${CONTENT.modules.map((m,i)=>`<div class="module ${unlocked(m[0])?'':'locked'}" onclick="${unlocked(m[0])?`go('${m[0]}')`:''}"><div class="module-number">${i+1}</div><small>${p.done.includes(m[0])?'✓ Selesai':unlocked(m[0])?'Siap dipelajari':'🔒 Terkunci'}</small><h3>${m[1]}</h3><p>${m[2]}</p></div>`).join('')}</div>`;
}

function renderIntro(){
  setLast('intro');
  app.innerHTML=lessonShell('Kenali Kartu Bilangan','Satu kartu positif dan satu kartu negatif membentuk pasangan nol.',`<div class="section"><h2>Kenali dan pasangkan kartu</h2><p class="instruction">Kartu <b>+1 berwarna biru</b> dan kartu <b>−1 berwarna merah</b>. Seret satu kartu positif dan satu kartu negatif ke area <b>Pasangan Nol</b>, atau ketuk kedua kartu secara bergantian.</p>${verticalBoard(3,2,'introBoard')}<p id="introInfo" class="feedback" aria-live="polite">Pasangan nol ditemukan: 0</p></div>`);
  let n=0;
  const board=document.getElementById('introBoard');
  enableZeroPairing(board,()=>{
    n++;
    const info=document.getElementById('introInfo');
    info.textContent='Pasangan nol ditemukan: '+n;
    if(n===2){
      info.innerHTML='<div class="result-sentence"><span class="result-check">✓</span><div><b>Benar!</b><p>Dua pasangan bernilai 0. Tersisa satu kartu positif, jadi nilainya <b>+1</b>.</p></div></div>';
      complete('intro');
      nextButton('addition');
    }
  });
}

function renderLearn(){const first=ORDER.find(x=>unlocked(x)&&!loadProgress().done.includes(x))||'intro';go(first)}
function renderProgress(){const p=loadProgress();app.innerHTML=`<div class="section"><p class="eyebrow">Perjalanan Belajar</p><h1>Progress Belajar</h1>${CONTENT.modules.map(m=>`<div class="progress-row"><div><b>${m[1]}</b><span>${p.done.includes(m[0])?'100% selesai':unlocked(m[0])?'Belum selesai':'Terkunci'}</span></div><strong>${p.done.includes(m[0])?'✓':unlocked(m[0])?'•':'🔒'}</strong></div>`).join('')}<p><b>Nilai evaluasi:</b> ${p.score??'Belum ada'}</p><button class="btn secondary" onclick="resetProgress()">Reset Progress</button></div>`}
function lockedMsg(){app.innerHTML='<div class="section"><h2>Evaluasi masih terkunci</h2><p>Selesaikan seluruh materi terlebih dahulu.</p><button class="btn" onclick="renderLearn()">Lanjut Belajar</button></div>'}
renderHome();


function showLearningTransition({title='Benar!',message='Bersiap ke eksplorasi berikutnya…',nextLabel='Eksplorasi berikutnya',onDone,duration=1500}={}){
  document.querySelector('.learning-transition')?.remove();
  const overlay=document.createElement('div');
  overlay.className='learning-transition';
  overlay.setAttribute('role','status');
  overlay.setAttribute('aria-live','polite');
  overlay.innerHTML=`
    <div class="learning-transition-card">
      <div class="learning-transition-check">✓</div>
      <div class="learning-transition-copy">
        <strong>${title}</strong>
        <p>${message}</p>
        <span>${nextLabel}</span>
      </div>
      <div class="learning-transition-loader" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="learning-transition-progress" aria-hidden="true"><b></b></div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>overlay.classList.add('show'));
  const finish=()=>{
    overlay.classList.add('leave');
    setTimeout(()=>{overlay.remove();onDone?.()},260);
  };
  setTimeout(finish,duration);
}
