"use strict";
const fs=require("fs"),path=require("path"),crypto=require("crypto"),url=require("url");
const {chromium}=require("C:\\AUTOFABRICADOR\\VENDOR\\browser-qa\\node_modules\\playwright-core");
const root="D:\\AUTOFABRICADOR-RESCATE\\FUJU-GAME-TEST-20261108";
const game=path.join(root,"UNPACKED-R1","FUJU-JUEGO-JUGABLE-R1");
const result={schema:1,source:"WIN11-CHROME-PLAYWRIGHT-OFFLINE-ORIGINAL-HOST",run:"FUJU-GAME-TEST-20261108",status:"RUNNING",checks:[],jsErrors:[],networkRequests:[],gamePath:game};
const hash=buf=>crypto.createHash("sha256").update(buf).digest("hex");
function check(name,value){const ok=Boolean(value);result.checks.push({name,pass:ok});if(!ok)throw Error("CHECK_FAILED:"+name);}
(async()=>{
 let browser;
 try{
  for(const x of ["index.html","styles.css","data.js","recipes.js","game.js"]){check("asset-present-"+x,fs.statSync(path.join(game,x)).size>10);}
  browser=await chromium.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true,chromiumSandbox:true,args:["--disable-background-networking","--disable-extensions","--no-first-run"]});
  const context=await browser.newContext({viewport:{width:1280,height:800},serviceWorkers:"block"});
  await context.route(/^https?:\/\//,route=>{result.networkRequests.push(route.request().url());return route.abort();});
  const page=await context.newPage();page.on("pageerror",err=>result.jsErrors.push(String(err)));
  page.on("console",msg=>{if(msg.type()==="error")result.jsErrors.push(msg.text());});
  const gameUrl=url.pathToFileURL(path.join(game,"index.html")).href;
  await page.goto(gameUrl,{waitUntil:"load",timeout:15000});
  check("file-url",page.url().startsWith("file:///"));
  check("landing-title",await page.locator("#landing").isVisible());
  check("data-loaded",await page.evaluate(()=>window.FUJU_DATA.bible.scenes.length===24&&window.FUJU_RECIPES.length===19));
  await page.screenshot({path:path.join(root,"HOST-CHROME-PORTADA.png")});
  await page.locator("#btn-start").click();
  check("chapter1-visible",await page.locator("#chapter-title").innerText()==="Las marcas del cristal");
  check("hotspot-visible",await page.locator(".hotspot").count()>0);
  check("inventory-first-chapter",await page.locator(".invitem").count()>=4);
  await page.locator("#btn-next").click();
  check("scene2",await page.locator("#scene-tag").innerText()==="Sala de los que esperan");
  check("puzzle-is-gate",!(await page.locator("#btn-next").isEnabled()));
  await page.locator("#btn-puzzle").click();
  check("puzzle-window",await page.locator("#overlay").isVisible());
  const recipe=await page.evaluate(()=>window.FUJU_RECIPES.find(x=>x.id==="P01"));
  for(const step of recipe.sequence)await page.locator("#modal-body .choices button").getByText(step,{exact:true}).click();
  check("puzzle-solved",await page.locator("#modal-body").innerText().then(x=>x.includes("Acertijo resuelto")));
  await page.locator("#btn-modal-close").click();
  check("chapter-gate-open",await page.locator("#btn-next").isEnabled());
  check("saved-native-local-storage",await page.evaluate(()=>{try{return Boolean(localStorage.getItem("fuju-offline-r1-save"));}catch(e){return false;}}));
  await page.reload({waitUntil:"load"});
  check("resume-enabled-after-reload",await page.locator("#btn-resume").isEnabled());
  await page.locator("#btn-resume").click();
  check("resumes-exact-scene",await page.locator("#scene-tag").innerText()==="Sala de los que esperan");
  check("resumes-puzzle",await page.locator("#btn-next").isEnabled());
  await page.locator("#btn-next").click();
  check("scene3",await page.locator("#scene-tag").innerText()==="La puerta pintada");
  await page.screenshot({path:path.join(root,"HOST-CHROME-ESCENA.png")});
  check("no-javascript-errors",result.jsErrors.length===0);
  check("no-network-request",result.networkRequests.length===0);
  result.status="PASS";
 }catch(e){result.status="FAILED";result.error=String(e);result.stack=String(e.stack).slice(0,1800);}
 finally{if(browser)await browser.close().catch(()=>{});}
 result.passCount=result.checks.filter(x=>x.pass).length;
 result.checkCount=result.checks.length;
 const data=JSON.stringify(result,null,2)+"\n";
 fs.writeFileSync(path.join(root,"HOST-CHROME-READBACK.json"),data,"utf8");
 console.log(JSON.stringify({status:result.status,passCount:result.passCount,checkCount:result.checkCount,error:result.error||null,gamePath:result.gamePath}));
 process.exitCode=result.status==="PASS"?0:2;
})();
