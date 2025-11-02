---
title: A constant time weather forecast algorithm for Berkeley
date: 2025-09-05
---

I was staying in Berkeley, California, for the summer. Legend says I've worked on combinational equivalence checking for hardware designs, but here's my real contribution to real science: this magnificent constant time algorithm to forecast weather in Berkeley.

# Algorithm

The algorithm is rather straightforward, so it shouldn't be too difficult to establish the constant time complexity.

![[algo-berkeley.png]]

# Evaluation

I've stayed 150 days there, mostly in the bay (sometimes in [[montagne/berkeley-2025/index|Yosemite or other cool places]]).

It rained only one day[^1]: April 26. So, this gives:

- a precision of $149/150 tilde.eq 99%$
- a recall of $149/149 eq 100%$

Woah! Impressive stats, uh?

_DO NOT investigate these metrics for rainy days._

# Future work

Some extensions to this work were considered, mainly:

- include temperature forecasts in the algorithm (tricky, varies between chill and warm)
- include more precise forecasts (tricky, varies between sunny and foggy)
- extend the approach to San Francisco (preliminary results indicated a foggy weather)

[^1]: Okay, it was sometimes super foggy and quite unclear if it should be considered "rainy".
