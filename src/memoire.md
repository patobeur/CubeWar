# Mémoire du Projet

Ce document sert de référence pour les concepts clés, les mécaniques de jeu et les décisions d'architecture.

## 1. Concept du Jeu
- **Genre :** Jeu de survie en solo avec des éléments de stratégie en temps réel.
- **Objectif :** Le joueur choisit une faction et doit assurer sa survie en combattant les autres factions.

## 2. Factions
- Le joueur choisit une faction au début de la partie.
- Toutes les unités d'une même faction partagent la même couleur.
- Les couleurs des factions sont centralisées dans un fichier de configuration (ex: `src/config/factionConfig.js`).
- La détection de collision des projectiles empêche le tir ami (`friendly fire`).

## 3. Rôles et Formes des Unités
Le rôle d'une unité (joueur ou mob) détermine sa forme géométrique.
- **Protecteur (Protector) :** Cube
- **Tireur (Shooter/Ranger) :** Tétraèdre
- **Soigneur (Healer) :** Sphère

## 4. Intelligence Artificielle (IA)
L'IA est modulaire et basée sur les rôles.
- **Base (`BaseIa.js`) :**
    - Comportement de cohésion de groupe pour éviter que les unités se superposent.
    - Logique d'acquisition de cible basée sur une statistique de `perception`.
    - Les unités de mêlée s'arrêtent lorsqu'elles sont à portée d'attaque.
- **Tireur (`RangerIa.js`) :**
    - Suit en priorité un Protecteur allié ("buddy system").
    - Maintient une distance avec les ennemis (`kiting`).
    - Intègre des pauses aléatoires pour un mouvement moins robotique.
- **Soigneur (`HealerIa.js`) :**
    - Suit en priorité un Protecteur allié, sinon n'importe quel autre allié.
    - Se déplace légèrement autour de sa cible (`roaming`) plutôt que de rester immobile.

## 5. Mécaniques de Jeu
- **Projectiles :**
    - Gérés par un `ProjectileManager` central.
    - Les projectiles sont des objets passifs avec des propriétés (dégâts, vitesse, coût en énergie).
- **Statistiques des unités :**
    - **Vie (HP) :** Barre de vie rouge.
    - **Énergie (EP) :** Barre d'énergie bleue, utilisée pour les compétences (tirer, soigner). L'énergie se régénère avec le temps.
- **Barres de Statut :**
    - Une classe `StatusBar` réutilisable affiche la vie et l'énergie au-dessus de chaque unité.
    - Les nuages sont des mobs sans statistiques et ne doivent pas afficher de barres.

## 6. Architecture Technique
- **Moteur 3D :** Three.js.
- **Structure :** Le code est organisé par fonctionnalités dans le dossier `src/`.
  - `core/` : Boucle de jeu, gestion de la scène.
  - `managers/` : Gestionnaires centraux (entités, projectiles, factions).
  - `entities/` : Classes pour les objets du jeu (Joueur, Mob, Projectile).
  - `ai/` : Logique de l'IA.
  - `ui/` : Composants d'interface (menus, barres de statut).
  - `config/` : Fichiers de configuration (stats, couleurs).
- **Lancement local :** `python3 -m http.server 8000` à la racine du projet.