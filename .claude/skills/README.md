# Skills Claude pour ce site

Ces skills sont chargés par Claude Code quand il travaille dans ce dépôt, automatiquement ou à la demande (`review-animations` s'appelle à la main).
Le dossier `.claude/` n'est pas publié par GitHub Pages (Jekyll ignore les dossiers qui commencent par un point).

## Installés

| Skill | Source | Licence | À quoi il sert |
| --- | --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) (commit 1780c5e) | Apache 2.0 | Direction visuelle forte, éviter les sites « génériques » |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills) (commit 1780c5e) | Apache 2.0 | Tester et capturer le site dans un vrai navigateur (Playwright) |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (commit 1995764) | Apache 2.0 | Critique, audit, finition (`/impeccable critique`, `polish`, `typeset`, `bolder`…) |
| `hallmark` | [nutlope/hallmark](https://github.com/nutlope/hallmark) (commit 04977e1) | MIT | Plancher anti-« AI slop » : tokens, focus, mouvement réduit, une idée par écran ; `/hallmark audit index.html` |
| `emil-design-eng`, `animate`, `review-animations`, `improve-animations` | [emilkowalski/skill](https://github.com/emilkowalski/skill) (commit 64eb3de) | MIT | Courbes, durées et retours au clic façon Emil Kowalski |

Le hook d'édition de Hallmark (`install-hook.mjs`) n'est pas installé. Son linter (`scripts/sloplint.mjs`) n'a pas été lancé lors de la refonte « Altitude » : ses règles ont été appliquées à la main.

## Lus et appliqués à la main, non installés

- `Leonxlnx/taste-skill` : ajoute un hook qui s'exécute à chaque fin de session et pèse près de 70 Mo ; on en a repris les règles de survol (carte qui monte de 2 px, image à 1,03) et d'une entrée unique du héros.
- `garrytan/gstack` (design-review) : plus de 120 Mo et des binaires ; on a repris sa grille de notation 0–10 par dimension pour la revue finale.
- `nextlevelbuilder/ui-ux-pro-max-skill` : base de styles en Python ; on a consulté sa fiche glassmorphism (flou, opacité, contraste du texte sur verre).
