"use strict";
(function(){
const DATA=window.FUJU_DATA, RECIPES=window.FUJU_RECIPES;
if(!DATA || !Array.isArray(RECIPES))throw Error('FUJU_DATA_NOT_LOADED');
const B=DATA.bible, I=DATA.interactions, D=DATA.dialogues;
const PUZZLES=Object.fromEntries(B.puzzles.map(p=>[p.id,p]));
const RECIPE=Object.fromEntries(RECIPES.map(p=>[p.id,p]));
const SCENES=B.scenes, CHAPTERS=B.chapters, ITEMS=B.items;
const DETAIL=Object.fromEntries(I.scenes.map(x=>[x.sceneId,x]));
const SAVE_KEY='fuju-offline-r1-save';
const $=id=>document.getElementById(id);
let state=null, dialogue=null, selectedItem=null, modalName=null, soundOn=false, audioContext=null;
let dialogIndex=0, currentPuzzle=null;
const iconMap={chicle:'◈',informe:'▤',espejo:'◉',roca_eco:'◆',billete:'▣',plano_asientos:'⌑',manifiesto:'▥',campana:'♢',calco:'▱',argolla:'○',silbato:'♪',campanilla:'♧',acta:'▧',pistas:'✎'};
const roman=['I','II','III','IV','V','VI','VII','VIII'];
function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function button(text,fn,cls){const e=make('button',cls||'',text);e.type='button';e.addEventListener('click',fn);return e;}
function save(){if(!state)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));$('save-text').textContent='Partida guardada ✓';}catch(e){$('save-text').textContent='Guardado no disponible';}}
function load(){try{const x=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(!x||x.version!==1||!Number.isInteger(x.sceneIndex)||x.sceneIndex<0||x.sceneIndex>=SCENES.length||!x.solved||!x.progress)return null;return x;}catch(e){return null;}}
function fresh(){return{version:1,sceneIndex:0,solved:{},flags:{},progress:{},hints:{},errors:{},seen:{},visits:{},items:[],endingChoice:null,finished:false};}
function notify(text){$('status-text').textContent=text;}
function arrive(){if(!state)return;const c=SCENES[state.sceneIndex].chapterId;ITEMS.filter(x=>x.obtainedChapter===c).forEach(x=>{if(!state.items.includes(x.id))state.items.push(x.id);});}
function start(newGame){state=newGame?fresh():load()||fresh();$('landing').hidden=true;$('game').hidden=false;selectedItem=null;arrive();showScene(true);save();}
function chapterOfScene(s){return CHAPTERS.findIndex(c=>c.id===s.chapterId);}
function scenePuzzles(s){return B.puzzles.filter(p=>p.sceneId===s.id);}
function unsolvedAtScene(s){return scenePuzzles(s).filter(p=>!state.solved[p.id]);}
function solvedTotal(){return Object.keys(state.solved).filter(id=>state.solved[id]).length;}
function puzzleMask(){let mask=0;B.puzzles.forEach((p,i)=>{if(state.solved[p.id])mask|=1<<i;});return mask;}
function chapterGate(){const here=SCENES[state.sceneIndex],next=SCENES[state.sceneIndex+1];
 if(next&&next.chapterId===here.chapterId)return true;
 return window.FUJU_FACTORY_AI_GATE.chapterCleared(chapterOfScene(here)+1,puzzleMask());}
