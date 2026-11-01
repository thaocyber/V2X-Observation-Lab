"""Build the public HTML, Markdown and four-page PDF guide from one source.
Requires reportlab only for rebuilding; normal site use has no Python dependency.
"""
from pathlib import Path
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
for name,file in [("GuideSans","DejaVuSans.ttf"),("GuideBold","DejaVuSans-Bold.ttf"),("GuideMono","DejaVuSansMono.ttf")]:
 pdfmetrics.registerFont(TTFont(name,"/usr/share/fonts/truetype/dejavu/"+file))
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'web/docs';OUT.mkdir(exist_ok=True)
SITE='https://v2x.tcybertrust.id.vn/'
REPO='https://github.com/thaocyber/V2X-Observation-Lab'
# Each section is one printed page; all formats share the same text.
pages=[('description','Description and scope',[
('h','What the tool helps you explore'),
('p','V2X Observation Lab is an open-source, browser-local MVP for automotive security education and evidence review. It asks what a receiving vehicle can establish from position messages, and what further evidence is needed before interpreting a result.'),
('h','Three workspaces'),
('ul',[
'Observation Playground (/): compare synthetic true position, current position claims and the latest claim received by another vehicle. Adjust constant offsets, reception delay and message omissions.',
'Learning Lab (/learn/): inspect two worlds with identical position messages, answer a question, then reveal their different true positions. Create and exchange lessons using a bounded template.',
'Evaluation Inspector (/evaluate/): inspect supplied binary predictions and reference labels. Review individual errors and export a scoped evidence report. It is separate from the vehicle simulation.'
]),
('h','Reading the scene'),
('p','A is the sending vehicle. B is the receiving vehicle. A-prime is the position A claims, not another car. The purple "B remembers" pin is the position stored in the latest received message, not B itself. Simulation-wide comparison exposes synthetic ground truth to the analyst; Receiver-only excludes truth and unreceived claims.'),
('h','Evidence boundaries'),
('p','A constant translation cancels in position differences within an unchanged-offset segment. Matching changes therefore do not establish correct absolute position. Sampling and delayed information are observation limits, not automatic evidence of an attack. The tool does not run an AI detector, transmit RF, encode CAM/BSM packets, simulate collisions or certify safety. Included scenarios and prediction fixtures are authored synthetic examples.'),
('h','License and development'),
('p','The project code is MIT licensed. Retain the bundled Three.js license and third-party notices. The current release is a working MVP. Report reopening, compatible evaluation comparison and explicit case-to-scenario adapters are planned, not current features.'),
('links',[('Source and contribution guidance',REPO),('License',REPO+'/blob/main/LICENSE'),('Updated changelog',REPO+'/blob/main/CHANGELOG.md'),('Third-party notices',REPO+'/blob/main/THIRD_PARTY_NOTICES.md')])
]),('installation','Installation and requirements',[
('h','Use the hosted version'),
('p','Open https://v2x.tcybertrust.id.vn/ in a modern browser. The interface and bundled examples use English. The overview video has US English narration, optional English captions and a text transcript. Nothing plays automatically.'),
('h','Run a local copy'),
('p','The site is static HTML, CSS and JavaScript, with Three.js for the 3D scene. Any static HTTP server can serve the web directory. The following example uses Git and Python 3; a downloaded GitHub ZIP can replace the clone step.'),
('code','git clone https://github.com/thaocyber/V2X-Observation-Lab.git\ncd V2X-Observation-Lab\npython3 -m http.server 8095 --bind 127.0.0.1 --directory web'),
('p','Open http://127.0.0.1:8095/ and keep the terminal running. Routes /learn/, /evaluate/ and /docs/ open the other workspaces and this guide. Stop the server with Ctrl+C. On Windows, use py -m http.server if python3 is unavailable. Do not open index.html using file://; module loading and browser security features require HTTP or HTTPS.'),
('h','Platforms and browser capabilities'),
('p','The static bundle is intended for Windows, macOS and Linux with a current browser supporting JavaScript modules, SVG, file input and Blob downloads. WebGL is needed for 3D; coordinate/message information remains available if 3D fails. The Inspector requires Web Crypto: use HTTPS or localhost. Desktop workflows have been checked in the development browser; a full browser, mobile-device and assistive-technology matrix has not been certified.'),
('h','Offline operation and privacy'),
('p','After downloading the complete bundle, the workspaces run without a remote API, account, model download or CDN. Imported lesson and evaluation files are processed in the browser, not uploaded. There is no autosave; download your lesson or report before leaving. Exports can contain user-supplied identifiers and notes, so review them before sharing.'),
('h','Verify the source package'),
('code','python3 scripts/verify_public.py'),
('p','Verification requires Python 3.10+ and Node.js 20+. It checks the file manifest, local references, limited private-content patterns and deterministic implementation tests in an isolated copy. It is not a security certification or model benchmark. Media and PDF rebuilding have optional development dependencies; they are not required to use the downloaded site.'),
('links',[('Public demo',SITE),('Implementation checks',REPO+'/actions')])
]),('playground','Using the Observation Playground',[
('h','A short guided walkthrough'),
('ol',[
'Open the homepage and choose "1 · Observation gap". At 6.5 s, true A is at x = -10.5 m while B retains x = -12 m from the message sent at 6 s. There is no offset in this example: a moving vehicle can outpace its last sample even with zero transmission delay.',
'Choose "2 · Offset, equal differences". At 10 s, A is at x = 0 m and its claim is x = 8 m. The latest two sent positions change by 3 m in both cases. Use the illustrated movement and the optional numerical details to compare these equal changes.',
'Switch Observation mode to "Receiver-only". Ground truth and unreceived claims disappear. Their absence is intentional: this view represents the information available to B.',
'Choose "3 · Late information". At 7 s the retained message was sent at 6 s and has just arrived after a 1 s delay. Its age since transmission is 1 s; its age since arrival is 0 s. These are different measures.'
]),
('h','Parameters and update behavior'),
('ul',[
'Offset X / Offset Y: translation in metres, each from -20 to 20. The presets use a planar X offset; this is not GNSS signal spoofing.',
'Start / End: simulation seconds defining the interval start <= time < end. The UI uses 0.5 s increments and requires end after start.',
'Reception delay: fixed delay from 0 to 2 s. Omit every Nth message: 0 means none; the UI permits 0 through 10.',
'Click "Apply & reset" after editing. Pending fields do not change the scene or exports. Applied settings reset time to zero. The timeline runs from 0 to 20 s, with one message per second; arrivals beyond 20 s remain outside playback.'
]),
('h','Reproduce and interpret'),
('p','Use "Download scenario" to save an importable configuration. Reopen it through advanced settings, then seek to the same time. "Download steps + expected results" records the selected moment. JSON reports include the full synthetic trace and ground truth for analysis; they do not grant the receiver extra knowledge. A trace or report is not a scenario-import file.'),
('p','Within a constant-offset segment, differences match. At offset onset or removal, they may jump. Compare message identifiers and send times before comparing sender and receiver differences: omissions can make the pairs different. Data age is time since transmission, not a risk score or an IP TTL. Crossing teaching trajectories do not establish a collision.'),
('links',[('Scenario schema',REPO+'/blob/main/docs/DATA_FORMAT.md'),('Report format',REPO+'/blob/main/docs/REPORT_FORMAT.md')])
]),('learning-evaluation','Lessons and evaluation evidence',[
('h','Create a lesson'),
('ol',[
'Open /learn/. Read the identical messages shown for B, choose an answer, then select "Reveal true positions". In the default example, world 2 has an 8 m offset while both worlds send the same positions.',
'Choose "Create your lesson". Edit the title, objective, question and explanation. Set the world-2 offset from 2 to 16 m and speed from 1 to 5 m/s. Select "Apply & try lesson".',
'Use "Download lesson JSON" to keep or share the exercise. "Open lesson" imports that lesson file. This template keeps receiver messages identical; it is not a general traffic editor and does not validate the author explanation.'
]),
('h','Inspect evaluation results'),
('ol',[
'Open /evaluate/. The fictional teaching sample has eight rows: TP = 2, TN = 3, FP = 1 and FN = 2. No model was executed. Read the scope and definition of class 1 before interpreting the results.',
'Download sample JSON as a schema example, or import your own authorized evaluation. Supply declared dataset, model, split, intendedUse, positiveClass, labelSource, thresholdPolicy and dataOrigin metadata. Each record needs a unique id plus numeric expected and predicted values of 0 or 1. The UI permits up to 10,000 rows and a 2 MiB file.',
'Use "Filter outcomes" to inspect errors. The sample FN filter shows two cases. Accuracy is (TP+TN)/N; precision is TP/(TP+FP); recall is TP/(TP+FN); F1 is 2TP/(2TP+FP+FN). A zero denominator is shown as N/A, not zero.',
'Add reviewer notes and select "Export evidence report". The report includes all validated input rows even when the table is filtered, derived metrics, assumptions, unknowns and notes. Export before leaving; no autosave is provided.'
]),
('h','What an evidence report does not establish'),
('p','Labels and provenance are importer declarations. SHA-256 identifies the normalized input, not authenticated origin; it does not cover reviewer notes. Metrics describe these rows, not deployment performance. Prediction rows are not mapped into 3D. Evidence-report reopening is not implemented: preserve the original evaluation input separately. Scenario, lesson, evaluation-input and evidence-report JSON files are distinct formats.'),
('h','Troubleshooting and support'),
('p','For a blank 3D view, check browser WebGL support or use numerical details. For Inspector hashing errors, use HTTPS or localhost. For import errors, start with the matching sample/schema and inspect field types and size. Report ordinary bugs through GitHub Issues; use private vulnerability reporting for security issues.'),
('links',[('Evaluation schema and sample',REPO+'/blob/main/docs/EVALUATION_FORMAT.md'),('Report a bug',REPO+'/issues/new/choose'),('Report a vulnerability privately',REPO+'/security/advisories/new')])
])]
styles=getSampleStyleSheet();styles.add(ParagraphStyle(name='GuideBody',fontName='GuideSans',fontSize=10,leading=14,spaceAfter=8));styles.add(ParagraphStyle(name='GuideH',fontName='GuideBold',fontSize=11.5,leading=15,spaceBefore=8,spaceAfter=5));styles.add(ParagraphStyle(name='GuideTitle',fontName='GuideBold',fontSize=19,leading=24,spaceAfter=12));styles.add(ParagraphStyle(name='GuideCode',fontName='GuideMono',fontSize=8.2,leading=12,spaceAfter=9,backColor=colors.HexColor('#eef3f7'),borderPadding=6));styles.add(ParagraphStyle(name='GuideLink',fontName='GuideSans',fontSize=8.5,leading=12,spaceAfter=4))
flow=[];html_sections=[];md=['# V2X Observation Lab User Guide','', 'English MVP documentation | Updated 1 November 2026','', '[Read on the website]('+SITE+'docs/) · [Download PDF](../web/docs/v2x-observation-lab-guide.pdf)','']
for ix,(anchor,title,blocks) in enumerate(pages):
 if ix:flow.append(PageBreak())
 flow.append(Paragraph('V2X Observation Lab',styles['GuideH']));flow.append(Paragraph(f'{ix+1}. {title}',styles['GuideTitle']))
 md+=['## '+title,''];html_blocks=[]
 for kind,value in blocks:
  if kind=='h':flow.append(Paragraph(escape(value),styles['GuideH']));html_blocks.append('<h3>'+escape(value)+'</h3>');md+=['### '+value,'']
  elif kind=='p':flow.append(Paragraph(escape(value),styles['GuideBody']));html_blocks.append('<p>'+escape(value)+'</p>');md+=[value,'']
  elif kind=='code':flow.append(Preformatted(value,styles['GuideCode']));html_blocks.append('<pre><code>'+escape(value)+'</code></pre>');md+=['```sh',value,'```','']
  elif kind in ('ol','ul'):
   html_blocks.append('<'+kind+'>')
   for n,v in enumerate(value):
    prefix=f'{n+1}. ' if kind=='ol' else '- '
    flow.append(Paragraph(escape(prefix+v),styles['GuideBody']));html_blocks.append('<li>'+escape(v)+'</li>');md+=[prefix+v]
   html_blocks.append('</'+kind+'>');md+=['']
  else:
   html_blocks.append('<ul class="references">')
   for label,url in value:
    flow.append(Paragraph('<link href="'+escape(url,quote=True)+'" color="#146957">'+escape(label)+'</link>',styles['GuideLink']));html_blocks.append('<li><a href="'+escape(url,quote=True)+'">'+escape(label)+'</a></li>');md+=['- ['+label+']('+url+')']
   html_blocks.append('</ul>');md+=['']
 html_sections.append('<section id="'+anchor+'" aria-labelledby="'+anchor+'-title"><h2 id="'+anchor+'-title">'+str(ix+1)+' / '+escape(title)+'</h2>'+''.join(html_blocks)+'</section>')
