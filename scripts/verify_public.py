#!/usr/bin/env python3
"""Verify a source-only public package without Git or third-party packages."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'PUBLIC_MANIFEST.json'
EXCLUDED = {'PUBLIC_MANIFEST.json', 'VALIDATION.json'}
SKIP = {'.git', '__pycache__', '.venv', 'node_modules'}

def inventory():
    files = {}
    for path in sorted(ROOT.rglob('*')):
        rel = path.relative_to(ROOT)
        if any(part in SKIP for part in rel.parts):
            continue
        if path.is_symlink():
            raise ValueError('Symlink not permitted: ' + str(rel))
        if path.is_file() and str(rel) not in EXCLUDED:
            if path.suffix in {'.pt', '.npz', '.npy', '.joblib', '.pkl', '.zip'} or path.name.startswith('.env'):
                raise ValueError('Unexpected binary or environment file: ' + str(rel))
            files[rel.as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return files

def inspect(files):
    bad = []
    for name in files:
        if name.startswith(('src/', 'experiments/', 'data/')):
            raise ValueError('Unexpected distribution directory: ' + name)
        text = (ROOT / name).read_text()
        for pattern in [r'/(?:home|Users)/', r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', r'\bgh[pousr]_[A-Za-z0-9]{30,}', r'\bAKIA[0-9A-Z]{16}\b']:
            if re.search(pattern, text):
                bad.append(name)
    if bad:
        raise ValueError('Review potential private content in: ' + ', '.join(sorted(set(bad))))
    class Links(HTMLParser):
        def __init__(self):
            super().__init__(); self.links = []
        def handle_starttag(self, tag, attrs):
            self.links.extend(value for key, value in attrs if key in {'src', 'href'} and value)
    for name in files:
        path = ROOT / name
        refs = []
        if path.suffix == '.html':
            parser = Links(); parser.feed(path.read_text()); refs = parser.links
        elif path.suffix in {'.mjs', '.js'} and '/vendor/' not in name:
            refs = re.findall(r'''(?:\bfrom\s+|\bimport\s+)['"]([^'"]+)['"]''', path.read_text())
        elif path.suffix == '.md':
            refs = re.findall(r'\]\(([^)]+)\)', path.read_text())
        for ref in refs:
            url = urlsplit(ref)
            if url.scheme or url.netloc or not url.path:
                continue
            target = (path.parent / unquote(url.path)).resolve()
            if target.is_dir():
                target /= 'index.html'
            if not target.is_relative_to(ROOT) or target.relative_to(ROOT).as_posix() not in files:
                raise ValueError('Missing local dependency: ' + name + ' -> ' + ref)

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--refresh', action='store_true')
    ap.add_argument('--report', type=Path)
    args = ap.parse_args()
    result = {'status':'FAIL', 'scope':'Synthetic implementation and package checks only', 'checks':{}}
    try:
        files = inventory(); inspect(files)
        if args.refresh:
            MANIFEST.write_text(json.dumps({'version':1, 'scope':'Reviewed public package bytes', 'files':files}, indent=2)+'\n')
            print('Public manifest refreshed after content checks'); return 0
        expected = json.loads(MANIFEST.read_text())['files']
        if expected != files:
            raise ValueError('Public inventory changed; review before refreshing manifest')
        result['manifest_sha256'] = hashlib.sha256(MANIFEST.read_bytes()).hexdigest()
        result['checks'] = {'inventory_and_hashes':'PASS', 'relative_links_and_imports':'PASS', 'limited_private_content_patterns':'PASS', 'git_metadata_present':(ROOT/'.git').exists(), 'files':len(files)}
        with tempfile.TemporaryDirectory(prefix='v2x-public-check-') as tmp:
            clean = Path(tmp)
            for name in files:
                dest = clean/name; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(ROOT/name,dest)
            env = dict(os.environ); env.pop('NODE_PATH',None); env.pop('PYTHONPATH',None)
            command = ['node','--test',*[p.relative_to(clean).as_posix() for p in sorted((clean/'tests').glob('*.test.mjs'))]]
            run = subprocess.run(command, cwd=clean, env=env, capture_output=True, text=True)
            output = (run.stdout+run.stderr).replace(tmp,'<isolated-copy>')
            result['tests'] = {'command':command,'exit_code':run.returncode,'output':output}
            print(output)
            if run.returncode:
                raise ValueError('Synthetic behavior tests failed')
        result['status'] = 'PASS'
        result['limitations'] = ['Pattern scan is not an exhaustive security audit','No full browser/device matrix','No live vehicle, RF, or predictive-performance testing','This script does not verify deployed hosting or repository access settings']
    except Exception as exc:
        result['error'] = str(exc); print(str(exc),file=sys.stderr)
    if args.report:
        args.report.write_text(json.dumps(result,indent=2)+'\n')
    print(result['status']); return 0 if result['status']=='PASS' else 1

if __name__ == '__main__':
    sys.exit(main())
