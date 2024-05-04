# Intro

`@colabo-playsust/f-core` is a **_f-colabo.space_** puzzle.

PlaySustainability! edu-game (Sustainabile Development) Core puzzle.

---

This puzzle is automatically created with the [colabo tools](https://www.npmjs.com/package/@colabo/cli)

# PlaySustainable VOs

- VOs are contained in the `playsust/core/lib/vos`
- discussion of the VOs architecture is at https://github.com/Cha-OS/colabo/issues/540

## QuestSolution

- contains references to `QuestStep` and `teamId`, so we know which team solved it and for which QuestStep is that solution, from there we get QuestPuzzle, because the same puzzle may be part of several quests or in multiple steps of the same quest (to allow players to choose their path)
