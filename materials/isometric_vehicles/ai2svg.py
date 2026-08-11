#!/usr/bin/env python3
"""
ai2svg.py -- extract the Adobe Illustrator private-data art stream from an
Illustrator-generated EPS and convert the vector artwork to SVG.

Handles the subset of the AI5/AI8 art language actually used by this class of
file: filled paths (m/l/L/c/C/v/V/y/Y/f), compound paths (*u/*U), groups (u/U),
RGB + process colour fills (Xa/Xk), linear gradient fills (Bb/Bg/Xm/BB) and
blend modes (Xy).  No strokes, clips or text are present in the source.
"""

import base64
import re
import sys
import zlib
from math import cos, sin, radians


# ---------------------------------------------------------------- extraction

def extract_ai_stream(eps_path):
    """Pull the %AI9_PrivateDataBegin block out of an EPS and inflate it."""
    raw = open(eps_path, "rb").read().decode("latin-1")
    start = raw.find("%AI9_DataStream")
    if start < 0:
        raise SystemExit("No %AI9_DataStream found -- this EPS has no private vector data.")
    body = raw[start:].split("\n", 1)[1]
    chunks = []
    for line in body.split("\n"):
        line = line.rstrip("\r")
        if line.startswith("%AI9_PrivateDataEnd"):
            break
        if line.startswith("%"):
            chunks.append(line[1:])
    a85 = "".join(chunks)
    end = a85.find("~>")
    if end >= 0:
        a85 = a85[:end]
    return zlib.decompress(base64.a85decode(a85)).decode("latin-1").replace("\r", "\n")


# ------------------------------------------------------------------ gradients

STOP_RE = re.compile(r"^([-\d.eE ]+?)\s+(\d+)\s+([-\d.]+)\s+([-\d.]+)\s+%_BS\s*$")


def parse_gradients(text):
    """Return {name: [(offset_pct, '#rrggbb'), ...]} from %AI5_BeginGradient blocks."""
    grads = {}
    name = None
    stops = []
    for line in text.split("\n"):
        line = line.strip()
        if line.startswith("%AI5_BeginGradient:"):
            name = line.split("(", 1)[1].rsplit(")", 1)[0]
            stops = []
        elif line.endswith("%_BS") and name:
            m = STOP_RE.match(line)
            if not m:
                continue
            nums = m.group(1).split()
            if len(nums) < 7:
                continue
            r, g, b = (float(v) for v in nums[4:7])   # CMYK first, then RGB
            mid, ramp = float(m.group(3)), float(m.group(4))
            stops.append((ramp, mid, rgb_hex(r, g, b)))
        elif line.startswith("%AI5_EndGradient") and name:
            if stops:
                grads[name] = sorted(stops, key=lambda s: s[0])
            name = None
    return grads


