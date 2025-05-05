
# 📘 Plan du Cours : Data Analytics (Version Détailée)

---

## 🔖 Chapitre I : **CRISP-DM – Méthodologie d’un Projet Data Analytics**

### 1. **Introduction**
#### 🔍 Contexte général
Avec l'explosion de la quantité de données disponibles dans toutes les industries (télécoms, finance, santé, etc.), il est crucial de disposer d'une **méthodologie structurée** pour gérer efficacement les projets d'analyse de données. Le **CRISP-DM** (**Cross Industry Standard Process for Data Mining**) a été développé dans les années 90 par un consortium industriel international (SPSS, NCR, DaimlerChrysler, etc.) pour offrir une **approche standardisée** à travers les phases d'un projet data analytics.

#### 📌 Définition
Le **CRISP-DM** est une **méthodologie itérative** qui propose **six étapes principales** pour guider un projet de data mining ou d’analyse prédictive :
1. Compréhension du métier
2. Compréhension des données
3. Préparation des données
4. Modélisation
5. Évaluation
6. Déploiement

Il n’est pas linéaire : les étapes peuvent être répétées plusieurs fois selon les besoins.

#### ✅ Pourquoi l’utiliser ?
- **Structuration** : Aide à organiser le travail, à définir les objectifs et les livrables.
- **Adaptabilité** : Peut s’appliquer à tous types de projets, quels que soient le secteur ou le volume de données.
- **Collaboration inter-fonctionnelle** : Permet aux équipes métiers et techniques de se comprendre et de travailler ensemble.
- **Gestion des risques** : Réduit les erreurs liées à une mauvaise compréhension des besoins ou des données.

---

### 2. **Les 6 Phases de CRISP-DM**

| Phase | Objectif | Activités Clés |
|-------|----------|----------------|
| **Compréhension du métier** | Aligner le projet avec les objectifs stratégiques de l'entreprise | - Identifier les besoins métiers<br> - Définir les KPIs<br> - Évaluer les contraintes opérationnelles |
| **Compréhension des données** | Explorer les sources de données disponibles | - Analyser les fichiers (`custinfo.dat`, `cdr.dat`, etc.)<br> - Identifier les caractéristiques pertinentes<br> - Détecter les anomalies ou lacunes |
| **Préparation des données** | Nettoyer, transformer et préparer les données pour l’analyse | - Gérer les valeurs manquantes<br> - Agrégation de données (ex. mensuel → semestriel)<br> - Intégration des données (fusion client + appels) |
| **Modélisation** | Appliquer des techniques d’apprentissage automatique | - Classification supervisée (SVM, Naive Bayes)<br> - Clustering non supervisé (K-means)<br> - Modèles prédictifs |
| **Évaluation** | Mesurer la performance du modèle selon les critères métiers | - Matrice de confusion<br> - Précision, rappel, F1-score<br> - Interprétabilité du modèle |
| **Déploiement** | Intégrer le modèle dans l’environnement opérationnel | - Mise en production (API, dashboard)<br> - Documentation technique<br> - Formation des utilisateurs |

> ⚠️ La phase de **préparation des données** prend souvent **70% du temps total** du projet.

---

### 3. **Encore plus sur les données**
#### Types de données
- **Données structurelles** : Données tabulaires (base de données relationnelle).
- **Données semi-structurées** : JSON, XML, logs.
- **Données non structurées** : Textes, images, vidéos.
  

#### Fusion et agrégation
- Fusionner des tables via des clés communes (ex. ID client).
- Agréger des données temporelles (journalier → hebdomadaire, mensuel).
- Créer des indicateurs synthétiques (churn rate, revenu moyen par utilisateur).

---

### 4. **Conclusion**
#### Rôle de CRISP-DM
CRISP-DM permet de **garantir la qualité** du processus de prise de décision, en assurant que chaque étape est bien maîtrisée et validée avant de passer à la suivante.

