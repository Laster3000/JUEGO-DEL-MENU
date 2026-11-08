"use strict";
const fs=require("fs"),path=require("path"),url=require("url"),crypto=require("crypto");
const {chromium}=require("C:\\AUTOFABRICADOR\\VENDOR\\browser-qa\\node_modules\\playwright-core");
const ROOT="D:\\AUTOFABRICADOR-RESCATE\\FUJU-GAME-TEST-20261108";
const GAME=path.join(ROOT,"R2-STAGING","FUJU-JUEGO-JUGABLE-R2");
const OWNER="C:\\AUTOFABRICADOR\\examples\\fuju_chapter_gate_repair_20261108.json";
const result={schema:1,system:"ORIGINAL-WINDOWS-CHROME-PLAYWRIGHT-OFFLINE",revision:"R2",checks:[],errors:[],requests:[],status:"RUNNING"};
function ck(v,name){const pass=Boolean(v);result.checks.push({name,pass});if(!pass)throw Error("CHECK_FAILED:"+name);}
const wait={waitUntil:"load",timeout:15000};
(async()=>{
 let browser=null;
 try{
  const original=JSON.parse(fs.readFileSync(OWNER,"utf8"));const r=JSON.parse(fs.readFileSync(path.join(GAME,"factory-provenance.json"),"utf8"));
  ck(r.originalOwnerCases===40,"genuine-model-owner-cases");
  ck(r.originalFactoryStatus==="PASS_SCOPED_WASI_BROWSER_OFFLINE","verified-accepted-model-status");
  browser=await chromium.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true,chromiumSandbox:true,args:["--disable-background-networking","--disable-extensions","--no-first-run"]});
  const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:"block"});
  await context.route(/^https?:\/\//,route=>{result.requests.push(route.request().url());return route.abort();});
  let page=await context.newPage();
  page.on("pageerror",e=>result.errors.push("PAGEERROR "+String(e)));
  page.on("console",m=>{if(m.type()==="error")result.errors.push("CONSOLE "+m.text());});
  const uri=url.pathToFileURL(path.join(GAME,"index.html")).href;
  await page.goto(uri,wait);
  ck(await page.locator("#landing").isVisible(),"R2-landing-visible");
  ck(await page.evaluate(()=>window.FUJU_FACTORY_AI_GATE&&typeof window.FUJU_FACTORY_AI_GATE.chapterCleared==="function"),"ai-gate-exposed");
  for(let i=0;i<original.acceptance.length;i++){
    const item=original.acceptance[i];
    const got=await page.evaluate(args=>window.FUJU_FACTORY_AI_GATE.chapterCleared(...args),item.args);
    ck(got===item.expected,"ai-owner-case-"+String(i+1));
  }
  const scenes=await page.evaluate(()=>window.FUJU_DATA.bible.scenes);
  const chapters=await page.evaluate(()=>window.FUJU_DATA.bible.chapters);
  const puzzles=await page.evaluate(()=>window.FUJU_DATA.bible.puzzles);
  const recipes=await page.evaluate(()=>window.FUJU_RECIPES);
  ck(scenes.length===24&&chapters.length===8&&puzzles.length===19&&recipes.length===19,"content-matrix-24-8-19");
  await page.locator("#btn-start").click();
  ck(await page.locator("#game").isVisible(),"new-game-start");
  for(let index=0;index<scenes.length;index++){
    let s=scenes[index];
    ck((await page.locator("#scene-tag").innerText())===s.title,"scene-"+s.id);
    const ps=puzzles.filter(p=>p.sceneId===s.id);
    if(ps.length){ck(!(await page.locator("#btn-next").isEnabled()),"puzzle-gate-"+s.id);}
    for(const p of ps){
      await page.locator("#btn-puzzle").click();
      ck(await page.locator("#overlay").isVisible(),"puzzle-dialog-"+p.id);
      const recipe=recipes.find(r=>r.id===p.id);
      for(let i=0;i<recipe.sequence.length;i++){
        if(p.id==="P19"&&i===1)await page.locator("#modal-body .altchoice button").nth(1).click();
        await page.locator("#modal-body .choices button").getByText(recipe.sequence[i],{exact:true}).click();
      }
      ck((await page.locator("#modal-body").innerText()).toLowerCase().includes("resuelto"),"puzzle-complete-"+p.id);
      await page.locator("#btn-modal-close").click();
    }
    ck(await page.locator("#btn-next").isEnabled(),"scene-unlocked-"+s.id);
    if(index+1<scenes.length)await page.locator("#btn-next").click();
  }
  ck((await page.locator("#puzzle-count").innerText()).includes("19 / 19"),"all-puzzles-solved");
  await page.locator("#btn-next").click();
  ck((await page.locator("#modal-eyebrow").innerText()).includes("FIN DE LA AVENTURA"),"ending-e02-accessible");
  await page.locator("#btn-modal-close").click();
  ck(await page.evaluate(()=>Boolean(localStorage.getItem("fuju-offline-r1-save"))),"local-save-written");
  // Independent chapter-level anti-skip checks with controlled test saves.
  for(let chapter=1;chapter<=8;chapter++){
    const chID=chapters[chapter-1].id;
    const lastIndex=scenes.reduce((acc,s,i)=>s.chapterId===chID?i:acc,-1);
    const cp=puzzles.filter(p=>p.chapterId===chID);
    ck(cp.length>=2,"chapter-puzzles-at-least-two-"+chapter);
    const missing=cp[0].id;
    let solved={};
    for(const p of cp.slice(1))solved[p.id]=true;
    const makeState=()=>({version:1,sceneIndex:lastIndex,solved,flags:{},progress:{},hints:{},errors:{},seen:{},visits:{},items:[],endingChoice:"E02",finished:false});
    await page.evaluate(st=>localStorage.setItem("fuju-offline-r1-save",JSON.stringify(st)),makeState());
    await page.reload(wait);await page.locator("#btn-resume").click();
    ck(!(await page.locator("#btn-next").isEnabled()),"chapter-boundary-reject-missing-"+chapter);
    solved[missing]=true;
    await page.evaluate(st=>localStorage.setItem("fuju-offline-r1-save",JSON.stringify(st)),makeState());
    await page.reload(wait);await page.locator("#btn-resume").click();
    ck(await page.locator("#btn-next").isEnabled(),"chapter-boundary-pass-complete-"+chapter);
    if(chapter<8){
      await page.locator("#btn-next").click();
      ck((await page.locator("#chapter-number").innerText()).includes(String(["I","II","III","IV","V","VI","VII","VIII"][chapter])),"next-chapter-arrived-"+chapter);
    }else{
      await page.locator("#btn-next").click();
      ck((await page.locator("#modal-eyebrow").innerText()).includes("FIN DE LA AVENTURA"),"final-chapter-gate-and-ending");
      await page.locator("#btn-modal-close").click();
    }
  }
  ck(result.errors.length===0,"zero-js-errors");
  ck(result.requests.length===0,"zero-network-requests");
  await page.screenshot({path:path.join(ROOT,"R2-HOST-CHROME-SCENE.png")});
  result.status="PASS";
 }catch(e){result.status="FAILED";result.error=String(e);result.stack=String(e.stack).slice(0,1800);}
 finally{if(browser)await browser.close().catch(()=>{});}
 result.total=result.checks.length;
 result.passed=result.checks.filter(c=>c.pass).length;
 const out=path.join(ROOT,"R2-HOST-CHROME-READBACK.json");
 fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n","utf8");
 console.log(JSON.stringify({status:result.status,total:result.total,passed:result.passed,error:result.error||null,jsErrors:result.errors.length,networkRequests:result.requests.length}));
 process.exitCode=result.status==="PASS"?0:2;
})();
