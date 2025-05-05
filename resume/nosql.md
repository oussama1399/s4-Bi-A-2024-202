
# 📘 Résumé Complet du Cours : Gestion des Bases de Données NoSQL

## 🗺️ Plan du Document

1. **Introduction aux bases de données NoSQL**
2. **Taxonomie des bases NoSQL**
   - Bases Clé-Valeur
   - Bases Orientées Colonnes
   - Bases Orientées Documents
   - Bases Orientées Graphes
3. **Systèmes distribués et Big Data**
   - Architecture des systèmes distribués
   - Le théorème CAP
   - Scaling du traitement vs scaling des données
4. **MongoDB – Base orientée documents**
   - Modèle de données
   - Opérations CRUD
   - Indexation
   - Sharding et réplication
5. **Neo4j – Base orientée graphes**
   - Modèle de données
   - Langage Cypher
   - Optimisation des requêtes complexes
6. **Conclusion générale**

---

## 1. Introduction aux bases de données NoSQL

### 🔍 Qu’est-ce qu’une base NoSQL ?

NoSQL (Not Only SQL) désigne une famille de bases de données qui diffère des modèles relationnels traditionnels en termes de structure, de performance, de flexibilité et d’architecture. Elles sont particulièrement adaptées aux applications modernes où la scalabilité horizontale, la gestion de données semi-structurées ou non structurées, et les performances élevées sont essentielles.

### ❓ Pourquoi utiliser une base NoSQL plutôt qu’une base SQL ?

| Critères | Base Relationnelle (SQL) | Base NoSQL |
|---------|----------------------------|------------|
| Schéma | Fixe | Dynamique / Flexible |
| Scalabilité | Verticale (ajout de puissance à un seul serveur) | Horizontale (ajout de nouveaux serveurs) |
| Relations | Tables + Jointures | Nœuds, Documents, Colonnes, ou Paires Clé/Valeur |
| Transactions | ACID (Atomicité, Cohérence, Isolation, Durabilité) | BASE (Basic Availability, Soft state, Eventual consistency) |

### ✅ Avantages des bases NoSQL :

- **Flexibilité** : absence de schéma rigide.
- **Haute disponibilité** : grâce à la réplication.
- **Scalabilité horizontale** : possibilité d’ajouter facilement des serveurs.
- **Performance optimisée** : pour les accès fréquents ou massifs.
- **Gestion de données hétérogènes** : adaptées au Big Data, aux flux dynamiques et aux formats variés.

### 💼 Cas d’utilisation typiques :
- Applications web (réseaux sociaux, e-commerce)
- Internet of Things (IoT)
- Moteurs de recommandation
- Systèmes de journalisation (logs)
- Analyse prédictive et intelligence artificielle

---

## 2. Taxonomie des bases NoSQL

Il existe quatre grandes familles de bases NoSQL, chacune ayant des caractéristiques propres et destinée à des cas d'usage spécifiques.

---

### 2.1 Bases Clé-Valeur (Key-Value Stores)

#### 🧠 Principe :
Données stockées sous forme de paires `clé → valeur`. Chaque clé est unique et permet d’accéder rapidement à la valeur associée.

#### ⚙️ Caractéristiques :
- Très rapide en lecture/écriture.
- Idéal pour le caching, les sessions utilisateurs, ou les logs simples.
- Pas de requêtage complexe possible (ex. recherche dans les valeurs).

#### 🛠️ Exemples :
- Redis
- Amazon DynamoDB
- Voldemort

#### 🧾 Cas d'utilisation :
- Stockage temporaire (cache applicatif).
- Gestion des préférences utilisateur.
- Files de messages légères.

---

### 2.2 Bases Orientées Colonnes (Column-Oriented Databases)

#### 🧠 Principe :
Les données sont organisées par colonnes plutôt que par lignes. Chaque ligne peut avoir un ensemble différent de colonnes, ce qui offre une grande flexibilité.

#### ⚙️ Caractéristiques :
- Optimisées pour l’analyse massive de données (Big Data).
- Hautes performances en lecture séquentielle.
- Adaptées aux systèmes nécessitant un grand volume d’insertions.

#### 🛠️ Exemples :
- Apache Cassandra
- HBase
- Google BigTable

