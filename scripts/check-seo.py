"""Validate the generated static site's search metadata after npm run build."""
from html.parser import HTMLParser
from pathlib import Path
import json
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta, self.links, self.title, self.schema = {}, {}, '', ''
        self.in_title = self.in_schema = False
        self.h1 = 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta':
            self.meta[a.get('name', a.get('property'))] = a.get('content')
        if tag == 'link':
            self.links[a.get('rel')] = a.get('href')
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.in_title = True
        if tag == 'script':
            self.in_schema = a.get('type') == 'application/ld+json'

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script':
            self.in_schema = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema += data


base = 'https://tee-lakkhananukun.pages.dev'
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
urls = {n.text for n in ET.parse('dist/sitemap-0.xml').iter(ns + 'loc')}
expected, titles, descriptions = set(), [], []
for file in Path('dist').rglob('*.html'):
    page = Page(file.read_text())
    if file.name == '404.html':
        assert 'noindex' in page.meta.get('robots', ''), file
        assert 'canonical' not in page.links, file
        continue
    path = '/' + str(file.relative_to('dist')).removesuffix('index.html')
    expected.add(base + path)
    assert page.links.get('canonical') == base + path, path
    assert 'noindex' not in page.meta.get('robots', ''), path
    assert page.h1 == 1, path
    assert page.title and page.meta.get('description'), path
    titles.append(page.title)
    descriptions.append(page.meta['description'])
    data = json.loads(page.schema)
    assert data['@graph'][2]['url'] == base + path, path
    assert page.meta['og:url'] == base + path, path
    image = page.meta['og:image']
    assert image.startswith(base + '/') and Path('dist', image[len(base)+1:]).is_file(), image
assert expected == urls, (expected - urls, urls - expected)
assert len(set(titles)) == len(titles), 'Duplicate page titles'
assert len(set(descriptions)) == len(descriptions), 'Duplicate descriptions'
assert 'Sitemap: ' + base + '/sitemap-index.xml' in Path('dist/robots.txt').read_text()
assert Path('dist/404.html').is_file()
print(f'PASS: {len(urls)} pages with canonical URLs, unique metadata, JSON-LD and share images; sitemap, robots and noindex 404 verified.')
