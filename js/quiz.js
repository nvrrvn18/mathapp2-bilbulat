const Q=[
  ['5 + (−3) = ...',[2,-2,8,-8],2,'addition'],
  ['(−4) + 4 = ...',[0,-8,8,4],0,'addition'],
  ['2 − 5 = ...',[-3,3,7,-7],-3,'subtraction'],
  ['(−2) − (−3) = ...',[1,-1,-5,5],1,'subtraction'],
  ['(−3) × (−2) = ...',[6,-6,5,-5],6,'multiplication'],
  ['3 × (−4) = ...',[-12,12,-7,7],-12,'multiplication'],
  ['(−12) ÷ 3 = ...',[-4,4,-9,9],-4,'division'],
  ['(−12) ÷ (−3) = ...',[4,-4,9,-9],4,'division'],
  ['Suhu 2°C turun 5°C. Suhu sekarang ...',[-3,3,7,-7],-3,'context'],
  ['Skor −2 berubah dengan tambahan +6. Skor baru ...',[4,-4,8,-8],4,'context']
];

function renderQuiz(){
  if(!loadProgress().done.includes('division'))return lockedMsg();
  let questions=shuffle(Q),i=0,score=0,wrongCount=0,restartCount=0,locked=false;

  function show(){
    locked=false;
    const q=questions[i];
    app.innerHTML=`<div class="section quiz-section">
      <div class="quiz-topline"><p class="eyebrow">Uji Pemahaman • Soal ${i+1} dari ${questions.length}</p><span class="wrong-counter">Salah: <b>${wrongCount}</b> / 5</span></div>
      <div class="quiz-progress"><i style="width:${(i/questions.length)*100}%"></i></div>
      <h2>${q[0]}</h2>
      ${choices(shuffle(q[1]),q[2])}
      <div id="quizStatus"></div>
    </div>`;
    document.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>answer(btn,q));
  }

  function answer(btn,q){
    if(locked)return;
    const ok=+btn.dataset.a===q[2];
    const feedback=document.getElementById('feedback');
    document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected',ok?'correct':'wrong');
    if(!ok){
      wrongCount++;
      if(feedback)feedback.innerHTML=`<div class="feedback feedback-warning">Belum tepat. Jumlah kesalahan: <b>${wrongCount}</b>.</div>`;
      const counter=document.querySelector('.wrong-counter b');if(counter)counter.textContent=wrongCount;
      if(wrongCount>5){
        locked=true;restartCount++;
        document.querySelectorAll('.choice').forEach(x=>x.disabled=true);
        document.getElementById('quizStatus').innerHTML=`<div class="quiz-restart pop"><span>🔄</span><h3>Evaluasi diulang</h3><p>Kesalahan sudah lebih dari 5 kali. Urutan soal akan diacak kembali.</p></div>`;
        setTimeout(()=>restart(),1200);
      }
      return;
    }
    locked=true;score++;
    document.querySelectorAll('.choice').forEach(x=>x.disabled=true);
    if(feedback)feedback.innerHTML='<div class="feedback feedback-success">✓ Benar!</div>';
    setTimeout(()=>{i++;i<questions.length?show():finish()},500);
  }

  function restart(){
    questions=shuffle(Q);i=0;score=0;wrongCount=0;locked=false;show();
  }

  function finish(){
    const val=Math.round(score/questions.length*100),p=loadProgress();p.score=val;saveProgress(p);
    app.innerHTML=`<div class="section"><p class="eyebrow">Hasil Belajar</p><div class="score">${val}/100</div><p style="text-align:center">${val>=80?'Sangat Baik':val>=70?'Baik, sedikit lagi!':'Ayo pelajari kembali bagian yang belum dikuasai.'}</p><p style="text-align:center">Jumlah salah pada percobaan ini: <b>${wrongCount}</b>${restartCount?` • Evaluasi pernah diulang otomatis ${restartCount} kali`:''}</p><button class="btn" onclick="renderQuiz()">Ulangi Evaluasi</button> <button class="btn secondary" onclick="renderHome()">Kembali ke Beranda</button></div>`;
  }
  show();
}