#### 🧾 Cas d'utilisation :
- Intelligence artificielle et machine learning.
- Journalisation système.
- IoT (stockage de mesures provenant de capteurs).

---

### 2.3 Bases Orientées Documents (Document Stores)

#### 🧠 Principe :
Les données sont stockées sous forme de documents JSON ou BSON (Binary JSON). Ces documents peuvent contenir des structures imbriquées, ce qui facilite la modélisation de données complexes.

#### ⚙️ Caractéristiques :
- Structure flexible et hiérarchique.
- Requêtes avancées sans jointures.
- Facile à intégrer avec les API REST et les frameworks web.

#### 🛠️ Exemples :
- MongoDB
- Couchbase
- RavenDB

#### 🧾 Cas d'utilisation :
- Catalogues produits.
- Applications mobiles et backend-as-a-service (BaaS).
- Systèmes de gestion de contenu (CMS).

---

### 2.4 Bases Orientées Graphes (Graph Databases)

#### 🧠 Principe :
Modélisation des données via des **nœuds (nodes)** et des **relations (edges)**. Cette structure reflète naturellement les interconnexions entre entités.

#### ⚙️ Caractéristiques :
- Performance élevée sur les requêtes liées aux relations.
- Modèle intuitif proche de la réalité.
- Langages dédiés comme **Cypher** (Neo4j), **Gremlin** (Apache TinkerPop), etc.

#### 🛠️ Exemples :
- Neo4j
- ArangoDB
- OrientDB

#### 🧾 Cas d'utilisation :
- Réseaux sociaux (amitiés, connexions).
- Systèmes de recommandation (produits, films).
- Détection de fraude bancaire.
- Bio-informatique (interactions protéines/gènes).

---

## 3. Systèmes distribués et Big Data

### 🔁 Principe des systèmes distribués

Un système distribué est composé de plusieurs machines interconnectées travaillant ensemble pour traiter de grandes quantités de données tout en assurant la **disponibilité**, la **tolérance aux pannes** et la **scalabilité**.

#### ✅ Caractéristiques principales :
- **Scalabilité horizontale** : ajout facile de nouveaux serveurs.
- **Réplication** : copie des données pour éviter la perte de données.
- **Partitionnement (Sharding)** : division des données pour les distribuer intelligemment.

📌 **Exemple concret :**  
MongoDB utilise la **réplication** via des *replica sets* et le **sharding** pour garantir la scalabilité et la tolérance aux pannes.

---

### 🧮 Théorème CAP – Consistency, Availability, Partition Tolerance

Le théorème de CAP affirme qu’il est impossible de garantir simultanément les trois propriétés suivantes dans un système distribué :

| Propriété | Signification |
|-----------|---------------|
| **Consistency (Cohérence)** | Tous les clients voient les mêmes données au même moment. |
| **Availability (Disponibilité)** | Chaque requête reçoit une réponse valide. |
| **Partition Tolerance (Tolérance au partitionnement)** | Le système continue de fonctionner malgré une coupure réseau. |

#### 💡 Choix pratiques selon les bases :
- **MongoDB** → Priorise **AP** (Disponibilité + Tolérance)
- **Cassandra** → Priorise **CP** (Cohérence + Tolérance)
- **PostgreSQL (avec Citus)** → Peut être configuré pour **CA** mais rarement utilisé ainsi.

---

### 🚀 Scaling du Traitement vs. Scaling des Données

#### 1️⃣ **Scaling du traitement** – MapReduce (ex: Hadoop)

- **Map** : extraction de données sur chaque machine.
- **Reduce** : agrégation des résultats pour produire une réponse finale.
- **Idéal pour** : traitement batch, analyse de données historiques.

📌 **Cas d’utilisation :** indexation massive de pages web par Google.

#### 2️⃣ **Scaling des données** – Sharding (ex: MongoDB)

- Répartition des données sur plusieurs serveurs.
- Accès rapide grâce au partitionnement intelligent.
- Adapté aux applications transactionnelles hautes performances.

📌 **Cas d’utilisation :** site e-commerce avec millions d'utilisateurs.

---

Voici une **version enrichie et détaillée** de la section sur MongoDB. Chaque point a été développé pour offrir une compréhension approfondie du modèle de données, des opérations CRUD, de l’indexation et du sharding dans MongoDB.

