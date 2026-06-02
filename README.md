# Email Registration Website

A modern, responsive website with an email registration form featuring frontend validation, backend API, and database storage.

## Features

- **Modern UI/UX**: Clean, responsive design with gradient backgrounds and smooth animations
- **Form Validation**: Real-time validation for name, email, password strength, and terms acceptance
- **Password Strength Meter**: Visual feedback on password strength
- **Backend API**: Node.js/Express server with RESTful endpoints
- **Database**: SQLite for user data storage with password hashing
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Social Login Placeholders**: Buttons for Google, GitHub, and Twitter integration

## Project Structure

```
.
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # Frontend JavaScript with validation
├── server.js           # Node.js/Express backend
├── package.json        # Node.js dependencies
├── .env               # Environment variables
├── README.md          # This file
└── users.db           # SQLite database (created automatically)
```

## Quick Start

### Option 1: Frontend Only (Simulated Registration)

1. Simply open `index.html` in your browser
2. The form will work with simulated registration (no backend required)

### Option 2: Full Stack (Frontend + Backend)

#### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

#### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd email-registration-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get all registered users (admin)
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user (for future use)

### Registration Request Example
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Registration Response Example
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1,
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

## Database Schema

The SQLite database (`users.db`) contains a `users` table:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **Input Validation**: Server-side validation with validator.js
- **CORS Protection**: Configured for secure cross-origin requests
- **SQL Injection Prevention**: Parameterized queries

## Form Validation Rules

### Name
- Minimum 2 characters
- Maximum 100 characters
- Only letters and spaces allowed

### Email
- Valid email format
- Unique in the database

### Password
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Real-time strength indicator

## Customization

### Styling
Edit `style.css` to change colors, fonts, or layout:
- Primary gradient: `#6a11cb` to `#2575fc`
- Success color: `#2ed573`
- Error color: `#ff4757`

### Backend Configuration
Edit `.env` file:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Database
The backend uses SQLite by default. To switch to another database:
1. Install the appropriate database driver (e.g., `pg` for PostgreSQL)
2. Update database connection in `server.js`
3. Modify SQL queries as needed

## Deployment

### Frontend Deployment (Static)
- Upload `index.html`, `style.css`, and `script.js` to any web hosting service
- Examples: Netlify, Vercel, GitHub Pages, AWS S3

### Backend Deployment
1. **Prepare for production**:
   ```bash
   npm install --production
   NODE_ENV=production node server.js
   ```

2. **Deploy to cloud platforms**:
   - **Heroku**: Add `Procfile` with `web: node server.js`
   - **Railway**: Connect GitHub repository
   - **AWS Elastic Beanstalk**: Create Node.js environment

3. **Environment variables**: Set production variables on your hosting platform

### Database Deployment
- For production, consider using PostgreSQL, MySQL, or MongoDB
- Update database configuration in `server.js`
- Set up connection pooling and backups

## Testing

### Manual Testing
1. Open the website in a browser
2. Try submitting invalid data to see validation messages
3. Submit valid data to test registration
4. Check browser console for API responses

### Automated Testing (Future Enhancement)
```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Verify Node.js is installed: `node --version`
- Check dependencies: `npm install`

### Database errors
- Ensure write permissions in the project directory
- Delete `users.db` to reset the database

### CORS errors
- Check that frontend and backend are on same origin or CORS is configured
- Update `server.js` CORS settings if needed

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

1. **Email Verification**: Send confirmation emails after registration
2. **Password Reset**: Forgot password functionality
3. **User Dashboard**: Profile management after login
4. **Social Login**: Integrate OAuth with Google, GitHub, etc.
5. **Two-Factor Authentication**: Add 2FA for enhanced security
6. **Admin Panel**: Manage users and view analytics
7. **Rate Limiting**: Prevent brute force attacks
8. **Logging**: Comprehensive request/error logging

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Open an issue in the repository

---

**Happy Coding!** 🚀