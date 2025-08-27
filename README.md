# Product Catalog Backend (Nest.js)

A RESTful API backend for managing products with JWT authentication, built with **Nest.js**, **TypeORM**, and **PostgreSQL**.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Protected routes for product management
  - Password hashing with bcrypt

- **Product Management**
  - Create, read, and delete products
  - Input validation and sanitization
  - UUID-based primary keys
  - Optional product descriptions

- **Database Integration**
  - PostgreSQL database with TypeORM
  - Database migrations and seeding
  - Dockerized database setup

- **API Features**
  - RESTful API design
  - Comprehensive error handling
  - Input validation with class-validator
  - CORS enabled for frontend integration

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SmitBhamwala/kitchen365-server.git
cd kitchen365-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory.
Example env file:

```env
PORT=8000
NODE_ENV=development
CLIENT_URL=https://kitchen365-client.vercel.app/

# JWT Configuration
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
JWT_ISSUER=kitchen365
JWT_AUDIENCE=kitchen365-users

# Database configuration
POSTGRES_HOST=localhost
POSTGRES_DB=kitchen365-products
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
POSTGRES_AUTH_METHOD=md5
POSTGRES_LOGGING=true
POSTGRES_SYNC=true # set to false for prod; use migrations

# pgAdmin Configuration
PGADMIN_EMAIL=admin@kitchen365.com
PGADMIN_PASSWORD=secure_pgadmin_password_change_me
PGADMIN_PORT=8080
```

### 4. Database Setup with Docker

Start PostgreSQL database:

```bash
# Start database container
docker-compose --env-file .env up -d

# Verify database is running
docker-compose ps
```

### 6. Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:8000`

## 🔗 API Routes

### Base URL: `http://localhost:8000`

### Authentication Endpoints

#### **POST** `/auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  },
  "token": "jwt-token-here"
}
```

**Status Codes:**

- `201 Created` - User successfully registered
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists

---

#### **POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  },
  "token": "jwt-token-here"
}
```

---

### Product Endpoints

#### **GET** `/products`

Retrieve all products (public endpoint).

**Response:**

```json
[
  {
    "id": "uuid-here",
    "name": "Product Name",
    "price": 29.99,
    "description": "Product description"
  }
]
```

**Status Codes:**

- `200 OK` - Products retrieved successfully

---

#### **POST** `/products` 🔒

Create a new product (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "New Product",
  "price": 49.99,
  "description": "Optional description"
}
```

**Response:**

```json
{
  "id": "uuid-here",
  "name": "New Product",
  "price": 49.99,
  "description": "Optional description"
}
```

**Status Codes:**

- `201 Created` - Product successfully created
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or missing token

---

#### **DELETE** `/products/:id` 🔒

Delete a product by ID (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

- No content body

**Status Codes:**

- `204 No Content` - Product successfully deleted
- `404 Not Found` - Product not found
- `401 Unauthorized` - Invalid or missing token

---

## 📊 Database Schema

### User Entity

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Product Entity

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Configuration

### Environment Variables

| Variable            | Description           | Default               | Required |
| ------------------- | --------------------- | --------------------- | -------- |
| `DATABASE_HOST`     | PostgreSQL host       | localhost             | Yes      |
| `DATABASE_PORT`     | PostgreSQL port       | 5432                  | Yes      |
| `DATABASE_USERNAME` | Database username     | postgres              | Yes      |
| `DATABASE_PASSWORD` | Database password     | -                     | Yes      |
| `DATABASE_NAME`     | Database name         | kitchen365-products   | Yes      |
| `JWT_SECRET`        | JWT signing secret    | -                     | Yes      |
| `JWT_EXPIRES_IN`    | Token expiration time | 7d                    | No       |
| `PORT`              | Application port      | 3001                  | No       |
| `NODE_ENV`          | Environment mode      | development           | No       |
| `CLIENT_URL`        | Frontend URL for CORS | http://localhost:3000 | No       |

## 📝 Available Scripts

```bash
# Development
npm run start:dev        # Start in watch mode
npm run start:debug      # Start in debug mode

# Production
npm run build           # Build the application
npm run start:prod      # Start production server

# Linting
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: class-validator decorators
- **CORS Configuration**: Restricted to frontend domain
- **Environment Variables**: Sensitive data protection
- **SQL Injection Protection**: TypeORM query builder

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common HTTP status codes:

- `200 OK` - Successful GET requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error