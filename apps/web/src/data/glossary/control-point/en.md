---
term: control point
related: [bezier-curve]
---

One of the handles that defines a Bezier curve. The curve starts at the first control point, ends at the last, and bends toward the inner ones without touching them. Move a control point and only the part of the curve nearest it changes — that _local control_ is the property a designer relies on. The polygon connecting consecutive control points is called the control polygon; it bounds the curve (Bezier curves lie inside the convex hull of their controls) but is never the curve itself.
