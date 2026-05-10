---
term: basis
related: [vector, dct]
---

A set of _coordinate directions_ against which any vector in a space can be written as a unique combination of scalars. The same vector has different coordinates in different bases — the _thing_ doesn't change, only the _labels_ you give it. The standard pixel basis for an 8×8 image: 64 directions, one per pixel position. The DCT basis for the same block: 64 different directions, each a 2D cosine pattern at a particular spatial frequency. Both bases describe the same 64-dimensional space; choosing one over the other is a _change of perspective_, not a change of information. JPEG's whole trick is that _natural images have a sparser representation in the DCT basis than in the pixel basis_ — most of the energy concentrates in a few coefficients, which is what makes throwing the rest away survivable.
