# Spendrix — Personal Finance Analytics Platform

A full-stack personal finance analytics web application built with Django REST Framework and React. Features JWT authentication, real-time expense tracking, budget management, ML-based spending predictions, and an interactive analytics dashboard.

🌐 **Live Demo:** [spendrix on Render](https://smartspend-frontend-dpli.onrender.com)

---

## Features

- 🔐 **JWT Authentication** — Secure login and registration system
- 💰 **Expense Management** — Full CRUD operations for expense tracking
- 📊 **Analytics Dashboard** — Interactive Pie, Bar and Line charts using Chart.js
- 🎯 **Budget Tracking** — Set monthly budgets per category with real-time progress bars
- 🤖 **ML Predictions** — Spending predictions, anomaly detection and trend analysis
- 📁 **CSV Export** — Download monthly expense reports
- 👤 **Multi-user** — Each user sees only their own data

---

## Tech Stack

**Backend:**
- Python 3.11
- Django 5.x
- Django REST Framework
- Simple JWT — Authentication
- scikit-learn + numpy + pandas — ML predictions
- PostgreSQL — Production database
- Gunicorn + Whitenoise — Production server

**Frontend:**
- React 18
- Axios — API calls
- Chart.js + react-chartjs-2 — Data visualization
- CSS3 — Custom Bloomberg-style dark theme

**Deployment:**
- Render — Backend + Frontend hosting
- PostgreSQL — Render managed database
- GitHub — Version control

---

## Project Structure

spendrix/
├── backend/              ← Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── expenses/             ← Main Django app
│   ├── models.py         ← Expense + Budget models
│   ├── views.py          ← API views
│   ├── serializers.py    ← DRF serializers
│   ├── urls.py           ← URL routing
│   ├── ml.py             ← ML predictions engine
│   └── register.py       ← User registration
├── frontend/             ← React application
│   └── src/
│       ├── App.js        ← Main component
│       ├── Login.js      ← Authentication
│       ├── Register.js   ← User registration
│       ├── Budget.js     ← Budget tracking
│       ├── Charts.js     ← Analytics dashboard
│       └── Predictions.js← ML insights
├── requirements.txt
├── Procfile
└── runtime.txt

---

## Local Setup

**Prerequisites:**
- Python 3.11+
- Node.js 18+
- Git

**Backend Setup:**
```bash
# Clone the repository
git clone https://github.com/rpd04/expense-tracker.git
cd expense-tracker

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

**Frontend Setup:**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

**Access the app:**
- Frontend: `http://localhost:3000`
- Backend API: `http://127.0.0.1:8000`
- Admin Panel: `http://127.0.0.1:8000/admin`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Login — get JWT token |
| POST | `/api/register/` | Register new user |
| GET/POST | `/api/expenses/` | List/Create expenses |
| GET/PUT/DELETE | `/api/expenses/{id}/` | Retrieve/Update/Delete expense |
| GET/POST | `/api/budgets/` | List/Create budgets |
| GET | `/api/budget-summary/` | Budget vs spent summary |
| GET | `/api/predictions/` | ML spending predictions |
| GET | `/api/export-csv/` | Export expenses as CSV |

---

## ML Features

The predictions engine (`expenses/ml.py`) uses statistical analysis to provide:

- **Spending Prediction** — Projects month-end total based on daily average
- **Trend Analysis** — Compares current month vs previous months
- **Anomaly Detection** — Flags expenses 2x higher than daily average
- **Category Insights** — Identifies biggest spending category

---

## Screenshots

## Screenshots

### Login Page
![Login](screenshots/Login.png)
### Dashboard
![Dashboard](screenshots/DashBoard.png)

### Analytics
![Analytics](screenshots/Analytics(1).png)
![](screenshots/Analytics(2).png)
---

## Author

**Priyansh Dubey**
- GitHub: [@rpd04](https://github.com/rpd04)
- LinkedIn: [https://www.linkedin.com/in/priyansh-dubey-94b1b2288/]

---

## License

MIT License — feel free to use this project for learning purposes.