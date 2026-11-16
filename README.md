# Ken Flores, portfolio d'ingénieur

**Site : [ken38420.github.io/kenflores](https://ken38420.github.io/kenflores/)**

Étudiant-ingénieur Arts et Métiers à l'ECAM LaSalle Lyon (promotion 2027) : conception mécanique, qualité et industrie du futur, avec un semestre d'ingénierie aérospatiale au Politecnico di Milano. Stage de fin d'études chez Safran Electronics & Defense en 2027.

![Aperçu du site](assets/apercu.jpg)

## Ce qu'on y trouve

- **7 projets**, chacun sur sa propre page avec une adresse partageable : quille de télécabine (Expleo), châssis de Formula Student, AuraFlow, habitat de ballon stratosphérique GEM-GCR (PoliSpace), mât rotor d'hélicoptère, ouvrages en acier (Fradem), KBE.
- **Un semestre à Milan** : quatre cours d'ingénierie aérospatiale et leurs projets.
- **Parcours et compétences** : frise formation / expériences, outils avec l'endroit où je m'en suis servi.

## Direction artistique

« Altitude » : un ciel de stratosphère bleu nuit pour les en-têtes, le quadrillage et le cartouche d'un bureau d'études, du verre dépoli là où quelque chose passe derrière, la typo Archivo en largeur étendue pour les titres. En tête de page, la vraie vue éclatée de l'habitat GEM-GCR, en trait blanc. Le site suit le mode clair ou sombre du système et respecte la préférence « réduire les animations ».

## Organisation

Aucun outil de build : GitHub Pages sert les fichiers tels quels.

| Fichier | Rôle |
| --- | --- |
| `index.html` | Tout le contenu, découpé en vues (`data-view`) ; l'ancre de l'URL choisit la vue affichée |
| `assets/css/site.css` | Styles et tokens de couleur (clair, sombre, bandes de nuit) |
| `assets/js/site.js` | Navigation entre vues, vue éclatée, visionneuse d'images, copie de l'adresse |
| `assets/img/`, `assets/video/` | Visuels tirés de mes rapports de stage et de projet |

Pour ajouter un projet, voir le commentaire en haut de `index.html`.

## Skills Claude utilisés

Le site a été retravaillé avec Claude Code et des skills de design, rangés dans [`.claude/skills`](.claude/skills/README.md) (non publiés sur le site).
