function renderDivision(){
  setLast('division');
  app.innerHTML=lessonShell(
    'Pembagian Bilangan Bulat',
    'Gunakan pengelompokan, hubungkan dengan perkalian, lalu temukan pola tanda pembagian.',
    `<div class="section">
      <p class="eyebrow">Contoh sehari-hari</p>
      <h2>💳 Membagi perubahan saldo</h2>
      <div class="story-strip">
        <span class="story-icon">💳</span>
        <div>
          <b>Total perubahan saldo selama 3 hari adalah −12 ribu rupiah, dengan perubahan yang sama setiap hari.</b>
          <small>Berapa perubahan saldo per hari?</small>
        </div>
      </div>
      <div class="math-model-card">
        <small>Model matematika</small>
        <strong>(−12) ÷ 3 = −4</strong>
        <span>karena 3 × (−4) = −12</span>
      </div>
      <div id="divBank" class="object-bank">${Array.from({length:12},(_,i)=>`<span class="debt-dot" draggable="true" data-id="${i}">−1</span>`).join('')}</div>
      <p class="instruction">Bagikan 12 token −1 secara sama rata ke 3 hari. Seret token ke kotak hari. Di HP, ketuk token lalu ketuk kotak.</p>
      <div id="divGroups" class="pictorial-groups">${[1,2,3].map(i=>`<div class="picture-group div-drop" data-day="${i}"><b>Hari ${i}</b><div class="day-tokens"></div><small>0 token</small></div>`).join('')}</div>
      <div id="divFeedback" class="feedback">Bagikan token sampai setiap hari mendapat jumlah yang sama.</div>
    </div>

    <div class="section" id="divPatternSection" style="display:none">
      <p class="eyebrow">Penemuan pola</p>
      <h2>Dari pembagian berbeda tanda menuju tanda sama</h2>
      <p class="pattern-intro">Pembagi tetap <b>−2</b>. Perhatikan hasil ketika bilangan yang dibagi bergerak dari positif, 0, lalu negatif.</p>
      <div class="pattern-table modern-pattern">
        ${divisionPatternLine('8 ÷ (−2)','−4')}
        ${divisionPatternLine('6 ÷ (−2)','−3')}
        ${divisionPatternLine('4 ÷ (−2)','−2')}
        ${divisionPatternLine('2 ÷ (−2)','−1')}
        ${divisionPatternLine('0 ÷ (−2)','0')}
        ${divisionPatternQuestion('divNeg1','(−2) ÷ (−2)',[-2,-1,1,2],1)}
        ${divisionPatternQuestion('divNeg2','(−4) ÷ (−2)',[-2,-1,1,2],2,true)}
      </div>
      <div id="divPatternFeedback" class="feedback">Isi dua baris terakhir untuk menemukan pola negatif ÷ negatif.</div>
      <div id="divisionConclusion"></div>
    </div>`
  );

  function divisionPatternLine(exp,result){
    return `<div class="pattern-step known"><span class="pattern-factor">${exp}</span><span class="pattern-eq">=</span><strong>${result}</strong></div>`;
  }
  function divisionPatternQuestion(id,exp,opts,answer,locked=false){
    return `<div class="pattern-step question ${locked?'locked-step':''}" id="${id}Row"><span class="pattern-factor">${exp}</span><span class="pattern-eq">=</span><div class="mini-choice-row">${opts.map(v=>`<button class="mini-choice" data-pattern="${id}" data-value="${v}" data-answer="${answer}" ${locked?'disabled':''}>${v>0?'+'+v:String(v).replace('-', '−')}</button>`).join('')}</div></div>`;
  }

  let selected=null;
  const tokens=[...document.querySelectorAll('.debt-dot')];
  const groups=[...document.querySelectorAll('.div-drop')];
  tokens.forEach(t=>{
    t.addEventListener('dragstart',e=>{selected=t;e.dataTransfer.setData('text/plain',t.dataset.id)});
    t.addEventListener('click',()=>{if(t.classList.contains('used'))return;tokens.forEach(x=>x.classList.remove('selected'));selected=t;t.classList.add('selected')});
  });
  groups.forEach(g=>{
    g.addEventListener('dragover',e=>{e.preventDefault();g.classList.add('drag-over')});
    g.addEventListener('dragleave',()=>g.classList.remove('drag-over'));
    g.addEventListener('drop',e=>{e.preventDefault();g.classList.remove('drag-over');place(g)});
    g.addEventListener('click',()=>place(g));
  });

  function place(g){
    if(!selected||selected.classList.contains('used'))return;
    const counts=groups.map(x=>x.querySelectorAll('.debt-dot').length);
    const min=Math.min(...counts);
    if(counts[groups.indexOf(g)]>min){divFeedback.innerHTML='Coba bagikan secara merata. Isi kelompok yang masih lebih sedikit.';return;}
    const clone=selected.cloneNode(true);clone.removeAttribute('draggable');clone.classList.remove('selected');
    g.querySelector('.day-tokens').appendChild(clone);selected.classList.add('used');selected.classList.remove('selected');selected=null;
    g.querySelector('small').textContent=`${g.querySelectorAll('.debt-dot').length} token`;
    const total=tokens.filter(t=>t.classList.contains('used')).length;
    divFeedback.innerHTML=`Sudah dibagikan <b>${total} dari 12</b> token.`;
    if(total!==12)return;
    const perGroup=groups.map(x=>x.querySelectorAll('.debt-dot').length);
    if(!perGroup.every(x=>x===4))return;
    divFeedback.innerHTML='✓ Setiap hari mendapat 4 token negatif. Jadi (−12) ÷ 3 = −4.';
    divPatternSection.style.display='block';
    divPatternSection.scrollIntoView({behavior:'smooth',block:'start'});
    wireDivisionPattern();
  }

  function wireDivisionPattern(){
    let firstDone=false,secondDone=false;
    document.querySelectorAll('.mini-choice').forEach(btn=>btn.onclick=()=>{
      const group=btn.dataset.pattern;
      const answer=+btn.dataset.answer;
      const value=+btn.dataset.value;
      const siblings=[...document.querySelectorAll(`.mini-choice[data-pattern="${group}"]`)];
      siblings.forEach(x=>x.classList.remove('wrong','correct'));
      if(value!==answer){
        btn.classList.add('wrong');
        divPatternFeedback.innerHTML='<div class="feedback feedback-warning">Belum tepat. Perhatikan pola hasil: −4, −3, −2, −1, 0, ...</div>';
        return;
      }
      btn.classList.add('correct');siblings.forEach(x=>x.disabled=true);
      if(group==='divNeg1'){
        firstDone=true;
        document.querySelectorAll('[data-pattern="divNeg2"]').forEach(x=>x.disabled=false);
        document.getElementById('divNeg2Row').classList.remove('locked-step');
        divPatternFeedback.innerHTML='<div class="feedback feedback-success">✓ Benar. (−2) ÷ (−2) = +1. Lanjutkan pola satu langkah lagi.</div>';
      }
      if(group==='divNeg2'){
        secondDone=true;
        divPatternFeedback.innerHTML='<div class="feedback feedback-success">✓ Pola ditemukan. Bilangan negatif dibagi bilangan negatif menghasilkan bilangan positif.</div>';
      }
      if(firstDone&&secondDone)showDivisionConclusion();
    });
  }

  function showDivisionConclusion(){
    document.getElementById('divisionConclusion').innerHTML=`
      <div class="concept-summary pop">
        <div class="concept-summary-icon">✦</div>
        <div>
          <p class="eyebrow">Kesimpulan pembagian</p>
          <h3>Pola tanda pembagian bilangan bulat</h3>
          <p>Pembagian dapat diperiksa dengan perkalian. Aturan tandanya mengikuti hubungan tanda yang sama.</p>
          <div class="sign-rule-grid">
            <div class="sign-rule positive"><b>Positif ÷ Positif</b><span>hasil positif</span><strong>+ ÷ + = +</strong></div>
            <div class="sign-rule positive"><b>Negatif ÷ Negatif</b><span>hasil positif</span><strong>− ÷ − = +</strong></div>
            <div class="sign-rule negative"><b>Positif ÷ Negatif</b><span>hasil negatif</span><strong>+ ÷ − = −</strong></div>
            <div class="sign-rule negative"><b>Negatif ÷ Positif</b><span>hasil negatif</span><strong>− ÷ + = −</strong></div>
          </div>
          <div class="memory-trick"><b>Trik melihat hasil pembagian bilangan bulat</b><p><strong>Tanda sama → hasil positif.</strong><br><strong>Tanda berbeda → hasil negatif.</strong></p></div>
        </div>
      </div>
      <button class="btn" id="divPracticeStart">Mulai Latihan Pembagian →</button>`;
    document.getElementById('divPracticeStart').onclick=()=>startTopicPractice({
      title:'Latihan Pembagian',
      subtitle:'Kerjakan contoh soal acak dari situasi sehari-hari. Setelah selesai, evaluasi akhir akan terbuka.',
      count:5,
      makeQuestion:divisionQuestion,
      onComplete:()=>{complete('division');renderQuiz()}
    });
  }
}
