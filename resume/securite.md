
# 📘 Résumé Complet du Cours : Sécurité des Systèmes  


---

## 🧩 1. Introduction & Terminologie


### 🔹 Définitions
- **Sécurité informatique** : Protection des actifs matériels et logiciels.
- **Sécurité de l’information** : Protection de la CIA (Confidentialité, Intégrité, Disponibilité).
- **Normes utilisées** : ISO/CEI 17799, NIST, ISO/CEI 13335-1.


### 🔹 Où, quoi et comment sécuriser ?
- Plusieurs niveaux :
  - Sécurité physique.
  - Sécurité des réseaux.
  - Sécurité des systèmes d'exploitation.
  - Sécurité des données.

### 🔹 Politique de Sécurité
- Base de tout projet de sécurité.
- Inclut : diagnostic, analyse des risques, rôles, procédures (protection, détection, réaction).

### 🔹 Terminologie (ISO 27000)
| Terme                 | Définition                                       |
| --------------------- | ------------------------------------------------ |
| **Actif**             | Ressource ayant une valeur pour l’organisation   |
| **Menace**            | Action pouvant causer un dommage à un actif      |
| **Vulnérabilité**     | Faiblesse exploitable par une menace             |
| **Attaque**           | Exploitation concrète d’une vulnérabilité        |
| **Risque**            | Menace × Vulnérabilité × Impact                  |
| **Vecteur d’attaque** | Chemin ou point d’entrée utilisé par une attaque |
| **Surface d’attaque** | Ensemble des vecteurs possibles                  |

---

## 🔐 2. Services de Sécurité

Les services de sécurité assurent la protection de l’information :

| Service | Définition | Exemple de menace protégée |
|--------|------------|-----------------------------|
| **Confidentialité (C)** | L'info n’est accessible qu’aux autorisés | Information Disclosure |
| **Intégrité (I)** | Données non modifiées sans autorisation | Tampering with Data |
| **Authentification** | Vérification de l’identité | Spoofing Identity |
| **Non-répudiation** | Preuve que l'action a eu lieu | Repudiation |
| **Contrôle d’accès** | Accès limité aux autorisés | Elevation of Privilege |
| **Disponibilité (A)** | Info disponible quand nécessaire | Denial of Service |
| **Imputabilité / Traçabilité** | Attribuer actions à leurs auteurs | Repudiation |

---

## 🔒 3. Mécanismes de Sécurité

Moyens techniques pour assurer les services de sécurité.

### 🔹 Cryptographie
- **Symétrique** : Même clé pour chiffrer/déchiffrer (ex: AES, DES).
- **Asymétrique** : Clé publique pour chiffrer, privée pour déchiffrer (ex: RSA).
- **Fonctions de hachage** : SHA-256, MD5 (obsolète), SHA-1 (cassé).
- ## 🟡 Comparaison rapide :

|             | taille du hash | securite actuelle | collison trouvee? | recommande? |
| ----------- | -------------- | ----------------- | ----------------- | ----------- |
| **MD5**     | 128 bits       | ❌ Très faible     | ✅ Oui             | ❌ Non       |
| **SHA-1**   | 160 bits       | ❌ Faible          | ✅ Oui (2017)      | ❌ Non       |
| **SHA-256** | 256 bits       | ✅ Bonne           | ❌ Non             | ✅ Oui       |


### 🔹 Signature Numérique
- Basée sur la cryptographie asymétrique.
- Assure : Authentification + Intégrité + non-répudiation.

### 🔹 Authentification 
une entite prouve son identite a une autre entite
- Facteurs possibles :
  - Ce que vous savez (mot de passe).
  - Ce que vous avez (carte).
  - Ce que vous êtes (biométrie).
- OTP (One-Time Password) : mot de passe à usage unique.

### 🔹 Contrôle d’accès


---

# 🔐 Exemples des modèles de **Contrôle d’Accès**

---

## 1. **DAC – Discretionary Access Control**

> Le **propriétaire d’un objet décide qui peut y accéder**.

### 📁 Exemple :
Un utilisateur partage un fichier sur un serveur Linux avec des permissions spécifiques.

| Fichier        | Alice (Propriétaire) | Bob (Groupe) | Autres |
|----------------|----------------------|--------------|--------|
| `doc.txt`      | Lecture + Écriture     | Lecture      | Aucun  |

---

## 2. **MAC – Mandatory Access Control**

> L’accès est déterminé par une **politique centralisée basée sur des niveaux de sécurité**.

### 🛡️ Exemple :
Dans un système militaire, les utilisateurs ont des niveaux de clearance et les documents des niveaux de classification.

| Utilisateur   | Niveau Sécurité | Document Cible | Accès ? |
|---------------|------------------|----------------|---------|
| Officier A    | Secret           | Top Secret     | ❌      |
| Officier B    | Top Secret       | Top Secret     | ✅      |

---

## 3. **RBAC – Role-Based Access Control**

> Les droits sont associés à des **rôles**, et les utilisateurs sont affectés à ces rôles.