def footer(c,d):
 c.setFont('GuideSans',8);c.setFillColor(colors.HexColor('#526273'));c.drawString(42,26,'V2X Observation Lab | MVP user guide | 1 November 2026');c.drawRightString(A4[0]-42,26,f'{d.page} / 4')
SimpleDocTemplate(str(OUT/'v2x-observation-lab-guide.pdf'),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=35,bottomMargin=42,title='V2X Observation Lab User Guide',author='TCyberTrust Lab').build(flow,onFirstPage=footer,onLaterPages=footer)
nav=''.join('<a href="#'+a+'">'+str(i+1)+'. '+escape(t)+'</a>' for i,(a,t,_) in enumerate(pages))
(OUT/'index.html').write_text('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Documentation · V2X Observation Lab</title><meta name="description" content="English user guide for V2X Observation Lab: features, installation, scenarios, lessons and evaluation evidence."><link rel="stylesheet" href="../style.css?v=demo-1"><link rel="stylesheet" href="guide.css"></head><body><header><a href="../">TCyberTrust <span>/ V2X Observation Lab</span></a><a href="https://github.com/thaocyber/V2X-Observation-Lab">GitHub</a></header><main class="user-guide"><p class="eyebrow">DOCUMENTATION / WORKING MVP</p><h1>V2X Observation Lab User Guide</h1><p>Understand the model, run the tool and reproduce the exercises. This guide covers the public MVP; planned features are identified separately.</p><div class="toolbar"><a class="demo-cta" href="v2x-observation-lab-guide.pdf">Download the 4-page PDF</a><a href="https://github.com/thaocyber/V2X-Observation-Lab/blob/main/docs/USER_GUIDE.md">Read on GitHub</a><a href="../learn/">Try a lesson</a></div><nav class="guide-toc" aria-label="Guide contents">'''+nav+'</nav>'+''.join(html_sections)+'''<footer>Updated 1 November 2026 · <a href="https://github.com/thaocyber/V2X-Observation-Lab/blob/main/CHANGELOG.md">Changelog</a> · <a href="../LICENSE">MIT license</a></footer></main></body></html>''')
(OUT/'guide.css').write_text('''.user-guide{max-width:1000px}.user-guide section{padding:28px 0;border-top:1px solid var(--line);margin-top:28px;scroll-margin-top:20px}.user-guide h2{font-size:1.5rem}.user-guide h3{margin-top:24px}.user-guide li{margin:10px 0}.guide-toc{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:28px 0}.guide-toc a{padding:12px;border:1px solid var(--line);border-radius:8px}.user-guide pre{overflow-x:auto;padding:16px;background:var(--panel);border-radius:8px;font-size:.85rem}.references{padding-left:20px}.user-guide .toolbar{margin-bottom:20px}@media(max-width:600px){.guide-toc{grid-template-columns:1fr}}@media print{header,.guide-toc,.toolbar,footer{display:none}body{background:white;color:black}.user-guide{max-width:none}.user-guide section{break-before:page;border:0}a{color:black}}
''')
(ROOT/'docs/USER_GUIDE.md').write_text('\n'.join(md))
print('Generated HTML, Markdown and PDF from the same guide content.')
