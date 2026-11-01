"""Add US female narration to the demo. Requires imageio-ffmpeg.
Provide four local MP3 clips using --audio-dir. With --synthesize, edge-tts
sends the public narration text to Microsoft's online speech service first.
"""
import argparse, asyncio, json, subprocess, tempfile, wave
from array import array
from pathlib import Path
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
MEDIA=ROOT/'web/media'
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--audio-dir',type=Path,required=True)
p.add_argument('--synthesize',action='store_true')
args=p.parse_args()
script=json.loads((ROOT/'docs/demo-narration.json').read_text())
if args.synthesize:
 import edge_tts
 args.audio_dir.mkdir(parents=True,exist_ok=True)
 async def generate():
  for i,part in enumerate(script['segments']):
   await edge_tts.Communicate(part['text'],script['voice'],rate=script['rate']).save(str(args.audio_dir/f'part-{i}.mp3'))
 asyncio.run(generate())
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
audio = array('h', [0]) * (48 * 48000)
for i,part in enumerate(script['segments']):
 clip=args.audio_dir/f'part-{i}.mp3'
 if not clip.exists():raise ValueError(f'Missing narration segment {i}')
 pcm=subprocess.check_output([ffmpeg,'-v','error','-i',str(clip),'-af','loudnorm=I=-18:TP=-1.5:LRA=7','-f','s16le','-ac','1','-ar','48000','-'])
 samples=array('h');samples.frombytes(pcm)
 duration=len(samples)/48000
 if duration>11.5:raise ValueError(f'Segment {i} is {duration:.2f}s; shorten it to fit its scene')
 start=round(part['start']*48000)
 audio[start:start+len(samples)]=samples
with tempfile.TemporaryDirectory(prefix='v2x-narration-') as tmp:
 wav=Path(tmp)/'narration.wav'
 with wave.open(str(wav),'wb') as out:
  out.setnchannels(1);out.setsampwidth(2);out.setframerate(48000);out.writeframes(audio.tobytes())
 target=Path(tmp)/'narrated.mp4'
 subprocess.run([ffmpeg,'-v','error','-i',str(MEDIA/'observation-demo.mp4'),'-i',str(wav),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','128k','-t','48','-movflags','+faststart',str(target)],check=True)
 (MEDIA/'observation-demo.mp4').write_bytes(target.read_bytes())
def timestamp(seconds):
 return f'00:{int(seconds)//60:02}:{seconds%60:06.3f}'
vtt=['WEBVTT','']
for part in script['segments']:
 vtt += [f'{timestamp(part["start"])} --> {timestamp(part["start"]+11.5)}',part['text'],'']
(MEDIA/'observation-demo.en.vtt').write_text('\n'.join(vtt))
print('Narrated demo: 48 seconds, en-US female synthetic voice, no music.')
