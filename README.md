# 🚀 DevPath AI

AI-powered developer learning platform.

DevPath AI is a full-stack learning platform inspired by the idea of developer roadmaps. It helps developers understand what to learn, track their progress, assess their skills, and eventually receive personalized AI-powered guidance.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- FastAPI
- Python
- Pydantic
- Beanie

### Database

- MongoDB
- MongoDB Atlas

### AI

- LangGraph
- Groq
- RAG
- MongoDB Vector Search

### Infrastructure

- Redis
- Docker
- Background Workers
- WebSockets

---

# 📈 Current Progress

## Day 1 — Project Foundation

- [x] Project initialized
- [x] FastAPI backend
- [x] React frontend
- [x] Health API
- [x] Frontend ↔ Backend connection
- [x] CORS configuration
- [x] Initial project structure
- [x] GitHub repository setup

## Day 2 — Database & Backend Architecture

- [x] MongoDB running with Docker
- [x] MongoDB connection
- [x] Beanie integration
- [x] Database initialization
- [x] Configuration management with `.env`
- [x] User model
- [x] User schemas
- [x] Repository layer
- [x] Service layer
- [x] User API routes
- [x] Create user API
- [x] Get users API
- [x] Frontend → Backend → MongoDB integration
- [x] Display users on frontend

## Day 3 — Roadmap System

- [x] Roadmap model
- [x] Nested topic structure
- [x] Roadmap schemas
- [x] Roadmap repository
- [x] Roadmap service
- [x] Roadmap API
- [x] Roadmap seed script
- [x] Backend Development roadmap
- [x] Roadmap API testing
- [x] React roadmap API integration
- [x] Interactive roadmap UI
- [x] Expandable roadmap topics

---

# 🗺️ Project Roadmap

### Foundation

- [x] Project setup
- [x] FastAPI backend
- [x] React frontend
- [x] MongoDB integration
- [x] Backend layered architecture

### Core Platform

- [x] Roadmap system
- [x] Topic system
- [ ] Resource system
- [x] Interactive roadmap UI
- [ ] Progress tracking
- [ ] User dashboard

### Authentication

- [ ] User registration
- [ ] User login
- [ ] JWT authentication
- [ ] Refresh tokens
- [ ] Password hashing
- [ ] Protected routes
- [ ] Authorization

### Learning System

- [ ] Quiz system
- [ ] Quiz attempts
- [ ] Score tracking
- [ ] Skill assessment
- [ ] Learning history
- [ ] Personalized progress

### AI Layer

- [ ] AI Mentor
- [ ] AI-powered explanations
- [ ] AI Roadmap Generator
- [ ] Skill-gap analysis
- [ ] AI Project Generator
- [ ] AI Code Review
- [ ] LangGraph workflows

### RAG

- [ ] Learning resource ingestion
- [ ] Embeddings
- [ ] Vector search
- [ ] MongoDB Vector Search
- [ ] Retrieval pipeline
- [ ] Context-aware AI responses
- [ ] Source citations

### Infrastructure

- [ ] Redis integration
- [ ] Caching
- [ ] Background workers
- [ ] Async AI jobs
- [ ] WebSockets
- [ ] Rate limiting

### Production

- [ ] Unit testing
- [ ] Integration testing
- [ ] Logging
- [ ] Error handling
- [ ] Dockerize application
- [ ] CI/CD
- [ ] Deployment
- [ ] Monitoring

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │     React UI     │
                         │      Vite        │
                         └────────┬─────────┘
                                  │
                                  │ HTTP / REST
                                  ▼
                         ┌──────────────────┐
                         │     FastAPI      │
                         │       API        │
                         └────────┬─────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │   Services   │  │ Repository   │  │   AI Layer   │
        │    Layer     │  │    Layer     │  │   LangGraph  │
        └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
               │                 │                 │
               └─────────────────┼─────────────────┘
                                 │
                                 ▼
                         ┌──────────────────┐
                         │     MongoDB      │
                         │  Primary Store   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ MongoDB Vector   │
                         │     Search       │
                         └──────────────────┘


                         ┌──────────────────┐
                         │      Redis       │
                         │ Cache / Queue    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Background       │
                         │ Workers          │
                         └──────────────────┘