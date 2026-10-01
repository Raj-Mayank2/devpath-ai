# 🚀 DevPath AI

> AI-powered developer learning platform for structured learning, skill tracking, assessment, and personalized AI guidance.

DevPath AI is a full-stack developer learning platform inspired by the concept of developer roadmaps.

The goal is to help developers:

- 🗺️ Follow structured learning paths
- 📚 Discover learning resources
- ✅ Track topic completion
- 📊 Monitor learning progress
- 🧠 Assess their technical skills
- 🤖 Get personalized AI-powered guidance
- 🎯 Identify skill gaps
- 🚀 Generate personalized learning paths

The project is being built incrementally from a traditional full-stack application into an AI-powered learning platform.

---

# ✨ Current Features

### 🗺️ Interactive Roadmaps

- Structured learning roadmaps
- Nested topics
- React Flow based roadmap visualization
- Custom roadmap nodes
- Connected topic paths
- Topic completion states
- Roadmap selector
- Responsive roadmap layout
- Natural scrolling for large roadmaps

### 📚 Learning Resources

- Resources associated with individual topics
- Documentation
- Articles
- Videos
- External learning links
- Resource detail panel

### ✅ Progress Tracking

- Mark topics as complete
- Mark topics as incomplete
- Persistent progress
- Roadmap completion percentage
- Overall learning progress
- Progress synchronization with dashboard

### 🔐 Authentication

- User registration
- User login
- JWT authentication
- Protected API routes
- Argon2 password hashing
- Current-user endpoint
- Token-based frontend authentication

### 📊 Dashboard

- Overall learning progress
- Total roadmaps
- Total topics
- Completed topics
- Roadmap-specific progress
- Progress visualization
- Continue/Open roadmap actions

### 🎨 UI/UX

- React + Vite
- Tailwind CSS
- Lucide icons
- Motion animations
- Responsive design
- Interactive roadmap visualization
- Topic detail panel
- Loading states
- Empty states
- Error states

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Flow
- Lucide React
- Motion

## Backend

- FastAPI
- Python
- Pydantic
- Pydantic Settings
- Beanie
- PyMongo Async

## Database

- MongoDB
- MongoDB Atlas
- MongoDB Vector Search *(planned)*

## Authentication

- JWT
- Argon2
- python-jose

## AI

- LangGraph
- Groq
- RAG
- Embeddings
- MongoDB Vector Search *(planned)*

## Infrastructure

- Docker
- Redis *(planned)*
- Background Workers *(planned)*
- WebSockets *(planned)*

---

# 📈 Development Progress

The project is being developed using incremental development days.

---

## Day 1 — Project Foundation

- [x] Project initialized
- [x] FastAPI backend
- [x] React frontend
- [x] Vite configuration
- [x] Health API
- [x] Frontend ↔ Backend connection
- [x] CORS configuration
- [x] Initial project structure
- [x] GitHub repository setup

---

## Day 2 — Database & Backend Architecture

- [x] MongoDB running with Docker
- [x] MongoDB connection
- [x] Beanie integration
- [x] PyMongo async client
- [x] Database initialization
- [x] Environment configuration
- [x] `.env` support
- [x] User model
- [x] User schemas
- [x] Repository layer
- [x] Service layer
- [x] User API routes
- [x] Create user API
- [x] Get users API
- [x] Frontend → Backend → MongoDB integration

---

## Day 3 — Roadmap System

- [x] Roadmap model
- [x] Nested topic structure
- [x] Recursive topics
- [x] Roadmap schemas
- [x] Roadmap repository
- [x] Roadmap service
- [x] Roadmap API
- [x] Roadmap seed script
- [x] Backend Development roadmap
- [x] Roadmap API testing
- [x] React roadmap integration
- [x] Expandable roadmap topics

---

## Day 4 — Progress Tracking

- [x] Progress model
- [x] Progress schemas
- [x] Progress repository
- [x] Progress service
- [x] Progress API
- [x] Create progress record
- [x] Toggle topic completion
- [x] Load saved progress
- [x] Mark topics complete from React
- [x] Persist progress in MongoDB
- [x] Roadmap completion percentage
- [x] Progress visualization

---

## Day 5 — Learning Resources

- [x] Resource model
- [x] Resource schemas
- [x] Resource repository
- [x] Resource service
- [x] Resource API
- [x] Create resource API
- [x] Get resources API
- [x] Get resources by topic
- [x] Resource seed data
- [x] Frontend resource integration
- [x] Topic resource panel
- [x] External resource links

---

## Day 6 — Authentication

- [x] User registration
- [x] User login
- [x] JWT access tokens
- [x] JWT configuration
- [x] Password hashing
- [x] Argon2 password hashing
- [x] Password verification
- [x] Protected routes
- [x] Authentication dependencies
- [x] Current user endpoint
- [x] Frontend authentication state
- [x] Login UI
- [x] Registration UI
- [x] Logout
- [x] Authenticated progress tracking

