# 🛡️ HessProtector

**HessProtector** est une application web moderne pour gérer ses finances, son frigo et sa nutrition, propulsée par l'Intelligence Artificielle (Gemini).

## 🚀 Fonctionnalités
- 💰 **Budget & Charges Fixes** : Suivi du "Reste à Vivre" par jour.
- 🥘 **Frigo & Recettes** : Scan de tickets de caisse par IA et suggestions de recettes.
- 🤖 **Coach Cuisine** : Génération de menus adaptés au budget.
- 📈 **Gamification** : Gagnez de l'XP en économisant (Rank "La Hess" -> "Rentier").
- 🌗 **Design Premium** : Mode Sombre/Clair, animations fluides.

## 🛠️ Stack Technique
- **Frontend** : Next.js 16, TypeScript, TailwindCSS, Framer Motion.
- **Backend** : FastAPI (Python), SQLite, Google Gemini AI.
- **DevOps** : Docker, Docker Compose, Makefile.

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-user/hess-protector.git
   cd hess-protector
   ```

2. **Configuration**
   Définissez votre clé API Gemini dans le backend :
   ```bash
   cd backend
   cp .env.example .env
   # Editez .env et ajoutez votre GEMINI_API_KEY
   cd ..
   ```

3. **Lancer l'application (Docker)**
   ```bash
   make dev
   ```
   L'application sera accessible sur :
   - Frontend : [http://localhost:3000](http://localhost:3000)
   - Backend API : [http://localhost:8000/docs](http://localhost:8000/docs)

## 🧹 Commandes Utiles
- `make dev` : Lance tout.
- `make build` : Re-construit les images Docker.
- `make down` : Stoppe les conteneurs.

