# System Architecture - Event Planning Web Application

## 📐 Architecture Overview

The Event Planning Web Application follows a **three-tier architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│              (React Frontend - Port 5173)                    │
└─────────────────────────────────────────────────────────────┘
                              ↕ 
                         HTTP/REST API
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│         (Node.js/Express Backend - Port 5000)                │
└─────────────────────────────────────────────────────────────┘
                              ↕
                        Mongoose ODM
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│              (MongoDB Database - Port 27017)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ High-Level Architecture Diagram

```mermaid
graph TB
    Client[User Browser]
    subgraph "Frontend - React SPA"
        Router[React Router]
        Auth[Auth Context]
        Components[UI Components]
        API[Axios API Client]
    end
    
    subgraph "Backend - Node.js/Express"
        Server[Express Server]
        AuthM[Auth Middleware]
        UploadM[Upload Middleware]
        Routes[API Routes]
        Controllers[Route Handlers]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB Database)]
        FS[File System - Uploads]
    end
    
    subgraph "External Services"
        GMaps[Google Maps API]
        JWT[JWT Tokens]
    end
    
    Client --> Router
    Router --> Auth
    Auth --> Components
    Components --> API
    API --> Server
    Server --> AuthM
    AuthM --> Routes
    Routes --> Controllers
    Controllers --> MongoDB
    Controllers --> FS
    Components --> GMaps
    Auth --> JWT
```

---

## 🎯 Technology Stack

### Frontend Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 18.x | UI library for component-based architecture |
| **Build Tool** | Vite | 5.x | Fast development server and bundler |
| **Routing** | React Router | 6.x | Client-side navigation and routing |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS framework |
| **HTTP Client** | Axios | 1.x | Promise-based HTTP requests |
| **Maps** | @react-google-maps/api | 2.x | Google Maps integration |
| **Icons** | React Icons | 5.x | Icon library |
| **State Management** | Context API | Built-in | Global authentication state |

### Backend Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 14+ | JavaScript runtime environment |
| **Framework** | Express.js | 4.x | Web application framework |
| **Database** | MongoDB | 5.x+ | NoSQL document database |
| **ODM** | Mongoose | 8.x | MongoDB object modeling |
| **Authentication** | JWT | 9.x | Token-based authentication |
| **Password Hashing** | bcrypt.js | 2.x | Secure password encryption |
| **File Upload** | Multer | 1.4.x | Multipart form data handling |
| **Validation** | express-validator | 7.x | Input validation middleware |
| **CORS** | cors | 2.x | Cross-origin resource sharing |

---

## 🔄 System Components Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        Pages[Pages Layer]
        Comp[Components Layer]
        Context[Context Layer]
        Utils[Utils Layer]
    end
    
    subgraph "Backend Components"
        Routes[Routes Layer]
        Middleware[Middleware Layer]
        Models[Models Layer]
        Config[Config Layer]
    end
    
    Pages --> Comp
    Pages --> Context
    Comp --> Utils
    Utils --> Routes
    Routes --> Middleware
    Middleware --> Models
    Models --> Config
```

### Frontend Component Hierarchy

```
App.jsx (Root)
├── AuthProvider (Context)
│   ├── Navbar (Layout)
│   ├── Routes
│   │   ├── Public Routes
│   │   │   ├── Home
│   │   │   ├── Events
│   │   │   ├── EventDetail
│   │   │   ├── Login
│   │   │   └── Signup
│   │   └── Protected Routes
│   │       ├── UserDashboard
│   │       ├── AdminDashboard (Admin Only)
│   │       └── AdminEvents (Admin Only)
│   └── Footer (Layout)
└── Shared Components
    ├── EventCard
    ├── ProtectedRoute
    └── Loader
