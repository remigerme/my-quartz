---
title: Cheating test suites and multivariate interpolating polynomial
date: 2025-06-24
---

This post was written as a follow-up on [Hillel Wayne's newsletter: You can cheat a test suite with a big enough polynomial](https://buttondown.com/hillelwayne/archive/you-can-cheat-a-test-suite-with-a-big-enough/) \[1] which you should definitely check first.

Indeed, his post refers to a well-known mathematical problem: [interpolation](https://en.wikipedia.org/wiki/Interpolation). More specifically, he is interpolating using polynomials. It turns out there is a great tool for polynomial interpolation: [Lagrange polynomial](https://en.wikipedia.org/wiki/Lagrange_polynomial).

# Lagrange interpolation

Given inputs $x_1, ..., x_n in RR$ and outputs $y_1, ..., y_n in RR$, we want to build a polynomial $P$ such that $forall i in {1..n}, P(x_i)=y_i$.

The Lagrange interpolating polynomial is built as follows:

$$
P(x) &= sum_(i=1)^n y_i delta_i(x) && "with" delta_i(x) = cases(0 & "if" x = x_j, 1 & "if" x = x_i)
$$

This way, it is clear that the property stands:

$$
P(x_i) &= sum_(j=1)^n y_j delta_j(x_i) = y_i underbrace(delta_i(x_i), 1) + sum_(j != i)y_j underbrace(delta_j(x_i), 0) \
&= y_i
$$

_Okay, but how do we define $delta_i(\cdot)$ as a polynomial?_  
Hopefully, we know the roots of this polynomial. And we also have some information on how to normalize it ($delta_i(x_i)=1$). The following meets these two requirements[^1]:

$$
delta_i(x) = product_(j != i)(x - x_j)/(x_i - x_j)
$$

Thus, we can entirely compute our Lagrange interpolating polynomial! But, wait... Hillel's newsletter was considering functions of multiple variables.

# Higher dimensions

### Using straightforward Lagrange interpolation

Given input vectors $x_1, ..., x_n in RR^d$ and output scalars[^2] $y_1, ..., y_n in RR$, we want to build a polynomial $P$ such that $forall i in {1..n}, P(x_i)=y_i$. Beware, $x$s are now vectors, so $P$ is a multivariate polynomial now. Using the idea of Lagrange interpolation, we can come up with:

$$
P(x) &= sum_(i=1)^n y_i delta_i(x) && "with" delta_i(x) = cases(0 & "if" x = x_j, 1 & "if" x = x_i) \
&= sum_(i=1)^n y_i product_(j != i) (||x - x_j||)/(||x_i - x_j||) && "where" || dot || "denotes a norm for vectors"
$$

_Simple, right? ...right?_
The thing is we no longer have a polynomial. Alright, let's apply a quick fix:

$$
P(x) &= sum_(i=1)^n y_i product_(j != i) (||x-x_j||^2)/(||x_i - x_j||^2) && "where" || dot || "denotes the euclidean norm" \
&= sum_(i=1)^n y_i product_(j != i) ( 1/(||x_i - x_j||^2) sum_(k = 1)^d (x^((k)) - x_j^((k)))^2)
$$

Ta-daaa! We somehow won, but at what cost? Well, now this is a multivariate polynomial, but we lost an important property along the way: this polynomial is not of minimal degree.

## A more sophisticated Lagrange interpolation

Hopefully, we are not the first ones working on this problem: see the paper by Kamron Saniee \[2] to do some clean work, which I won't do today.

# Experimental results

Now, time to code and compute some polynomials!

You can check the [source code here](https://gist.github.com/remigerme/9544553d40c2cb2e6ff7d417a64db303). The code itself is ugly as hell, but it does work (and will be forgotten forever after this hopefully).

I used the same set of inputs as in Hillel's post:

```python
inputs = [(1, 2, 3), (4, 2, 2), (1, 1, 1), (3, 5, 4)]
outputs = [max(g) for g in inputs]

p = lagrange(inputs, outputs)

print(p.eval(inputs[0]))
# Should be 3, outputs 2.9999999999999254

print(p.eval(inputs[1]))
# Should be 4, outputs 3.9999999999998908

print(p.eval(inputs[2]))
# Should be 1, outputs 0.9999999999999887

print(p.eval(inputs[3]))
# Should be 5, outputs 4.999999999999659

print(p)
# This one I'm not writing here
```

Yeay! Apart from floating point errors, we're good! So, we found a polynomial which appears to be equivalent to the `max` function if looking only at this 4-test-long test suite.

What is this polynomial, you may ask?

> [!note]- The polynomial (click to unfold)
>
> $$
>
> &P(x, y, z) = \
> &0.008389738340477258x^6 &&- 0.11513274902437466x^5 &&+ 1.0730228392297358x^4 \
> &+ 0.02516921502143177x^4y^2 &&- 0.1302117586846651x^4y &&+ 0.02516921502143177x^4z^2 \
> &- 0.12339965453265947x^4z &&- 5.371275030388332x^3 &&- 0.23026549804874932x^3y^2 \
> &+ 1.0990083807817799x^3y &&- 0.23026549804874932x^3z^2 &&+ 1.0566822340221358x^3z \
> &+ 17.965412321668477x^2 &&+ 2.224676604183994x^2y^2 &&- 6.773748320644872x^2y \
> &+ 2.2095988740323715x^2z^2 &&- 6.79466572836031x^2z &&+ 0.02516921502143177x^2y^4 \
> &- 0.26042351736933017x^2y^3 &&+ 0.05033843004286354x^2y^2z^2 &&- 0.24679930906531894x^2y^2z \
> &- 0.26042351736933017x^2y z^2 &&+ 1.1105981703026038x^2y z &&+ 0.02516921502143177x^2z^4 \
> &- 0.24679930906531894x^2z^3 &&- 29.6431245601689x &&- 6.889314823107927x y^2 \
> &+ 16.31967244578082x y &&- 6.869129294350971x z^2 &&+ 16.74706928539441x z \
> &- 0.11513274902437466x y^4 &&+ 1.0990083807817799x y^3 &&- 0.23026549804874932x y^2z^2 \
> &+ 1.0566822340221358x y^2z &&+ 1.0990083807817799x y z^2 &&- 4.180942997888811x y z \
> &- 0.11513274902437466x z^4 &&+ 1.0566822340221358x z^3 &&+ 32.30273175100761 \
> &+ 18.336720619282197y^2 &&- 30.092303755357946y &&+ 18.66529844539697z^2 \
> &- 31.246256797389808z &&+ 1.1516537649542578y^4 &&- 5.509788241315336y^3 \
> &+ 2.288229799756893y^2z^2 &&- 6.954174397031541y^2z &&- 6.913071460559145y z^2 \
> &+ 16.67558057705841y z &&+ 1.136576034802636z^4 &&- 5.565139786322052z^3 \
> &+ 0.008389738340477258y^6 &&- 0.1302117586846651y^5 &&+ 0.02516921502143177y^4z^2 \
> &- 0.12339965453265947y^4z &&- 0.26042351736933017y^3z^2 &&+ 1.1105981703026038y^3z \
> &+ 0.02516921502143177y^2z^4 &&- 0.24679930906531894y^2z^3 &&- 0.1302117586846651y z^4 \
> &+ 1.1105981703026038y z^3 &&+ 0.008389738340477258z^6 &&- 0.12339965453265947z^5
>
> $$

We are pretty far from minimal degree here. But this just adds more chaos to the gag I guess.

# References

- \[1] newsletter by Hillel Wayne: [You can cheat a test suite with a big enough polynomial](https://buttondown.com/hillelwayne/archive/you-can-cheat-a-test-suite-with-a-big-enough/)
- \[2] Saniee, Kamron. (2008). A Simple Expression for Multivariate Lagrange Interpolation. SIAM Undergraduate Research Online. 1. 10.1137/08S010025.

[^1]: Of course, when doing Lagrange interpolation, the $x_i$s are supposed to be unique.

[^2]: Here we consider some scalars, but it also could be some vectors without any loss of generality.
