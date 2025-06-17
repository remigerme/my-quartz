---
title: λ-calculus cheatsheet
date: 2024-10-08
---
# λ-calculus
## Definition
$\lambda$-terms are
- *variables* or *atomic constants* from given sets
- *applications* : if $M$ and $N$ are $\lambda$-terms, then $(MN)$ is one
- *abstraction*s : if $x$ is a variable and $M$ is a $\lambda$-term, then $(\lambda x.M)$ is one
By convention, the association to the left is used : $MNPQ=((MN)P)Q$.
## Reduction
- $\beta$-reduction :
	- $(\lambda x.M)N \rhd_\beta [N/x]M$
- $\eta$-reduction :
	- $\lambda x.Mx \rhd_\eta M \text{ if } x \notin FV(M)$
## Extensional equality
- $(\zeta) \quad \frac{Mx = Nx}{M = N} \text{ if } x \notin FV(MN)$
- $(\eta) \quad \lambda x.Mx = M \text{ if } x \notin FV(M)$

Theories $\lambda\beta\zeta$ and $\lambda \beta \eta$ determine the same equality relation.
# Combinatory logic
## Definition
$[x]^w.Y$ is defined thus :
- $[x]^w.Y \equiv KY$ if $x \notin FV(Y)$
- $[x]^w.x \equiv I$
- $[x]^w.UV \equiv S([x]^w.U)([x]^w.V)$ if $x \in FV(UV)$

Warning : do not include $\eta$-reduction inside abstraction definition. 
## Reduction
- $weak$-reduction :
	- $\mathbf{I}X \rhd_{1w} X$
	- $\mathbf{K}XY \rhd_{1w} X$
	- $\mathbf{S}XYZ \rhd_{1w} XZ(YZ)$
- theorem on abstractions :
	- $([x].M)N \rhd_w [N/x]M$
## Extensional equality
- $(\zeta) \quad \frac{Xx = Yx}{X = Y} \text{ if } x \notin FV(XY)$
- $(\xi) \quad \frac{X = Y}{[x].X = [x].Y }$ 
- $(\eta) \quad [x].Ux = U \text{ if } x \notin FV(U)$

Theories $\text{CL}\zeta$ and $\text{CL}(\xi+\eta)$ determine the same equality relation. But they're not easy to work with. So instead, let's use five axioms only and denote the obtained theory by $\text{CL}ext_{ax}$ :
- $\text{E-ax } 1$ and $\text{E-ax }2$ are used to prove the lemma : $\text{CL}ext_{ax}$

# Equivalence of extensional equalities
```mehrmaid
graph TD
A --> B
B --> D
A --> I
I --> EqH
I --> lambdatocl
lambdatocl --> zetaxieta
lambdatocl --> ltcalpha
lambdatocl --> ltcbeta
lambdatocl --> ltcxi
lambdatocl --> ltceta
ltcbeta --> n913d
A("$X=_{C_{ext}}Y \iff X_{\lambda} =_{\lambda_{ext}} Y_\lambda$")
B("$\implies$<br>by 9.5c")
D("depends on
- 9.5a : ok
- 9.5b : ok
- and induction on $\text{CL}\zeta$ which is still ok")
I("$\impliedby$")
EqH("9.11 : previously $(X_\lambda)_H \equiv X$<br>but $(X_\lambda)_H =_{C_{ext}} X$ is enough
Proof by induction on X : 
- $X \equiv x$ : ok
- $X \equiv YZ$ : ok
- $X \equiv \mathbf{I}$ : ok
	- $\mathbf{I}_{\lambda H} \equiv (\lambda x. x)_H \equiv [x]^w.x \equiv \mathbf{I}$
- $X \equiv \mathbf{K}$ : ?
	- $\mathbf{K}_{\lambda H} \equiv \mathbf{S}(\mathbf{K}\mathbf{K})\mathbf{I}$
- $X \equiv \mathbf{S}$ : ?
	- $\mathbf{S}_{\lambda H} \equiv$ see below")
lambdatocl("9.14 : $\lambda \beta \zeta \vdash M = N \implies \text{CL}\zeta \vdash M_H = N_H$ <br>And in fact $\text{CL}\zeta \iff \text{CL}(\xi+\eta)$ so
- $(\rho), (\mu), (\nu), (\tau), (\sigma)$ : ok")
zetaxieta("Proof of $\text{CL}\zeta \iff \text{CL}(\xi+\eta)$ <br>
By 8.8 (adding $(\eta)$)")
ltcbeta("Proof of $(\beta)$ : $((\lambda x.M)N)_H = ([N/x]M)_H$ <br>
$((\lambda x.M)N)_H \equiv (\lambda x.M)_HN_H$ by def <br>
$\equiv ([x]^w.M_H)N_H$ by def <br>
$\rhd_w [N_H/x]M_H$ by 2.21 (valid) <br>
$\equiv ([N/x]M)_H$ by 9.13d")
ltcalpha("Proof of $(\alpha)$ <br>
Use 9.13c : still valid")
ltcxi("Proof of $(\xi)$ <br>
Make sure 8.8 and reasoning is legit")
ltceta("Proof of $(\eta)$ <br>
This proof is not valid anymore, same strategy as for $(\xi)$")
n913d("Checking 9.13d
- 9.13abc : ok
- 2.28b : ok
- 9.10c : by def
- 2.28c : ok")
```
So excluding rule $(\eta)$ from the definition of abstractions (2.18c) only adds two results which can be satisfied with the extensionality axioms (check later) :
- $\mathbf{S}(\mathbf{K}\mathbf{K})\mathbf{I} =_{C_{ext}} \mathbf{K}$
- ${\tiny \mathbf{S}\Biggl(\mathbf{S}\biggl(\mathbf{K}\mathbf{S}\Bigl)\biggl(\mathbf{S}\Bigl(\mathbf{K}\mathbf{K}\bigl)\Bigl(\mathbf{S}\bigl(\mathbf{K}\mathbf{S}\bigl)\bigl(\mathbf{S}\bigl(\mathbf{S}\bigl(\mathbf{K}\mathbf{S}\bigl)\bigl(\mathbf{S}\bigl(\mathbf{K}\mathbf{K}\bigl)\mathbf{I}\bigl)\bigl)\bigl(\mathbf{K}\mathbf{I}\bigl)\bigl)\bigl)\Bigl)\biggl)\Biggl(\mathbf{K}\biggl(\mathbf{S}\Bigl(\mathbf{S}\bigl(\mathbf{K}\mathbf{S}\bigl)\bigl(\mathbf{S}\bigl(\mathbf{K}\mathbf{K}\bigl)\mathbf{I}\bigl)\bigl)\Bigl(\mathbf{K}\mathbf{I}\bigl)\Bigl)\biggl)}=_{C_{ext}} \mathbf{S}$
# Equivalence between theories
Goal : $\text{CL}\zeta \iff \text{CL}_{ext}$. As $\text{CL}\zeta \iff \text{CL}(\xi + \eta)$, let's prove $\text{CL}(\xi+\eta) \iff \text{CL}_{ext}$. Here $\iff$ is used in the meaning of theorem-equivalent.  
# References
- J. Roger Hindley and Jonathan P. Seldin. 2008. Lambda-Calculus and Combinators: An Introduction (2nd. ed.). Cambridge University Press, USA, https://www.cin.ufpe.br/~djo/files/Lambda-Calculus%20and%20Combinators.pdf, accessed on 8th October 2024
