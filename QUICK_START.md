# 🚀 Quick Start Guide - AOBNAP

## ✅ Your Application is Ready!

Both frontend and backend are running and connected to the database.

---

## 🌐 Access URLs

**Frontend (React App):**  
👉 **http://localhost:3000**

**Backend API:**  
👉 **http://localhost:5001**

---

## 🔑 Login Credentials

### Administrator Account (Updated - No More "Bulchiinsa Sirna")
- **Email:** `admin@aobnap.gov.et`
- **Password:** `Admin@123456`

### Officer Accounts (Need to be created from Admin panel)
- Financial Officer
- Language Officer  
- Senior Officer

### Business Owner
- Register a new account or create from Admin panel

---

## 🎯 Test the New Features

### 1. Admin Side Tests

**Login as Administrator** and test:

#### User Management (`/admin/users`)
- ✅ Click the **Active/Inactive badge** to toggle user status
- ✅ Click **Edit button** to modify user details (name, phone, role, password)
- ✅ Click **Delete button** to remove users
- ✅ Verify "Administrator" appears (not "Bulchiinsa Sirna")

#### Business Categories (`/admin/categories`)
- ✅ Check **createdAt** and **updatedAt** columns are visible
- ✅ Click the **Active/Inactive badge** to toggle category status
- ✅ Create, edit, and delete categories

#### Settings Page (`/admin/settings`)
- ✅ See the new modern gradient card UI
- ✅ Edit settings and see "unsaved changes" indicator
- ✅ Save changes

### 2. Business Owner Side Tests

**Register or create a Business Owner account**, then:

#### New Application (`/owner/applications/new`)
- ✅ Go through 3-step process (no National ID verification)
- ✅ In Step 1: Select **"Biroo (Other)"** from Gosa Daldaala dropdown
- ✅ Upload business permission document
- ✅ Submit application

#### Applications List - Iyyata Koo (`/owner/applications`)
- ✅ Verify **Maqaa Daldaala** (Business Name) column is visible
- ✅ Verify **Gosa Daldaala** (Business Category) column is visible
- ✅ Search by business name
- ✅ "Other" displays as "Biroo (Other)"

#### Application Detail (`/owner/applications/:id`)
- ✅ Click "Ilaali →" on any application
- ✅ Verify all 6 fields are visible:
  - Application Number ✓
  - Business Name ✓
  - Category ✓
  - Business Address ✓
  - Submission Date ✓
  - Description ✓

---

## 📊 Database Information

**Database:** PostgreSQL 18  
**Database Name:** `aobnap_db`  
**Username:** `postgres`  
**Password:** `Admin@123456`  
**Host:** `localhost`  
**Port:** `5432`

### Database Status:
- ✅ Created
- ✅ Migrations applied
- ✅ Seeded with initial data

### Initial Data Includes:
- 5 user roles
- 1 Administrator user
- 10 business categories
- 10 reserved terms

---

## 🛑 Stop/Restart Servers

### Stop All Servers:
Kill all node processes or use Kiro's process manager

### Restart Backend:
```powershell
cd "c:\Users\Pc\Afaan Oromo Business Name Approval Portal\apps\backend"
npm run dev
```

### Restart Frontend:
```powershell
cd "c:\Users\Pc\Afaan Oromo Business Name Approval Portal\apps\frontend"
npm run dev
```

---

## 📝 Configuration Files

### Backend `.env`
**Location:** `apps/backend/.env`
```env
DATABASE_URL=postgresql://postgres:Admin%40123456@localhost:5432/aobnap_db
PORT=5001
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env`
**Location:** `apps/frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_USE_MOCK_API=false
```

### Database `.env`
**Location:** `database/.env`
```env
DATABASE_URL=postgresql://postgres:Admin%40123456@localhost:5432/aobnap_db
```

---

## 🔧 Common Commands

### Generate Prisma Client:
```powershell
cd database
npx prisma generate --schema=prisma/schema.prisma
```

### Run Migrations:
```powershell
cd database
npx prisma migrate deploy --schema=prisma/schema.prisma
```

### Seed Database:
```powershell
cd database
node prisma/seed/seed.js
```

### Reset Database (Fresh Start):
```powershell
cd database
npx prisma migrate reset --schema=prisma/schema.prisma
node prisma/seed/seed.js
```

---

## ✨ What's New - Summary of Improvements

### Admin Side (6 improvements):
1. ✅ User Management: Status toggle, Edit, Delete buttons
2. ✅ Business Categories: Date/time columns, status toggle
3. ✅ "Bulchiinsa Sirna" → "Administrator"
4. ✅ Notifications: Mock data removed
5. ✅ Settings: Beautiful modern gradient UI
6. ✅ Full backend integration

### Business Owner Side (4 improvements):
1. ✅ No National ID verification (3-step process)
2. ✅ "Biroo (Other)" option in category dropdown
3. ✅ Business name & category visible in table
4. ✅ All 6 fields visible in detail view

---

## 🐛 Troubleshooting

### CORS Error:
- Check backend CORS_ORIGIN matches frontend URL
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3000`

### Database Connection Error:
- Verify PostgreSQL is running: `Get-Service *postgresql*`
- Check credentials in `.env` files
- Password: `Admin@123456` (URL encoded: `Admin%40123456`)

### Port Already in Use:
- Backend is on port **5001** (not 5000)
- Frontend is on port **3000**
- Kill processes: `Stop-Process -Name node -Force`

---

## 📚 Documentation

For detailed implementation information, see:
- `IMPLEMENTATION_CHANGES.md` - Complete list of all changes
- `IMPLEMENTATION_SUMMARY.md` - Original project summary
- `README.md` - Project overview

---

## 🎉 You're All Set!

The application is fully configured and running with:
- ✅ CORS fixed
- ✅ Database connected
- ✅ All improvements implemented
- ✅ Ready for testing

**Start testing at:** http://localhost:3000

Happy testing! 🚀
