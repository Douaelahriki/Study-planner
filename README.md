# 📚 Study Planner — Plateforme Collaborative de Planification d'Étude

Une application web fullstack permettant aux étudiants de planifier leurs sessions d'étude, collaborer en groupe et analyser leur productivité.

---

## 👥 Équipe

| Membre | Rôle | Branche |
|--------|------|---------|
| douae | Auth + Planification + Admin | feature/auth-planner |
| khadija  | Collaboration + Dashboard + Notifications | feature/collab-dashboard |

---

## 🚀 Fonctionnalités

### 🔐 Authentification
- Inscription / Connexion / Déconnexion
- Protection des routes (AuthGuard)
- Gestion des rôles : **Utilisateur** et **Administrateur**

### 📅 Planification intelligente
- Définir des matières avec priorités et objectifs hebdomadaires
- Indiquer ses disponibilités
- Génération automatique du planning  
- Contraintes : pas de chevauchement, priorités respectées, durée max par session

### 👥 Collaboration
- Créer des groupes d'étude
- Inviter des membres  
- Chat temps réel (Socket.io)
- Partager des sessions d'étude dans le groupe
- Consulter les sessions des membres du groupe
- Commenter les sessions partagées
- Participer ou refuser une session partagée

### 📊 Dashboard analytique
- Temps total étudié
- Progression par matière
- Comparaison sessions prévues vs réalisées
- Graphique de productivité hebdomadaire

### 🔔 Notifications
- Invitation à un groupe
- Nouveau participant à une session
- Rappel automatique 30 minutes avant une session
- Objectif hebdomadaire atteint

### ⚙️ Administration
- Visualiser les statistiques globales
- Gérer les utilisateurs (modifier rôle, supprimer)

---

## 🛠️ Technologies

### Frontend
| Technologie | Version |
|-------------|---------|
| Angular | 21 |
| TypeScript | 5.9 |
| Socket.io-client | latest |
| TailwindCSS | 4 |

### Backend
| Technologie | Version |
|-------------|---------|
| Node.js | 22 |
| Express.js | 4 |
| MongoDB | Atlas |
| Mongoose | 8 |
| Socket.io | 4 |
| JWT | 9 |
| bcryptjs | 2 |
| node-cron | 3 |

---

## 📁 Structure du projet

```
Study-planner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── availability.controller.js
│   │   │   ├── group.controller.js
│   │   │   ├── groupSession.controller.js
│   │   │   ├── message.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── stats.controller.js
│   │   │   ├── subject.controller.js
│   │   │   └── session.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Subject.js
│   │   │   ├── Session.js
│   │   │   ├── Group.js
│   │   │   ├── GroupSession.js
│   │   │   ├── Message.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── availability.routes.js
│   │   │   ├── group.routes.js
│   │   │   ├── groupSession.routes.js
│   │   │   ├── message.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── session.routes.js
│   │   │   ├── stats.routes.js
│   │   │   └── subject.routes.js
│   │   ├── services/
│   │   │   ├── goalCheck.service.js
│   │   │   ├── jwt.service.js
│   │   │   ├── planning.service.js
│   │   │   └── reminder.service.js
│   │   ├── socket/
│   │   │   └── socket.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    └── src/
        └── app/
            ├── core/
            │   ├── guards/
            │   │   ├── auth.guard.ts
            │   │   └── admin.guard.ts
            │   ├── interceptors/
            │   │   └── jwt.interceptor.ts
            │   ├── models/
            │   │   ├── admin.model.ts
            │   │   ├── availability.model.ts
            │   │   ├── group-session.model.ts
            │   │   ├── group.model.ts
            │   │   ├── message.model.ts
            │   │   ├── notification.model.ts
            │   │   ├── session.model.ts
            │   │   ├── stats.model.ts
            │   │   ├── subject.model.ts
            │   │   └── user.model.ts
            │   └── services/
            │       ├── admin.service.ts
            │       ├── auth.service.ts
            │       ├── availability.service.ts
            │       ├── group-session.service.ts
            │       ├── group.service.ts
            │       ├── message.service.ts
            │       ├── notification.service.ts
            │       ├── session.service.ts
            │       ├── socket.service.ts
            │       ├── stats.service.ts
            │       └── subject.service.ts
            ├── features/
            │   ├── auth/
            │   │   ├── login/
            │   │   └── register/
            │   ├── dashboard/
            │   ├── planning/
            │   │   └── auto-planning/
            │   ├── subjects/
            │   │   ├── subject-list/
            │   │   └── subject-form/
            │   ├── sessions/
            │   │   ├── session-list/
            │   │   └── session-form/
            │   ├── availability/
            │   │   └── availability-form/
            │   ├── collaboration/
            │   │   ├── group-list/
            │   │   ├── group-detail/
            │   │   ├── group-form/
            │   │   ├── chat-box/
            │   │   ├── session-share/
            │   │   └── session-card/
            │   ├── notifications/
            │   │   └── notification-list/
            │   └── admin/
            │       ├── user-list/
            │       ├── user-detail/
            │       ├── admin-form/
            │       └── global-stats/
            └── shared/
                ├── navbar/
                └── sidebar/
```

---

## ⚙️ Installation et lancement

### Prérequis
- Node.js v18+
- npm v9+
- Angular CLI v21
- Compte MongoDB Atlas

### 1. Cloner le projet