#### Bonnes pratiques et recommandations
- **Documentation** : Toutes les étapes doivent être documentées pour faciliter la maintenance et la reprise.
- **Itération** : Ne pas hésiter à boucler entre les étapes si nécessaire.
- **Inclusion des parties prenantes** : Les décideurs métiers doivent être impliqués dès le début pour valider les hypothèses et les résultats.

---

## 🔖 Chapitre II : **Règles d’Association**

### 1. **Généralités**
#### 🧠 Définition
Les règles d’association visent à découvrir des **relations fréquentes** entre des éléments dans un ensemble de transactions (ex. panier d’achat). Ces relations sont exprimées sous la forme :  
> *Si X alors Y*  
où X et Y sont des ensembles d’items (produits, services, etc.).

#### 💼 Applications concrètes
- **Analyse du panier d’achat** : Quels articles sont souvent achetés ensemble ?
- **Recommandations de produits** : Si vous avez acheté X, vous aimerez peut-être Y.
- **Cross-selling / Up-selling** : Stratégies commerciales basées sur les associations.
- **Placement des produits en magasin** : Optimiser la disposition physique pour favoriser les ventes croisées.

---

### 2. **Exemple & Complexité**
#### 🔢 Calcul des mesures clés :

| Mesure | Définition | Formule |
|--------|------------|---------|
| **Support** | Fréquence d’un itemset | $ \text{Supp}(X) = \frac{\text{Nombre de transactions contenant } X}{\text{Nombre total de transactions}} $ |
| **Confiance** | Probabilité qu’un item Y apparaisse si X est présent | $ \text{Conf}(X \rightarrow Y) = \frac{\text{Supp}(X \cup Y)}{\text{Supp}(X)} $ |
| **Lift** | Indique si deux items sont indépendants, positivement ou négativement corrélés | $ \text{Lift}(X \rightarrow Y) = \frac{\text{Conf}(X \rightarrow Y)}{\text{Supp}(Y)} $ |

> 📌 Seules les règles avec **support ≥ minsupp** et **confiance ≥ minconf** sont retenues.

#### Exemple :
Soit un supermarché avec les transactions suivantes :

| Transaction | Articles |
|-------------|----------|
| T1          | {pain, lait} |
| T2          | {pain, fromage, œufs} |
| T3          | {lait, fromage} |
| T4          | {pain, œufs} |
| T5          | {pain, lait, fromage} |

- Support({pain}) = 4/5 = 0.8
- Confiance({pain} → {lait}) = 3/4 = 0.75
- Lift = 0.75 / 0.6 = 1.25 > 1 → Association positive

---

### 3. **Algorithme Apriori**
#### 🔄 Principe de base
Apriori repose sur la propriété suivante : *si un itemset est fréquent, alors tous ses sous-ensembles sont aussi fréquents*. Il procède en plusieurs étapes itératives :

1. **Trouver les 1-itemsets fréquents** (support ≥ seuil).
2. **Générer les 2-itemsets candidats** à partir des 1-itemsets.
3. **Calculer leur support** et garder ceux fréquents.
4. **Répéter** jusqu’à obtenir des k-itemsets.
5. **Extraire les règles** à partir des itemsets fréquents.

#### 🔍 Génération des candidats fréquents
- On combine des itemsets pour générer des candidats.
- On élimine les candidats dont au moins un sous-ensemble n’est pas fréquent (principe d’anti-monotonicité).

#### 🛠️ Optimisations possibles
- Utilisation de structures comme **FP-Growth** (plus rapide que Apriori).
- Algorithmes avancés : **Eclat**, **DIC**, **CHARM**.
- Techniques distribuées (MapReduce, Spark) pour traiter des données massives.

---

### 4. **Résumé**
#### ✅ Avantages des règles d’association
- Facilement interprétables.
- Non supervisées (pas besoin d’étiquettes).
- Utiles pour le marketing, le commerce, les services…

#### ❌ Inconvénients
- Très coûteuses en temps de calcul.
- Beaucoup de règles triviales ou inutiles.
- Moins efficaces pour les articles rares.

#### 📈 Cas d’utilisation
- **Retail** : Quels articles sont souvent achetés ensemble ?
- **E-commerce** : Recommandations dynamiques.
- **Télécoms** : Combinaison de services souscrits par les clients.