---

## 4. MongoDB – Base orientée documents

MongoDB est une base de données NoSQL de type **document store**, largement utilisée pour sa flexibilité, sa scalabilité horizontale et son intégration naturelle avec les applications web modernes (notamment celles basées sur JSON). Elle est particulièrement adaptée aux cas où le schéma évolue souvent ou où les volumes de données sont importants.

---

### 🧠 Modèle de données

MongoDB utilise un modèle **orienté documents**, organisé en trois niveaux principaux :

```
Base de données (Database) → Collections → Documents
```

- **Base de données (Database)** : contient plusieurs collections. C’est l’unité logique de regroupement des données.
- **Collection** : ensemble de documents, similaire à une table dans une base relationnelle, mais sans schéma fixe.
- **Document** : unité fondamentale de stockage, représentée au format **BSON** (*Binary JSON*), extension de JSON qui inclut des types binaires supplémentaires comme les dates, les UUID, etc.

#### Avantages du modèle documentaire :
- **Schéma flexible** : chaque document peut avoir une structure différente dans la même collection.
- **Données imbriquées** : possibilité d’intégrer directement des sous-documents et des tableaux, évitant ainsi les jointures coûteuses.
- **Performance élevée** : lecture/écriture rapide grâce à la structure proche des objets manipulés par les langages de programmation.

#### 📄 Exemple de document :

```json
{
    "_id": ObjectId("6512f2d4c1"),
    "nom": "Alice",
    "email": "alice@example.com",
    "historique_achats": [
        {
            "produit": "Ordinateur",
            "prix": 899.99,
            "date": ISODate("2024-01-15T08:30:00Z")
        },
        {
            "produit": "Souris",
            "prix": 29.99,
            "date": ISODate("2024-01-17T10:45:00Z")
        }
    ],
    "preferences": {
        "theme": "sombre",
        "notifications": true
    }
}
```

Ce document représente un utilisateur avec ses informations personnelles, son historique d'achats (tableau de sous-documents), et ses préférences (sous-document imbriqué).

---

### 🛠️ CRUD – Opérations de base en MongoDB

Les opérations **CRUD** (**Create**, **Read**, **Update**, **Delete**) constituent les actions fondamentales pour manipuler les données dans MongoDB.

| Opération | Méthode MongoDB                | Description                                                                                                      |
| --------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Create    | `insertOne()` / `insertMany()` | Insère un ou plusieurs documents dans une collection.                                                            |
| Read      | `find()` / `findOne()`         | Récupère des documents correspondant à un filtre.                                                                |
| Update    | `updateOne()` / `updateMany()` | Met à jour un ou plusieurs documents selon un critère , avec une création automatique si l’élément n’existe pas. |
| Delete    | `deleteOne()` / `deleteMany()` | Supprime un ou plusieurs documents.                                                                              |

#### 📌 Exemples détaillés :

##### 1. Insertion (`insertOne`)
Insère un seul document dans la collection `utilisateurs`.

```js
db.utilisateurs.insertOne({
    nom: "Alice",
    age: 25,
    email: "alice@example.com"
});
```

##### 2. Recherche (`find`)
Recherche tous les utilisateurs âgés de plus de 20 ans, triés par nom, limités à 10 résultats :

```js
db.utilisateurs.find({ age: { $gt: 20 } })
               .sort({ nom: 1 })
               .limit(10);
```

##### 3. Mise à jour (`updateOne`)
Met à jour l'âge d'Alice :

```js
db.utilisateurs.updateOne(
    { nom: "Alice" },
    { $set: { age: 26 } }
);
```

##### 4. Suppression (`deleteOne`)
Supprime un utilisateur spécifique :

```js
db.utilisateurs.deleteOne({ nom: "Alice" });
```

##### Opérateurs fréquemment utilisés :
- `$gt`, `$lt` : supérieur / inférieur à une valeur.
- `$in`, `$nin` : inclusion ou exclusion dans une liste.
- `$set` : mise à jour d’un champ.
- `$push`, `$pull` : ajout/suppression d’éléments dans un tableau.
- `$unset` : suppression d’un champ.

---

### 🔍 Indexation pour accélérer les requêtes