```bash
git clone https://github.com/Douaelahriki/Study-planner.git
cd Study-planner
```

### 2. Configurer le Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` dans `backend/` :

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@study-planner.wnrdjfu.mongodb.net/studyPlannerDB?retryWrites=true&w=majority&appName=study-planner
JWT_SECRET=study_planner_secret_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
NODE_ENV=development
```

### 3. Configurer le Frontend

```bash
cd ../frontend
npm install
```

### 4. Lancer le projet

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend :**
```bash
cd frontend
ng serve
```

### 5. Ouvrir dans le navigateur

```
http://localhost:4200
```

---

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@test.com | QSFGHJKLOIU |
| Utilisateur | lahrik@test.com | QSERGHJKUKJI|
| Utilisateur | douae@test.com | QSERGHJKUIKJI |

---

## 🌐 API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/auth/me | Profil connecté |
| PUT | /api/auth/me | Modifier profil |
| PUT | /api/auth/availability | Modifier disponibilités |

### Sujets
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/subjects | Mes matières |
| POST | /api/subjects | Créer une matière |
| PUT | /api/subjects/:id | Modifier une matière |
| DELETE | /api/subjects/:id | Supprimer une matière |

### Sessions
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/sessions | Mes sessions |
| POST | /api/sessions | Créer une session |
| PUT | /api/sessions/:id | Modifier une session |
| DELETE | /api/sessions/:id | Supprimer une session |
| PUT | /api/sessions/:id/complete | Marquer complétée |
| PUT | /api/sessions/:id/miss | Marquer manquée |
| GET | /api/sessions/stats | Statistiques sessions |
| POST | /api/sessions/generate | Générer planning auto |

### Disponibilités
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/availability | Mes disponibilités |
| PUT | /api/availability | Modifier disponibilités |

### Groupes
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/groups | Mes groupes |
| POST | /api/groups | Créer un groupe |
| GET | /api/groups/:id | Détail groupe |
| DELETE | /api/groups/:id | Supprimer groupe |
| POST | /api/groups/:id/invite | Inviter un membre |
| PUT | /api/groups/:id/respond | Accepter/Refuser invitation |
| GET | /api/groups/:id/messages | Messages du chat |
| POST | /api/groups/:id/messages | Envoyer un message |
| GET | /api/groups/:id/members-sessions | Sessions des membres |

### Sessions de groupe
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/group-sessions | Partager une session |
| GET | /api/group-sessions/group/:id | Sessions d'un groupe |
| PUT | /api/group-sessions/:id/respond | Participer/Refuser |
| POST | /api/group-sessions/:id/comments | Commenter |

### Stats
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/stats/summary | Résumé personnel |
| GET | /api/stats/by-subject | Stats par matière |
| GET | /api/stats/weekly | Productivité hebdo |
| GET | /api/stats/comparison | Prévu vs réalisé |

### Notifications
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/notifications | Mes notifications |
| PUT | /api/notifications/:id/read | Marquer lue |
| PUT | /api/notifications/read-all | Tout marquer lu |
| DELETE | /api/notifications/:id | Supprimer |

### Admin
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/admin/users | Tous les utilisateurs |
| GET | /api/admin/users/:id | Détail utilisateur |
| DELETE | /api/admin/users/:id | Supprimer utilisateur |
| PUT | /api/admin/users/:id/role | Changer rôle |
| GET | /api/admin/stats | Statistiques globales |

---

## 🔌 WebSocket Events (Socket.io)

| Événement | Direction | Description |
|-----------|-----------|-------------|
| join-group | Client → Serveur | Rejoindre un groupe |
| leave-group | Client → Serveur | Quitter un groupe |
| send-message | Client → Serveur | Envoyer un message |
| new-message | Serveur → Client | Nouveau message reçu |
| typing | Client → Serveur | Indicateur de frappe |
| user-typing | Serveur → Client | Utilisateur en train d'écrire |
| stop-typing | Client → Serveur | Arrêt de frappe |
| user-stop-typing | Serveur → Client | Utilisateur arrêté |

---

## 🧪 Tests

### Lancer les tests unitaires Frontend

```bash
cd frontend
ng test
```

### Lancer les tests Backend

```bash
cd backend
npm test
```

---

## 👨‍💻 Workflow Git

```
main
├── feature/auth-planner      ← douae(Auth, Planning, Admin)
└── feature/collab-dashboard  ← khadija (Collaboration, Dashboard, Notifications)
```

---

## 📋 Fonctionnalités implémentées

- [x] Inscription / Connexion / Déconnexion
- [x] Protection des routes avec Guards
- [x] Rôles Utilisateur / Administrateur
- [x] Gestion des matières et objectifs
- [x] Disponibilités hebdomadaires
- [x] Génération automatique du planning
- [x] Anti-chevauchement des sessions
- [x] Groupes d'étude
- [x] Invitation de membres
- [x] Chat temps réel (Socket.io)
- [x] Partage de sessions dans les groupes
- [x] Consultation des sessions des membres
- [x] Commentaires sur les sessions
- [x] Dashboard analytique avec graphiques
- [x] Notifications invitations groupes
- [x] Notifications nouveaux participants
- [x] Rappel automatique 30 min avant une session
- [x] Notification objectif hebdomadaire atteint
- [x] Gestion des utilisateurs (Admin)
- [x] Statistiques globales (Admin)

---

## 📄 Licence

Projet académique — 2025/2026