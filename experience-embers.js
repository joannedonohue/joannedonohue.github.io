
(()=>{
const root=document.getElementById('ember-preview'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),button=root.querySelector('button');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches,time=0,last=0,width=1,height=1,raf=0;
const N=30,M=10,points=[],edges=[];
for(let i=0;i<N;i++)for(let j=0;j<M;j++){const u=i/N*Math.PI*2,v=j/M*Math.PI*2;points.push({u,v,j,i});const a=i*M+j;edges.push([a,((i+1)%N)*M+j],[a,i*M+(j+1)%M],[a,((i+1)%N)*M+(j+1)%M]);}
function size(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function project(p){const u=p.u,v=p.v,t=time*.13;const major=82+7*Math.sin(u*3+time*.4),minor=29+5*Math.sin(u*5+v*2);let x=(major+minor*Math.cos(v))*Math.cos(u),y=(major+minor*Math.cos(v))*Math.sin(u),z=minor*Math.sin(v)+11*Math.sin(u*2);const xx=x*Math.cos(t)+z*Math.sin(t),zz=-x*Math.sin(t)+z*Math.cos(t);const yy=y*.93-zz*.36,depth=y*.36+zz*.93;const scale=Math.min(height/270,width/360);return {x:width*.63+xx*scale,y:height*.49+yy*scale,z:depth,u};}
function heat(u){let d=Math.atan2(Math.sin(u-time*.52),Math.cos(u-time*.52));let d2=Math.atan2(Math.sin(u-time*.52-2.8),Math.cos(u-time*.52-2.8));return Math.max(Math.exp(-d*d/0.13),.6*Math.exp(-d2*d2/0.08))*(.62+.24*Math.sin(time*.7));}
function draw(){ctx.clearRect(0,0,width,height);const ps=points.map(project);for(let k=0;k<2;k++){const pos=project({u:time*.52+k*2.8,v:0});const glow=ctx.createRadialGradient(pos.x,pos.y,1,pos.x,pos.y,53);glow.addColorStop(0,'rgba(255,188,68,.24)');glow.addColorStop(.3,'rgba(255,155,39,.12)');glow.addColorStop(1,'rgba(255,155,39,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(pos.x,pos.y,53,0,Math.PI*2);ctx.fill();}
for(const [a,b] of edges){const A=ps[a],B=ps[b],h=(heat(A.u)+heat(B.u))/2;ctx.lineWidth=h>.5?1.05:.55;ctx.strokeStyle=h>.25?`rgba(216,${Math.round(100+h*67)},32,${.2+h*.56})`:`rgba(55,53,50,${.09+(A.z+70)/520})`;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();}
ps.forEach((p,i)=>{const h=heat(p.u);if(h>.34&&i%3===0){ctx.fillStyle=`rgba(243,163,44,${h})`;ctx.beginPath();ctx.arc(p.x,p.y,1.2+h,0,Math.PI*2);ctx.fill();}});
for(let i=0;i<42;i++){const life=(time*.35+i*.618)%1,angle=time*.52+(i%2)*2.8;const origin=project({u:angle,v:(i*.91)%(Math.PI*2)});const x=origin.x+Math.sin(i*9.1+life*4)*life*20,y=origin.y-life*62;const alpha=Math.sin(life*Math.PI)*.65;ctx.fillStyle=`rgba(218,${125+i%70},29,${alpha})`;ctx.beginPath();ctx.arc(x,y,.6+(i%3)*.3,0,Math.PI*2);ctx.fill();}
}
function tick(now){if(!last)last=now;if(!paused&&!document.hidden)time+=Math.min((now-last)/1000,.04);last=now;if(!paused)draw();raf=requestAnimationFrame(tick);}
function sync(){button.textContent=paused?'Play motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));}
button.addEventListener('click',()=>{paused=!paused;sync();draw();});reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});new ResizeObserver(size).observe(canvas);sync();size();raf=requestAnimationFrame(tick);
})();