L’**indexation** est essentielle dans MongoDB pour améliorer les performances des requêtes. Sans index, MongoDB doit parcourir toute la collection (**scan complet**) pour trouver les documents correspondants.

#### Créer un index simple :

```js
db.utilisateurs.createIndex({ "nom": 1 });
```

Le paramètre `1` indique un ordre ascendant, `-1` un ordre descendant.

#### Types d’index :

| Type d'index      | Utilisation |
|------------------|-------------|
| **Index simple** | Sur un seul champ. |
| **Index composé** | Sur plusieurs champs (`{nom: 1, age: -1}`). |
| **Index textuel** | Pour la recherche full-text (`createIndex({description: "text"})`). |
| **Index géospatial** | Pour les coordonnées géographiques (`2dsphere`, `2d`). |
| **Index TTL** | Auto-suppression après un délai (`{createdAt: 1}, {expireAfterSeconds: 3600}`) |

#### Bonnes pratiques :
- Créez des index sur les champs souvent utilisés dans les requêtes.
- Évitez les index inutiles pour réduire la consommation de mémoire et améliorer les performances d’écriture.
- Utilisez `explain()` pour analyser si vos requêtes utilisent bien les index.

Exemple d’utilisation de `explain()` :

```js
db.utilisateurs.find({ nom: "Alice" }).explain("executionStats");
```

---

### 🌐 Sharding – Répartition des données sur plusieurs serveurs

Le **sharding** permet de diviser une grande collection en fragments (**shards**) distribués sur plusieurs serveurs physiques. Cela assure une **scalabilité horizontale**, c’est-à-dire que vous pouvez ajouter facilement des serveurs pour gérer davantage de données et de trafic.

#### Architecture du sharding :

- **Shard** : contient une portion des données.
- **Config Server** : stocke les métadonnées sur la localisation des données.
- **Query Router (mongos)** : route les requêtes vers le bon shard.

#### Activer le sharding sur une base et une collection :

```js
// Activer le sharding sur la base de données
sh.enableSharding("maBase");

// Activer le sharding sur une collection en spécifiant la clé de partitionnement
sh.shardCollection("maBase.utilisateurs", { "user_id": "hashed" });
```

#### Choix de la clé de sharding :
- **Clé aléatoire (hashée)** : bonne répartition des données, mais moins efficace pour les requêtes de plage.
- **Clé monotone (ex: date)** : favorise les insertions séquentielles, mais peut créer des goulets d’étranglement.

#### Avantages du sharding :
- **Scalabilité illimitée** : ajout facile de nouveaux shards.
- **Haute disponibilité** : réplication possible via des replica sets.
- **Équilibrage automatique** : MongoDB redistribue les données entre shards si nécessaire.
- **Tolérance aux pannes** : chaque shard peut être répliqué pour assurer la continuité du service.

#### Limites :
- Plus complexe à configurer et à administrer.
- Certaines opérations (comme les jointures complexes) peuvent être plus lentes.

---

### ✅ Résumé des forces de MongoDB

| Fonctionnalité | Détail |
|----------------|--------|
| **Modèle de données** | Orienté documents, très flexible, avec support des structures imbriquées. |
| **CRUD** | Syntaxe intuitive, puissante, avec de nombreux opérateurs de filtrage et de mise à jour. |
| **Indexation** | Support avancé des index (simples, composés, géospatiaux, textuels) pour optimiser les performances. |
| **Sharding** | Scalabilité horizontale robuste, idéale pour les systèmes distribués. |
| **Réplication** | Haute disponibilité assurée via les replica sets. |



---

Voici une **version enrichie et détaillée** de la section sur **Neo4j**, avec une explication approfondie du modèle de données, du langage Cypher, des opérations courantes, des exemples concrets, ainsi que des bonnes pratiques.

---

## 5. Neo4j – Base orientée graphes

Neo4j est une base de données **NoSQL orientée graphe**, spécialement conçue pour modéliser, stocker et interroger efficacement des **données fortement interconnectées**. Contrairement aux bases relationnelles qui utilisent des tables et des jointures, Neo4j représente les informations sous forme de **nœuds (entités)** et de **relations (connexions entre entités)**.

Elle est particulièrement adaptée aux applications où les **liens entre les données sont aussi importants que les données elles-mêmes**, comme dans les réseaux sociaux, les systèmes de recommandation ou la détection de fraude.

