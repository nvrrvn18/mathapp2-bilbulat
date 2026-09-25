function renderMultiplication(){
  setLast('multiplication');
  app.innerHTML=lessonShell('Perkalian Bilangan Bulat','Mulai dari kelompok, lalu temukan pola.',`
    <div class="section"><h2>3 × (−2)</h2><p>Tiga kelompok, masing-masing berisi dua kartu negatif.</p><div class="groups">${[1,2,3].map(()=>`<div class="group"><div class="cards">${cards(0,2)}</div></div>`).join('')}</div><div class="equation">(−2) + (−2) + (−2) = −6</div></div>
    <div class="section"><h2>Temukan pola</h2><div class="pattern-row"><b>2 × (−2)</b><span>=</span><b>−4</b></div><div class="pattern-row"><b>1 × (−2)</b><span>=</span><b>−2</b></div><div class="pattern-row"><b>0 × (−2)</b><span>=</span><b>0</b></div><div class="pattern-row"><b>(−1) × (−2)</b><span>=</span><div>${choices([-2,2,-1,1],2)}</div></div><div id="multiplyConclusion"></div></div>`);
  wireChoices(2,()=>{
    multiplyConclusion.innerHTML='<div class="remember">Tanda sama menghasilkan positif. Tanda berbeda menghasilkan negatif.</div>';
    complete('multiplication');
    document.getElementById('nextArea').innerHTML='<button class="btn" onclick="go(\'division\')">Lanjut ke Pembagian →</button>';
    document.getElementById('nextArea').scrollIntoView({behavior:'smooth',block:'center'});
  });
}
