# CBI Bank Backend API

A complete Node.js/Express backend for the CBI Bank application with MongoDB integration.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role management
- 💰 **Account Management** - Balance, transfers, account operations
- 🏦 **Fixed Deposits** - Create, manage, and break FDs with interest calculations
- 💳 **ATM Card Management** - Request, activate, set PIN, block/unblock cards
- 📊 **Transaction History** - Detailed transaction logs with filtering
- 💳 **Payment Integration** - Razorpay integration for adding money
- 📧 **Email Notifications** - Welcome emails, transaction alerts
- 📞 **Contact Support** - Ticket system for customer support
- 🛡️ **Security** - Input validation, rate limiting, error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route handlers
│   │   ├── auth.controller.js
│   │   ├── amount.controller.js
│   │   ├── fd.controller.js
│   │   ├── atm.controller.js
│   │   ├── transaction.controller.js
│   │   └── contact.controller.js
│   ├── models/            # MongoDB schemas
│   │   ├── UserModel.js
│   │   ├── AccountModel.js
│   │   ├── TransactionModel.js
│   │   ├── FixedDepositModel.js
│   │   ├── ATMModel.js
│   │   └── ContactModel.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── amount.routes.js
│   │   ├── fd.routes.js
│   │   ├── atm.routes.js
│   │   ├── transactions.routes.js
│   │   └── contact.routes.js
│   ├── middlewares/       # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── utils/             # Utility functions
│   │   ├── jwt.service.js
│   │   ├── razorpay.service.js
│   │   └── mailer.js
│   ├── config/           # Configuration
│   │   └── db.js
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Quick Start

### 1. Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for payments)
- Gmail account (for email notifications)

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Environment Configuration

Edit `.env` file with your configurations:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/cbi_bank

# JWT Secret - Use a strong secret in production
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Razorpay Configuration - Get from Razorpay Dashboard
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration - Use Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=noreply@cbibank.com

# Frontend URL
CLIENT_URL=http://localhost:8080
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# For local MongoDB
mongod

# The application will automatically connect and create collections
```

### 5. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Account & Money Management
- `GET /api/amount/balance` - Get account balance
- `POST /api/amount/add` - Initiate money addition
- `POST /api/amount/verify-payment` - Verify payment and add money
- `POST /api/amount/transfer` - Transfer money to another account

### Fixed Deposits
- `POST /api/fd/create` - Create new fixed deposit
- `GET /api/fd/` - Get user's fixed deposits
- `GET /api/fd/:fdId` - Get specific FD details
- `POST /api/fd/:fdId/break` - Break FD (premature withdrawal)

### ATM Cards
- `POST /api/atm/request` - Request new ATM card
- `GET /api/atm/` - Get user's ATM cards
- `GET /api/atm/:cardId/details` - Get card details
- `POST /api/atm/set-pin` - Set ATM PIN
- `POST /api/atm/change-pin` - Change ATM PIN
- `POST /api/atm/:cardId/toggle-block` - Block/unblock card

### Transactions
- `GET /api/transactions/` - Get transaction history
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/download` - Download statement
- `GET /api/transactions/:transactionId` - Get transaction details

### Contact Support
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/my-tickets` - Get user's tickets
- `GET /api/contact/ticket/:ticketNumber` - Get ticket details

## Features Detail

### 🔐 Authentication System
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (customer/admin)
- Account activation/deactivation

### 💰 Banking Operations
- Real-time balance updates
- Secure money transfers between accounts
- Transaction fee calculations
- Overdraft protection

### 🏦 Fixed Deposits
- Multiple tenure options (6-120 months)
- Interest rate tiers based on tenure
- Compound interest calculations
- Premature withdrawal with penalties

### 💳 ATM Card Management
- Virtual card generation
- PIN management with encryption
- Daily withdrawal/spending limits
- Card blocking/unblocking functionality

### 📊 Transaction Management
- Detailed transaction logging
- Advanced filtering and search
- Transaction categorization
- Statement generation (JSON/CSV)

### 💳 Payment Integration
- Razorpay payment gateway integration
- Secure payment verification
- Refund management
- Transaction reconciliation

### 📧 Notification System
- Welcome emails for new users
- Transaction alerts
- Support ticket responses
- Email templates with rich HTML

## Security Features

- **Input Validation**: Joi schema validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Password Hashing**: Bcrypt for password security
- **JWT Security**: Token-based authentication
- **Error Handling**: Centralized error handling

## Testing

Test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"9876543210","password":"password123","confirmPassword":"password123","dateOfBirth":"1990-01-01","address":"123 Main St, City","agreedToTerms":true}'
```

## Production Deployment

1. **Environment Variables**: Update all environment variables for production
2. **Database**: Use MongoDB Atlas or a production MongoDB instance
3. **Security**: 
   - Use strong JWT secrets
   - Enable HTTPS
   - Configure proper CORS origins
   - Set up proper rate limiting
4. **Monitoring**: Add logging and monitoring solutions
5. **Process Management**: Use PM2 or similar for process management

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Email Not Sending**
   - Verify Gmail credentials
   - Enable 2-factor authentication and use app password
   - Check firewall settings

3. **Razorpay Integration Issues**
   - Verify API keys
   - Check webhook configurations
   - Ensure test/live mode consistency

4. **JWT Token Issues**
   - Verify JWT secret is set
   - Check token expiration settings
   - Ensure consistent secret across restarts

## Support

For issues and questions:
- Check the logs for detailed error messages
- Verify environment configuration
- Ensure all dependencies are installed
- Check MongoDB connection and data

## License

MIT License - see LICENSE file for details.