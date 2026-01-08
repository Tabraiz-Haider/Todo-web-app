name: todo-webapp
version: 2.0
description: >
  A full-stack Todo web application with user authentication and persistent storage.
  Users can register, log in, and manage their tasks through a responsive frontend.

author: Tabraiz Haider
language: Python (backend), TypeScript (frontend)
interface: Web (Next.js + FastAPI)

stack:
  frontend: Next.js (React)
  backend: FastAPI (Python)
  database: Neon PostgreSQL
  auth: JWT-based authentication
  deployment: Optional (for later phases)

features:
  - User registration & login
  - Secure JWT authentication
  - Add, update, delete tasks
  - Mark tasks as completed
  - Tasks saved in PostgreSQL DB
  - Each task linked to a user
  - Responsive frontend UI
  - Error handling & loading states

frontend_pages:
  - /register → Register form
  - /login → Login form
  - /dashboard → Todo list, Add/Edit/Delete UI
  - /logout → Log user out

backend_routes:
  - POST /register → Create new user
  - POST /login → Authenticate user, return JWT
  - GET /tasks → Get all tasks (for logged-in user)
  - POST /tasks → Add new task
  - PUT /tasks/{id} → Update task
- DELETE /tasks/{id} → Delete task
  - PATCH /tasks/{id}/complete → Mark as completed

task_model:
  - id: integer (auto)
  - user_id: foreign key
  - title: string
  - description: string (optional)
  - is_completed: boolean
  - created_at: datetime
  - updated_at: datetime

notes:
  - Use Neon DB for persistent PostgreSQL storage
  - All API routes require valid JWT except register/login
  - Frontend must store token in localStorage or HTTP-only
   cookies
  - Use Axios or fetch in Next.js for API calls
  - Phase 2 must be fully functional locally