function canLeaveScene(){return unsolvedAtScene(SCENES[state.sceneIndex]).length===0&&chapterGate();}
function goNext(){if(!canLeaveScene()){notify('Debes resolver los acertijos pendientes de este capítulo.');return;}if(state.sceneIndex>=SCENES.length-1){showEnding();return;}state.sceneIndex++;selectedItem=null;arrive();showScene(true);save();}
function showScene(autostart){const s=SCENES[state.sceneIndex],chapter=chapterOfScene(s),hot=DETAIL[s.id];state.visits[s.id]=true;
$('chapter-number').textContent='CAPÍTULO '+roman[chapter]+' / 8';$('chapter-title').textContent=CHAPTERS[chapter].title;
$('location-label').textContent=s.location;$('scene-tag').textContent=s.title;
$('scene-description').textContent=s.dramaticIntent;
$('chapter-progress').replaceChildren(...CHAPTERS.map((c,i)=>{const x=make('span','chapter-dot'+(i===chapter?' active':i<chapter?' done':''),roman[i]);x.title=c.title;return x;}));
renderStage(s,hot);renderInventory();
let pending=unsolvedAtScene(s);
$('btn-puzzle').hidden=pending.length===0;
$('btn-puzzle').disabled=pending.length===0;
$('btn-puzzle').textContent=pending.length?('Resolver: '+pending[0].title):'No hay acertijos pendientes';
$('btn-next').disabled=!canLeaveScene();
$('btn-next').textContent=state.sceneIndex===SCENES.length-1?'Ver desenlace':'Continuar al siguiente escenario ▸';
$('puzzle-count').textContent=solvedTotal()+' / '+B.puzzles.length+' acertijos resueltos';
$('dialogue-box').hidden=true;dialogue=null;
notify(pending.length?'Busca pistas, habla y utiliza objetos para avanzar.':canLeaveScene()?'Escena completada: puedes continuar.':'Quedan misterios anteriores por resolver antes de avanzar de capítulo.');
if(autostart){const node=D.nodes.find(n=>n.sceneId===s.id&&n.autoStart===true);if(node&&!state.seen[node.id])openDialogue(node);}
save();}
function renderInventory(){const box=$('inventory');box.replaceChildren();$('inventory-count').textContent='('+state.items.length+')';state.items.forEach(id=>{const it=ITEMS.find(x=>x.id===id);if(!it)return;const el=make('button','invitem'+(selectedItem===id?' selected':''));el.type='button';el.title=it.name+' — '+it.description;const sp=make('span','inv-icon',iconMap[id]||'✧');el.appendChild(sp);el.appendChild(make('span','',it.name.split(' ').slice(0,2).join(' ')));el.addEventListener('click',()=>{selectedItem=selectedItem===id?null:id;$('inventory-action').textContent=selectedItem?'Objeto seleccionado: '+it.name+'. Ahora pulsa un elemento del escenario.':it.description;renderInventory();});box.appendChild(el);});}
function renderStage(s,sceneInfo){paint(s);const layer=$('hotspots');layer.replaceChildren();let hotspots=(sceneInfo&&sceneInfo.hotspots)||[];
const rows=hotspots.length>6?2:1;
hotspots.forEach((h,i)=>{const row=rows===2?Math.floor(i/Math.ceil(hotspots.length/2)):0;const size=rows===2?Math.ceil(hotspots.length/2):hotspots.length;const col=rows===2?i%size:i;const hsize=rows===2?(row===0?size:hotspots.length-size):size;const x=11+(col+.5)*78/Math.max(1,hsize);const y=rows===2?(row===0?68:83):79;
const label=h.objectKey.replace(/_/g,' ');const el=make('button','hotspot');el.type='button';el.style.left=x+'%';el.style.top=y+'%';el.title=h.defaultLine;el.setAttribute('aria-label',h.defaultLine);const ico=make('i','',h.type==='npc'?'●':'✦');el.append(ico,make('span','',label));el.addEventListener('click',()=>onHotspot(h));layer.appendChild(el);});}
function onHotspot(h){const s=SCENES[state.sceneIndex];const name=h.objectKey.replace(/_/g,' ');if(selectedItem){const item=ITEMS.find(x=>x.id===selectedItem);$('inventory-action').textContent='Pruebas '+item.name+' con '+name+'. '+(h.puzzleRefs&&h.puzzleRefs.length?'Parece relacionado con una pista.':'Observas qué ocurre, pero todavía no encuentras la combinación adecuada.');if(h.puzzleRefs&&h.puzzleRefs.length){const p=PUZZLES[h.puzzleRefs[0]];if(p&&!state.solved[p.id]){openPuzzle(p);}}return;}
notify(h.defaultLine||'Observas '+name+'.');if(h.type==='npc'){const n=D.nodes.find(x=>x.sceneId===s.id&&x.autoStart===true);if(n)openDialogue(n);}else if(h.puzzleRefs&&h.puzzleRefs.length){const p=PUZZLES[h.puzzleRefs[0]];if(p&&!state.solved[p.id])openPuzzle(p);}}
function openDialogue(node){if(!node)return;$('dialogue-box').hidden=false;dialogue=node;dialogIndex=0;state.seen[node.id]=true;renderDialogue();save();}
function closeDialogue(){dialogue=null;$('dialogue-box').hidden=true;}
function renderDialogue(){if(!dialogue){closeDialogue();return;}const lines=dialogue.lines||[];const choices=$('dialogue-choices');choices.replaceChildren();$('btn-dialogue-next').hidden=dialogIndex>=lines.length;
if(dialogIndex<lines.length){const l=lines[dialogIndex];$('dialogue-speaker').textContent=l.speaker||'Narrador';$('dialogue-text').textContent=l.text;}
else{$('dialogue-speaker').textContent='Decisión';$('dialogue-text').textContent='¿Qué quieres hacer?';(dialogue.choices||[]).forEach(x=>choices.appendChild(button(x.label,()=>{if(x.next){const n=D.nodes.find(z=>z.id===x.next);if(n)openDialogue(n);else closeDialogue();}else closeDialogue();})));if(!choices.children.length)choices.appendChild(button('Cerrar',closeDialogue));} }
function openPuzzle(p){if(!p)return;currentPuzzle=p;modalName='puzzle';$('overlay').hidden=false;renderPuzzle();}
function renderPuzzle(){const p=currentPuzzle,r=RECIPE[p.id];$('modal-eyebrow').textContent='ACERTIJO '+p.id+' · '+p.category;$('modal-title').textContent=p.title;
const body=$('modal-body');body.replaceChildren();body.appendChild(make('p','',r.brief));body.appendChild(make('p','',p.objective));
const step=state.progress[p.id]||0;const steps=make('div','steps');r.sequence.forEach((word,i)=>steps.appendChild(make('span','step-pill'+(i<step?' done':''),(i+1)+' / '+r.sequence.length+(i<step?' ✓':''))));body.appendChild(steps);
if(state.solved[p.id]){body.appendChild(make('p','','✓ Acertijo resuelto. La historia puede continuar.'));body.appendChild(button('Volver a la escena',closeModal,'primary'));$('modal-feedback').textContent='Has encontrado la conexión correcta.';return;}
if(p.id==='P19'&&step===1){body.appendChild(make('p','','Antes de escoger, examina las consecuencias de las dos declaraciones:'));const alternatives=make('div','altchoice');B.endings.forEach(e=>{const b=button(e.name,()=>{state.endingChoice=e.id;save();renderPuzzle();},state.endingChoice===e.id?'selected':'');alternatives.appendChild(b);});body.appendChild(alternatives);if(state.endingChoice)body.appendChild(make('p','hint-text',B.endings.find(x=>x.id===state.endingChoice).cost));}
const choices=make('div','choices');r.options.forEach(option=>choices.appendChild(button(option,()=>choosePuzzle(option))));body.appendChild(choices);
const action=make('div','modal-action');action.appendChild(button('Pedir una pista ('+Math.min(state.hints[p.id]||0,3)+'/3)',showHint));action.appendChild(button('Volver a examinar la escena',closeModal));body.appendChild(action);
$('modal-feedback').textContent='Paso '+(step+1)+' de '+r.sequence.length+'. Selecciona la acción que tenga sentido.';}
function choosePuzzle(action){const p=currentPuzzle,r=RECIPE[p.id];const step=state.progress[p.id]||0;const expected=r.sequence[step];if(p.id==='P19'&&expected==='Elegir declaración'&&!state.endingChoice){$('modal-feedback').textContent='Debes elegir primero una de las declaraciones disponibles.';return;}
if(action!==expected){state.progress[p.id]=0;state.errors[p.id]=(state.errors[p.id]||0)+1;save();renderPuzzle();$('modal-feedback').textContent='Esa acción no encaja todavía. El mecanismo vuelve a su posición inicial; no pierdes objetos.';return;}
state.progress[p.id]=step+1;if(state.progress[p.id]>=r.sequence.length){state.solved[p.id]=true;const flag=p.successCondition.replace(/^flag:/,'');state.flags[flag]=true;state.progress[p.id]=r.sequence.length;notify('¡Acertijo '+p.id+' resuelto!');soundSuccess();showScene(false);}save();renderPuzzle();}
function showHint(){const p=currentPuzzle;let n=Math.min(3,(state.hints[p.id]||0)+1);state.hints[p.id]=n;const modal=$('modal-body');const old=modal.querySelector('.hint-text');if(old)old.remove();const h=make('p','hint-text','Pista '+n+'/3: '+p.hints[n-1]);modal.insertBefore(h,modal.lastChild);save();$('modal-feedback').textContent='Pista añadida al cuaderno; no se ha resuelto automáticamente.';}
function closeModal(){$('overlay').hidden=true;modalName=null;currentPuzzle=null;}
function showJournal(){modalName='journal';$('overlay').hidden=false;$('modal-eyebrow').textContent='CUADERNO DE PRUEBAS';$('modal-title').textContent='Lo que Naro ha descubierto';const body=$('modal-body');body.replaceChildren();const c=chapterOfScene(SCENES[state.sceneIndex]);B.puzzles.filter(p=>chapterOfScene(B.scenes.find(s=>s.id===p.sceneId))<=c).forEach(p=>{const row=make('div','journal-row');row.appendChild(make('strong','',(state.solved[p.id]?'✓ ':'◇ ')+p.title));row.appendChild(make('p','',state.solved[p.id]?'Conexión comprendida.':p.objective));for(let i=0;i<(state.hints[p.id]||0);i++)row.appendChild(make('p','tiny','Pista '+(i+1)+': '+p.hints[i]));body.appendChild(row);});$('modal-feedback').textContent=solvedTotal()+' acertijos resueltos de '+B.puzzles.length;}
function showHelp(){modalName='help';$('overlay').hidden=false;$('modal-eyebrow').textContent='CONTROLES';$('modal-title').textContent='Cómo jugar';const body=$('modal-body');body.replaceChildren();['Haz clic en los elementos del paisaje para examinarlos y conversar.','Selecciona un objeto del abrigo y después un elemento del escenario para intentar utilizarlo.','Abre el acertijo de cada escena: prueba acciones en orden. Los errores no destruyen objetos ni bloquean la partida.','Puedes pedir hasta tres pistas por acertijo. El diario conserva las que ya hayas usado.','Al resolver el misterio de la escena, pulsa «Seguir adelante».','La partida se guarda automáticamente en el almacenamiento de este navegador. Reiniciar borra solamente esta partida local.','No necesitas conexión, cuentas ni servicios externos.'].forEach(line=>body.appendChild(make('p','',line)));$('modal-feedback').textContent='También puedes cerrar cualquier ventana con Escape.';}
function showEnding(){if(!state.solved.P19){notify('Aún queda una decisión por tomar.');return;}state.finished=true;save();modalName='ending';$('overlay').hidden=false;$('modal-eyebrow').textContent='FIN DE LA AVENTURA';$('modal-title').textContent='El último andén';const body=$('modal-body');body.replaceChildren();const ending=B.endings.find(x=>x.id===state.endingChoice)||B.endings[0];body.appendChild(make('h3','','Has llegado al final.'));body.appendChild(make('p','','Tu decisión abre el desenlace «'+ending.name+'».'));body.appendChild(make('p','hint-text',ending.cost));body.appendChild(make('p','','Gracias por recorrer los ocho capítulos. El mundo conserva las consecuencias de lo que has decidido.'));body.appendChild(button('Volver a explorar la última escena',closeModal));$('modal-feedback').textContent='Partida completada: 19 / 19 acertijos.';}
function reset(){if(!confirm('¿Borrar únicamente la partida local de esta aventura y empezar de nuevo?'))return;try{localStorage.removeItem(SAVE_KEY);}catch(e){}state=null;closeModal();$('game').hidden=true;$('landing').hidden=false;$('btn-resume').disabled=true;notify('Partida reiniciada.');}
function soundSuccess(){if(!soundOn||!audioContext)return;try{let t=audioContext.currentTime;[392,494,587].forEach((freq,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,t+i*.11);g.gain.exponentialRampToValueAtTime(.05,t+i*.11+.04);g.gain.exponentialRampToValueAtTime(.0001,t+i*.11+.4);o.connect(g);g.connect(audioContext.destination);o.start(t+i*.11);o.stop(t+i*.11+.42);});}catch(e){}}
function toggleSound(){soundOn=!soundOn;$('btn-sound').textContent=soundOn?'♫ Sonido: sí':'♫ Sonido: no';$('btn-sound').setAttribute('aria-pressed',String(soundOn));if(soundOn){try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();soundSuccess();}catch(e){soundOn=false;}}}
function paint(s){const canvas=$('canvas'),g=canvas.getContext('2d');if(!g)return;const w=canvas.width,h=canvas.height,chapter=chapterOfScene(s),idx=state.sceneIndex;
const palettes=[['#263c5e','#a38a9a','#1d2b39'],['#665a5e','#d3a576','#4b4540'],['#304a60','#b8a1a5','#293547'],['#344253','#b6a4b8','#182d37'],['#54708b','#d6ab6b','#345842'],['#3b3557','#aa9ec9','#27263f'],['#3e415e','#a17d87','#26283d'],['#2d5060','#d8b681','#243d44']];let pal=palettes[chapter],grad=g.createLinearGradient(0,0,0,h);grad.addColorStop(0,pal[0]);grad.addColorStop(.7,pal[1]);grad.addColorStop(1,pal[2]);g.fillStyle=grad;g.fillRect(0,0,w,h);
let seed=idx*139+31;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let i=0;i<42;i++){g.fillStyle=chapter===0?'#dae5e277':'#fff4c066';g.fillRect(rnd()*w,rnd()*320,1+rnd()*2,1+rnd()*2);}
function polygon(points,color){g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
function rect(x,y,ww,hh,color){g.fillStyle=color;g.fillRect(x,y,ww,hh);}
function arc(x,y,r,color){g.fillStyle=color;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
if(chapter===0){for(let i=0;i<8;i++){let x=i*145-30;let bh=100+Math.floor(rnd()*140);rect(x,335-bh,130,bh+155,'#17283b');for(let j=0;j<20;j++){const xx=x+12+(j%4)*25,yy=350-bh+Math.floor(j/4)*29;rect(xx,yy,9,17,rnd()>.5?'#f9d58a':'#5e7381');}}rect(0,435,w,105,'#2e3339');for(let i=0;i<10;i++)rect(i*115+30,478,58,3,'#a0a8a0');if(idx===1){rect(220,180,500,250,'#d8c4a5');for(let j=0;j<4;j++)rect(260+j*107,222,65,100,'#899dad');rect(285,363,390,12,'#6d5962');}}
else if(chapter===1){polygon([[0,330],[150,130],[320,330]],'#55596c');polygon([[175,360],[420,90],[730,365]],'#474e62');polygon([[540,370],[795,115],[960,330]],'#625267');for(let i=0;i<8;i++){rect(55+i*110,350-rnd()*110,32,200,'#443a3c');arc(70+i*110,320-rnd()*60,24,'#8d846f');}rect(0,440,w,100,'#4e4c43');}
else if(chapter===2||chapter===3){polygon([[0,415],[110,365],[630,380],[960,340],[960,540],[0,540]],'#25313c');g.strokeStyle='#e2c59a';g.lineWidth=6;g.beginPath();g.moveTo(0,490);g.lineTo(960,490);g.stroke();rect(130,230,660,220,'#495068');rect(140,237,635,22,'#b7a783');for(let j=0;j<8;j++){rect(175+j*72,272,48,69,'#b4cacc');rect(180+j*72,278,38,59,'#5b7385');}for(let j=0;j<4;j++)arc(240+j*150,447,20,'#171b22');if(chapter===3){arc(700,160,90,'#d1a88a55');for(let j=0;j<4;j++)rect(880-j*35,250+j*30,18,130,'#354659');}}
else if(chapter===4){rect(0,400,w,140,'#5e604c');for(let i=0;i<10;i++){const x=35+i*105,b=130+rnd()*80;rect(x,390-b,23,b,'#4f3733');for(let j=0;j<4;j++)arc(x-32+rnd()*68,215+rnd()*55,40,'#376151');}rect(420,390,260,15,'#bb9463');}
else if(chapter===5){rect(0,375,w,165,'#2b2d41');for(let i=0;i<13;i++){const x=12+i*75;rect(x,138,63,260,'#5c4457');for(let j=0;j<8;j++){rect(x+7,145+j*31,49,5,'#bd9a73');for(let k=0;k<5;k++)rect(x+10+k*9,151+j*31,5,20,'#c2ad89');}}}
else if(chapter===6){polygon([[0,430],[480,220],[960,430],[960,540],[0,540]],'#383444');for(let i=0;i<8;i++)rect(i*130,180,14,280,'#9b8273');rect(170,385,625,55,'#4f3e49');}
else{polygon([[0,360],[450,150],[960,395],[960,540],[0,540]],'#3a4a4e');for(let j=0;j<6;j++){g.strokeStyle=j%2?'#c6b7a4':'#313540';g.lineWidth=7;g.beginPath();g.moveTo(430+j*15,330);g.lineTo(150+j*120,540);g.stroke();}arc(760,150,60,'#ffdb96aa');}
// Hand-drawn vignette and floor grain.
for(let i=0;i<24;i++){rect(rnd()*w,425+rnd()*h*.18,30+rnd()*85,1,'#f2cf9e18');}
let vign=g.createRadialGradient(w/2,h/2,90,w/2,h/2,610);vign.addColorStop(0,'#00000000');vign.addColorStop(1,'#0808139a');g.fillStyle=vign;g.fillRect(0,0,w,h);
// Original protagonist silhouette; older mentor silhouette appears when appropriate.
function figure(x,y,coat,beard){g.save();g.translate(x,y);arc(0,-77,24,'#e6bda0');rect(-20,-52,40,78,coat);polygon([[-27,-30],[-17,-34],[-36,21],[-24,22]],coat);polygon([[17,-34],[27,-30],[36,21],[24,22]],coat);rect(-17,22,14,42,'#1b2231');rect(5,22,14,42,'#1b2231');if(beard){polygon([[-17,-65],[17,-65],[9,-30],[-9,-28]],'#e5e2d8');}else{polygon([[-25,-91],[0,-112],[26,-92]],'#1b1b27');}g.restore();}
figure(95,418,'#292c43',false);if(chapter>=5&&chapter<=6)figure(845,425,'#514560',true);
g.font='italic 21px Georgia';g.fillStyle='#ffe4ba';g.fillText(s.title,25,510);}
$('btn-start').addEventListener('click',()=>start(true));$('btn-resume').addEventListener('click',()=>start(false));$('btn-resume').disabled=!load();
$('btn-next').addEventListener('click',goNext);$('btn-puzzle').addEventListener('click',()=>openPuzzle(unsolvedAtScene(SCENES[state.sceneIndex])[0]));
$('btn-dialogue-skip').addEventListener('click',closeDialogue);$('btn-dialogue-next').addEventListener('click',()=>{dialogIndex++;renderDialogue();});$('btn-journal').addEventListener('click',showJournal);$('btn-help').addEventListener('click',showHelp);$('btn-reset').addEventListener('click',reset);$('btn-sound').addEventListener('click',toggleSound);$('btn-modal-close').addEventListener('click',closeModal);
$('btn-talk').addEventListener('click',()=>{const s=SCENES[state.sceneIndex];openDialogue(D.nodes.find(n=>n.sceneId===s.id&&n.autoStart===true));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('overlay').hidden)closeModal();else if(!$('dialogue-box').hidden)closeDialogue();}});
})();