```

---

## 🗄️ Database Schema & Relationships

```mermaid
erDiagram
    USER ||--o{ REGISTRATION : "registers for"
    EVENT ||--o{ REGISTRATION : "has"
    USER ||--o{ EVENT : "creates (admin)"
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum role
        string phone
        date createdAt
    }
    
    EVENT {
        ObjectId _id PK
        string title
        string description
        date date
        string time
        enum category
        string venue
        object location
        string image
        number capacity
        ObjectId createdBy FK
        date createdAt
    }
    
    REGISTRATION {
        ObjectId _id PK
        ObjectId user FK
        ObjectId event FK
        date registeredAt
    }
```

### Database Collections

**Users Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin']),
  phone: String (optional),
  createdAt: Date
}
```

**Events Collection**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  date: Date (required),
  time: String (required),
  category: String (enum),
  venue: String (required),
  location: {
    lat: Number (required),
    lng: Number (required),
    address: String (optional)
  },
  image: String (filename),
  capacity: Number,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

**Registrations Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  event: ObjectId (ref: Event, required),
  registeredAt: Date
}
// Compound index: {user: 1, event: 1} - unique
```

---

## 🔐 Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB
    participant JWT
    
    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>MongoDB: Find user by email
    MongoDB-->>Backend: User data + hashed password
    Backend->>Backend: Compare password (bcrypt)
    Backend->>JWT: Generate token
    JWT-->>Backend: Signed JWT token
    Backend-->>Frontend: {user, token}
    Frontend->>Frontend: Store in localStorage
    Frontend->>Frontend: Update AuthContext
    
    Note over Frontend,Backend: Subsequent Requests
    
    Frontend->>Backend: API Request + Authorization Header
    Backend->>Backend: Verify JWT token
    Backend->>Backend: Check user role
    Backend->>MongoDB: Execute query
    MongoDB-->>Backend: Response data
    Backend-->>Frontend: API Response
```

### JWT Token Structure
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: userId, iat: timestamp, exp: timestamp }
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), SECRET)
```

---

## 📡 API Architecture & Endpoints

### API Routes Structure

```
/api
├── /auth
│   ├── POST   /signup          - Register new user
│   ├── POST   /login           - Authenticate user
│   ├── GET    /me              - Get current user (protected)
│   └── PUT    /profile         - Update profile (protected)
│
├── /events
│   ├── GET    /                - Get all events (public)
│   ├── GET    /stats           - Get statistics (admin)
│   ├── GET    /:id             - Get single event (public)
│   ├── POST   /                - Create event (admin + upload)
│   ├── PUT    /:id             - Update event (admin)
│   └── DELETE /:id             - Delete event (admin)
│
└── /registrations
    ├── POST   /                - Register for event (protected)
    ├── GET    /user            - Get user registrations (protected)
    ├── GET    /event/:eventId  - Get event registrations (admin)
    ├── GET    /check/:eventId  - Check registration status (protected)
    └── DELETE /:id             - Cancel registration (protected)
```

### Request/Response Flow

```mermaid
sequenceDiagram
    participant Client
    participant Axios
    participant Express
    participant Middleware
    participant Controller
    participant Database
    
    Client->>Axios: API Call
    Axios->>Axios: Add JWT to headers
    Axios->>Express: HTTP Request
    Express->>Middleware: Auth Verification
    Middleware->>Middleware: Verify JWT
    Middleware->>Controller: Next()
    Controller->>Database: Query
    Database-->>Controller: Result
    Controller-->>Express: JSON Response
    Express-->>Axios: HTTP Response
    Axios-->>Client: Data
```

---

## 🔒 Security Architecture

### Security Layers

```mermaid
graph TD
    A[Client Request] --> B{CORS Check}
    B -->|Pass| C{JWT Verification}
    B -->|Fail| Z[403 Forbidden]
    C -->|Valid| D{Role Check}
    C -->|Invalid| Y[401 Unauthorized]
    D -->|Authorized| E[Route Handler]
    D -->|Unauthorized| X[403 Forbidden]
    E --> F{Input Validation}
    F -->|Valid| G[Database Operation]
    F -->|Invalid| W[400 Bad Request]
    G --> H[Response]
```

### Security Measures Implemented

| Layer | Security Feature | Implementation |
|-------|-----------------|----------------|
| **Transport** | HTTPS/TLS | Recommended in production |
| **CORS** | Origin validation | Configured in server.js |
| **Authentication** | JWT tokens | 30-day expiry, signed tokens |
| **Password** | Hashing | bcrypt with 10 salt rounds |
| **Authorization** | Role-based access | Middleware checks user.role |
| **Input Validation** | express-validator | Validates all user inputs |
| **File Upload** | Type & size limits | Multer filters (images only, 5MB max) |
| **Database** | Mongoose validation | Schema-level validation |
| **XSS Protection** | React escaping | Automatic by React |
| **SQL Injection** | N/A | NoSQL (MongoDB) |

---

## 📂 File Upload Architecture

```mermaid
graph LR
    Client[Browser Form] -->|multipart/form-data| Multer[Multer Middleware]
    Multer -->|Validate| Check{File Type?}
    Check -->|Image| Disk[Save to /uploads]
    Check -->|Other| Reject[400 Error]
    Disk --> DB[Store filename in MongoDB]
    DB --> Serve[Static File Serving]
    Serve --> Browser[Display Image]
```

### Upload Configuration
- **Storage**: Disk storage in `/backend/uploads/`
- **Naming**: `event-{timestamp}-{random}.{ext}`
- **Allowed Types**: jpg, jpeg, png, gif, webp
- **Max Size**: 5MB
- **Access**: Static files served via Express

---

## 🌍 Google Maps Integration

```mermaid
graph LR
    Event[Event Detail Page] --> Load[Load Google Maps SDK]
    Load --> Init[Initialize Map]
    Init --> Center[Center at event coordinates]
    Center --> Marker[Add Marker]
    Marker --> Link[Generate Directions Link]