---

## Day 7 — Dashboard & Analytics

- [x] Dashboard API
- [x] Dashboard statistics
- [x] Total roadmap calculation
- [x] Total topic calculation
- [x] Completed topic calculation
- [x] Overall progress calculation
- [x] Roadmap-specific progress
- [x] Dashboard frontend
- [x] Progress cards
- [x] Progress visualization
- [x] Continue/Open roadmap actions

---

# 🎨 Day 7.5 — UI/UX Overhaul

The functional MVP was upgraded into a polished interactive learning platform.

### Design System

- [x] Tailwind CSS
- [x] Lucide icons
- [x] Motion animations
- [x] Responsive layouts
- [x] Loading states
- [x] Empty states
- [x] Error states

### Navigation

- [x] Redesigned navbar
- [x] Dashboard navigation
- [x] Roadmap navigation
- [x] User profile section
- [x] Responsive mobile navigation
- [x] Logout interaction

### Dashboard

- [x] Dashboard redesign
- [x] Current learning path
- [x] Progress ring
- [x] Learning statistics
- [x] Roadmap progress cards
- [x] Start / Continue / Review actions
- [x] Dashboard → roadmap navigation

### Roadmap Experience

- [x] React Flow integration
- [x] Custom roadmap nodes
- [x] Connected roadmap edges
- [x] Root topic nodes
- [x] Child topic nodes
- [x] Completed topic states
- [x] Roadmap selector
- [x] Fixed readable node sizes
- [x] Natural roadmap scrolling
- [x] No unnecessary zoom controls
- [x] Responsive roadmap layout

### Topic Experience

- [x] Topic detail panel
- [x] Topic description
- [x] Completion status
- [x] Mark as complete
- [x] Mark as incomplete
- [x] Learning resources
- [x] Resource type indicators
- [x] External resource links
- [x] Mobile backdrop
- [x] Escape-to-close
- [x] Responsive panel

---

# 🗺️ Project Roadmap

## Foundation

- [x] Project setup
- [x] FastAPI backend
- [x] React frontend
- [x] MongoDB integration
- [x] Backend layered architecture
- [x] Environment configuration

---

## Core Platform

- [x] Roadmap system
- [x] Topic system
- [x] Resource system
- [x] Interactive roadmap UI
- [x] Progress tracking
- [x] User dashboard
- [x] Topic detail panel
- [x] Roadmap selector

---

## Authentication

- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] Password hashing
- [x] Protected routes
- [x] Current user endpoint
- [ ] Refresh tokens
- [ ] Role-based authorization
- [ ] Advanced authorization

---

## Learning System

- [ ] Quiz system
- [ ] Question bank
- [ ] Quiz attempts
- [ ] Score tracking
- [ ] Skill assessment
- [ ] Topic-level assessment
- [ ] Learning history
- [ ] Personalized progress
- [ ] Skill level tracking

---

## AI Layer

- [ ] AI Mentor
- [ ] AI-powered explanations
- [ ] AI Roadmap Generator
- [ ] Skill-gap analysis
- [ ] AI Project Generator
- [ ] AI Code Review
- [ ] Personalized learning recommendations
- [ ] LangGraph workflows
- [ ] Multi-step AI agents

---

## RAG

- [ ] Learning resource ingestion
- [ ] Document processing
- [ ] Text chunking
- [ ] Embeddings
- [ ] Vector storage
- [ ] MongoDB Vector Search
- [ ] Retrieval pipeline
- [ ] Context-aware AI responses
- [ ] Source citations
- [ ] RAG evaluation

---

## Infrastructure

- [ ] Redis integration
- [ ] Caching
- [ ] Background workers
- [ ] Async AI jobs
- [ ] Job queue
- [ ] WebSockets
- [ ] Rate limiting
- [ ] API performance optimization

---

## Testing & Production

- [ ] Unit testing
- [ ] API testing
- [ ] Integration testing
- [ ] Frontend testing
- [ ] Logging
- [ ] Centralized error handling
- [ ] Dockerize application
- [ ] Docker Compose
- [ ] CI/CD
- [ ] Deployment
- [ ] Monitoring
- [ ] Production configuration

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      React UI       │
                         │        Vite         │
                         │    Tailwind CSS     │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / REST
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │        API          │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │   Services   │      │ Repository   │      │  AI Layer    │
       │    Layer     │      │    Layer     │      │  LangGraph   │
       └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      MongoDB        │
                         │   Primary Store     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ MongoDB Vector      │
                         │      Search         │
                         │      (Planned)      │
                         └─────────────────────┘


              ┌─────────────────────┐
              │       Redis         │
              │    Cache / Queue    │
              │      (Planned)      │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Background Workers  │
              │      (Planned)      │
              └─────────────────────┘