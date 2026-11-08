# -*- coding: utf-8 -*-
"""Immutable R2 checkpoint, SHA manifest and restore rehearsal, no Host/PROD writes."""
from pathlib import Path,PurePosixPath
import hashlib,json,zipfile,shutil,stat,datetime
ROOT=Path(r"D:\AUTOFABRICADOR-RESCATE\FUJU-GAME-TEST-20261108")
REC=ROOT/"RECOVERY-R2"
ZIP=ROOT/"FUJU_JUEGO_JUGABLE_R2.zip"
R1=ROOT/"FUJU_JUEGO_JUGABLE_R1.zip"
REMOTE=ROOT/"FUJU_JUEGO_JUGABLE_R2-GITHUB-READBACK.zip"
R2_HASH="ff5ad6eda983dd8465048647eac60328079637e99a8a743bee0ffe42cc92a20c"
SRC=Path(r"C:\AUTOFABRICADOR\repojobs\RJ-12d52c7a90e047d1\attempts\A-03-source.json")
F_RECEIPT=Path(r"C:\AUTOFABRICADOR\factoryjobs\FC-3d98a854d33b4128\result.json")
def sha(path):
 h=hashlib.sha256()
 with Path(path).open("rb") as f:
  for chunk in iter(lambda:f.read(1024*1024),b""):h.update(chunk)
 return h.hexdigest()
assert sha(ZIP)==sha(REMOTE)==R2_HASH
assert sha(R1)=="058e8fb592c7fe92d8a18cce56277f277803656c430da4515b144054074e17ea"
receipt=json.loads(F_RECEIPT.read_text("utf8"))
qa=json.loads((ROOT/"R2-HOST-CHROME-READBACK.json").read_text("utf8"))
assert receipt["status"]=="PASS_SCOPED_WASI_BROWSER_OFFLINE" and receipt["originalOwnerCases"]==40
assert qa["status"]=="PASS" and qa["total"]==qa["passed"]==188
if REC.exists():raise RuntimeError("RECOVERY_ALREADY_EXISTS_DO_NOT_OVERWRITE")
REC.mkdir(parents=False)
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
readme="""# LEEME-PRIMERO — FUJU R2
Recuperación independiente del prototipo R2, NO instalación protegida.
1. Leer CHECKPOINT-CONVERSACION.json y CHECKPOINT-PROYECTO.json.
2. Leer MANIFEST-R2.json y verificar hashes de los archivos que contienen.
3. Comprobar el ZIP desde GitHub; readback original en R2-ORIGINAL-READBACK.json.
4. Consultar el estado vivo original de AUTOFABRICADOR con los IDs
   FC-3d98a854d33b4128 y RJ-12d52c7a90e047d1, SIN volver a ejecutar PASS.
5. RESTORED-CLEAN-R2 demuestra reconstrucción a partir de los bytes del ZIP.
6. Abrir RESTORED-CLEAN-R2/FUJU-JUEGO-JUGABLE-R2/index.html en Chrome.
7. Para reproducir las pruebas, ejecutar browser_qa_r2.js en Chrome con el
   entorno local, y comprobar el registro R2-HOST-CHROME-READBACK.json.
Estado: PASSED SCOPED 188/188; no certificación física externa y no fábrica universal.
NEXT_ACTION: prueba humana de juego e implementación autónoma posterior de
una aplicación completa distinta con aceptación independiente.
"""
(REC/"LEEME-PRIMERO-R2.md").write_text(readme,encoding="utf8")
conversation={"schema":1,"conversationId":"LOCAL-FUJU-GAME-TEST-20261108",
 "conversationIdKind":"LOCAL_ALIAS_NOT_NATIVE",
 "coverage":"PARTIAL_ACCESSIBLE_SEGMENT","transcriptFullAvailable":False,
 "lastDirectUserLiteral":"continua",
 "source":"current accessible user message and tool evidence; no claimed verbatim historical transcript",
 "reason":"The user asked AUTOFABRICADOR to create a playable game from the GitHub FUJU story handoff and then continue to completion.",
 "verifiedEffects":["R1 playable locally","AI factory first attempt failed","AI factory new repair passed","R2 integrated","188/188 Windows Chrome","GitHub readback matched R2 SHA"],
 "nextAction":"Use R2 as playable candidate; collect gameplay review and independently validate game-engine autonomy.",
 "checkpointType":"CHAT_NOT_RESTORE_POINT","atUtc":now}
