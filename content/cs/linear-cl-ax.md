---
title: Extensionality axioms for linear combinatory logic
date: 2024-12-07
---

> [!info] Disclaimer
> Unfortunately, this post is not self-contained. The reader is assumed to know about combinatory logic. If this is not the case, it is possible to refer to Lambda-Calculus and Combinators: An Introduction, by J. Roger Hindley and Jonathan P. Seldin.

The source code and the full report are available [on github](https://github.com/remigerme/lambda-cl).

## Linear Combinatory Logic

> [!info] Linear combinators
>
> - $bold(I) X triangle.stroked.r X$
> - $bold(B) X Y Z triangle.stroked.r X(Y Z)$
> - $bold(C) X Y Z triangle.stroked.r X Z Y$

> [!info] Abstractions
>
> - $[x].x equiv bold(I) $
> - $[x].U V = bold(C) ([x].U)V quad "if" x in "FV"(U), x in.not "FV"(V)$
> - $[x].U V = bold(B) U([x].V) quad "if" x in.not "FV"(U), x in "FV"(V)$

## Deriving extensionality axioms

> [!info] $bold(I)$-axiom
>
> - $script( bold(B) (bold(B) bold(I) )bold(I)  = bold(I) ) quad \ italic(i.e.) quad [x].bold(B) bold(I) x = [x].x$

How is the axiom derived?

We consider $X = bold(I) U$, and $Y = U$. Clearly, $X = Y$ extensionally. We want our extensional equality to satisfy rule $(xi)$, that is, if $X = Y$ then $[v].X = [v].Y$. Let's write it down and see what needs to be true: that is the axiom we need to add to our theory.

$$
[v].X &= [v].bold(I) U \
&= bold(B) bold(I) ([v].U) && "def of abstractions" \
&= ([x].bold(B) bold(I) x)([v].U) && "eval th" \
&= ([x].x)([v].U) && bold(I)"-axiom" \
&= [v].U = [v].Y && "eval th"
$$

> [!info] $bold(B)$-axioms
>
> 1.  $script(bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(B) (bold(B) bold(C) )(bold(C) (bold(B) bold(B) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )bold(I) )))bold(I) ))))bold(I)  = bold(C) (bold(B) bold(B) (bold(B) bold(B) (bold(B) bold(C) bold(I) )))(bold(C) (bold(B) bold(B) bold(I) )bold(I) )) quad \ italic(i.e.) quad [x, V, Z].bold(C) (bold(C) (bold(B) bold(B) x)V)Z = [x, V, Z].bold(C) x(V Z)$
> 2.  $script(bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(B) (bold(B) bold(C) )(bold(B) (bold(C) (bold(B) bold(B) (bold(B) bold(B) bold(I) )))bold(I) ))))bold(I)  = bold(B) (bold(C) (bold(B) bold(B) (bold(B) bold(B) bold(I) )))(bold(C) (bold(B) bold(B) (bold(B) bold(C) bold(I) ))bold(I) )) quad \ italic(i.e.) quad [x, U, Z].bold(C) (bold(B) (bold(B) U)x)Z = [x, U, Z].bold(B) U(bold(C) x Z)$
> 3.  $script(bold(B) (bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(C) (bold(B) bold(B) (bold(B) bold(B) bold(I) ))bold(I) ))))bold(I)  = bold(B) (bold(C) (bold(B) bold(B) (bold(B) bold(B) bold(I) )))(bold(B) (bold(C) (bold(B) bold(B) bold(I) ))bold(I) )) quad \ italic(i.e.) quad [x, U, V].bold(B) (bold(B) U V)x = [x, U, V].bold(B) U(bold(B) V x)$

Why ?
Here, we have $X = Y$ with $X = bold(B) U V Z$ and $Y = U(V Z)$. We want to show that $[v].X=[v].Y$. Let's detail the first case, where $v in "FV"(U)$ and $v in.not "FV"(V)$ nor $v in.not "FV"(Z)$.

