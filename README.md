# Lost & Found - Backend

This is the backend server for the Lost & Found application, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lostAndFound
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Create an admin user (run this once to create the initial admin):
   ```bash
   npm run create-admin
   ```
   Default admin credentials:
   - Username: admin
   - Password: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id/status` - Update item status (admin only)
- `DELETE /api/items/:id` - Delete item (admin only)

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Mongoose models
├── routes/           # Route definitions
├── uploads/          # File uploads (created automatically)
├── utils/            # Utility scripts
├── .env              # Environment variables
├── package.json      # Project dependencies
└── server.js         # Application entry point
```

## Environment Variables

- `PORT` - Port to run the server on (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Application environment (development/production)

## Development

- Use `npm run dev` to start the development server with hot-reload
- The server will restart automatically when you make changes

## Production

1. Set `NODE_ENV=production` in your environment
2. Run `npm install --production` to install only production dependencies
3. Start the server with `npm start`
