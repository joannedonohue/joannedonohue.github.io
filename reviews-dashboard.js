(() => {
  'use strict';
  // Deliberately synthetic, deterministic fixtures. No customer data or model calls.
  const examples = [
    ['Packaging','Negative',2,'The bag arrived intact, but the closure would not reseal.'],
    ['Taste','Positive',5,'My dog eats this right away. The texture seems to work well.'],
    ['Value','Neutral',3,'The food is fine. The price is about what I expected.'],
    ['Packaging','Positive',4,'The lid is easy to open and the portion is convenient.'],
    ['Taste','Negative',2,'We tried a slow transition, but my dog kept leaving it in the bowl.'],
    ['Value','Positive',5,'This size works well for our household and feels worth the price.'],
    ['Ingredients','Positive',4,'The ingredient list is easy to understand and fits what I was looking for.'],
    ['Packaging','Negative',3,'The food was well received, but the container leaked during delivery.'],
    ['Texture','Neutral',3,'The pieces are smaller than expected. We are still trying it.'],
    ['Texture','Negative',2,'The consistency varied between the containers in this order.'],
    ['Taste','Positive',5,'Both dogs finished their bowls. I would buy this flavor again.'],
    ['Value','Negative',2,'The smaller pack size makes the cost per meal harder to justify.'],
    ['Ingredients','Neutral',3,'I read the label, but I would like more detail about the ingredients.'],
    ['Packaging','Positive',5,'The packaging is easy to store and keeps the remaining food contained.'],
    ['Texture','Positive',4,'The texture is easy to portion and mix with the rest of the meal.'],
    ['Packaging','Negative',2,'The seal tore unevenly and made the package difficult to close.'],
    ['Ingredients','Negative',3,'The listing did not make the ingredient change clear enough for me.'],
    ['Taste','Positive',4,'It took a few meals, but this has become a regular choice.'],
    ['Value','Positive',4,'The larger option lasts longer and fits our budget.'],
    ['Packaging','Neutral',3,'The new container looks different, but it works about the same.'],
    ['Texture','Positive',5,'The food is consistent from one serving to the next.'],
    ['Taste','Negative',1,'My dog did not seem interested in this flavor.'],
    ['Ingredients','Positive',5,'The clear ingredient information helped me compare the options.'],
    ['Packaging','Negative',2,'The package was awkward to pour from without spilling.']
  ];
  const anchor = Date.UTC(2026,8,14);
  const reviews = Array.from({length:96},(_,i) => {
    const [theme,sentiment,rating,text]=examples[(i*7+Math.floor(i/24)*3)%examples.length];
    const age=(i*13)%90;
    return {id:i+1,brand:['Brand A','Brand B','Brand C'][i%3],format:Math.floor(i/3)%2?'Wet food':'Dry food',age,date:new Date(anchor-age*86400000).toISOString().slice(0,10),theme,sentiment,rating,text};
  });
  const $=id=>document.getElementById(id);
  const pct=(n,d)=>d?Math.round(n/d*100):0;
  const mean=rows=>rows.length?(rows.reduce((a,r)=>a+r.rating,0)/rows.length).toFixed(1):'N/A';
  const themeOrder=['Packaging','Taste','Value','Ingredients','Texture'];
  function render(){
    const brand=$('brand-filter').value, format=$('format-filter').value, days=Number($('period-filter').value), sentiment=$('sentiment-filter').value;
    const rows=reviews.filter(r=>(brand==='all'||r.brand===brand)&&(format==='all'||r.format===format)&&r.age<days&&(sentiment==='all'||r.sentiment===sentiment));
    const counts={Positive:0,Neutral:0,Negative:0}; rows.forEach(r=>counts[r.sentiment]++);
    const themes=themeOrder.map(name=>({name,count:rows.filter(r=>r.theme===name&&r.sentiment==='Negative').length})).sort((a,b)=>b.count-a.count);
    const lead=themes[0], tied=themes.filter(t=>t.count===lead.count&&t.count>0);
    $('dash-status').textContent=`${rows.length} synthetic reviews • ${brand==='all'?'All brands':brand} • ${format==='all'?'All formats':format} • Last ${days} days • ${sentiment==='all'?'All sentiment':sentiment}`;
    $('kpi-count').textContent=rows.length;
    $('kpi-rating').textContent=mean(rows);
    $('kpi-positive').textContent=rows.length?`${pct(counts.Positive,rows.length)}%`:'N/A';
    $('kpi-theme').textContent=!lead.count?'None in view':tied.length>1?'Multiple themes':lead.name;
    $('kpi-theme-note').textContent=lead.count?`${lead.count} negative reviews${tied.length>1?' per tied theme':''}`:'No negative reviews in view';
    const colors={Positive:'#288160',Neutral:'#e2b84d',Negative:'#bf5270'};
    $('sentiment-chart').innerHTML=rows.length?`<div class="sentiment-stack" role="img" aria-label="${Object.entries(counts).map(([s,n])=>`${s}: ${n} reviews`).join(', ')}">${Object.entries(counts).map(([s,n])=>`<span class="${s.toLowerCase()}" style="width:${n/rows.length*100}%"></span>`).join('')}</div><div class="legend">${Object.entries(counts).map(([s,n])=>`<span style="--swatch:${colors[s]}">${s} ${pct(n,rows.length)}% (${n})</span>`).join('')}</div>`:'<p>No reviews match these filters. Try a wider selection.</p>';
    $('theme-chart').innerHTML=themes.map(t=>`<div class="theme-row"><span>${t.name}</span><div class="theme-bar" aria-hidden="true"><span style="width:${pct(t.count,counts.Negative)}%"></span></div><span>${t.count} / ${counts.Negative}</span></div>`).join('');
    $('brand-table').innerHTML=['Brand A','Brand B','Brand C'].filter(b=>brand==='all'||brand===b).map(b=>{const rs=rows.filter(r=>r.brand===b);return `<tr><th scope="row">${b}</th><td>${rs.length}</td><td>${mean(rs)}</td><td>${rs.length?pct(rs.filter(r=>r.sentiment==='Positive').length,rs.length)+'%':'N/A'}</td></tr>`;}).join('');
    $('insight-text').textContent=!rows.length?'No reviews match this selection. Reset filters to explore the category.':lead.count?`${tied.map(t=>t.name).join(' and ')} ${tied.length>1?'share the lead among negative themes':'is the leading negative theme'} in this view. Read the comments and check product-level context before deciding whether this signals a fixable product issue. Sample sizes here are small and illustrative.`:'There are no negative reviews in this selection. Check a broader view before concluding that there are no customer pain points.';
    const shown=[...rows].sort((a,b)=>a.age-b.age).slice(0,6);
    $('review-count').textContent=`Showing ${shown.length} of ${rows.length} matching synthetic reviews, newest first.`;
    $('review-list').innerHTML=shown.map(r=>`<article class="review"><div class="review-top"><strong>${r.brand} · ${r.rating}/5</strong><span>${r.date}</span></div><span class="review-tag">${r.sentiment} · ${r.theme}</span><p>“${r.text}”</p><small>${r.format} · Fabricated example #${r.id}</small></article>`).join('');
  }
  ['brand-filter','format-filter','period-filter','sentiment-filter'].forEach(id=>$(id).addEventListener('change',render));
  $('reset-filters').addEventListener('click',()=>{['brand-filter','format-filter','sentiment-filter'].forEach(id=>$(id).value='all');$('period-filter').value='90';render();});
  render();
})();
