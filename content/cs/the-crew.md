---
title: "Solving The Crew: Mission Deep Sea"
date: 2026-02-08
---

I love playing The Crew. You should definitely give it a try if you've never played it before.

The Crew: Mission Deep Sea is a cooperative card game that I will briefly explain in a moment. If you have already played more than once, there is a situation that you have inevitably encountered:

> Argh... guys, I think no matter what we do from this point on, we already lost the game.

> C'mon... maybe it is still winnable?

I wanted to check for certain. So I made a solver.

# The Crew: Mission Deep Sea

I won't explain the full rules. Too boring and too long. But you definitely should know the basics to understand what we're talking about.

The Crew is a cooperative trick-taking card game. What you need to know for this blog post:

- there are four colored suits: pink, blue, green, yellow, containing cards numbered from 1 to 9,
- there is one trump suit (named submarine), containing cards numbered from 1 to 4,
- the player who has the 4 of submarine in their hand is the captain,
- some tasks that players should fulfill in order to win the game, are drawn and placed in the center of the table,
- example of tasks (there are 96 of them):
  - win specific cards (1 of pink, 1, 2, and 3 of blue, ...),
  - don't open a trick with pink or green cards,
  - win exactly two consecutive tricks
  - win a trick with only even-valued cards
  - ...
