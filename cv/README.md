# CV source

`ernest-sacdal-cv.html` is the source of truth for the CV. It is a hand-built
replica of `Ernest-Sacdal-CV.docx` (Word), matching its A4 geometry, Arial type
scale, colours and spacing — those values are noted as comments next to the CSS
custom properties at the top of the file.

`public/ernestsacdalcv.pdf` is **generated** — edit the HTML, never the PDF.
It is linked from the hero social row in `src/components/sections/Hero.tsx`,
so the filename must not change.

## Re-render after editing

```bash
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 \
  --print-to-pdf="$PWD/public/ernestsacdalcv.pdf" \
  "file://$PWD/cv/ernest-sacdal-cv.html"
```

Any Chromium-based browser works; Brave is what is installed on this machine.

## Keep it to one page

The layout currently fits A4 with only ~3px to spare. If added content spills to
a second page, tighten the `--sp-*` spacing custom properties rather than cutting
content. Check with:

```bash
python3 -c "import re;print(len(re.findall(rb'/Type\s*/Page[^s]',open('public/ernestsacdalcv.pdf','rb').read())))"
```