### 👥 Exemple :
Un système bancaire attribue des rôles aux employés.

| Rôle         | Droits                          | Utilisateurs |
|--------------|----------------------------------|--------------|
| Gestionnaire | Voir + Modifier comptes clients   | Alice, Bob   |
| Superviseur  | Approuver transactions          | Charlie      |
| Client       | Voir son compte                  | UserX        |

---

## 4. **ACL – Access Control List**

> Chaque **objet a une liste des sujets autorisés** et leurs actions.

### 🗂️ Exemple :
Un fichier dans un système Windows avec une ACL définie.

| Objet        | Sujet     | Permissions     |
|--------------|-----------|-----------------|
| `fichier.pdf`| Alice     | Lecture + Écriture |
| `fichier.pdf`| Bob       | Lecture seule     |
| `fichier.pdf`| Groupe HR | Lecture           |

---

## 5. **Capabilités**

> Chaque **sujet possède une liste des objets accessibles** et les actions permises.

### 🧾 Exemple :
Un utilisateur dispose de capabilités pour accéder à certains fichiers.

| Sujet    | Objet          | Permission       |
|----------|----------------|------------------|
| Alice    | `rapport.pdf`  | Lecture          |
| Alice    | `donnees.xlsx` | Écriture         |
| Bob      | `donnees.xlsx` | Lecture seule    |

---

Souhaitez-vous que je vous fournisse ce contenu en format PDF ou HTML également ?
	
### 🔹 Intégrité
- Hachage, signature numérique.
- Watermarking (tatouage numérique).

### 🔹 Autres
- **Bourrage de trafic** : Protège contre l’analyse de flux.
- **Contrôle de routage** : Choisir des chemins sûrs.

---

## 🛡️ 4. Sécurité des Systèmes d’Exploitation

### 🔹 Rôle central
- Interface entre applications et matériel.
- Gestion des processus, mémoire, I/O, fichiers.

### 🔹 Fonctions de sécurité
- Identification et authentification.
- Contrôle d’accès via ACL.
- Protection de la mémoire.
- Audit et traçabilité.

### 🔹 Critères Communs (Common Criteria - CC)
- Norme internationale d’évaluation de sécurité.
- Niveaux EAL (Evaluation Assurance Level) : de 1 à 7.

### 🔹 TCB (Trusted Computing Base)
- Partie critique du système : noyau, pilotes, etc.
- Objectif : minimiser sa taille pour améliorer la sécurité.

### 🔹 Moniteur de référence (Reference Monitor)
- Décide de l’accès à une ressource.
- Doit être inviolable, incontournable, vérifiable.

### 🔹 Solutions complémentaires
- **Audit** : journalisation des événements critiques.
- **Sandboxing** : exécution isolée de code suspect.

---

## ⚠️ 5. Modèle STRIDE / DREAD

### 🔹 STRIDE (Microsoft)
| Lettre | Menace | Service visé |
|--------|--------|--------------|
| **S** | Spoofing | Authentification |
| **T** | Tampering | Intégrité |
| **R** | Repudiation | Non-répudiation |
| **I** | Info Disclosure | Confidentialité |
| **D** | Denial of Service | Disponibilité |
| **E** | Elevation of Privilege | Contrôle d'accès |

### 🔹 DREAD (Évaluation de risque)
| Lettre | Critère | Description |
|--------|--------|-------------|
| **D** | Damage | Impact potentiel |
| **R** | Reproducibility | Facilité de reproduction |
| **E** | Exploitability | Difficulté d’exploitation |
| **A** | Affected Users | Nombre d’utilisateurs impactés |
| **D** | Discoverability | Facilité de découverte |

> **Formule** : `Risque = (Damage + Repro + Exploit + Affected + Discover) / 5`

---

## 📈 6. Triades de la Sécurité

### 🔹 Triade CIA
- **Confidentialité**
- **Intégrité**
- **Disponibilité**

### 🔹 Triade du Risque
- **Menace**
- **Vulnérabilité**
- **Actif**

---

## 🧠 7. Conclusion & Bonnes Pratiques

- **Pas de sécurité 100%** : toujours une faille potentielle.
- **Politique de sécurité claire** est essentielle.
- **Cycle PDCA** (Plan, Do, Check, Act) pour maintenir la sécurité.
- **Technologies émergentes** à surveiller :
  - **Cryptographie post-quantique**
  - **Blockchain**
  - **IA & Deep Learning**

---

## 🌐 Liens utiles
- [OWASP](https://owasp.org)
- [NIST](https://csrc.nist.gov)
- [DGSSI](https://www.dgssi.gov.ma)
- [ANSSI France](https://www.ssi.gouv.fr)
- [Sans Institute](https://www.sans.org)

---

👉 **Ce résumé contient l’essentiel du cours de Sécurité des Systèmes (2A_SSI).**  
Tu peux l’utiliser comme base pour réviser, préparer un exposé ou structurer tes notes.

Souhaites-tu que je te le convertisse en PDF ou en fichier Word ?