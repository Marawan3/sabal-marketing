"""
Archivo for the OG images (owner, 2026-10-20): a static TTF at the H1's
weight (750) and width (110%), instanced from the site's own Archivo file,
because the image renderer (Satori, behind next/og) reads TTF, OTF and WOFF
but not WOFF2 or variable axes.

    npm run build && python3 scripts/og-font.py

Writes assets/og/archivo-750-110.ttf (latin, as the site's file).
src/lib/og-image.tsx reads it. Archivo is under the SIL Open Font License;
its text is assets/og/OFL.txt. Needs fontTools (pip).
"""

import glob
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT = "assets/og/archivo-750-110.ttf"


def archivo():
    for path in glob.glob(".next/static/media/*.woff2"):
        font = TTFont(path)
        cmap = font.getBestCmap()
        # The latin file: it has the basic Latin letters (the site's other Archivo files are latin-ext and Vietnamese).
        if "fvar" in font and font["name"].getDebugName(1).startswith("Archivo") and all(ord(c) in cmap for c in "AZaz09"):
            return path, font
    sys.exit("No Archivo latin file in .next/static/media: run `npm run build` first.")


def main():
    path, font = archivo()
    static = instancer.instantiateVariableFont(font, {"wght": 750, "wdth": 110}, updateFontNames=False)
    static.flavor = None
    static.save(OUT)
    print(f"{OUT} from {path}: {len(static.getGlyphOrder())} glyphs")


if __name__ == "__main__":
    main()