$$
[v].X &= [v].bold(B) U V Z \
&= bold(C) ([v].bold(B) U V)Z && "abstraction def (denoted by ad later on)" \
&= bold(C) (bold(C) ([v].bold(B) U)V)Z && "ad" \
&= bold(C) (bold(C) (bold(B) bold(B) ([v].U))V)Z && "ad" \
&= ([x, y, t]. bold(C) (bold(C) (bold(B) bold(B) x)y)t)([v].U)V Z && "eval th" \
&= ([x, y, t].bold(C) x(y t))([v].U)V Z && bold(B)"-axiom 1" \
&= bold(C) ([v].U)(V Z) && "eval th" \
&= [v].U(V Z) = [v].Y && "ad"
$$

Similar reasonings can be made to find the other axioms.

> [!info] $bold(C) $-axioms
>
> 1. $script( bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(B) (bold(B) bold(C) )(bold(C) (bold(B) bold(B) (bold(B) bold(C) (bold(B) (bold(B) bold(C) )bold(I) )))bold(I) ))))bold(I)  = bold(C) (bold(B) bold(B) (bold(B) bold(C) (bold(B) (bold(B) bold(C) )(bold(C) (bold(B) bold(B) (bold(B) bold(C) bold(I) ))bold(I) ))))bold(I) ) quad \ italic(i.e.) quad [x, V, Z].bold(C) (bold(C) (bold(B) bold(C) x)V)Z = [x, V, Z].bold(C) (bold(C) x Z)V$
> 2. $script( bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(B) (bold(B) bold(C) )(bold(B) (bold(C) (bold(B) bold(B) (bold(B) bold(C) bold(I) )))bold(I) ))))bold(I)  = bold(B) (bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(C) (bold(B) bold(B) bold(I) )bold(I) ))))bold(I) ) quad \ italic(i.e.) quad [x, U, Z].bold(C) (bold(B) (bold(C) U)x)Z = [x, U, Z].bold(B) (U Z)x$
> 3. $script( bold(B) (bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(C) (bold(B) bold(B) (bold(B) bold(C) bold(I) ))bold(I) ))))bold(I)  = bold(C) (bold(B) bold(C) (bold(B) (bold(B) bold(B) )(bold(B) (bold(B) bold(C) )(bold(B) (bold(C) (bold(B) bold(B) bold(I) ))bold(I) ))))bold(I) ) quad \ italic(i.e.) quad [x, U, V].bold(B) (bold(C) U V)x = [x, U, V].C(bold(B) U x)V$

Similar reasonings to the one above.

> [!info] $eta$-axiom
>
> - $bold(C) (bold(B) bold(B) bold(I) )bold(I) = bold(I) quad \ italic(i.e.) quad [u, x].u x=bold(I) $

Justification :

- $eta$-rule : for all terms $U$, $[x].U x=U$
- as specified above, the rule is an axiom-scheme representing an infinite number of axioms
- let's close it, our closed $eta$-rule is $[u, x].u x=[u].u$
- $[u].u=bold(I) $
- $[u, x].u x = [u].bold(B) u bold(I) = bold(C) (bold(B) bold(B) bold(I) )bold(I) $

> [!example] Example : deriving $bold(B) bold(I) =bold(I) $ from $(bold(I) +eta)$-axioms
>
> $$
> bold(C) (bold(B) bold(B) bold(I) )bold(I) (bold(B) bold(I) ) &= bold(I) (bold(B) bold(I) ) && "using" eta"-axiom" \
> &= bold(B) bold(I)  && "on one hand" \
> &= bold(B) bold(B) bold(I) (bold(B) bold(I) )bold(I)  && "on the other hand, applying" bold(C)  \
> &= bold(B)  (bold(I) (bold(B) bold(I) ))bold(I)  && "applying" bold(B)  \
> &= bold(B) (bold(B) bold(I) )bold(I)  && "applying" bold(I)  \
> &= bold(I)  && "using" bold(I)"-axiom" \
> "Thus" bold(B) bold(I)  &= bold(I)
> $$
