/* SRC-specific portfolio adaptation. Deterministic; no model or external API. */
function screenDeal(d){
 const margin=d.netIncome==null?null:d.netIncome/d.revenue*100;
 const checks=[
  {label:'Revenue',value:`$${(d.revenue/1e6).toFixed(2)}M · target $5–25M`,ok:d.revenue>=5e6&&d.revenue<=25e6},
  {label:'EBITDA',value:`$${(d.ebitda/1e6).toFixed(2)}M · target $1–5M`,ok:d.ebitda>=1e6&&d.ebitda<=5e6},
  {label:'Net margin',value:margin==null?'Net income missing · target >15%':`${margin.toFixed(1)}% · target >15%`,ok:margin==null?null:margin>15},
  {label:'Geography',value:d.location+' · Southwest',ok:d.southwest}
 ];
 const missed=checks.some(x=>x.ok===false),missing=checks.some(x=>x.ok==null);
 const decision=missed?'Pass':missing?'Request data':'Advance to diligence';
 const flags=[];
 if(d.recurring<50)flags.push('Low recurring mix: below the demo’s 50% review threshold.');
 if(d.topCustomer>25)flags.push('Customer concentration: above the demo’s 25% review threshold.');
 if(d.transition==null)flags.push('Owner transition timeline is missing.');
 else if(d.transition<3||d.transition>12)flags.push('Owner transition falls outside the stated 3–12 month range.');
 return {name:d.name,decision,margin,checks,flags,classification:missed?'fail':missing?'unknown':'pass',next:d.next};
}
if(typeof module!=='undefined')module.exports={screenDeal};
if(typeof document!=='undefined'){
 let deals=[];let current;
 const money=v=>v==null?'Unknown':'$'+(v/1e6).toFixed(2)+'M';
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){
  const d=deals.find(x=>x.id===document.getElementById('deal').value);if(!d)return;
  const r=screenDeal(d);current={d,r};
  document.getElementById('results').innerHTML=`<div class="decision"><div><p class="eyebrow">${esc(d.sector)} / FICTIONAL DEAL</p><h3>${esc(d.name)}</h3><p>${esc(d.summary)}</p></div><span class="badge ${r.classification}">${r.decision}</span></div>
  <div class="screen-grid"><div class="screen-box"><h3>What came in</h3><dl class="snapshot"><div><dt>Revenue</dt><dd>${money(d.revenue)}</dd></div><div><dt>EBITDA</dt><dd>${money(d.ebitda)}</dd></div><div><dt>Net income</dt><dd>${money(d.netIncome)}</dd></div><div><dt>Recurring revenue</dt><dd>${d.recurring}%</dd></div><div><dt>Largest customer</dt><dd>${d.topCustomer}%</dd></div><div><dt>Transition</dt><dd>${d.transition==null?'Unknown':d.transition+' months'}</dd></div></dl><p><strong>Customer niche:</strong> ${esc(d.niche)}</p><p><strong>Owner:</strong> ${esc(d.owner)}</p><p class="small">Synthetic annual financials, all for the same fictional fiscal year. Net income is after interest, depreciation, and taxes; it is not EBITDA.</p></div>
  <div class="screen-box"><h3>Apply the published financial & location criteria</h3>${r.checks.map(c=>`<div class="check"><div><strong>${c.label}</strong><small>${c.value}</small></div><span class="badge ${c.ok==null?'unknown':c.ok?'pass':'fail'}">${c.ok==null?'? Missing':c.ok?'✓ Fits':'× Outside'}</span></div>`).join('')}<p class="small">${r.checks.filter(x=>x.ok===true).length} of 4 checks fit. This is a screening result, not a valuation or probability of success.</p></div>
  <div class="screen-box"><h3>The qualitative questions</h3><p><strong>Defensibility:</strong> ${esc(d.moat)}</p><p><strong>People:</strong> ${esc(d.culture)}</p><p><strong>Seller alignment:</strong> ${esc(d.equity)}</p><p class="small">Treat resilience and a regulatory moat as hypotheses to test, not facts proven by an industry label.</p></div>
  <div class="screen-box"><h3>What could change the answer?</h3>${r.flags.length?'<ul>'+r.flags.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p>No numeric watch flags under the demo thresholds. Evidence still needs verification.</p>'}<ul>${d.risks.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></div></div><div class="next-step"><strong>Next action / ${r.decision}</strong><p>${esc(d.next)}</p></div><button type="button" class="src-button" id="download-memo" style="margin-top:20px">Download this screening memo ↓</button>`;
  document.getElementById('screen-status').textContent=`Screen complete: ${d.name}. ${r.decision}.`;
  document.getElementById('download-memo').onclick=()=>{const text=['SRC PORTFOLIO DEMO | FICTIONAL DATA',d.name+' | '+d.sector,r.decision,'',d.summary,'',...r.checks.map(c=>c.label+': '+c.value+' | '+(c.ok==null?'Missing':c.ok?'Fits':'Outside')),'','DILIGENCE',...d.risks,'','NEXT ACTION',d.next,'','Source thesis: https://sonoranridgecapital.com/','Illustrative adaptation; not an official SRC underwriting model.'].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download=d.id+'-screening-memo.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 }
 document.getElementById('deal-form').onsubmit=e=>{e.preventDefault();render();};
 document.getElementById('deal').onchange=()=>{document.getElementById('results').innerHTML='';document.getElementById('screen-status').textContent='New opportunity selected. Screen this deal to inspect the result.';};
 fetch('assets/src-demo/deals.json').then(r=>{if(!r.ok)throw Error('data');return r.json();}).then(d=>{deals=d;render();}).catch(()=>{document.getElementById('screen-status').textContent='The sample could not load. Download the CSV below or refresh to try again.';});
}
