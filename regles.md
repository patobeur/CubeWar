# 📘 CubeWar – Game Design Document

## 🎯 Objectifs techniques

-  Jeu **standalone** : fonctionne en local sans connexion internet.
-  Compatible **mobile** (contrôles tactiles).
-  Fonctionne sur **Chrome, Firefox et navigateurs modernes à venir**.
-  Limite : **50 cubes max** sur la carte (dont 1 contrôlé par le joueur).

---

## 📊 Statistiques des cubes

### Statistiques principales

| Stat                   | Description                                 | Valeur par défaut |
| ---------------------- | ------------------------------------------- | ----------------- |
| ❤️ Vie (HP)            | Quantité de points de vie                   | 100               |
| ⚡ Énergie / Endurance | Permet de courir, attaquer, esquiver        | 100               |
| 🍖 Nourriture / Faim   | Baisse lentement, influence la régénération | 100 (max)         |
| 💭 Moral / Courage     | Si trop bas → fuite, hésitation             | 50                |

### Statistiques secondaires

| Stat            | Description                      | Valeur par défaut |
| --------------- | -------------------------------- | ----------------- |
| 💪 Force        | Dégâts physiques infligés        | 10                |
| 🏃 Vitesse      | Rapidité de déplacement          | 1.0 (case/sec)    |
| 👀 Perception   | Rayon de détection (vue/odorat)  | 5 cases           |
| 🔥 Agressivité  | Probabilité d’attaquer un ennemi | 50%               |
| 🧠 Intelligence | Capacité à choisir une stratégie | Moyenne           |
| 🛡 Résistance    | Réduction des dégâts subis       | 10%               |

---

## 🤖 IA des Mobs

### 1. 🚶 Exploration (Roamer) – Déplacement naturel

-  Les cubes **ne se déplacent pas de manière erratique**.
-  Ils **avancent toujours un peu** dans une direction avant de tourner.
-  Les changements de trajectoire sont **progressifs** :
   -  Tourner en avançant (arc de cercle).
   -  Faire une courte pause, puis repartir.
-  Les déclencheurs d’un changement de direction :
   -  Temps écoulé (ex. 2 à 5 secondes de marche).
   -  Obstacle rencontré.
   -  Ressource ou cube détecté à proximité.

👉 Cela donne un **mouvement fluide et crédible**, qui semble motivé plutôt que chaotique.

---

### 2. 👁 Détection

-  Si un cube d’une autre couleur entre dans le rayon de perception → état _alerte_.
-  Comparaison des stats avec la cible avant décision.

### 3. 🎯 Choix de la cible

-  Attaque si ennemi plus faible.
-  Ignore ou fuit si ennemi trop fort.
-  Si plusieurs ennemis → priorité au plus faible, au plus proche ou au moins en vie.

### 4. ⚔️ Attaque

-  Si à portée → attaque.
-  Sinon → poursuit la cible.
-  Si l’ennemi disparaît trop longtemps → retour à Roamer.

### 5. 🛑 Survie

-  Si vie < 30% → comportement défensif :
   -  Fuite.
   -  Recherche de nourriture si disponible.

### 6. 🍗 Faim / Ressources

-  Si faim trop basse → priorité à chercher de la nourriture.
-  Peut attaquer des cubes neutres pour se nourrir.

### 7. 👥 Interactions sociales (optionnel)

-  Suivre un chef.
-  Attaquer en groupe.
-  Fuir ensemble.

---

## 🟥 Factions

-  5 factions (5 couleurs de cubes).
-  Chaque faction possède **3 modèles de cubes**.
-  Chaque modèle **progresse avec l’expérience** (plus de portée, plus de dégâts, soins renforcés…).

### Types de cubes par faction

| Type         | Rôle    | Attaque                                          | Pouvoir spécial                                   |
| ------------ | ------- | ------------------------------------------------ | ------------------------------------------------- |
| ✚ Soigneur   | Support | Projectile (2 unités de distance)                | Soigne alliés dans un rayon de 5 (plus avec l’XP) |
| 🎯 Tireur    | DPS     | Projectile (10 unités de distance, 1 tir / 1.5s) | Portée et dégâts augmentent avec l’XP             |
| 🛡 Protecteur | Tank    | Projectile (5 unités de distance)                | Pose un mur infranchissable 3s (CD : 10s)         |

---

## ⚔️ Jeu & Objectifs

-  Jeu **solo** : le joueur choisit une faction.
-  Le joueur est **toujours visible** (entouré d’un cercle, caméra centrée sur lui).
-  Chaque cube qui meurt → un nouveau cube spawn dans une faction aléatoire.
-  Objectif : **faire survivre et dominer sa faction**.
-  Ressources pop aléatoirement sur la carte : nourriture, énergie, bonus temporaires.

---

## 🎮 Navigation & Interface

-  Menu **top-bar** avec fond flouté (responsive).
-  Sous-menu permettant de modifier des réglages **en temps réel** (ex. vitesse du jeu, spawn, agressivité IA…).
