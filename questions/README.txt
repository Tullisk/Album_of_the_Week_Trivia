Trivia TXT format (block-based)
===============================

Create one .txt file per album inside /questions.
File name should match the album name used in the UI (case-insensitive), e.g.
  questions/Igor.txt
  questions/1989.txt

Block format (repeat for each question)
--------------------------------------

[Question]
Difficulty: easy|medium|hard
Question: Your question text?
A: Choice A
B: Choice B
C: Choice C
D: Choice D
Correct: A|B|C|D

Notes:
- Blank lines are allowed between blocks.
- Lines are trimmed.
- Difficulty defaults to 'easy' if omitted.
- Correct can be A/B/C/D (case-insensitive).
