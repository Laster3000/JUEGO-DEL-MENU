import json, pathlib, sys, traceback, re
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data.js').read_text(encoding='utf8').split('=',1)[1].removesuffix(';\n'))
RECIPES=json.loads((ROOT/'recipes.js').read_text(encoding='utf8').split('=',1)[1].removesuffix(';\n'))
REC={r['id']:r for r in RECIPES}
results={'schema':1,'status':'RUNNING','cases':[],'errors':[]}
def chk(cond,msg):
 results['cases'].append({'name':msg,'pass':bool(cond)})
 if not cond:raise AssertionError(msg)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1);page.set_default_timeout(3500)
 page.on('pageerror',lambda e:results['errors'].append('PAGEERROR: '+str(e)))
 page.on('console',lambda m:results['errors'].append('CONSOLE: '+m.text) if m.type=='error' else None)
 try:
  html=(ROOT/'index.html').read_text(encoding='utf8');html=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>', '', html);html=re.sub(r'<script defer src="[^"]+"></script>', '', html);page.set_content(html);page.add_style_tag(content=(ROOT/'styles.css').read_text(encoding='utf8'));[page.add_script_tag(content=(ROOT/f).read_text(encoding='utf8')) for f in ('data.js','recipes.js','factory-gate.js','game.js')];page.wait_for_timeout(100)
  chk(page.locator('#landing').is_visible(),'Portada visible')
  page.screenshot(path=str(ROOT/'qa'/'visual-start.png'),full_page=True)
  chk(not page.locator('#btn-resume').is_enabled(),'Sin partida previa no existe continuar')
  page.locator('#btn-start').click();page.wait_for_timeout(100)
  chk(page.locator('#game').is_visible(),'Comenzar partida')
  chk(page.locator('#hotspots .hotspot').count()>0,'Hotspots accesibles')
  page.screenshot(path=str(ROOT/'qa'/'visual-scene.png'),full_page=True)
  for idx,s in enumerate(DATA['bible']['scenes']):
   print('SCENE',s['id'],flush=True)
   chk(page.locator('#scene-tag').inner_text()==s['title'],'Escenario '+s['id']+' cargado')
   expected=[x for x in DATA['bible']['puzzles'] if x['sceneId']==s['id']]
   if expected:
    chk(not page.locator('#btn-next').is_enabled(),'No se puede saltar '+expected[0]['id'])
    for puzz in expected:
     page.locator('#btn-puzzle').click()
     chk(page.locator('#overlay').is_visible(),'Ventana '+puzz['id']+' visible')
     rec=REC[puzz['id']]
     if puzz['id']=='P01':
      wrong=next(x for x in rec['options'] if x!=rec['sequence'][0]);page.locator('#modal-body .choices button').get_by_text(wrong,exact=True).click()
      chk('no pierdes objetos' in page.locator('#modal-feedback').inner_text(),'Error reversible')
      page.locator('#modal-body .modal-action button').first.click()
      chk('Pista 1/3' in page.locator('#modal-body').inner_text(),'Pistas escalonadas')
     for i,step in enumerate(rec['sequence']):
      if puzz['id']=='P19' and i==1:
       page.locator('#modal-body .altchoice button').nth(1).click()
      page.locator('#modal-body .choices button').get_by_text(step,exact=True).click()
     chk('resuelto' in page.locator('#modal-body').inner_text().lower(),puzz['id']+' finalizado')
     page.locator('#btn-modal-close').click()
     chk(not page.locator('#overlay').is_visible(),puzz['id']+' ventana cerrada')
   chk(page.locator('#btn-next').is_enabled(),'Escena '+s['id']+' desbloqueada')
   if idx==11:
    chk(page.locator('#btn-next').is_enabled(),'Estado conservado durante partida')
   if idx<len(DATA['bible']['scenes'])-1:page.locator('#btn-next').click()
  chk('19 / 19' in page.locator('#puzzle-count').inner_text(),'Los 19 acertijos completados')
  page.locator('#btn-next').click()
  chk('FIN DE LA AVENTURA' in page.locator('#modal-eyebrow').inner_text(),'Final accesible')
  chk('Turno compartido' in page.locator('#modal-body').inner_text(),'Rama final E02')
  page.screenshot(path=str(ROOT/'qa'/'visual-ending.png'),full_page=True)
  chk(not results['errors'],'Sin excepciones de JavaScript ni errores de consola')
  results['status']='PASS'
 except Exception as e:
  results['status']='FAILED';results['error']=str(e);results['traceback']=traceback.format_exc();page.screenshot(path=str(ROOT/'qa'/'visual-failure.png'),full_page=True)
 finally:
  browser.close()
results['total']=len(results['cases']);results['passed']=sum(x['pass'] for x in results['cases'])
(ROOT/'qa'/'browser-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in results.items() if k not in ('cases','traceback')},ensure_ascii=False,indent=2))
sys.exit(0 if results['status']=='PASS' else 1)