---

## 🔖 Chapitre III : **Text Mining**

### 1. **Introduction au Text Mining**
#### 🧠 Définition
Le **Text Mining** est l’ensemble des techniques de **Data Mining** appliquées aux données textuelles non structurées pour en extraire des connaissances **inconnues, valides et exploitables**.

#### 🔍 Enjeux
- Transformer le texte en données exploitables.
- Extraire des tendances, opinions ou structures cachées.
- Gérer la complexité du langage naturel (ambiguïtés, contexte).

#### 💼 Applications
- Recherche d’information (moteurs de recherche)
- Classification de texte (spam vs non-spam)
- Résumé automatique
- Analyse des sentiments
- Extraction d'entités nommées (NER)
- Interrogation en langage naturel (Question Answering)

---

### 2. **Prétraitement du texte**
| Étape | Description |
|------|-------------|
| **Nettoyage** | Suppression des balises HTML, ponctuations, chiffres, accents |
| **Normalisation** | Passage en minuscules, suppression des accents |
| **Tokenisation** | Découpage du texte en mots ou expressions (tokens) |
| **Indexation** | Choix des termes pertinents (stopwords, fréquence) |
| **Dictionnaire** | Liste des termes retenus après filtrage |
| **Pondération** | Attribution d’un poids à chaque terme :<br> - Binaire (présence/absence)<br> - TF (Term Frequency)<br> - IDF (Inverse Document Frequency)<br> - **TF-IDF** → méthode la plus utilisée |

---

### 3. **Techniques du Text Mining**
| Technique | Objectif | Outils / Méthodes |
|----------|----------|-------------------|
| **Vectorisation** | Représentation numérique des textes | BoW (Bag of Words), TF-IDF |
| **Réduction de dimensionnalité** | Simplifier la matrice document-termes | LSA, PCA |
| **Mesures de similarité** | Comparer les documents entre eux | Cosinus, distance euclidienne |

---

### 4. **Catégorisation de texte**
#### 📌 Classification supervisée
Apprentissage à partir de textes annotés avec des classes prédéfinies.

#### ✅ Techniques courantes :
- **SVM (Support Vector Machine)** : Performant, surtout avec des données linéairement séparables.
- **KNN (k-Nearest Neighbors)** : Basé sur la proximité entre documents.
- **Naive Bayes** : Simple mais très rapide.
- **Arbres de décision / Random Forest** : Bonne interprétation des décisions.
- **Modèles de Deep Learning** (BERT, LSTM) : Très performants, surtout sur des données volumineuses.

---

### 5. **Analyse des Sentiments**
#### 📊 Opinion Mining
Extraction d’opinions, émotions ou attitudes exprimées dans le texte.

#### 🛠️ Approches possibles :
- **Approche lexicale** : Utilisation de dictionnaires de sentiments (ex. AFINN, SentiWordNet).
- **Approche statistique** : Modèles supervisés entraînés sur des données annotées.
- **Approche hybride** : Combinaison des deux.

#### 📱 Cas d’utilisation :
- Analyse d’avis clients
- Suivi des réseaux sociaux
- Monitoring de marque

---

### 6. **Méthodologie d’un projet Text Mining**
Suivre la méthodologie **CRISP-DM**, avec adaptation aux spécificités du texte :
- Prétraitement adapté (tokenisation, stemming, lemmatisation).
- Vectorisation adéquate (TF-IDF, embeddings).
- Modélisation spécifique (SVM, Naive Bayes, etc.)

---

### 7. **Récapitulatif et Conclusion**
- Le **Text Mining** permet de transformer des données textuelles non structurées en **connaissances exploitables**.
- Il combine des techniques de **traitement du langage naturel**, de **statistiques** et de **machine learning**.
- C’est un domaine en plein essor grâce à l’explosion des données textuelles (réseaux sociaux, emails, forums, etc.).

---

## 🔖 Chapitre IV : **Web Mining**

### 1. **Introduction**
#### 🧠 Définition
Le **Web Mining** est l’extraction automatique d’informations utiles à partir des ressources disponibles sur le Web. Il combine des techniques de **Text Mining**, **Data Mining** et **apprentissage automatique**.

