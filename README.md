# ScholarBridge

ScholarBridge is a full-stack MERN application that helps students buy and request affordable second-hand academic resources such as textbooks, notes, and study materials from other students within their college community.

The platform includes a complete request-management workflow where users can browse listed books, send purchase requests, and communicate directly with sellers through a real-time chat system after request approval.

## 🚀 Features

- **User Authentication** - JWT-based Login & Signup
- **Book Listing & Management** - Create and manage book listings
- **Request-Based Purchase System** - Browse books and send purchase requests
- **Real-Time Chat** - Direct communication with buyers/sellers using Socket.io
- **Protected Routes & Authorization** - Secure access control
- **MongoDB Database Integration** - Persistent data storage
- **Room-Based Real-Time Messaging** - Isolated chat rooms per transaction
- **Chat Access Control** - Based on request status
- **REST API Architecture** - Scalable backend design
- **Responsive Frontend** - Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - WebSocket library
- **JWT** - Authentication

## ⚡ System Design Highlights

- **Dynamic Room Generation** - Real-time chat rooms using `bookId + requesterId`
- **Request Lifecycle Management** - States: `available` → `requested` → `claimed`
- **Event-Driven Architecture** - WebSocket-based real-time communication
- **Message Persistence** - Chat history stored in MongoDB

## 📦 Backend Modules

- **Authentication System** - User registration, login, JWT token management
- **Book Management System** - CRUD operations for book listings
- **Request Management System** - Purchase request workflow
- **Real-Time Chat System** - Socket.io event handlers
- **Message Persistence Layer** - MongoDB chat history storage

## 🔐 Authentication

JWT-based authentication with protected middleware for secure API access and user-specific actions. All authenticated routes verify user identity before processing requests.

## 💬 Real-Time Chat

Implemented using Socket.io with room-based isolation to enable direct communication between buyer and seller after request approval. Messages are persisted in MongoDB for chat history support.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Riyakuila/scholar-Bridge.git
   cd scholar-Bridge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend (in another terminal)**
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
scholar-Bridge/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth & validation
│   ├── sockets/          # Socket.io events
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API calls & socket setup
│   │   ├── context/      # State management
│   │   └── App.js        # Main app component
│   └── public/
└── README.md
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Create a book listing
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book listing
- `DELETE /api/books/:id` - Delete book listing

### Requests
- `GET /api/requests` - Get user requests
- `POST /api/requests` - Create purchase request
- `PUT /api/requests/:id` - Update request status
- `DELETE /api/requests/:id` - Cancel request

### Chat
- WebSocket events for real-time messaging

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🗺️ Roadmap

- [ ] Advanced search and filtering for books
- [ ] User rating and review system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics for sellers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For questions or issues, please open a GitHub issue or contact the project maintainers.

---

**Happy learning with ScholarBridge! 📚**
