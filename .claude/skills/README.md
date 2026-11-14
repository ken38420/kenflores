# Skills Claude pour ce site

Ces skills sont chargés automatiquement par Claude Code quand il travaille dans ce dépôt.
Le dossier `.claude/` n'est pas publié par GitHub Pages (Jekyll ignore les dossiers qui commencent par un point).

| Skill | Source | Licence | À quoi il sert |
| --- | --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) (commit 1780c5e) | Apache 2.0 | Direction visuelle forte, éviter les sites « génériques » |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills) (commit 1780c5e) | Apache 2.0 | Tester et capturer le site dans un vrai navigateur (Playwright) |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (commit 1995764) | Apache 2.0 | Critique, audit, finition (`/impeccable critique`, `polish`, `typeset`, `bolder`…) |

`impeccable` fonctionne en mode « lecture » : son binaire optionnel n'est pas inclus, le skill le signale et lit directement les fichiers du projet.

Évalués mais non installés :
- `Leonxlnx/taste-skill` : très complet, mais ajoute un hook qui s'exécute à chaque fin de session et pèse 40 Mo ; pensé pour des sites d'entreprise.
- `nextlevelbuilder/ui-ux-pro-max-skill` : base de styles génériques en Python, moins utile pour un portfolio d'ingénieur.
