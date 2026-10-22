from pathlib import Path
import re,sys,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
pages=[p for p in root.rglob("index.html") if "tests" not in p.parts]
assert len(pages)==12,("page count",len(pages))
urls=set()
for p in pages:
 s=p.read_text(encoding="utf-8")
 for name in ("canonical","description"):
  assert ("rel=\"canonical\"" in s if name=="canonical" else "name=\"description\"" in s),(p,name)
 can=re.search(r'<link[^>]*href="(https://netcheck-cn.github.io/[^"]*)"[^>]*rel="canonical"',s)
 assert can,(p,"canonical")
 assert can.group(1) not in urls,(p,"duplicate canonical")
 urls.add(can.group(1))
 assert "G-D9GC3GMQH9" in s,(p,"GA tag missing")
 for path in re.findall(r'(?:href|src)="(/[^"#?]+)',s):
  target=root/path.lstrip("/")
  assert target.is_file() or (target.is_dir() and (target/"index.html").is_file()),(p,path)
xml=ET.parse(root/"sitemap.xml")
locations={e.text for e in xml.iter() if e.tag.endswith("loc")}
assert urls==locations,("sitemap mismatch",urls^locations)
for resource in ("favicon.ico","assets/images/logo.png","assets/css/style.css","assets/js/app.js","README.md","404.html"):
 assert (root/resource).is_file(),resource
assert 'noindex' in (root/'404.html').read_text()
print(f"PASS: {len(pages)} pages, canonical/sitemap, links, assets, GA4, 404")
