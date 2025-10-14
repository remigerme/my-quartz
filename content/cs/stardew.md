---
title: Stardew Valley & the coupon collector problem
date: 2025-08-08
description: Exploring the coupon collector problem using Stardew Valley as an example.
---

Imagine a game where you open loot boxes in order to complete a collection of cosmetics.[^1] That shouldn't be too hard to imagine these days.

**How many loot boxes do you need to open to get the whole collection?**

Today, we answer this question by doing a bit of math while using Stardew Valley as a concrete yet non-trivial example. Stardew Valley is a wonderful game available on all platforms I can think of. You basically play a farmer and you have a _ton_ of things to do (sounds boring, uh? it's not, I swear).

![[stardew.jpg]]

> [!info] Credits
> All Stardew Valley assets below are copyright [ConcernedApe](https://stardewvalleywiki.com/ConcernedApe) 2016. The picture above is from the steam page, the others were retrieved from the wiki - which was used extensively during the writing (and my game sessions).

This post ambitiously aims to be understandable to people without a math background or those who haven't played Stardew Valley (yet - you definitely should!).

# The coupon collector problem

Now, the difficult part. Feel free to skip and look at the [[stardew#Collecting minerals|results]] in the next section.

Time to properly introduce the coupon collector problem.

**The coupon collector problem.**  
Let $n$ denote the number of items to collect. Each item has an equal probability of $1/n$ of being looted from a loot box. How many loot boxes do we need to open on average to complete the whole collection? This notion of average is called expectation and will be denoted by $EE$.

**Interlude: geometric distribution.**  
Before solving the coupon collector problem, we need to gain a better understanding of _waiting times_ and _geometric distributions_.

Let's consider a random variable $X$ which is the result of a die roll. We consider our die is fair, and has thus a uniform probability of $p=1/6$ of landing on any face. Formally, this is expressed as follows:

$$
p &= PP(X = 1) && "which denotes the probability of rolling a" & 1 \
&= PP(X = 2) && ... & 2 \
&= PP(X = 3) && ... & 3 \
&= PP(X = 4) && ... & 4 \
&= PP(X = 5) && ... & 5 \
&= PP(X = 6) && ... & 6 \
&= 1/6
$$

Now, let's consider another random variable $Y$ which denotes the number of die rolls we need to do before obtaining a 1 for the first time. $PP(Y = k)$ means "the probability of obtaining a 1 for the first time on the k-th die roll", which means the first k-1 die rolls were not 1 and the k-th is a 1. In the equations below, $X_i$ is the random variable representing the result of the i-th die roll.

$$
PP(Y = k) &= PP(X_1 != 1 "and" X_2 != 1 "and" ... "and" X_(k-1) != 1 "and" X_k = 1) \
&= PP(X_1 != 1) times PP(X_2 != 1) times ... times PP(X_(k-1) != 1) times PP(X_k = 1) && "by independence" \
&= (1-p) times (1-p) times ... times (1-p) times p \
&= p(1-p)^(k-1)
$$

We say that $Y$ is the waiting time for a 1 to occur. Such random variables describing waiting times are following a _geometric distribution of parameter $p$_, which we note $Y ~ cal(G)(p)$ where $p$ is the probability of the event we're waiting for to occur at each trial.

> **Lemma**  
> If $X ~ cal(G)(p)$, then $EE(X)=1/p$.

See the proof of the lemma in the [[stardew#Expectation of a geometric distribution|appendix]].

What does this mysterious-looking lemma say really? Something very natural. $EE(X)$ denotes the _expectation of $X$_, which is the average value of $X$ you'd expect from doing many experiments.

In the case of the die roll, how many rolls do you think you need on average to get a 1?  
Well, the lemma says that in the above situation, with $p=1/6$ and $Y$ denoting the waiting time for a 1, $EE(Y) = 1/(1/6)=6$. On average, you would need six rolls to get a 1.

**The classic solution.**  
Now that we are experts in geometric distributions, we can solve the coupon collector problem. Feel free to skip the proof to look at the [[stardew#Collecting minerals|results]].

Let's look at items one by one. First, how many loot boxes does it take to find our first item? Well, only one: we are sure to find a new item using our very first loot box. So, using $X_1$ to denote the waiting time before our first item, we have to wait only 1 box opening in average: $EE(X_1) = 1$.

Okay, our second item now. We have a probability $p_"failure" = 1/n$ of re-obtaining our first item again, and a probability $p_"success" = 1 - 1/n = (n-1)/n$ of finding a new item. The waiting time $X_2$ for the second item follows a geometric distribution of parameter $p_"success"$, so $EE(X_2) = n/(n-1)$.

One last time. We now have a probability $p_"failure" = 2/n$ of re-obtaining one of our first two items again, and a probability $p_"success" = 1 - 2/n = (n-2)/n$ of finding a new item. Thus, $EE(X_3) = n/(n-2)$.

I think you can see a pattern emerging there.

Let $T$ denote the total waiting time for obtaining the whole collection. Formally we have: $T = X_1 + X_2 + ... + X_n$. First, we need to wait for the first item. Then the second. And so on, until waiting for the final n-th item. From this, we make the computation below.

$$
EE(T) &= EE(X_1) + EE(X_2) + ... + EE(X_n) \
&= 1 + n/(n-1) + n/(n-2) + ... + n/(n-(n-1)) \
&= n/n + n/(n-1) + ... + n/1 \
&= n(1/n + 1/(n-1) + ... + 1/1) \
&= n(1 + 1/2 + ... + 1/n)
$$

Hm, this $1 + 1/2 + ... + 1/n$ term is quite annoying. Oh, but this is the famous [harmonic series](<https://en.wikipedia.org/wiki/Harmonic_series_(mathematics)>)! It is well known that $1 + 1/2 + ... + 1/n tilde.eq ln n + gamma$ with $gamma tilde.eq 0.577$ the Euler constant. Thus, we get the following result.

> [!info] Theorem
> For a coupon collector problem with $n$ items, if $T$ denotes the waiting time before completing the whole collection, we have $EE(T) tilde.eq n(ln n + gamma)$.

I ran some simulations of coupon collector problems (you can check the [source code](https://gist.github.com/remigerme/bd12e4a3a75ebf34cadfdd87815813db)), the graph below illustrates the experimental results (note that the blue curve is $n(ln n + gamma)$ as the default `log` is our beloved $ln$). As you can see, we computed an excellent estimate.

![[coupon.png]]

**Adapting the solution to Stardew.**  
We consider a slightly different situation (yet completely equivalent). Each item has a uniform probability $p_"item"$, and we have $n_"items"$ items. Instead of having $p = 1, (n-1)/n, (n-2)/n, ..., 1/n$, we now have $p = p_"item" n_"items", p_"item" (n_"items"-1), p_"item" (n_"items"-2), ...,  p_"item"$.

$$
"Previously:" &sum_(i=1)^k n/i tilde.eq n (ln k + gamma) \
"Now:" & sum_(i=1)^(n_"items") 1/(p_"item" i) tilde.eq 1/(p_"item")(ln n_"items" + gamma) quad (diamond)
$$

We are going to make extensive use of $(diamond)$ in the next section. Now that we have studied this classic problem, let's get back to Stardew!

# Collecting minerals

Minerals? Yes, minerals. Not only do you play a farmer in Stardew, but you also venture into mines and collect some minerals, in order to complete the town's museum collection.

Hm, let me check [the wiki](https://stardewvalleywiki.com/Minerals)... So we have 53 minerals to find to complete the museum collection.

They are distributed as follows:

- 4 foraged minerals
- 8 gems
- 41 geode minerals, which are obtained by opening geodes.

I'm going to ignore foraged minerals and gems as they are naturally collected early in the game (and also, they are not a coupon collector problem).

But those 41 geode minerals... they are definitely a coupon collector problem! Oh wait, we can loot them from 4 different geode types. Each mineral can be found using two kinds of geodes: omni geodes and one of the regular, frozen, or magma geodes.

|           Geode type           |     geode      |     frozen geode      |     magma geode      |     omni geode      |
| :----------------------------: | :------------: | :-------------------: | :------------------: | :-----------------: |
|                                | ![[geode.png]] | ![[frozen_geode.png]] | ![[magma_geode.png]] | ![[omni_geode.png]] |
|  **# of obtainable minerals**  |       15       |          14           |          12          |         41          |
| **P(finding a given mineral)** |     $1/32$     |        $1/30$         |        $1/26$        |      $31/2750$      |

The 3 specific geodes (geode, frozen geode, and magma geode) are independent of each other. What I mean by independent is that minerals that can be found in a regular geode cannot be found in a frozen geode or a magma geode (and so on). Each geode type has its own exclusive set of minerals. Which is why $15 + 14 + 12 = 41$.

But.  
All 41 minerals are obtainable using an omni geode. Which breaks the overall independence. If the problem was fully independent, we would just be in a situation with 4 independent coupon collector problems... However, the harsh reality is different.

Is there a better strategy? Like opening a certain ratio of specific geodes and omni geodes? Let's consider different approaches.

**First strategy: no omni geode.**  
The situation with the 4 geodes simultaneously is complicated. Let's simplify it by not using any omni geode. In that case, it is simple. We're back to 3 independent coupon collector problems. So we can apply the previous formula three times to compute the expected numbers of geodes to open of each type:

- $N_"G" = 32 (ln (15)+gamma) tilde.eq 105$ geodes
- $N_"FG" = 30 (ln (14) + gamma) tilde.eq 96$ frozen geodes
- $N_"MG" = 26(ln(12) + gamma) tilde.eq 80$ magma geodes
- $N = N_"G" + N_"FG" + N_"MG" tilde.eq 281$ geodes overall

**Second strategy: omni geodes FTW.**  
It's even simpler if we only use omni geodes as it's just one traditional coupon collector problem. The expected number of omni geodes to open is $N = 2750/31(ln(41)+gamma) tilde.eq 381$. Far worse than if we used the different specific geodes.

Are we surprised?  
No.

Intuitively, the more minerals are distributed across different geodes, the better. Imagine for a second that each mineral has a unique associated geode. Then, we would be sure to obtain that specific mineral by opening its specific geode. Thus, we would only need to open 41 different geodes to collect all 41 minerals.

**Mixed strategies.**  
Well, at this point, I'm not even interested in digging deeper into mixed strategies. We already know which strategy is theoretically the best.

In practice however, I think it's fair to say that people collect some omni geodes before having collected a sufficient number of geodes / frozen geodes / magma geodes. So I made the plot below (you can check the [source code](https://gist.github.com/remigerme/bd12e4a3a75ebf34cadfdd87815813db)).

![[geodes.png]]

**Bonus: artifacts.**  
It's also possible to view the opening of [artifact troves](https://stardewvalleywiki.com/Artifact_Trove) as a coupon collector problem. I'm not doing the analysis there - I think you got the idea.

---

Well, that was nice. But I had already completed the museum when writing this, so, all of this is not that useful to me now.

However, I still don't have all giant crops!

# Giant crops

In Stardew, you are playing a farmer, so you of course have crops - that should sound more reasonable than minerals and artifacts. But there is a small chance that fully-grown crops combine in a _GIANT_ crop.[^2] Which is obviously way more fun.

What do I want to compute? Two different things spontaneously come to my mind:

- $EE(X)$ where $X$ is the waiting time for at least one giant crop to appear
- $EE(Q_t)$ where $Q_t$ is the number of giant crops on the farm at time $t$ (way more difficult)

In practice, I'm more interested in the first, and the second looks way more difficult to compute, so... let's compute how much time I need to wait before having giant crops! We are not going to face another coupon collector problem, but I thought that this small probability problem was fun and useful enough to be featured here.

So, for a giant crop to appear we need two things:

- a $3 times 3$ square full of (grown) crops
- luck.

Each candidate $3 times 3$ square has a probability $p_"appearance"=0.01 med (1%)$ to turn into a giant crop each morning. Overlapping $3 times 3$ squares are considered.

Below is the layout of crops I'm using[^3] (image from [Pinterest](https://www.pinterest.com/pin/stardew-valley-junimo-hut-layout--454371049917837390/)). I've drawn 4 overlapping candidate squares in red, blue, green, pink.

![[layout.jpg]]

There are $n = 24$ candidate squares in total (including overlapping squares).

Now, let's compute the probability that at least one giant crop appears each day, given there are $n$ candidate squares.

$$
p &= PP("at least one giant crop appeared") \
& = 1 - PP("no giant crop appeared") \
& = 1 - (1 - p_"appearance")^n && "because squares are \"independent\" " star \
& = 1 - 0.99^n \
& tilde.eq 0.21
$$

$star$ _In fact, squares are not independent, but the formula stands correct in this specific situation. I think the rigorous arguments are a bit beyond the ~~efforts I'm ready to put in this post~~ scope of this section. See [[stardew#On 3x3 squares independence|appendix]]._

Let $X$ denote the waiting time for having at least one giant crop. Then $X ~ cal(G)(p)$. So, the expected waiting time $EE(X)$ is $1/p tilde.eq 4.7$ days. Well, time for me to go back playing, and hopefully wi5 in-game days I should have a giant crop.

![[giant_crop.png]]

Hope I convinced you that the coupon collector problem is a fundamental and cool problem.

# Appendix

You really are adventurous! Or you've done it a thousand times already. Anyway, let's do some proofs together.

## Expectation of a geometric distribution

The goal of this section is to prove the following:

> **Lemma**  
> If $X ~ cal(G)(p)$, then $EE(X)=1/p$.

Let $X ~ cal(G)(p)$. By definition:

$$
EE(X) &= sum_(k=1)^(+ infinity) PP(X=k)k \
&= sum_(k=1)^(+ infinity) p (1-p)^(k-1)k \
&= p sum_(k=1)^(+ infinity) k (1-p)^(k-1)
$$

Hem, doesn't look nice yet. Let's recall that we know:

$$
sum_(k=0)^(+ infinity) X^k = 1/(1-X)
$$

If we differentiate, we obtain:

$$
sum_(k=0)^(+ infinity)k X^(k-1) = 1/((1-X)^2)
$$

Oh, how convenient! It's exactly the formula we wanted to compute. So

$$
EE(X) &= p sum_(k=1)^(+ infinity)k(1-p)^(k-1) \
&= p dot 1/((1-(1-p))^2) \
&= p/p^2 \
&= 1/p
$$

## On 3x3 squares independence

So, clearly, $3 times 3$ squares are not independent. Why? Let's imagine one square turns into a giant crop, then overlapping squares won't be able to also turn into giant crops.

But.  
We are interested in a specific situation, where every square has not turned into a giant crop. So, intuitively, in the situation we're interested in, squares won't affect their overlapping neighbours. I'm becoming too lazy to write a more formal explanation at this point.

[^1]: Or, depending where you grew up, you might have seen some magnets to collect in cereal boxes for example. Every child's lifelong dream was to get all the magnets (in France, it was usually a map of France).

[^2]: I'm not going to make explicit the exact conditions under which a giant crop can appear, but you can refer to the [wiki](https://stardewvalleywiki.com/Crops).

[^3]: Well, this is not exactly the layout I'm using. I mean, this is the base layout but I'm combining them which generates waaaaay more 3x3-square candidates.
