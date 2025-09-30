# CubeWar

3d Cubes War

[-Cube War : le test](https://patobeur.github.io/CubeWar/)

## Ce jeu doit :

-  être standalone ! et fontionner en local sans internet.
-  etre jouable sur mobile
-  fonctioner autant sur chrome que firefox mais aussi sur les navigateurs courants et à venir

## Statistiques de base d’un cube

-  Chaque cube (joueur, mob, allié, neutre) peut avoir les stats suivantes :

### Statistiques principales

-  Vie (HP) : quantité de points de vie.
-  Énergie / Endurance (Stamina) : permet de courir, attaquer, esquiver.
-  Nourriture / Faim : baisse lentement, influence la régénération.
-  Moral / Courage : si trop bas, le cube peut fuir ou hésiter à attaquer.

### Statistiques secondaires (influencent l’IA et les combats)

-  Force : dégâts physiques infligés.
-  Vitesse : rapidité de déplacement.
-  Perception : portée de détection (vue/odorat).
-  Aggressivité : probabilité d’attaquer un cube ennemi.
-  Intelligence : capacité à adapter son comportement (choisir une cible faible, chercher à manger, etc.).
-  Résistance : réduction des dégâts subis.

# Comportements de base d’un MOB (IA simple)

## 1. Exploration (Roamer)

-  Si aucun ennemi détecté dans la zone de perception → se déplace aléatoirement.
-  Peut parfois s’arrêter pour "observer"

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
-  il doit y avoir 4 cubes par faction max au début (on verras si c'est trop plus tard) 4 par factions -1 dans une faction car c'est le joueur.
-  4 couleurs de cubes, soit 4 factions (on verras si c'est trop peu plus tard).
-  les cubes n'ont pas forcement le meme comportement ni la meme taille.
-  des ressources pop sur la map.
-  a chaque fois q'un cube meur, un autre apparait d'une des 4 couleurs.
-  le joueur jou une couleur de son choix (la difference avec les autre c'est qu'il a un cercle autour de lui) et qu'il est toujours au centre de l'ecran d'une certaine maniere.

## menu de navigation top (fond flouttant le dessous) responsive.

-  un sous menu permet de modifier quelques réglages en temps réél

## l'attaque

-  couleur 1 : tir des projectile a courte distance

## factions

Chaque faction possede 3 type de models.

Chaque type augmente avec l'experience

-  au debut le joueur choisi sa couleur et son modele. en jeu il peut changer de modele en passant par un sous menu dans le menu de navigation en haut.

Soigneur : rôle support.

-  celui qui peut soigner à 5 unités autour de lui et de plus en plus loin avec son experience (sa monté en puissance). Soigne plus loin et plus fort avec l'experience. il tire aussi des projectile mais a 2 unité de distance seulement.

Tireur : rôle DPS.

-  celui qui tire des projectiles à 10 unités de distance (1.5 sec entre les tires pour l'instant). tire plus loin et plus fort avec l'experience.

Protecteur : rôle tank.

-  celui qui protege les autres en posant des murs infranchisable pendant 3 sec (10 sec entre les tires pour l'instant).il tire aussi des projectile mais à 5 unité de distance seulement.

-  au debut le joueur choisi sa couleur et son modele. en jeu il peut changer de modele en passant par un sous menu dans le menu de navigation en haut.