```

### Maps Implementation
- **SDK**: @react-google-maps/api
- **API Key**: Stored in environment variable
- **Features**: 
  - Interactive map display
  - Location marker
  - "Get Directions" link to Google Maps
  - Customizable zoom level (15)

---

## 🚀 Deployment Architecture (Recommended)

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer / Nginx]
        
        subgraph "Frontend"
            Static[Static Host - Vercel/Netlify]
        end
        
        subgraph "Backend"
            API1[Node.js Instance 1]
            API2[Node.js Instance 2]
        end
        
        subgraph "Database"
            Mongo[(MongoDB Atlas Cluster)]
        end
        
        subgraph "Storage"
            S3[AWS S3 / Cloudinary]
        end
    end
    
    Users[Users] --> LB
    LB --> Static
    Static --> API1
    Static --> API2
    API1 --> Mongo
    API2 --> Mongo
    API1 --> S3
    API2 --> S3
```

### Deployment Options

**Frontend Deployment:**
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Backend Deployment:**
- Heroku
- Railway
- Render
- AWS EC2 / EB
- DigitalOcean

**Database:**
- MongoDB Atlas (Recommended)
- Local MongoDB (Development)

**File Storage:**
- AWS S3
- Cloudinary
- Azure Blob Storage

---

## 📊 Data Flow Diagram

### User Registration Flow
```mermaid
sequenceDiagram
    User->>Frontend: Fill registration form
    Frontend->>Frontend: Client-side validation
    Frontend->>Backend: POST /api/auth/signup
    Backend->>Validator: Validate input
    Backend->>Database: Check email exists
    Database-->>Backend: Email available
    Backend->>Bcrypt: Hash password
    Backend->>Database: Create user document
    Database-->>Backend: New user created
    Backend->>JWT: Generate token
    Backend-->>Frontend: {user, token}
    Frontend->>LocalStorage: Store token
    Frontend->>AuthContext: Update user state
    Frontend->>Router: Navigate to home
```

### Event Registration Flow
```mermaid
sequenceDiagram
    User->>Frontend: Click "Register" button
    Frontend->>Backend: POST /api/registrations
    Backend->>Auth: Verify JWT token
    Backend->>Database: Check event exists
    Backend->>Database: Check duplicate registration
    Database-->>Backend: No duplicate found
    Backend->>Database: Create registration
    Database-->>Backend: Registration created
    Backend-->>Frontend: Success response
    Frontend->>UI: Show success message
    Frontend->>UI: Update button state
```

---

## 🔄 State Management Architecture

### Frontend State Flow

```mermaid
graph TD
    A[User Action] --> B[Component Event Handler]
    B --> C{Need API?}
    C -->|Yes| D[Axios API Call]
    C -->|No| E[Update Local State]
    D --> F[Backend Processing]
    F --> G[Response]
    G --> H{Success?}
    H -->|Yes| I[Update State]
    H -->|No| J[Show Error]
    I --> K[Re-render Component]
    E --> K
```

### Global State (AuthContext)
- **User**: Current logged-in user data
- **Token**: JWT authentication token
- **isAuthenticated**: Boolean authentication status
- **isAdmin**: Boolean admin role check
- **Functions**: login(), signup(), logout(), updateUserProfile()

### Local State
- Component-specific state using `useState`
- Form data, loading states, error messages
- UI state (modals, dropdowns, etc.)

---

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: React.lazy() for route-based splitting
- **Lazy Loading**: Images loaded on demand
- **Caching**: Axios response caching
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search input debouncing

### Backend Optimizations
- **Database Indexing**: Compound index on registrations
- **Query Optimization**: Lean queries, field selection
- **Caching**: In-memory caching for static data
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevent API abuse

---

## 🎯 Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: JWT tokens enable horizontal scaling
- **Database Replication**: MongoDB replica sets
- **Load Balancing**: Distribute requests across instances
- **CDN**: Static assets via CDN

### Vertical Scaling
- **Database**: Increase MongoDB resources
- **Server**: Increase Node.js memory/CPU
- **File Storage**: Move to cloud storage (S3)

---

## 📝 Summary

This Event Planning Web Application implements a **modern, scalable, and secure architecture** with:

✅ **Three-tier separation**: Frontend, Backend, Database  
✅ **RESTful API design**: Clear endpoint structure  
✅ **JWT authentication**: Stateless, scalable auth  
✅ **Role-based authorization**: Admin and user roles  
✅ **Document database**: Flexible MongoDB schema  
✅ **Modern frontend**: React with hooks and context  
✅ **Security best practices**: Password hashing, input validation, CORS  
✅ **File upload system**: Multer with validation  
✅ **External API integration**: Google Maps  
✅ **Responsive design**: Mobile-first approach  

---

**Architecture Version**: 1.0  
**Last Updated**: December 2024  
**Technology Stack**: MERN (MongoDB, Express, React, Node.js)