---

### 2. **Web Content Mining**
#### 🎯 Objectif :
Extraire et analyser le contenu textuel ou multimédia des pages web.

#### 📚 Exemples :
- Résumé automatique
- Extraction d’avis
- Classification de pages

---

### 3. **Web Structure Mining**
#### 🎯 Objectif :
Analyser la structure des liens hypertextes entre les pages.

#### 🔗 Techniques clés :
- **PageRank** (Google) : mesure de popularité d’une page.
- Détection de communautés : groupes de pages fortement connectées.
- Analyse des hubs et authorities : identification de pages centrales.

---

### 4. **Web Usage Mining**
#### 🎯 Objectif :
Analyser les traces de navigation des utilisateurs à travers les logs.

#### 📈 Données analysées :
- Sessions utilisateur
- Clics, temps passé, chemins de navigation

#### 💡 Applications :
- Systèmes de recommandation
- Personnalisation de contenu
- Marketing ciblé

---

### 5. **Conclusion**
| Type de Web Mining | Données analysées | Objectif principal |
|--------------------|------------------|---------------------|
| **Content Mining** | Contenu textuel/multimédia | Comprendre ce qui est dit |
| **Structure Mining** | Liens entre pages | Comprendre comment les pages sont liées |
| **Usage Mining** | Logs, clics, sessions | Comprendre comment les utilisateurs naviguent |

---

## 🔖 Chapitre V : **Topic Modeling**

### 1. **Introduction & Définition**
#### 🧠 Qu’est-ce que le Topic Modeling ?
Technique d’analyse de texte permettant de découvrir **automatiquement les thèmes présents** dans un grand corpus de documents.

#### 📈 Applications :
- Classification automatique de documents
- Résumé de grands corpus
- Suivi de tendances (politique, santé, marketing)

---

### 2. **Modélisation non supervisée : LSA & LDA**
| Méthode                               | Avantages                                  | Inconvénients               |
| ------------------------------------- | ------------------------------------------ | --------------------------- |
| **LSA (Latent Semantic Analysis)**    | Simple, rapide, efficace sur petits corpus | Pas de base probabiliste    |
| **LDA (Latent Dirichlet Allocation)** | Interprétable, modélisation probabiliste   | Plus complexe à implémenter |

#### 🔄 Workflow LDA :
1. Prétraitement du texte
2. Vectorisation (TF-IDF)
3. Application de LDA (choix du nombre de topics)
4. Visualisation et interprétation

---

### 3. **Approches supervisées et guidées par graines**
| Approche | Description |
|---------|-------------|
| **Seeded LDA** | Introduit des contraintes ou des mots-clés pour guider la découverte des topics |
| **Supervision utilisateur** | Permet une interaction humaine pour affiner les résultats |

---

### 4. **Récapitulatif et Conclusion**
- Le **Topic Modeling** est une technique puissante pour explorer des corpus volumineux sans annotation préalable.
- **LSA** est simple mais moins interprétable ; **LDA** offre une meilleure interprétation sémantique.
- Ces techniques peuvent être enrichies par des approches semi-supervisées ou guidées par l'utilisateur.

---

## ✅ Conclusion générale des trois chapitres

Ces chapitres couvrent les aspects fondamentaux du **traitement des données textuelles et du Web** :
- Le **Text Mining** transforme les textes en informations exploitables via des techniques de **vectorisation**, **classification** et **analyse des sentiments**.
- Le **Web Mining** analyse les contenus, les structures et les comportements en ligne via trois axes : **Content**, **Structure** et **Usage Mining**.
- Le **Topic Modeling** découvre automatiquement les sujets présents dans un corpus, notamment via **LSA** et **LDA**.

Ces compétences sont essentielles pour exploiter pleinement les données textuelles et web dans des domaines comme le **marketing**, la **recherche d’information**, l’**intelligence artificielle** ou encore la **veille stratégique**.

---

Souhaitez-vous que je développe davantage un chapitre particulier ?