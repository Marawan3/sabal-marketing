"""
The WunTab wordmark as outlines (owner, 2026-10-20): "WunTab" in Archivo at
weight 750, width 110%, tracking -0.02em, the H1's settings, shaped with the
font's own kerning. Writes the path and its box for src/components/logo.tsx.

The font is the site's own Archivo (variable, wght 100-900 and wdth 62-125),
the latin file next/font puts in .next/static/media after `npm run build`.

    python3 scripts/wordmark.py [cap height in px at logo size 28]

Needs fontTools and uharfbuzz (pip). The drawing is in logo-size-28 pixels:
the box is as tall as the tile (28), and the capitals sit centred on the
tile's mark (the W's centre, 12.75px down at size 28).
"""

import glob
import io
import json
import sys

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

TEXT = "WunTab"
WGHT, WDTH = 750, 110
TRACKING_EM = -0.02
TILE = 28
# The W in the tile runs from y=12 to y=39 of 56 (plus half the stroke above and below), so its centre is 25.5/56.
MARK_CENTRE = 25.5 / 56 * TILE


def archivo():
    for path in glob.glob(".next/static/media/*.woff2"):
        font = TTFont(path)
        cmap = font.getBestCmap()
        if "fvar" in font and font["name"].getDebugName(1).startswith("Archivo") and all(ord(c) in cmap for c in TEXT):
            return path, font
    sys.exit("No Archivo latin file in .next/static/media: run `npm run build` first.")


def main():
    cap_px = float(sys.argv[1]) if len(sys.argv) > 1 else 16.0
    path, font = archivo()
    static = instancer.instantiateVariableFont(font, {"wght": WGHT, "wdth": WDTH})
    upm = static["head"].unitsPerEm
    buf = io.BytesIO()
    static.flavor = None
    static.save(buf)
    blob = hb.Blob(buf.getvalue())
    hb_font = hb.Font(hb.Face(blob))

    glyphs = static.getGlyphSet()
    # Cap height: the top of the T (flat, no overshoot).
    cap = BoundsPen(glyphs)
    glyphs[static.getBestCmap()[ord("T")]].draw(cap)
    cap_units = cap.bounds[3]
    size = cap_px / cap_units * upm
    scale = size / upm
    tracking = TRACKING_EM * upm

    shaped = hb.Buffer()
    shaped.add_str(TEXT)
    shaped.guess_segment_properties()
    hb.shape(hb_font, shaped, {"kern": True, "liga": True})

    baseline = MARK_CENTRE + cap_px / 2
    pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    bounds = BoundsPen(glyphs)
    x = 0.0
    order = static.getGlyphOrder()
    for i, (info, pos) in enumerate(zip(shaped.glyph_infos, shaped.glyph_positions)):
        name = order[info.codepoint]
        # Font units to drawing pixels, y down, baseline at `baseline`.
        t = (scale, 0, 0, -scale, (x + pos.x_offset) * scale, baseline)
        glyphs[name].draw(TransformPen(pen, t))
        glyphs[name].draw(TransformPen(bounds, t))
        x += pos.x_advance + (tracking if i < len(TEXT) - 1 else 0)

    x0, y0, x1, y1 = bounds.bounds
    print(json.dumps({
        "font": path, "upm": upm, "fontSize": round(size, 3), "capHeight": cap_px,
        "baseline": round(baseline, 3), "ink": [round(v, 2) for v in (x0, y0, x1, y1)],
        "width": round(x1, 2), "height": TILE, "d": pen.getCommands(),
    }))


if __name__ == "__main__":
    main()
