# CareHub

A modern, full-stack clinic and patient management system powered by AI.

## Overview

CareHub is built around the idea of a **centralized, intelligent system for healthcare providers**. Instead of managing patients and appointments across fragmented tools, clinic staff manage everything from one secure, production-ready platform.

The platform encourages efficiency and clarity by combining **full CRUD operations** for patients and appointments with a **real-time dashboard** and an **AI-powered chatbot assistant** — all in one clean, responsive interface.

## Features

### Authentication
- Secure user signup and login using Firebase Authentication (Email/Password)
- Protected routes that restrict all pages to authenticated users only

### Patient Management (CRUD)
- Users can:
  - Add new patient profiles
  - View a searchable, paginated list of all patients
  - Update patient details including contact info and medical history
  - Delete patient records with a confirmation dialog
- Supports both **table view** and **grid card view**
- Data is stored in Firestore

### Appointment Management (CRUD)
- Users can:
  - Schedule new appointments linked to a patient
  - View all appointments with status filtering and keyword search
  - Update appointment details, date, time, and status
  - Delete appointments with a confirmation dialog
- Appointment statuses: `scheduled`, `completed`, `cancelled`, `rescheduled`
- Supports both **table view** and **grid card view**

### Patient Detail View
- Full patient profile page showing:
  - Personal and contact information
  - Medical history and known allergies
  - Complete appointment history for that patient
- Schedule a new appointment directly from the patient detail page

### AI Assistant Chatbot
- Floating chat interface accessible from every authenticated page
- Powered by **Anthropic Claude** via a secure Express backend
- Helps users:
  - Navigate the system (e.g., how to add a patient)
  - Answer general clinic workflow questions
  - Get contextual guidance without leaving the page
- The API key is **never exposed to the frontend** — all AI calls go through the backend proxy

### Dashboard
- View live clinic metrics at a glance:
  - Total patients
  - Scheduled appointments
  - Completed appointments
  - Cancelled appointments
- **Recharts pie chart** showing appointment status distribution
- Recent patients panel
- Recent appointments panel

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router v6
- Recharts
- Lucide React (icons)
- React Hot Toast (notifications)

### Backend / BaaS
- Firebase Authentication
- Firestore

### AI Backend
- Node.js + Express (secure proxy server)
- Anthropic Claude API (`claude-3-5-haiku`)

## Live Demo

https://carehub.vercel.app/

## Running the Project Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm
- Git

### 1. Clone the Repository

    git clone https://github.com/your-username/carehub.git
    cd carehub

### 2. Install Frontend Dependencies

    npm install

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

> Do not commit your `.env` file. Add it to `.gitignore`.

### 4. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database
4. Copy your Firebase config values into your `.env` file
5. In the Firestore console, set the following security rules for development:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Setup the AI Backend

Install backend dependencies:

    cd server
    npm install

Create a `.env` file inside the `server/` directory and add:

    ANTHROPIC_API_KEY=your_anthropic_api_key
    PORT=5000
    FRONTEND_URL=http://localhost:5173

Get your API key at [console.anthropic.com](https://console.anthropic.com).

> Do not commit `server/.env`. Add it to `.gitignore`.

### 6. Run the Development Servers

You need two terminals running simultaneously.

**Terminal 1 — Frontend:**

    npm run dev

**Terminal 2 — AI Backend:**

    npm run server:dev

The Vite dev server automatically proxies all `/api/*` requests to the Express backend.

### 7. Open in Browser

    http://localhost:5173

### 8. Test the App Flow

- Create an account
- Add a patient profile
- Schedule an appointment for that patient
- View the dashboard metrics update in real time
- Open the AI chatbot and ask how to navigate the system
- Edit and delete records using the dedicated full-page forms

### Common Issues

**1. Firebase not working**
- Ensure all config values in `.env` are correct and match your Firebase project
- Check that Authentication (Email/Password) and Firestore are both enabled in the Firebase console

**2. Environment variables not loading**
- Restart the dev server after editing `.env`
- Ensure all frontend variables start with `VITE_`

**3. AI chatbot not responding**
- Make sure the Express backend is running in a second terminal
- Verify your Anthropic API key in `server/.env` is valid
- Check the terminal running the backend for error logs

**4. Firestore permission errors**
- Confirm your Firestore security rules allow authenticated reads and writes
- Make sure you are logged in before accessing any protected page