(REC/"CHECKPOINT-CONVERSACION.json").write_text(json.dumps(conversation,ensure_ascii=False,indent=2)+"\n","utf8")
project={"schema":1,"objectiveId":"af-fuju-game2d-manufacturing-proof-20261108",
 "functionalId":"AF.FACTORY.GAME2D","releaseId":"FUJU-R2","revisionId":"R2",
 "operationIds":["FC-005b88fedb044dc4","FC-3d98a854d33b4128"],
 "originalAIRepoJobs":["RJ-9ac71087da8a4a48","RJ-12d52c7a90e047d1"],
 "originalFailure":"STAGNATED_IDENTICAL_SOURCE_AFTER_28_OF_40_TESTS",
 "originalSuccess":"PASS_SCOPED_WASI_BROWSER_OFFLINE_40_CASES",
 "gameChromeE2E":{"status":"PASS","checks":188,"passed":188,"failure":0},
 "githubRepo":"https://github.com/Laster3000/JUEGO-DEL-MENU",
 "githubZipPath":"proyecto-fuju/juego/FUJU_JUEGO_JUGABLE_R2.zip",
 "zipSHA256":R2_HASH,"r1Preserved":True,"originalProductUnmodified":True,
 "M1":"PASS_SCOPED","M2":"PASS","M3":"PASS","M4":"NOT_APPLICABLE",
 "M5":"PASS_PORTABLE_ONLY","M6":"BLOCKED_INDEPENDENT_PHYSICAL_ACCEPTANCE",
 "limitations":["Full autonomous game generation NOT demonstrated","Art provisional, human game-quality review pending","No independent physical PC acceptance"],
 "nextAction":"User playtest, polish assets/novel-to-game fidelity, then general-factory E2E on different app.",
 "checkpointType":"PROJECT_NOT_RESTORE_POINT","atUtc":now}
(REC/"CHECKPOINT-PROYECTO.json").write_text(json.dumps(project,ensure_ascii=False,indent=2)+"\n","utf8")
backup=REC/"RESTORE-POINT"
backup.mkdir()
copy=backup/"FUJU_JUEGO_JUGABLE_R2.zip"
shutil.copyfile(REMOTE,copy)
assert sha(copy)==R2_HASH
dest=REC/"RESTORED-CLEAN-R2"
dest.mkdir()
with zipfile.ZipFile(copy) as z:
 assert z.testzip() is None
 infos=z.infolist()
 assert len(infos)==len(set(i.filename for i in infos))
 for i in infos:
  name=i.filename;p=PurePosixPath(name)
  assert name.startswith("FUJU-JUEGO-JUGABLE-R2/") and ".." not in p.parts and not p.is_absolute()
  assert "\\" not in name and ":" not in name
  assert stat.S_IFMT(i.external_attr >> 16)!=stat.S_IFLNK
  if i.is_dir():continue
  output=dest/name
  output.parent.mkdir(parents=True,exist_ok=True)
  with output.open("xb") as f:f.write(z.read(name))
  assert sha(output)==hashlib.sha256(z.read(name)).hexdigest()
 manifest=json.loads(z.read("FUJU-JUEGO-JUGABLE-R2/MANIFEST-SHA256.json"))
 for n,h in manifest["entries"].items():
  assert sha(dest/"FUJU-JUEGO-JUGABLE-R2"/n)==h
assert (dest/"FUJU-JUEGO-JUGABLE-R2"/"index.html").is_file()
dependencies={
 "originalAIModelSource":str(SRC),
 "originalAIModelSourceSha":sha(SRC),
 "originalFactoryReceipt":str(F_RECEIPT),
 "originalFactoryReceiptSha":sha(F_RECEIPT),
 "R2ZipOriginalSha":sha(ZIP),"R2GithubReadbackSha":sha(REMOTE)}
(REC/"ORIGINAL-LINKS-AND-HASHES.json").write_text(json.dumps(dependencies,ensure_ascii=False,indent=2)+"\n","utf8")
files=([REC/"LEEME-PRIMERO-R2.md",REC/"CHECKPOINT-CONVERSACION.json",
 REC/"CHECKPOINT-PROYECTO.json",REC/"ORIGINAL-LINKS-AND-HASHES.json",copy]
 +[p for p in sorted(dest.rglob("*")) if p.is_file()])
m={"schema":1,"atUtc":now,"root":str(REC),
 "coverage":"CONTINUITY_AND_REHEARSED_RESTORE",
 "entries":{str(p.relative_to(REC)).replace("\\","/"):sha(p) for p in files},
 "recoveryGameSha256":R2_HASH,"scope":"ISOLATED_RESCUE_ONLY"}
(REC/"MANIFEST-R2.json").write_text(json.dumps(m,ensure_ascii=False,indent=2)+"\n","utf8")
mr=json.loads((REC/"MANIFEST-R2.json").read_text("utf8"))
for name,h in mr["entries"].items():assert sha(REC/name)==h
final={"schema":1,"status":"PASS_READBACK_REHEARSED_RESTORE","atUtc":now,
       "sourceSHA256":R2_HASH,"manifestSHA256":sha(REC/"MANIFEST-R2.json"),
       "verifiedFiles":len(mr["entries"]),"recoveredGameIndex":str(dest/"FUJU-JUEGO-JUGABLE-R2"/"index.html")}
(REC/"FINAL-READBACK-R2.json").write_text(json.dumps(final,indent=2)+"\n","utf8")
print(json.dumps(final))