def expand_midpoints(stops):
    """AI stores a skew ('midpoint') per stop; SVG has no equivalent, so insert
    an explicit 50%-blend stop wherever the midpoint is not 50%."""
    out = []
    for i, (ramp, mid, col) in enumerate(stops):
        out.append((ramp, col))
        if i + 1 < len(stops) and abs(mid - 50.0) > 1.0:
            nramp, _, ncol = stops[i + 1]
            pos = ramp + (mid / 100.0) * (nramp - ramp)
            blend = "#" + "".join(
                "%02x" % ((int(col[1 + 2 * k:3 + 2 * k], 16)
                           + int(ncol[1 + 2 * k:3 + 2 * k], 16)) // 2)
                for k in range(3))
            out.append((pos, blend))
    return out


def rgb_hex(r, g, b):
    clamp = lambda v: max(0, min(255, int(round(v * 255))))
    return "#%02x%02x%02x" % (clamp(r), clamp(g), clamp(b))


# -------------------------------------------------------------------- convert

BLEND = {0: None, 1: "multiply", 2: "screen", 3: "overlay", 4: "darken",
         5: "lighten", 6: "color-dodge", 7: "color-burn", 8: "hard-light",
         9: "soft-light", 10: "difference", 11: "exclusion"}


class Converter:
    def __init__(self, text):
        self.text = text
        self.gradients = parse_gradients(text)
        self.out = []
        self.defs = []
        self.grad_id = 0
        # path state
        self.subpaths = []      # list of 'd' strings for the current object
        self.cur = []           # tokens of the subpath being built
        self.pos = (0.0, 0.0)
        self.start = (0.0, 0.0)
        self.fill = "#000000"
        self.blend = None
        self.compound = False
        self.comp_paths = []
        # gradient-fill state
        self.in_grad = False
        self.grad_name = None
        self.grad_geom = None
        self.grad_xm = None
        self.depth = 0

    # ---- coordinate flip (AI is y-up, SVG is y-down); origin from BoundingBox
    def setup_frame(self):
        m = re.search(r"%%HiResBoundingBox:\s*([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)", self.text)
        if not m:
            m = re.search(r"%%BoundingBox:\s*([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)", self.text)
        self.x0, self.y0, x1, y1 = (float(v) for v in m.groups())
        self.w, self.h = x1 - self.x0, y1 - self.y0

    def pt(self, x, y):
        """AI point -> SVG point: shift to origin and flip the y axis."""
        return (round(x - self.x0, 3), round((self.y0 + self.h) - y, 3))

    # ---- path construction -------------------------------------------------
    def flush_subpath(self):
        if self.cur:
            self.subpaths.append(" ".join(self.cur) + " Z")
            self.cur = []

    def moveto(self, x, y):
        self.flush_subpath()
        p = self.pt(x, y)
        self.cur = ["M %g %g" % p]
        self.pos = (x, y)
        self.start = (x, y)

    def lineto(self, x, y):
        self.cur.append("L %g %g" % self.pt(x, y))
        self.pos = (x, y)

    def curveto(self, x1, y1, x2, y2, x3, y3):
        self.cur.append("C %g %g %g %g %g %g"
                        % (self.pt(x1, y1) + self.pt(x2, y2) + self.pt(x3, y3)))
        self.pos = (x3, y3)

    # ---- painting ----------------------------------------------------------
    def make_gradient(self):
        """Build a <linearGradient> from the Bg geometry + Xm matrix."""
        stops = self.gradients.get(self.grad_name)
        if not stops:
            return None
        x, y, angle, length = self.grad_geom[:4]
        a, b, c, d, tx, ty = self.grad_geom[4:10]
        # gradient axis in gradient space
        p0 = (x, y)
        p1 = (x + length * cos(radians(angle)), y + length * sin(radians(angle)))
        # When Illustrator writes an Xm matrix it already carries the object's
        # transform, and the Bg matrix must NOT be composed with it as well --
        # doing so throws the gradient axis thousands of units off-canvas.
        for mat in ((1, 0, 0, 1, 0, 0) if self.grad_xm else (a, b, c, d, tx, ty),
                    self.grad_xm):
            if not mat:
                continue
            ma, mb, mc, md, mtx, mty = mat
            xf = lambda p: (ma * p[0] + mc * p[1] + mtx, mb * p[0] + md * p[1] + mty)
            p0, p1 = xf(p0), xf(p1)
        self.grad_id += 1
        gid = "g%d" % self.grad_id
        s0, s1 = self.pt(*p0), self.pt(*p1)
        body = "".join(
            '<stop offset="%g%%" stop-color="%s"/>' % (max(0.0, min(100.0, o)), col)
            for o, col in expand_midpoints(stops))
        self.defs.append(
            '<linearGradient id="%s" gradientUnits="userSpaceOnUse" '
            'x1="%g" y1="%g" x2="%g" y2="%g">%s</linearGradient>'
            % (gid, s0[0], s0[1], s1[0], s1[1], body))
        return "url(#%s)" % gid

    def paint(self):
        self.flush_subpath()
        if not self.subpaths:
            return
        d = " ".join(self.subpaths)
        self.subpaths = []
        if self.compound:
            self.comp_paths.append(d)
            return
        self.emit_path(d, evenodd=False)

    def emit_path(self, d, evenodd):
        fill = self.make_gradient() if self.in_grad else self.fill
        if not fill:
            fill = self.fill
        attrs = ['d="%s"' % d, 'fill="%s"' % fill]
        if evenodd:
            attrs.append('fill-rule="evenodd"')
        if self.blend:
            attrs.append('style="mix-blend-mode:%s"' % self.blend)
        self.out.append("  " * self.depth + "<path %s/>" % " ".join(attrs))

    # ---- main loop ---------------------------------------------------------
    def run(self):
        self.setup_frame()
        art = self.text.split("%%EndSetup", 1)[1]
        for line in art.split("\n"):
            line = line.strip()
            if not line or line.startswith("%"):
                continue
            tok = line.split()
            op = tok[-1]
            num = []
            for t in tok[:-1]:
                try:
                    num.append(float(t))
                except ValueError:
                    num = None
                    break

            if op == "m" and num:
                self.moveto(num[0], num[1])
            elif op in ("l", "L") and num:
                self.lineto(num[0], num[1])
            elif op in ("c", "C") and num and len(num) >= 6:
                self.curveto(*num[:6])
            elif op in ("v", "V") and num and len(num) >= 4:
                self.curveto(self.pos[0], self.pos[1], num[0], num[1], num[2], num[3])
            elif op in ("y", "Y") and num and len(num) >= 4:
                self.curveto(num[0], num[1], num[2], num[3], num[2], num[3])
            elif op in ("f", "F", "b", "B"):
                self.paint()
            elif op in ("n", "N"):
                self.flush_subpath()
            elif op == "Xa" and num and len(num) >= 7:
                self.fill = rgb_hex(*num[4:7])
            elif op == "Xk":
                m = re.match(r"^([-\d.eE]+(?:\s+[-\d.eE]+){6})\s", line)
                if m:
                    v = [float(x) for x in m.group(1).split()]
                    self.fill = rgb_hex(*v[4:7])
            elif op == "Xy" and num and len(num) >= 2:
                self.blend = BLEND.get(int(num[0]))
            elif op == "*u":
                self.compound = True
                self.comp_paths = []
            elif op == "*U":
                self.compound = False
                if self.comp_paths:
                    self.emit_path(" ".join(self.comp_paths), evenodd=True)
                self.comp_paths = []
            elif op == "u":
                self.out.append("  " * self.depth + "<g>")
                self.depth += 1
            elif op == "U":
                self.depth = max(0, self.depth - 1)
                self.out.append("  " * self.depth + "</g>")
            elif op == "Bb":
                self.in_grad = True
                self.grad_xm = None
                self.grad_geom = None
            elif op == "Bg":
                m = re.match(r"^\S+\s+\((.*?)\)\s+(.*)\s+Bg$", line)
                if m:
                    self.grad_name = m.group(1)
                    vals = [float(v) for v in m.group(2).split()]
                    if len(vals) >= 10:
                        self.grad_geom = vals[:10]
            elif op == "Xm" and num and len(num) >= 6 and self.in_grad:
                self.grad_xm = num[:6]
            elif op == "BB":
                self.in_grad = False
        while self.depth > 0:
            self.depth -= 1
            self.out.append("  " * self.depth + "</g>")
        return self.svg()

    def svg(self):
        defs = "<defs>\n%s\n</defs>\n" % "\n".join(self.defs) if self.defs else ""
        return ('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<svg xmlns="http://www.w3.org/2000/svg" '
                'width="%g" height="%g" viewBox="0 0 %g %g">\n%s%s\n</svg>\n'
                % (self.w, self.h, self.w, self.h, defs, "\n".join(self.out)))



if __name__ == "__main__":
    text = extract_ai_stream(sys.argv[1])
    open(sys.argv[2], "w").write(Converter(text).run())
    print("wrote", sys.argv[2])
