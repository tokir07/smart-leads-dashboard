# GigFlow — Smart Leads Dashboard 🚀

Welcome! This repository houses **GigFlow**, a production-grade, highly-aesthetic MERN stack Lead Management platform built with strict TypeScript from top to bottom. 

This project was built to solve a very real-world business challenge: providing a fast, secure, and intuitive pipeline tool for sales agents and managers to track and organize client interactions without clunky UI overhead.

---

## 💡 Architectural Decisions (Why I Built It This Way)

As a full-stack developer, I prioritized speed, security, and developer experience. Here are a few key design choices under the hood:

### 1. The Monorepo Layout
I chose a clean monorepo structure separating the `/backend` and `/frontend`. This keeps the API code independent of the client interface while letting both workspaces share strict TypeScript definitions seamlessly.

### 2. State Management: Zustand + React Query
Instead of bloating the client-side with a heavy state management tool like Redux, I split the state layer into two highly specialized modules:
* **Zustand** is used for light, persistent global UI states (handling user session profiles, JWT tokens, and light/dark mode choices).
* **React Query (TanStack)** manages all network caches, loading states, and automatic cache invalidations on mutations. When you create, update, or delete a lead, React Query invalidates the cache and updates the UI instantly.

### 3. Programmatic DNS Fallback (Node.js on Windows Fix)
If you've ever connected a local Node.js application to a MongoDB Atlas cluster, you might have run into the notorious `querySrv ECONNREFUSED` error. This is a common Windows/ISP issue where standard home routers fail to resolve SRV records (`mongodb+srv://`).
* **The Solution**: In `backend/src/server.ts`, I programmatically override the default resolver and set standard Google and Cloudflare DNS servers (`8.8.8.8` and `1.1.1.1`) inside the Node process. This ensures that the backend resolves your Atlas DB instantly, regardless of the user's local network settings!

### 4. Search Throttling with Custom Debounce Hook
Instead of flooding the server with network requests on every single keystroke in the search bar, I wrote a custom `useDebounce` hook in the client layer. It introduces a `400ms` delay, meaning the search request is only dispatched when the user actually pauses typing.

---

## 🔒 Gated Access Control (Who Sees What?)

Security is baked directly into the schema designs and Express controller queries:

* **Sales Agent**: Can register, log in, create leads, and update their own leads. The backend strictly gates search queries to return only the leads where `createdBy` matches the active agent's ID. Sales agents cannot delete records or export CSV data.
* **System Administrator**: Has top-level access. Can view all leads across all agents, update any client details, permanently delete records, and stream the entire client list as a raw CSV file.

---

## 📁 Repository Layout

```bash
smart-leads-dashboard/
├── backend/                  # TypeScript Node + Express API
│   ├── src/
│   │   ├── config/           # Database & env properties
│   │   ├── controllers/      # Route controllers (auth & leads CRUD)
│   │   ├── middlewares/      # RBAC, validator parsers, global error handler
│   │   ├── models/           # Mongoose schemas (User & Lead with TS types)
│   │   ├── routes/           # REST endpoints
│   │   ├── utils/            # JWT helpers and CSV streams
│   │   └── server.ts         # Server bootstrapper & DNS fallback config
│   ├── tsconfig.json         # Strict TS compilation settings
│   └── Dockerfile            # Multi-stage Express backend server image
│
├── frontend/                 # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/              # Axios global client and request interceptors
│   │   ├── components/
│   │   │   ├── layout/       # Sidebar, Navbar, ProtectedRoute gates
│   │   │   └── ui/           # Atomic components (Buttons, Modals, Toasts)
│   │   ├── context/          # Zustand global stores & Theme context
│   │   ├── hooks/            # useDebounce and useLeads query mutations
│   │   ├── pages/            # Login, Register, Dashboard, & Leads view
│   │   └── main.tsx          # Client bootstrapper
│   ├── tsconfig.json         # Strict bundler options
│   ├── nginx.conf            # Serve config redirecting virtual paths
│   └── Dockerfile            # Multi-stage React + Nginx image
│
├── docker-compose.yml        # Orchestration (Mongo + Node + Nginx)
└── README.md                 # Project roadmap
```

---

## 🚀 How to Launch the Project

Ensure you have your environment files ready before booting. The project includes an `.env.example` in the backend workspace showing the format.

### Option A: Local Development (Fastest Setup)

#### 1. Setup Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file matching [backend/.env.example](file:///c:/Desktop/Projects/Full%20Stack/smart-leads-dashboard/backend/.env.example):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=any_secure_signing_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### 2. Setup Frontend
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the client dev server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser!

---

### Option B: Docker Compose (All-in-One Container)
If you have Docker Desktop running locally, you can orchestrate the entire stack (including the database, backend, and static client web assets served through Nginx) in one command:

1. Navigate to the root folder:
   ```bash
   cd smart-leads-dashboard
   ```
2. Spin up the containers:
   ```bash
   docker compose up --build
   ```
3. Open your browser and access the app at **`http://localhost:3000`** (Nginx maps container port 80 to your host port 3000).

---

## 📡 REST API Reference

All requests and responses use JSON. Secure routes require a standard Bearer token in the headers: `Authorization: Bearer <token>`.

### Authentication
* `POST /api/auth/register` — Create a new profile. Body: `{ name, email, password, role: 'admin' | 'sales' }`.
* `POST /api/auth/login` — Sign in and get a JWT token. Body: `{ email, password }`.
* `GET /api/auth/me` — Fetch details of the active session.

### Lead CRUD (Protected)
* `GET /api/leads` — Query paginated, sorted, and filtered leads. *(Query params: `page`, `limit`, `status`, `source`, `search`, `sort`)*.
* `POST /api/leads` — Create a lead. Body: `{ name, email, status, source, notes }`.
* `GET /api/leads/:id` — View details of a single lead.
* `PUT /api/leads/:id` — Edit an existing lead.
* `DELETE /api/leads/:id` — Delete a lead *(Admin only)*.
* `GET /api/leads/export/csv` — Stream the list as a raw CSV file *(Admin only)*.

---

## 💎 Features Checklist

- [x] **Strict TypeScript Implementation**: 100% TS code coverage in both backend and frontend workspaces.
- [x] **Secure Auth Flow**: Password hashing using `bcrypt` (12 rounds) and robust JWT bearer parsing.
- [x] **Dynamic Compound Filters**: Filters status, source, search keywords, and sort values seamlessly in a single Mongoose query pipeline.
- [x] **Smart Client-side Debouncing**: Throttles keystrokes by 400ms to preserve server resources.
- [x] **Clean Pagination**: Strictly limited to 10 records per page, returning robust metadata.
- [x] **Streamed CSV Export**: High-performance CSV parsing stream, restricted to admin users.
- [x] **Theme Switcher**: Stored dark/light mode context.
- [x] **Docker Integration**: Ready-to-go `docker-compose.yml` linking Mongo, Node, and Nginx.
