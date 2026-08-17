# 🚀 How to Run AOBNAP Frontend

This guide will help you get the Afaan Oromo Business Name Approval Portal running on your local machine.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

### Check Your Installation

```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
```

---

## 🔧 Installation Steps

### Step 1: Navigate to the Frontend Directory

Open your terminal/PowerShell and navigate to the frontend folder:

```bash
cd "C:\Users\iDesire Computer\Desktop\aobnap-frontend-complete (1)\afaan-oromo-business-portal\apps\frontend"
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will download all dependencies listed in `package.json`. It may take 2-3 minutes.

### Step 3: Configure Environment Variables (Optional)

The application is already configured to use mock data by default. If you want to customize:

1. Check if `.env` file exists in the frontend folder
2. The key environment variable is:
   ```
   VITE_USE_MOCK_API=true
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

**Note**: With `VITE_USE_MOCK_API=true`, no backend is needed. The app uses mock data.

---

## ▶️ Running the Application

### Development Mode (Recommended)

Start the development server:

```bash
npm run dev
```

You should see output like:

```
  VITE v5.1.0  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open your browser** and go to: **http://localhost:5173/**

The app will automatically reload when you make changes to the code.

### Production Build

To create an optimized production build:

```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## 🎭 Demo Accounts

Once the application is running, you can log in with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Business Owner** | `owner@aobnap.gov.et` | `Owner@1234` |
| **Communication Biro** | `financial@aobnap.gov.et` | `Financial@1234` |
| **Addaf Turizm Biro** | `language@aobnap.gov.et` | `Language@1234` |
| **Commercial Office** | `language@aobnap.gov.et` | `Language@1234` |
| **Admin (IT Biro)** | `admin@aobnap.gov.et` | `Admin@1234` |

---

## 🧭 Navigation Guide

### Landing Page
- **URL**: `http://localhost:5173/`
- Beautiful homepage with features overview
- Click "Sign In" to access the portal

### Login Page
- **URL**: `http://localhost:5173/login`
- Use demo credentials listed above
- Each role redirects to its specific dashboard

### Role-Specific Dashboards

1. **Business Owner** → `/owner/dashboard`
   - Submit applications
   - View approval messages
   - Track application status

2. **Communication Biro** → `/communication/dashboard`
   - Route incoming applications
   - Send messages to departments
   - Monitor workflow

3. **Addaf Turizm Biro** → `/turizm/dashboard`
   - Review business descriptions
   - Approve/reject with reasons
   - Language compliance checks

4. **Commercial Office** → `/commercial/dashboard`
   - Review business permits
   - Approve/reject with reasons
   - Document compliance checks

5. **Admin (IT Biro)** → `/admin/dashboard`
   - Monitor all transactions
   - View system health
   - Manage users and categories

---

## 🔔 Testing Real-Time Notifications

The notification system is built-in and works automatically:

1. **Login** with any demo account
2. **Click the bell icon** (🔔) in the top-right corner
3. **See notifications** based on your role
4. New notifications appear every **30 seconds** (simulated)
5. **Browser notifications** will appear if you grant permission

---

## 🛠️ Common Issues & Solutions

### Issue 1: Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- --port 3000
```

### Issue 2: Dependencies Not Installing

**Error**: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 3: Module Not Found Errors

**Error**: Cannot find module '@/...'

**Solution**: Check that `vite.config.js` has the correct path aliases:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue 4: Blank Page After Login

**Solution**:
- Open browser DevTools (F12)
- Check Console for errors
- Make sure you're using a supported browser (Chrome, Firefox, Edge, Safari)
- Clear browser cache and cookies

---

## 🎨 Development Tips

### Hot Module Replacement (HMR)
- Changes to `.jsx` files reload instantly
- Changes to `.css` files update without page reload
- State is preserved during updates

### Browser DevTools
- Press **F12** to open DevTools
- Use **React Developer Tools** extension for debugging
- Check **Console** tab for errors
- Use **Network** tab to see mock API calls

### Code Linting
Run ESLint to check code quality:
```bash
npm run lint
```

---

## 📱 Mobile Testing

The application is fully responsive. To test on mobile:

### Option 1: Network Access
```bash
npm run dev -- --host
```
Then access from your phone using your computer's IP address (e.g., `http://192.168.1.100:5173`)

### Option 2: Browser DevTools
1. Open DevTools (F12)
2. Click the device toggle button (Ctrl+Shift+M)
3. Select a mobile device from the dropdown

---

## 🔄 Workflow Testing Guide

### Test Complete Workflow

1. **As Business Owner**:
   - Login: `owner@aobnap.gov.et` / `Owner@1234`
   - Go to "New Application"
   - Fill in 3 steps
   - Submit application

2. **As Communication Biro**:
   - Logout and login: `financial@aobnap.gov.et` / `Financial@1234`
   - Go to "Incoming Applications"
   - Click "Route" on an application
   - Confirm routing to both departments

3. **As Commercial Office**:
   - Logout and login: `language@aobnap.gov.et` / `Language@1234`
   - Go to "Permit Reviews"
   - Review application
   - Approve/Reject with detailed reason

4. **As Addaf Turizm Biro**:
   - Stay logged in as `language@aobnap.gov.et` (same account)
   - Navigate to `/turizm/dashboard`
   - Go to "Language Review Queue"
   - Review business description
   - Approve/Reject with detailed reason

5. **As Business Owner (Check Status)**:
   - Login back: `owner@aobnap.gov.et` / `Owner@1234`
   - Go to "Approval Messages"
   - See approval/rejection messages

6. **As Admin (Monitor)**:
   - Login: `admin@aobnap.gov.et` / `Admin@1234`
   - Dashboard shows all activity
   - View recent transactions
   - Check system health

---

## 🌐 Browser Compatibility

Fully supported browsers:
- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

---

## 📊 Performance Tips

For the best experience:
- Use Chrome or Edge for best performance
- Close unused browser tabs
- Disable unnecessary browser extensions
- Use incognito mode for a clean test environment

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check the browser console** (F12 → Console tab)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Restart the dev server** (Ctrl+C, then `npm run dev`)
4. **Reinstall dependencies**: 
   ```bash
   rm -rf node_modules
   npm install
   ```

---

## 🎯 Quick Start (TL;DR)

For experienced developers:

```bash
# Navigate to frontend
cd "afaan-oromo-business-portal/apps/frontend"

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:5173/

# Login with demo account
# owner@aobnap.gov.et / Owner@1234
```

---

## 📝 Project Structure

```
apps/frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components (routes)
│   ├── context/       # React contexts (Auth, Notifications)
│   ├── services/      # API service layer
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── constants/     # Constants and config
│   ├── layouts/       # Layout components
│   ├── routes/        # Route guards
│   └── assets/        # Static assets (CSS, images)
├── index.html         # HTML entry point
├── vite.config.js     # Vite configuration
├── package.json       # Dependencies and scripts
└── .env               # Environment variables
```

---

## ✨ Features to Explore

Once running, explore these features:

- 🏠 **Landing Page** - Beautiful homepage
- 🔐 **Authentication** - Secure login system
- 📊 **Dashboards** - Role-specific dashboards
- 📝 **Application Forms** - Multi-step forms
- ✅ **Review Systems** - Approval workflows
- 💬 **Messaging** - Inter-department communication
- 🔔 **Notifications** - Real-time alerts
- 👁️ **Admin Monitoring** - System oversight
- 📱 **Responsive Design** - Works on all devices

---

**Happy coding! 🚀**

*Last updated: 2026-08-17*
