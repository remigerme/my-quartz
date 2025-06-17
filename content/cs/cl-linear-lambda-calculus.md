---
title: Combinatory logic for linear λ-calculus
date: 2024-12-07
---
The source code is available [on github](https://github.com/remigerme/lambda-cl).

> [!info] Combinators
> - $\mathbf{I}X \rhd X$
> - $\mathbf{B}XYZ \rhd X(YZ)$
> - $\mathbf{C}XYZ \rhd XZY$

> [!info] Abstractions
> - $[x].x \equiv \mathbf{I}$
> - $[x].UV = \mathbf{C}([x].U)V \quad \text{ if } x \in FV(U), x \notin FV(V)$
> - $[x].UV = \mathbf{B}U([x].V) \quad \text{ if } x \notin FV(U), x \in FV(V)$

> [!important] $\mathbf{I}$-axiom
> - ${\tiny \mathbf{B}(\mathbf{B}\mathbf{I})\mathbf{I} = \mathbf{I}} \quad \textit{i.e.} \quad [x].\mathbf{B}\mathbf{I}x = [x].x$

Why ? 
$$
\begin{align*}
[v].X &= [v].\mathbf{I}U \\ 
&= \mathbf{B}\mathbf{I}([v].U) && \text{def of abstractions} \\
&= ([x].\mathbf{B}\mathbf{I}x)([v].U) && \text{eval th (todo)} \\
&= ([x].x)([v].U) && \textbf{I-axiom} \\
&= [v].U = [v].Y && \text{eval th (todo)}
\end{align*}
$$ 
> [!important] $\mathbf{B}$-axioms
> 1.  ${\tiny \mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{B}(\mathbf{B}\mathbf{C})(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})\mathbf{I})))\mathbf{I}))))\mathbf{I} = \mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}\mathbf{I})))(\mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I})\mathbf{I})} \newline \textit{i.e.} \quad [x, V, Z].\mathbf{C}(\mathbf{C}(\mathbf{B}\mathbf{B}x)V)Z = [x, V, Z].\mathbf{C}x(VZ)$
> 1. ${\tiny \mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{B}(\mathbf{B}\mathbf{C})(\mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{B}\mathbf{I})))\mathbf{I}))))\mathbf{I} = \mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{B}\mathbf{I})))(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}\mathbf{I}))\mathbf{I})} \newline \textit{i.e.} \quad [x, U, Z].\mathbf{C}(\mathbf{B}(\mathbf{B}U)x)Z = [x, U, Z].\mathbf{B}U(\mathbf{C}xZ)$
> 1. ${\tiny \mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{B}\mathbf{I}))\mathbf{I}))))\mathbf{I} = \mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{B}\mathbf{I})))(\mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I}))\mathbf{I})} \newline \textit{i.e.} \quad [x, U, V].\mathbf{B}(\mathbf{B}UV)x = [x, U, V].\mathbf{B}U(\mathbf{B}Vx)$

Why ? 
Here, we have $X = Y$ with $X = \mathbf{B}UVZ$ and $Y = U(VZ)$. We want to show that $[v].X=[v].Y$. Let's detail the first case, where $v \in FV(U)$ and $v \notin FV(V)$ nor $v \notin FV(Z)$.
$$
\begin{align*}
[v].X &= [v].\mathbf{B}UVZ \\
&= \mathbf{C}([v].\mathbf{B}UV)Z && \text{abstraction def (denoted by ad later on)} \\
&= \mathbf{C}(\mathbf{C}([v].\mathbf{B}U)V)Z && \text{ad} \\
&= \mathbf{C}(\mathbf{C}(\mathbf{B}\mathbf{B}([v].U))V)Z && \text{ad} \\
&= ([x, y, t]. \mathbf{C}(\mathbf{C}(\mathbf{B}\mathbf{B}x)y)t)([v].U)VZ && \text{eval th (todo)} \\
&= ([x, y, t].\mathbf{C}x(yt))([v].U)VZ && \mathbf{B} \text{-axiom 1} \\
&= \mathbf{C}([v].U)(VZ) && \text{eval th (todo)} \\
&= [v].U(VZ) = [v].Y && \text{ad}
\end{align*}
$$
Similar reasonings can be made to find the other axioms.

> [!important] $\mathbf{C}$-axioms
> 1. ${\tiny \mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{B}(\mathbf{B}\mathbf{C})(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{C})\mathbf{I})))\mathbf{I}))))\mathbf{I} = \mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{C})(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}\mathbf{I}))\mathbf{I}))))\mathbf{I}} \newline \textit{i.e.} \quad [x, V, Z].\mathbf{C}(\mathbf{C}(\mathbf{B}\mathbf{C}x)V)Z = [x, V, Z].\mathbf{C}(\mathbf{C}xZ)V$
> 2. ${\tiny \mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{B}(\mathbf{B}\mathbf{C})(\mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}\mathbf{I})))\mathbf{I}))))\mathbf{I} = \mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I})\mathbf{I}))))\mathbf{I}} \newline \textit{i.e.} \quad [x, U, Z].\mathbf{C}(\mathbf{B}(\mathbf{C}U)x)Z = [x, U, Z].\mathbf{B}(UZ)x$
> 3. ${\tiny \mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{C}(\mathbf{B}\mathbf{B}(\mathbf{B}\mathbf{C}\mathbf{I}))\mathbf{I}))))\mathbf{I} = \mathbf{C}(\mathbf{B}\mathbf{C}(\mathbf{B}(\mathbf{B}\mathbf{B})(\mathbf{B}(\mathbf{B}\mathbf{C})(\mathbf{B}(\mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I}))\mathbf{I}))))\mathbf{I}} \newline \textit{i.e.} \quad [x, U, V].\mathbf{B}(\mathbf{C}UV)x = [x, U, V].C(\mathbf{B}Ux)V$

Similar reasonings to the one above.

> [!important] $\eta$-axiom
> - $\mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I})\mathbf{I} = \mathbf{I} \quad \textit{i.e.} \quad [u, x].ux=\mathbf{I}$

Justification :
- $\eta$-rule : for all terms $U$, $[x].Ux=U$
- as specified above, the rule is an axiom-scheme representing an infinite number of axioms
- let's close it, our closed $\eta$-rule is $[u, x].ux=[u].u$
- $[u].u=\mathbf{I}$
- $[u, x].ux = [u].\mathbf{B}u\mathbf{I} = \mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I})\mathbf{I}$


> [!example] Example : deriving $\mathbf{B}\mathbf{I}=\mathbf{I}$ from $(\mathbf{I}+\eta)$-axioms
> $$
> \begin{align*}
> \mathbf{C}(\mathbf{B}\mathbf{B}\mathbf{I})\mathbf{I}(\mathbf{B}\mathbf{I}) &= \mathbf{I}(\mathbf{B}\mathbf{I}) && \text{using } \eta\text{-axiom} \\
> &= \mathbf{B}\mathbf{I} && \text{on one hand} \\
> &= \mathbf{B}\mathbf{B}\mathbf{I}(\mathbf{B}\mathbf{I})\mathbf{I} && \text{on the other hand, applying } \mathbf{C} \\
> &= \mathbf{B} (\mathbf{I}(\mathbf{B}\mathbf{I}))\mathbf{I} && \text{applying } \mathbf{B} \\
> &= \mathbf{B}(\mathbf{B}\mathbf{I})\mathbf{I} && \text{applying } \mathbf{I} \\
> &= \mathbf{I} && \text{using } \mathbf{I}\text{-axiom} \\
> \text{Thus } \mathbf{B}\mathbf{I} &= \mathbf{I}  
> \end{align*}
> $$

