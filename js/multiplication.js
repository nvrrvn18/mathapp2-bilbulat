function renderMultiplication(){
  setLast('multiplication');
  app.innerHTML=lessonShell(
    'Perkalian Bilangan Bulat',
    'Amati situasi, hubungkan dengan model matematika, lalu temukan sendiri pola tandanya.',
    `<div class="section">
      <p class="eyebrow">Contoh sehari-hari</p>
      <h2>🎮 Kehilangan poin dalam 3 ronde</h2>
      <div class="story-strip">
        <span class="story-icon">🎮</span>
        <div>
          <b>Dalam setiap ronde, skor Dimas berkurang 2 poin. Ia bermain 3 ronde.</b>
          <small>Tiga ronde dengan perubahan −2 pada setiap ronde.</small>
        </div>
      </div>
      <div class="math-model-card">
        <small>Model matematika</small>
        <strong>3 × (−2) = −6</strong>
        <span>(−2) + (−2) + (−2) = −6</span>
      </div>
      <div id="mulSource" class="object-bank"><span class="score-token" draggable="true">−2</span><span class="score-token" draggable="true">−2</span><span class="score-token" draggable="true">−2</span></div>
      <p class="instruction">Seret setiap perubahan −2 ke satu kotak ronde. Di HP, ketuk kotak ronde untuk menempatkan token.</p>
      <div id="mulGroups" class="pictorial-groups">${[1,2,3].map(i=>`<div class="picture-group drop-group" data-slot="${i}"><b>Ronde ${i}</b><div class="slot-content"></div></div>`).join('')}</div>
      <div id="mulStoryFeedback" class="feedback">Terisi 0 dari 3 ronde.</div>
    </div>

    <div class="section" id="mulPatternSection" style="display:none">
      <p class="eyebrow">Penemuan pola</p>
      <h2>Dari positif menuju negatif</h2>
      <p class="pattern-intro">Perhatikan faktor pertama: <b>4, 3, 2, 1, 0, −1, −2</b>. Faktor kedua tetap <b>−2</b>. Amati bagaimana hasil berubah.</p>
      <div class="pattern-table modern-pattern">
        ${patternLine('4 × (−2)','−8','known')}
        ${patternLine('3 × (−2)','−6','known')}
        ${patternLine('2 × (−2)','−4','known')}
        ${patternLine('1 × (−2)','−2','known')}
        ${patternLine('0 × (−2)','0','known')}
        ${patternQuestion('mulNeg1','(−1) × (−2)',[-2,2,-1,1],2)}
        ${patternQuestion('mulNeg2','(−2) × (−2)',[-4,-2,2,4],4,true)}
      </div>
      <div id="mulPatternFeedback" class="feedback">Isi dua baris terakhir untuk menemukan pola negatif × negatif.</div>
      <div id="multiplyConclusion"></div>
    </div>`
  );

  setupTokenDrag();

  function patternLine(exp,result,cls=''){
    return `<div class="pattern-step ${cls}"><span class="pattern-factor">${exp}</span><span class="pattern-eq">=</span><strong>${result}</strong></div>`;
  }

  function patternQuestion(id,exp,opts,answer,locked=false){
    return `<div class="pattern-step question ${locked?'locked-step':''}" id="${id}Row"><span class="pattern-factor">${exp}</span><span class="pattern-eq">=</span><div class="mini-choice-row">${opts.map(v=>`<button class="mini-choice" data-pattern="${id}" data-value="${v}" data-answer="${answer}" ${locked?'disabled':''}>${v>0?'+'+v:String(v).replace('-', '−')}</button>`).join('')}</div></div>`;
  }

  function setupTokenDrag(){
    let dragged=null,filled=0;
    document.querySelectorAll('.score-token').forEach(t=>t.addEventListener('dragstart',e=>{dragged=t;e.dataTransfer.setData('text/plain','-2')}));
    document.querySelectorAll('.drop-group').forEach(g=>{
      g.addEventListener('dragover',e=>{e.preventDefault();g.classList.add('drag-over')});
      g.addEventListener('dragleave',()=>g.classList.remove('drag-over'));
      g.addEventListener('drop',e=>{e.preventDefault();g.classList.remove('drag-over');place(g)});
      g.addEventListener('click',()=>{const t=[...document.querySelectorAll('.score-token')].find(x=>!x.classList.contains('used'));if(t){dragged=t;place(g)}})
    });

    function place(g){
      if(!dragged||g.classList.contains('filled')||dragged.classList.contains('used'))return;
      g.classList.add('filled');
      g.querySelector('.slot-content').innerHTML='<span class="score-token placed">−2</span><div class="tiny-cards">'+cards(0,2)+'</div>';
      dragged.classList.add('used');filled++;
      mulStoryFeedback.innerHTML=`Terisi <b>${filled} dari 3</b> ronde.${filled===3?' Total perubahan: (−2)+(−2)+(−2)=<b>−6</b>.':''}`;
      dragged=null;
      if(filled===3){
        mulPatternSection.style.display='block';
        mulPatternSection.scrollIntoView({behavior:'smooth',block:'start'});
        wirePattern();
      }
    }
  }

  function wirePattern(){
    let firstDone=false,secondDone=false;
    const buttons=[...document.querySelectorAll('.mini-choice')];
    buttons.forEach(btn=>btn.onclick=()=>{
      const group=btn.dataset.pattern;
      const answer=+btn.dataset.answer;
      const value=+btn.dataset.value;
      const siblings=[...document.querySelectorAll(`.mini-choice[data-pattern="${group}"]`)];
      siblings.forEach(x=>x.classList.remove('wrong','correct'));
      if(value!==answer){
        btn.classList.add('wrong');
        mulPatternFeedback.innerHTML='<div class="feedback feedback-warning">Belum tepat. Setiap turun satu langkah pada faktor pertama, hasil bertambah 2.</div>';
        return;
      }
      btn.classList.add('correct');
      siblings.forEach(x=>x.disabled=true);
      if(group==='mulNeg1'){
        firstDone=true;
        document.querySelectorAll('[data-pattern="mulNeg2"]').forEach(x=>x.disabled=false);
        document.getElementById('mulNeg2Row').classList.remove('locked-step');
        mulPatternFeedback.innerHTML='<div class="feedback feedback-success">✓ Benar. Setelah 0 × (−2) = 0, maka (−1) × (−2) = +2. Lanjutkan satu langkah lagi.</div>';
      }
      if(group==='mulNeg2'){
        secondDone=true;
        mulPatternFeedback.innerHTML='<div class="feedback feedback-success">✓ Pola ditemukan. Bilangan negatif dikali bilangan negatif menghasilkan bilangan positif.</div>';
      }
      if(firstDone&&secondDone)showConclusion();
    });
  }

  function showConclusion(){
    document.getElementById('multiplyConclusion').innerHTML=`
      <div class="concept-summary pop">
        <div class="concept-summary-icon">✦</div>
        <div>
          <p class="eyebrow">Kesimpulan perkalian</p>
          <h3>Pola tanda perkalian bilangan bulat</h3>
          <p>Dari pola di atas, ketika faktor pertama bergerak dari positif, 0, lalu negatif, hasil tetap mengikuti pola yang teratur.</p>
          <div class="sign-rule-grid">
            <div class="sign-rule positive"><b>Positif × Positif</b><span>hasil positif</span><strong>+ × + = +</strong></div>
            <div class="sign-rule positive"><b>Negatif × Negatif</b><span>hasil positif</span><strong>− × − = +</strong></div>
            <div class="sign-rule negative"><b>Positif × Negatif</b><span>hasil negatif</span><strong>+ × − = −</strong></div>
            <div class="sign-rule negative"><b>Negatif × Positif</b><span>hasil negatif</span><strong>− × + = −</strong></div>
          </div>
          <div class="memory-trick"><b>Trik melihat hasil perkalian bilangan bulat</b><p><strong>Tanda sama → hasil positif.</strong><br><strong>Tanda berbeda → hasil negatif.</strong></p></div>
        </div>
      </div>
      <button class="btn" id="mulPracticeStart">Mulai Latihan Perkalian →</button>`;
    document.getElementById('mulPracticeStart').onclick=()=>startTopicPractice({
      title:'Latihan Perkalian',
      subtitle:'Kerjakan contoh soal acak dari situasi sehari-hari sebelum melanjutkan ke pembagian.',
      count:5,
      makeQuestion:multiplicationQuestion,
      onComplete:()=>{complete('multiplication');go('division')}
    });
  }
}