- each player, starting from the captain and turning clockwise, chooses a task that they will have to fulfill (with the help of others),
- keep assigning tasks until there are none left in the center of the table,
- then start playing tricks (the captain is the initial player):
  - players must play the color that was used to open the trick (or can freely play another color or a submarine if they don't have the required color),
  - players collaborate to try to fulfill all their respective tasks together,
- when all tricks have been played, if all tasks are fulfilled the game is won, else it is lost.

# How does the solver work?

First, we need to understand how we can model the game. Or at least, how I modeled the game.

## Modelling the game

The following should seem pretty reasonable (note that we need to keep the index of the trick because we'll need to enforce constraints such as "don't win consecutive tricks" or "don't win any of the first four tricks"):

|                                     Object                                      | Data stored                                                         |
| :-----------------------------------------------------------------------------: | ------------------------------------------------------------------- |
|   [cards](https://github.com/remigerme/the-crew-solver/blob/main/src/card.rs)   | suit, number                                                        |
|  [tricks](https://github.com/remigerme/the-crew-solver/blob/main/src/trick.rs)  | index of the trick, index of the first player, list of cards played |
| [players](https://github.com/remigerme/the-crew-solver/blob/main/src/player.rs) | list of cards in hand, list of tricks won, list of tasks assigned   |
|   [tasks](https://github.com/remigerme/the-crew-solver/blob/main/src/task.rs)   | ???                                                                 |
|  [state](https://github.com/remigerme/the-crew-solver/blob/main/src/state.rs)   | list of players, current trick                                      |

Everything there is straightforward, except for tasks. The issue is that tasks do not share a common logic, they can be "win the 2 of green in the last trick", "win more tricks than the captain", or "don't open a trick with pink or green cards". There are still classes of tasks that feature the same logic (all the "win card X" for example), but it is not possible to write only one logic that would embed all tasks.

So, the underlying logic is not shared among tasks. What is shared is the ability to query a task to retrieve its status `TaskStatus` which can be one of three following variants:

- `Done` when the task has been completed for certain,
- `Failed` when the task can no longer be satisfied,
- `Unknown` otherwise (the default situation).

Then, a task is simply a function that takes the game state as input, and returns a `TaskStatus` indicating its current status. For convenience, we also take the index of the player to whom the task is assigned (which we can argue could technically be retrieved from the game state). In Rust terms[^1]:

```rust
trait Task {
    fn eval(&self, state: &State, ip: usize) -> TaskStatus;
}
```

There are 96 tasks to implement. I grouped similar tasks together, and implemented the trait above for 17 different structs, which means there are "only" 17 distinct logics. It could have been worse considering there are 96 tasks overall.

## So... how does the solver work?

Now we are fully equipped to answer that question.

**The solver returns the first solution it finds, if any, else, it returns that the game is unwinnable.**

I implemented a very simple backtracking algorithm. For the uninitiated, it basically means "try to play all possible cards that can be played recursively - if at some point the game is lost or won, no need to keep exploring this branch".

Here is an illustration of a backtracking execution, each circle features the card that was played, and the color indicates the status for the whole game at this point (red: lost, green: won, blue: unknown):

![[branching-backtracking.svg|400x400]]

Note that every branch eventually terminates (the depth of the tree is at most 40, because there are 40 cards).

> [!info] Play with the solver online (soon 🤞)
> The solver is only available as a [Rust binary](https://github.com/remigerme/the-crew-solver) for now, but I'd love to see it available online as a static website (powered by the magic of WASM). The thing is I hate web dev and suck at it anyway, I wouldn't be able to make a user-friendly UI. Contributions welcome!

Clearly, this is [simple to implement](https://github.com/remigerme/the-crew-solver/blob/main/src/solver.rs) but... is it efficient enough?

# Evaluating the search space

Even though a naive backtracking approach might seem a terrible idea, ~~it is not!~~ let's confirm it is by a very quick combinatorial analysis.

How many ways can we play a given game (cards were just dealt)?

Starting with an example of a game with 4 players: each player has $n_t = 10$ cards, leading to $10$ tricks. Without any constraint, the first player can play any card out of his 10 cards. Let's consider the worst case possible for the second player: they can also play any of their 10 cards. Same for the third and fourth players. And we keep going, but now, each player has only 9 cards left...

This leads to at most $cal(C)(4) = 10^4 times 9^4 times ... times 1^4 = (10!)^4$ configurations, which can be generalized for a variable number of players $n_p$: $cal(C)(n_p) = (n_t !)^(n_p)$.

For $n_p = 3$, the formula is slightly different because one player has an extra card, so it leads to: $14 dot 13^2 times 13 dot 12 ^ 2 times ... times 2 dot 1^2 = 14 times (13!)^3$ .

| $n_p$ | $n_t (n_p)$ |   $cal(C)(n_p)$   |
| :---: | :---------: | :---------------: |
|   3   |     13      | $3.4 times 10^30$ |
|   4   |     10      | $1.7 times 10^26$ |
|   5   |      8      | $1.1 times 10^23$ |

Oof. These are big numbers.

Hopefully, $cal(C)(n_p)$ is an upper bound, and is never reached because The Crew has rules that constrain the cards you can legally play. Unfortunately, some configurations might decently approach it (think of the configuration with $n_p=4$ such that each player has all the cards from a given color and a submarine card).

But in practice, the tasks will add way more constraints, thus making the search space sufficiently small for us to find a solution in a realistic time, right?  
Right?

# An attempt to experiment

Trying to evaluate the real number of configurations that this algorithm explores is complex. Way above my pay grade today. Instead, let's run some experiments.

Instead of returning as soon as the first successful configuration (green circles in the figure above) is encountered, we keep exploring and we count the number of successful configurations `n_done`, the number of failed ones `n_failed` (in red), and the number of unknown ones `n_unknown` (in blue).

Regarding the tasks assignment, random tasks are drawn until the total difficulty of all assigned tasks reaches a given difficulty.

I wrote a [program](https://github.com/remigerme/the-crew-solver/tree/experiments), which schematically performs the following:

```python
# Inputs: n_players, N, difficulty_min, difficulty_max
# Output: list containing tracked variables
#         (difficulty, n_done, n_failed, n_unknown)
#         for each single random experiment

results = []
for difficulty in range(difficulty_min, difficulty_max + 1):
    for _ in range(N):
        s = random_distribution(n_players)
        s.assign_random_tasks(difficulty)
        (n_done, n_failed, n_unknown) = s.play()
        results.append((difficulty, n_done, n_failed, n_unknown))
```

My goal was then to plot `n_done`/`n_failed`/`n_unknown` versus `difficulty`. I was hoping for observations along the lines of:

- if difficulty is too low, the game is under-constrained and the solver takes forever but we reach many successful configurations throughout the exploration,
- if difficulty is too high, the game is over-constrained and the exploration is fast, sometimes reaching a few successful configurations, sometimes not,
- a more interesting intermediate regime in between the two above.

Questions like "what are those thresholds of difficulty between regimes depending on the number of players? and how sharp are they?", "what is the ratio of successful configurations compared to failed ones in each regime?", or more importantly "how long does it take on average to find the first successful configuration (if it exists)?" could have been answered!

But, as you can probably guess, it is not quite what _I was able_[^2] to observe.

I was not able to observe much. Basically, either the exploration does not terminate (in realistic time), or it terminates really quickly when some tasks are contradicting each other (like "don't win any pink card" and "win the 1 of pink"). Of course, a higher difficulty means we are more likely to end up in the second category... but I don't think any insight can be gained here.

I think the blame should be put on the fact that _tasks are assigned randomly between players_. Humans, as fallible as they are, would never do that. These random assignments lead to so many uninteresting situations (tasks humans would 100% have assigned differently). I don't think it's worth digging deeper using this method.

**Conclusion.** Hopefully, the solver has been useful so far when I needed it the most: mid/end-game, when we were wondering if the game was still winnable. In these (few) real-world situations, it performed really well and gave an answer in about a second (at worst).

[^1]: In fact, I used an enum dispatch strategy, so we don't have to bother with heterogeneous collections of tasks. For the implementation with trait only, see [this commit](https://github.com/remigerme/the-crew-solver/tree/5acd2714feca92f63931ae7ea1cf14aa46fac209), for the newer one refer to the current version.

[^2]: I put the emphasis here on what I was able to observe and not what could be observed in general. Maybe you could do better reusing the existing infrastructure!
