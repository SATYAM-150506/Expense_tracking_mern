//updated readme

# Expense Tracker Application

A full-stack expense tracking application built with React frontend and Express.js backend, featuring user authentication, CRUD operations for expenses, and data visualization.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### Expense Management
- Create, read, update, and delete expenses
- Categorize expenses (Food, Transportation, Entertainment, etc.)
- Date-based filtering
- Category-based filtering
- Expense statistics and analytics

### User Interface
- Responsive design
- Real-time expense statistics
- Category-wise spending breakdown
- Modern and intuitive UI

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   │   ├── ExpenseStats.js
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense_tracker
   JWT_SECRET=your_jwt_secret_key_here_please_change_in_production
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` accordingly.

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```
   
   The frontend application will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Expense Routes
- `GET /api/expenses` - Get all expenses for logged-in user
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/summary` - Get expense statistics

## Usage

1. **Register/Login:**
   - Create a new account or login with existing credentials
   - JWT token will be stored in localStorage for authentication

2. **Add Expenses:**
   - Click "Add New Expense" button
   - Fill in title, amount, category, description (optional), and date
   - Submit to save the expense

3. **Manage Expenses:**
   - View all expenses in a list format
   - Edit expenses by clicking the "Edit" button
   - Delete expenses by clicking the "Delete" button
   - Filter expenses by category and date range

4. **View Statistics:**
   - Dashboard shows total expenses, total amount, and average per expense
   - Category breakdown shows spending distribution
   - Visual indicators for different expense categories

## Expense Categories

The application supports the following expense categories:
- Food
- Transportation
- Entertainment
- Healthcare
- Shopping
- Bills
- Education
- Travel
- Other

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API routes requiring valid tokens
- Input validation on both frontend and backend
- CORS configuration for cross-origin requests

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # React development server with hot reload
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment variables
2. Use a strong, unique JWT secret
3. Configure MongoDB connection for production
4. Consider using PM2 for process management

### Frontend
1. Build the React app: `npm run build`
2. Serve the built files using a web server
3. Update API endpoints for production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue on the GitHub repository.