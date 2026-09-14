# Swathi's Portfolio & CMS Website (Node.js + Java Dual Backend)

A modern full-stack developer portfolio and dynamic Content Management System (CMS) featuring luxury editorial styling, animated interactions, and dual backend implementations (**Node.js / Express** and **Java / Spring Boot**).

---

## 🌟 Highlights & Features

- **Luxury Typography & Aesthetics**: Dark forest green & warm cream aesthetic (`DM Serif Display` & `Inter`).
- **Dynamic Content Management (CMS)**: Manage Profile, Skills, Projects, and Password via `/admin` and `/dashboard`.
- **Dual Backend Architecture**:
  - **Node.js (Express + EJS + SQLite/MySQL)**: Immediate zero-config runnable full-stack application.
  - **Java (Spring Boot 3 + JPA + H2/MySQL)**: Enterprise REST API with Spring Data repositories and data seeding.
- **Responsive Animations**: Intersection observer scroll reveal, dynamic navbar blur, active nav spy, and mobile drawer.
- **Ready for Instant Hosting**: Configured for Render, Railway, Vercel, and local execution.

---

## 🚀 Quick Start (Node.js Live Application)

### 1. Start Node.js Application
```bash
cd node-backend
npm install
npm start
```

### 2. Access the Application
- **Live Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **REST API**: [http://localhost:3000/api/portfolio](http://localhost:3000/api/portfolio)

### Default Admin Credentials:
- **Username**: `swathi`
- **Password**: `1234`

---

## ☕ Java Spring Boot Backend

### 1. Build and Run
```bash
cd java-backend
./mvnw spring-boot:run
# or if maven is installed:
mvn spring-boot:run
```

### 2. Endpoints
- **Base URL**: `http://localhost:8080/api`
- **Portfolio Data**: `GET /api/portfolio`
- **Skills API**: `GET /api/skills`, `POST /api/admin/skills`, `DELETE /api/admin/skills/{id}`
- **Projects API**: `GET /api/projects`, `POST /api/admin/projects`, `DELETE /api/admin/projects/{id}`
- **H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:portfoliodb`)

---

## 🌐 Deploying to the Web (Free & Easy)

### Option A: Render (Recommended for Full-Stack Node.js)
1. Push this repository to GitHub.
2. Go to [render.com](https://render.com) and create a new **Web Service**.
3. Set the Root Directory to `node-backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`

### Option B: Railway
1. Open [railway.app](https://railway.app) and click **New Project** -> **Deploy from GitHub repo**.
2. Set root directory to `node-backend`.
3. Railway automatically detects `npm start` and provisions a live HTTPS URL.