---

### 🧠 Modèle de données : Nœuds et Relations

Le cœur du modèle de données Neo4j repose sur trois éléments principaux :

- **Nœuds (Nodes)** : représentent les entités (personnes, objets, concepts).
- **Relations (Relationships / Edges)** : définissent les connexions entre deux nœuds.
- **Propriétés (Properties)** : attributs associés à un nœud ou une relation.

#### Exemple simple : Alice est amie avec Bob

```cypher
CREATE (a:User {nom: "Alice", age: 28})
CREATE (b:User {nom: "Bob", age: 30})
CREATE (a)-[:AMI]->(b)
```

Dans cet exemple :
- `(a:User)` et `(b:User)` sont des **nœuds** étiquetés `User`.
- `{nom: "Alice", age: 28}` sont des **propriétés** associées au nœud.
- `-[:AMI]->` est une **relation** de type `AMI`.

#### Structure visuelle :

```
(Alice:User) -[:AMI]-> (Bob:User)
```

#### Types de relations possibles :
- Relation dirigée (`->`) ou non dirigée (`--`)
- Plusieurs types de relations entre deux nœuds (ex: `AMI`, `TRAVAILLE_AVEC`, `AIME`, etc.)
- Possibilité d’ajouter des propriétés aux relations

Exemple avec propriété sur une relation :
```cypher
CREATE (a)-[:AIME {depuis: 2021}]->(b)
```

---

### 📊 Langage Cypher – Manipulation des données

Cypher est le langage de requêtes principal de Neo4j. Il est **expressif**, **lisible** et très adapté à la manipulation de données en graphe.

---

### ✅ Opérations CRUD de base en Cypher

| Opération | Syntaxe Cypher | Description |
|----------|----------------|-------------|
| Create   | `CREATE`        | Création de nœuds et relations |
| Read     | `MATCH`         | Recherche de nœuds et relations |
| Update   | `SET`           | Mise à jour de propriétés |
| Delete   | `DELETE` / `DETACH DELETE` | Suppression de nœuds et relations |


---

#### 2. **Rechercher des données avec MATCH**

##### Trouver tous les amis d'Alice
```cypher
MATCH (u:User {nom: "Alice"})-[:AMI]->(ami)
RETURN ami.nom AS ami;
```

##### Trouver tous les utilisateurs vivant à Paris
```cypher
MATCH (u:User {ville: "Paris"})
RETURN u.nom AS utilisateur;
```

##### Trouver tous les collaborateurs directs d'Alice
```cypher
MATCH (u:User {nom: "Alice"})-[:COLLABORE_AVEC]->(collaborateur)
RETURN collaborateur.nom AS collaborateur;
```

---

#### 3. **Mettre à jour des données**

##### Modifier l'email d’un utilisateur
```cypher
MATCH (u:User {nom: "Alice"})
SET u.email = "alice_new@example.com"
RETURN u;
```

##### Ajouter une nouvelle propriété à une relation
```cypher
MATCH (a:User {nom: "Alice"})-[r:AMI]->(b:User {nom: "Bob"})
SET r.depuis = 2020
RETURN r;
```

---

#### 4. **Supprimer des données**

##### Supprimer une relation
```cypher
MATCH (a:User {nom: "Alice"})-[r:AMI]->(b:User {nom: "Bob"})
DELETE r;
```

##### Supprimer un nœud (nécessite de supprimer ses relations d’abord)
```cypher
MATCH (u:User {nom: "Charlie"})
DETACH DELETE u;
```

> ⚠️ `DETACH DELETE` supprime automatiquement toutes les relations attachées au nœud.

---



## 6. Conclusion générale

| Type de Base | Utilité Principale | Scénarios Recommandés |
|--------------|--------------------|------------------------|
| SQL          | Transactions fortes, relations fixes | Banque, ERP, finance |
| NoSQL        | Flexibilité, scalabilité | Web, IoT, Big Data |
| MongoDB      | Données semi-structurées, stockage flexible | Applications web, catalogues |
| Neo4j        | Relations complexes | Réseaux sociaux, recommandations, fraud detection |

💡 **Le choix de la base dépend avant tout du contexte applicatif et des contraintes métier.**

