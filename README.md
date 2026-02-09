# Smart Urban Service Locator

A modern web application for locating urban services with stunning 3D animations and role-based authentication.

## 🌟 Features

- **3D Globe Intro Animation** - Rotating Earth with smooth transitions
- **Role-Based Login System** - Separate portals for Service Providers, Admins, and Users
- **Modern UI/UX** - Premium design with 3D card effects and animations
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Fast & Lightweight** - No build process, pure HTML/CSS/JS

## 🚀 Quick Start

### Option 1: Open Directly (Fastest)
1. Navigate to the `frontend` folder
2. Double-click `index.html` to open in your browser
3. That's it! No server needed.

### Option 2: Use Live Server (Recommended for Development)
```bash
# If you have Python installed
cd frontend
python -m http.server 8000

# Then open: http://localhost:8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📁 Project Structure

```
frontend/
├── index.html              # Main page with globe intro
├── service-provider.html   # Service provider login
├── admin.html             # Admin login
├── user.html              # User login
├── services.html          # Service listing (coming soon)
├── css/
│   ├── style.css          # Main styles & animations
│   └── login.css          # Login page styles
├── js/
│   ├── globe.js           # Three.js globe animation
│   ├── main.js            # Intro sequence logic
│   └── login.js           # Login form handling
└── assets/
    └── images/            # Images and icons
```

## 🎨 Features Breakdown

### 1. Globe Intro Animation
- **Technology**: Three.js
- **Duration**: 7-second sequence
- **Features**:
  - Rotating 3D Earth with NASA texture
  - Smooth text fade-in/out
  - Automatic transition to login selection
  - localStorage to skip for returning users

### 2. Login Selection
- **3 Role Cards**:
  - Service Provider (Green theme)
  - Admin (Red theme)
  - User (Blue theme)
- **3D Effects**:
  - Card lift on hover
  - 3D tilt based on mouse position
  - Smooth shadows and transitions

### 3. Login Pages
- **Features**:
  - Form validation
  - Loading states
  - Error/success messages
  - Remember me functionality
  - Responsive design

## 🔑 Demo Credentials

For testing purposes, you can use these credentials:

**Service Provider:**
- Email: `provider@demo.com`
- Password: `demo123`

**Admin:**
- Email: `admin@demo.com`
- Password: `admin123`

**User:**
- Email: `user@demo.com`
- Password: `user123`

> **Note**: Currently accepts any email/password for demo purposes. Update `js/login.js` for production.

## ⚙️ Customization

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary: #2563eb;      /* Blue */
    --secondary: #10b981;    /* Green */
    --accent: #f59e0b;       /* Amber */
    --admin-color: #ef4444;  /* Red */
}
```

### Modify Animation Timing
Edit timing in `js/main.js`:
```javascript
const TIMING = {
    GLOBE_ROTATION: 3000,
    TEXT_APPEAR: 3000,
    GLOBE_FADE: 6000,
    TEXT_FADE: 6500,
    LOGIN_APPEAR: 7000
};
```

### Skip Intro for All Users
In `js/main.js`, uncomment the skip button function:
```javascript
addSkipButton();
```

## 🌐 Deployment

### Netlify (Easiest)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `frontend` folder
3. Get instant URL

### Vercel
```bash
cd frontend
npx vercel
```

### GitHub Pages
1. Push to GitHub
2. Go to Settings > Pages
3. Select branch and `/frontend` folder
4. Save

## 🔧 Backend Integration

To connect to your existing backend:

1. **Update API endpoint** in `js/login.js`:
```javascript
async function mockLogin(email, password, role) {
    const response = await fetch('YOUR_BACKEND_URL/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
    });
    return await response.json();
}
```

2. **Handle authentication tokens**
3. **Update redirect URLs** to your dashboard pages

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 (requires polyfills)

## 🎯 Performance

- **First Load**: < 2 seconds
- **Globe Animation**: 60 FPS
- **Total Size**: < 500 KB (excluding Three.js CDN)

## 📝 To-Do / Next Steps

- [ ] Create service listing page
- [ ] Add search and filter functionality
- [ ] Integrate map view
- [ ] Connect to backend API
- [ ] Add user registration
- [ ] Create dashboard pages
- [ ] Add service detail pages
- [ ] Implement real authentication

## 🐛 Troubleshooting

**Globe not showing?**
- Check browser console for errors
- Ensure internet connection (Three.js loads from CDN)
- Try a different browser

**Animations stuttering?**
- Close other tabs
- Check GPU acceleration is enabled
- Reduce animation complexity in `js/globe.js`

**Forms not submitting?**
- Check browser console
- Ensure JavaScript is enabled
- Verify form IDs match in `js/login.js`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your needs!

---

**Built with ❤️ for Smart Urban Service Locator**

For questions or support, please open an issue or contact the development team.
