# CubeWar

3d Cubes War

## Ce jeu doit :

-  être standalone ! et fontionner en local sans internet.
-  etre jouable sur mobile
-  fonctioner autant sur chrome que firefox mais aussi sur les navigateurs courants et à venir

## Statistiques de base d’un cube

-  Chaque cube (joueur, mob, allié, neutre) peut avoir les stats suivantes :

## Statistiques principales

-  Vie (HP) : quantité de points de vie.

-  Énergie / Endurance (Stamina) : permet de courir, attaquer, esquiver.

-  Nourriture / Faim : baisse lentement, influence la régénération.

-  Moral / Courage : si trop bas, le cube peut fuir ou hésiter à attaquer.

## Statistiques secondaires (influencent l’IA et les combats)

-  Force : dégâts physiques infligés.

-  Vitesse : rapidité de déplacement.

-  Perception : portée de détection (vue/odorat).

-  Aggressivité : probabilité d’attaquer un cube ennemi.

-  Intelligence : capacité à adapter son comportement (choisir une cible faible, chercher à manger, etc.).

-  Résistance : réduction des dégâts subis.

-  Comportements de base d’un MOB (IA simple)

## 1. Exploration (Roamer)

-  Si aucun ennemi détecté dans la zone de perception → se déplace aléatoirement.

-  Peut parfois s’arrêter pour "observer" ou "gratter le sol" (animation).

## 2. Détection

-  Si un cube d’une autre couleur entre dans le rayon de perception → passer en état alerte.

-  Vérifie la puissance relative : comparer ses stats avec celles de la cible.

## 3. Choix de la cible

-  Si ennemi plus faible détecté → attaque.

-  Si ennemi trop fort → fuit ou ignore.

-  Si plusieurs ennemis : privilégie le plus faible / le plus proche / celui avec le moins de vie.

## 4. Attaque

-  Si à portée → attaque.

   Sinon → poursuit la cible.

-  Si l’ennemi sort du champ de vision trop longtemps → abandonne et repasse en Roamer.

## 5. Survie

-  Si vie < 30% → comportement change :

-  Cherche à fuir / se cacher.

-  Si nourriture détectée → la consomme pour se régénérer.

## 6. Faim / Ressources

-  Si faim trop basse → priorité à chercher de la nourriture.

-  Peut attaquer des cubes neutres (faibles) pour les manger.

## 7. Interactions sociales (optionnel)

-  Si plusieurs mobs du même type :

-  Suivre le chef (cube le plus fort).

-  Attaquer en groupe.

-  Fuir ensemble.

## Jeu

-  c'est un jeu solo ou il faut faire gagner son camp.
-  il doit y avoir 40 cubes max (on verras si c'est trop plus tard)
-  5 couleurs de cubes (on verras si c'est trop peu plus tard).
-  les cubes n'ont pas forcement le meme comportement ni la meme taille.
-  des ressources pop sur la map.
-  a chaque fois q'un cube meur, un autre apparait d'une des 5 couleurs.
-  le joueur jou une couleur de son choix (la difference avec les autre c'est qu'il a un cercle autour de lui) et qu'il est toujours au centre de l'ecran d'une certaine maniere.

## menu de navigation top (fond flouttant le dessous) responsive.

-  un sous menu permet de modifier quelques réglages en temps réél)
