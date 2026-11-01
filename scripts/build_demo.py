"""Render a silent, model-derived explainer. Requires Pillow and imageio-ffmpeg.
Run from any directory: python scripts/build_demo.py
"""
from pathlib import Path
import json, subprocess, math
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'web/media'
OUT.mkdir(exist_ok=True)
frames = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
 "import {example,lessonFrame} from './web/learn/model.mjs'; console.log(JSON.stringify(Array.from({length:6},(_,t)=>lessonFrame(example,t))));"], cwd=ROOT))
W,H,FPS,SECONDS=1280,720,24,48
BG='#0a121e'; PANEL='#121f30'; LINE='#29384c'; WHITE='#e2edf5'; MUTED='#a6b9c9'; MINT='#67e8c3'; GOLD='#ffc477'
font_path=Path('/usr/share/fonts/truetype/dejavu')
def font(size,bold=False): return ImageFont.truetype(str(font_path/('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')),size)
fonts={n:font(n) for n in [18,20,22,24,28,32,42]}; bold={n:font(n,True) for n in [20,24,28,32,42]}
def render(t):
 im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
 def txt(x,y,s,size=24,color=WHITE,heavy=False):d.text((x,y),s,font=(bold if heavy else fonts)[size],fill=color)
 def box(b,fill=PANEL,outline=LINE):d.rounded_rectangle(b,16,fill=fill,outline=outline,width=2)
 def line(a,b,c=LINE,width=2):d.line([a,b],fill=c,width=width)
 txt(48,25,'TCyberTrust / V2X Observation Lab',20,MINT,True)
 txt(885,25,'ILLUSTRATED DEMO  /  48 SEC',18,MUTED)
 line((48,64),(1232,64))
 reveal=t>=12
 phase=0 if t<12 else 1 if t<24 else 2 if t<36 else 3
 titles=['Two worlds. Identical messages.','Reveal what B cannot see.','Equal movement. Different places.','Turn the question into a lesson.']
 subs=['Can receiver B tell which world reports the wrong position?', 'The gold marker is a position claim, not another car.', 'A constant offset cancels when comparing position changes.', 'Create a scenario. Ask a question. Reveal the evidence.']
 txt(48,91,titles[phase],42,WHITE,True);txt(48,151,subs[phase],24,MUTED)
 if phase<3:
  # Smooth teaching motion between the model's integer-second frames.
  sim=0 if t<24 else min(5,(t-24)/2)
  k=min(5,int(sim));frac=sim-k
  f=frames[k];nxt=frames[min(5,k+1)]
  for i in range(2):
   top=207+i*186;box((48,top,1232,top+166))
   txt(72,top+15,f'WORLD {i+1}',20,MUTED,True)
   txt(253,top+15,'True position hidden' if not reveal else ('Claim matches truth' if i==0 else 'Claim shifted by +8 m'),20,MINT if reveal else MUTED)
   left,right=155,920
   def x(v):return left+(v+8)/40*(right-left)
   road=top+104
   d.rounded_rectangle((95,road-25,960,road+25),8,fill='#1d3043')
   for a in range(110,950,45):line((a,road),(a+22,road),'#456078')
   for v in [-8,0,8,16,24,32]:txt(x(v)-10,road+30,str(v),18,MUTED)
   a=f['worlds'][i];b=nxt['worlds'][i]
   truth=a['truth']+(b['truth']-a['truth'])*frac
   claim=a['reported']+(b['reported']-a['reported'])*frac
   if reveal:
    cx=x(truth);d.rounded_rectangle((cx-24,road-14,cx+24,road+14),7,fill=MINT)
    d.rectangle((cx-9,road-10,cx+10,road+10),fill='#237869')
    txt(cx-18,road-49,'A',20,MINT,True)
   cx=x(claim);d.ellipse((cx-29,road-29,cx+29,road+29),outline=GOLD,width=3)
   txt(cx+30,road-49,'Claim',20,GOLD)
   box((985,top+20,1210,top+145),BG)
   txt(1003,top+32,'B receives',20,MUTED)
   txt(1003,top+65,f'x = {a["reported"]} m',28,GOLD,True)
   txt(1003,top+108,f'sent at {k} s',18,MUTED)
  caption=('Both worlds send exactly the same position messages.' if phase==0 else 'World 2 is 8 metres away from its claim. B sees identical messages.' if phase==1 else 'Both advance 3 m each second. Matching changes do not prove position.')
  txt(48,598,caption,24,WHITE)
 else:
  cards=[('01','Explore','See only B’s messages.','Then reveal the truth.'),('02','Create','Set the offset and speed.','Write your own question.'),('03','Share','Download the lesson JSON.','Reopen it in Learning Lab.')]
  for i,(num,title,a,b) in enumerate(cards):
   x=48+i*400;box((x,222,x+384,482));txt(x+24,245,num,42,MINT,True);txt(x+24,312,title,32,WHITE,True);txt(x+24,377,a,20,MUTED);txt(x+24,413,b,20,MUTED)
  txt(48,527,'Try it: v2x.tcybertrust.id.vn/learn/',32,MINT,True)
  txt(48,591,'Position messages alone cannot confirm the true position.',24,WHITE)
 txt(48,655,'Synthetic teaching model · no radio injection, detector or safety verdict',18,MUTED)
 d.rectangle((48,697,1232,701),fill=LINE);d.rectangle((48,697,48+1184*t/SECONDS,701),fill=MINT)
 return im
writer=imageio_ffmpeg.write_frames(str(OUT/'observation-demo.mp4'),(W,H),fps=FPS,codec='libx264',pix_fmt_in='rgb24',pix_fmt_out='yuv420p',output_params=['-crf','23','-movflags','+faststart'],ffmpeg_log_level='error')
writer.send(None)
for n in range(SECONDS*FPS):writer.send(render(n/FPS).tobytes())
writer.close()
render(0).save(OUT/'observation-demo-poster.png')
print(f'Rendered {SECONDS}s, {FPS}fps, {W}x{H}; model-derived frames: {len(frames)}')
