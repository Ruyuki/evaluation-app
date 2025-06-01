# Documentation

### Modélisation - Persistence

J'ai choisi d'utiliser une base PostGre, standard à Air France pour les nouvelles applications, sélectionnée pour Azure pour son coût réduit.
MySQL aurait pu également convenir pour ce test, mais offre moins de fonctionnalités et de flexibilité de types de données, de capacité de mise à l'échelle, et d'accés concurrents que PostGre, qui sera donc préférable dans un projet amené à se complexifier.

Ci-dessous la modélisation 3eme forme normale (3NF) que j'ai adoptée pour représenter les avis (evaluation), et la ou les réponses données.
Norme qui assure la consistance des données, sans risque de redondance.

```
+----------------------+             +----------------------+
| evaluation           |             | answer               |
+----------------------+             +----------------------+
|-id (PK)              |             |-id (PK)              |
|-company              |1        0..*|-comment              |
|-flightNumber         |-------------|-creationDate         |
|-flightDate           |             |-evaluation# (FK)     |
|-rate                 |             +----------------------+
|-comment              |
|-status               |
|-creationDate         |
|-answers# (FK)        |
+----------------------+
```

Evaluation

- Un avis est lié à 0 ou plusieurs réponses (OneToMany porté par l'entité evaluation)
  Permettant de récupérer un avis et les réponses associées pour l'affichage du détail, sans aller spécifiquement requêter les réponses via un autre repository.
  Je définis cette relation avec un FetchType.LAZY pour ne charger les réponses qu'à la demande et ne pas requêter les données réponses si on en n'a pas besoin
  Et en CascadeType.ALL puisque la suppression d'une evaluation doit entrainer la suppression des réponses associées.

Answer

- Une réponse est donnée à un avis particulier (ManyToOne)

User

- Pour l'exercice, je n'ai pas intégré de classe User parce que je n'ai pas implémenté de manière d'identifier les utilisateurs postants des avis ou des réponses.
  Mais dans ce cas j'aurai procédé de la même manière, avec une evaluation ayant un auteur, un utilisateur pouvant rédiger 0 à n avis, même chose pour les réponses si on voulait identifier l'utilisateur "ADMIN" qui répond.

```
Evaluation 0..*---------------1 User
Answer 0..*---------------1 User
```

### Back-end

- J'ai utilisé springboot initializr pour générer le projet de base avec les dépendances utiles (springboot, spring data, driver post gre) depuis : https://start.spring.io/

J'ai ici séparé les responsabilités en 3 couches:

- Controller : définition des end-point indépendants pour chaque fonctionnalité.
  J'ai utilisé 2 controllers : un pour la partie cliente `/evaluation`, et un second pour la partie admin `/evaluation-admin` protégé par une Basic authentification avec `spring-boot-starter-security`
- Service : une couche service qui se charge de rendre un service particulier pour répondre à une fonctionnalité :
  Récupérer un avis et ses réponses, la liste des avis publiés, la recherche d'avis paginés pour l'admin et le changement de statut d'un avis.
  J'ai laissé ici des méthodes privées de transformation d'entité en DTO (Data Transfert Object) car la classe reste simple et que ces transformations ne sont pas utiles ailleurs aujourd'hui.
  Si la situation évolue il faudrait externaliser ces méthodes dans un service "mapper" qui n'aurait que cette responsabilité.
  Le mapper se charge d'alimenter des objets DTO à partir des entités, pour être plus flexible et éviter des problèmes de performances.
  En effet, retourner directement les entités evaluation serait mauvais puisque les réponses associées seraient automatiquement chargées pour chaque avis pour être retournées dans la réponse de l'API.
  Comme on n'accède pas aux answers de l'entité evaluation lors du mapping de la liste, les données des réponses ne sont pas chargées par Hibernate.
  On les inclue par contre dans le mapping pour l'affichage détaillé d'un avis et pour les avis publics.
- Repository : une couche d'accès aux données, utilisant JPA.
  Fournissant les méthodes permettant de requêter les données nécessaires à chaque fonctionnalité.
  Et retourne les entités utiles.

- J'ai implémenté une recherche paginée des avis pour l'admin.
  Car on peut imaginer que l'historique des avis grossisse grandement, entrainant des problèmes de performances si on remontait tous les avis sans filtre.
- Pour la liste des avis publiés de la partie cliente, on pourrait imaginer le même système, pour la même raison, mais je n'affiche que les 5 derniers avis pour cette fonctionnalité.

- Un package config définit les règles de sécurité pour protéger l'API admin avec `SecurityConfig`, et la configuration CORS nécessaire pour autoriser les requêtes provenant d'un autre domaine (ici localhost:4200, front-end angular), dans `CorsConfig`.

### Front-end

- J'ai utilisé les commandes ng pour génerer le projet de départ et la structure des différents composants:

```
ng new <project-name>
ng generate component <component-name>
ng generate service <service-name>
```

Pour la partie design, j'ai intégré:

- Angular material, permettant d'avoir des composants rapides à utiliser pour constuire une IHM : https://material.angular.dev/
- tailwind, pour éviter le CSS custom et faciliter le développement des templates : https://v3.tailwindcss.com/

En terme d'architecture du code:

- Un répertoire core :
  qui va contenir les services globaux à l'application
  comme le HTTPLoader servant à récupérer le fichier en.json pour l'externalisation des labels (pour faciliter la maintenance, même si une seule langue est disponible ici).
  Ainsi qu'une guard qui va rediriger l'utilisateur sur le composant de Login s'il n'est pas déjà logué. Et un intercepteur qui complète ce comportement sur les erreurs 401.
  Un userService, permettant de gérer les security headers pour l'authentification, utilisé par les services qui en ont besoin
- Un répertoire share:
  pour les composants et services partagés, réutilisables dans plusieurs parties de l'application.
  Ici le composant star-rating, permettant à la fois de donner une note, et d'en afficher une, avec le même format/design.
  Avec un mode `READONLY` ou `EDITABLE` pour simplifier, et surtout centraliser ici la configuration du système de note (1 à 5).
  Qui sera utilisé en `READONLY` dans les différents affichages (liste/admin/detail) et en mode `EDITABLE` dans le formulaire de création d'un avis.
  Et le composant evaluation detail, qui permet d'afficher un avis et ses réponses, que ce soit dans la partie cliente ou admin.
  Ce composant n'a qu'un rôle d'affichage un avis, qui sera passé un input. Charge au composant maitre (composant de la partie cliente, ou de la partie admin), de charger le ou les avis à afficher en fonction du besoin de chacun.
- Un répertoire "feature" evaluation pour la partie cliente.
- Un répertoire "feature" evaluation-admin pour la partie admin.
- Les composants appellent une couche service (evaluation.service.ts) qui va retourner des objets formatés pour le front (Evaluation), mappés à partir des interfaces réprésentants la structure exacte des DTO retournés par les API SpringBoot (EvaluationAPI).
  Ici par exemple pour transformer les dates iso string en objets Moment, plus facile à manipuler et à intégrer avec les MatDatePicker de Material.
  Cette séparation entre les DTO et les objets manipulés par les composants permet, en cas de modification dans les API, changement de back-end, etc... de n'avoir que la couche de mapping à adapter, sans impact sur les composants d'affichage.
- Les "service-api" utilisent le HttpClient d'Angular pour les appels http à l'API SpringBoot

Autre:

- Prettier, pour le formattage automatique des fichiers.
- De la même manière j'utiliserai des règles de formatage avec l'IDE pour la partie back
  afin de simplifier les comparaisons de code lors des pull requests.

### IA

J'ai utilisé GitHub Copilot, intégré à VS Code, pour résoudre plus rapidement les soucis de syntaxe afin de gagner du temps.
Il propose également des extraits de code utiles, basés notamment sur le code déjà écrit, que je n'avais plus qu'à adapter à mes besoins.
Je l'ai également utilisé pour générer la javadoc des méthodes.

### Reste à faire

- Ajouter des tests d'intégration springboot/front-end pour vérifier la non régression automatiquement.
