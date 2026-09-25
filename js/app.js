const app=document.getElementById('app');function setLast(x){let p=loadProgress();p.last=x;saveProgress(p)}function lessonShell(title,sub,body){return `<div class="stepper">${CONTENT.modules.map((m,i)=>`<span class="${loadProgress().done.includes(m[0])?'active':''}">${i+1}. ${m[1]}</span>`).join('')}</div><div class="section"><p class="eyebrow">Eksperimen Matematika</p><h1>${title}</h1><p>${sub}</p></div>${body}<div id="nextArea"></div>`}function nextButton(id){nextArea.innerHTML=`<button class="btn" onclick="go('${id}')">Lanjut →</button>`}function wireChoices(answer,cb){document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');let ok=+b.dataset.a===answer;b.classList.add(ok?'correct':'wrong');let f=document.getElementById('feedback');if(f)f.innerHTML=`<div class="feedback">${ok?'✓ Benar!':'Belum tepat. Perhatikan kembali pola atau kartu yang tersedia.'}</div>`;if(ok)cb?.(true)})}function renderHome(){updateProgressUI();let p=loadProgress();app.innerHTML=`<section class="hero"><div class="visual">➕ 🟦 🟧 ➖</div><p class="eyebrow">Interactive Digital Learning Book</p><h1>${CONTENT.title}</h1><p class="lead">${CONTENT.subtitle}</p><button class="btn" onclick="go('${p.done.length?p.last==='home'?'intro':p.last:'intro'}')">${p.done.length?'Lanjutkan Belajar':'Mulai Belajar'}</button></section><div class="grid">${CONTENT.modules.map(m=>`<div class="module ${unlocked(m[0])?'':'locked'}" onclick="${unlocked(m[0])?`go('${m[0]}')`:''}"><small>${loadProgress().done.includes(m[0])?'✓ Selesai':unlocked(m[0])?'Siap dipelajari':'🔒 Terkunci'}</small><h3>${m[1]}</h3><p>${m[2]}</p></div>`).join('')}</div>`}function renderIntro(){
  setLast('intro');
  app.innerHTML=lessonShell(
    'Kenali Kartu Bilangan',
    'Satu kartu positif dan satu kartu negatif membentuk pasangan nol.',
    `<div class="section">
      <h2>Kenali dan pasangkan kartu</h2>
      <p class="instruction">Kartu <b>+1 berwarna biru</b> dan kartu <b>−1 berwarna merah</b>. Seret satu kartu positif dan satu kartu negatif ke area <b>Pasangan Nol</b>, atau ketuk kedua kartu secara bergantian.</p>
      ${verticalBoard(3,2,'introBoard')}
      <p id="introInfo" class="feedback" aria-live="polite">Pasangan nol ditemukan: 0</p>
    </div>`
  );
  let n=0;
  const board=document.getElementById('introBoard');
  enableZeroPairing(board,()=>{
    n++;
    const info=document.getElementById('introInfo');
    info.textContent='Pasangan nol ditemukan: '+n;
    if(n===2){
      info.innerHTML='✓ Dua pasangan bernilai 0. Tersisa satu kartu positif, jadi nilainya <b>+1</b>.';
      complete('intro');
      nextButton('addition');
    }
  });
}
function renderLearn(){let first=ORDER.find(x=>unlocked(x)&&!loadProgress().done.includes(x))||'intro';go(first)}function renderProgress(){let p=loadProgress();app.innerHTML=`<div class="section"><h1>Progress Belajar</h1>${CONTENT.modules.map(m=>`<p><b>${m[1]}</b><br><span class="small">${p.done.includes(m[0])?'100% ✓':unlocked(m[0])?'Belum selesai':'Terkunci'}</span></p>`).join('')}<p><b>Nilai evaluasi:</b> ${p.score??'Belum ada'}</p><button class="btn secondary" onclick="resetProgress()">Reset Progress</button></div>`}function lockedMsg(){app.innerHTML='<div class="section"><h2>Evaluasi masih terkunci</h2><p>Selesaikan seluruh materi terlebih dahulu.</p><button class="btn" onclick="renderLearn()">Lanjut Belajar</button></div>'}renderHome();
