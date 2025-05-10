# 🎓 Student Dashboard

A modern, responsive student management system with a sleek UI, dark mode support, and real-time updates. This dashboard provides educators and administrators with powerful tools to manage student data effectively.

## ✨ Features

- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark/Light Mode** - Toggle between dark and light themes for comfortable viewing
- **🔐 User Authentication** - Secure Google account login functionality
- **🔍 Advanced Filtering** - Filter students by course, search by name, email, or course
- **📊 Student Analytics** - View attendance percentages and grades at a glance
- **✏️ CRUD Operations** - Create, read, update, and delete student records
- **🔔 Toast Notifications** - Real-time feedback on all user actions
- **🎭 Animations** - Smooth transitions and animations using Framer Motion and AOS
- **💾 Persistent Storage** - Student data persists using localStorage
- **🔄 Mock API** - Simulated backend API for demonstration purposes

## 🔧 Technologies Used

- **React** - Frontend library for building the user interface
- **Framer Motion** - Animation library for React
- **AOS** - Animate On Scroll library
- **Firebase** - Authentication services
- **Axios** - HTTP client for API requests
- **Axios Mock Adapter** - Mocking API responses
- **Lucide React** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications
- **TailwindCSS** - Utility-first CSS framework (implied in code)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/student-dashboard.git
   cd student-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase credentials
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📱 Application Structure

### Dashboard Overview
The main dashboard displays a list of students with key information:
- Profile picture
- Name
- Email
- Course
- Grade
- Attendance percentage

### Authentication
- Users can sign in with their Google account
- Authentication state is preserved across sessions
- Certain actions (add, edit, delete) require authentication

### Student Management
- **Add new students** with comprehensive information
- **View detailed profiles** of existing students
- **Edit student information** with form validation
- **Delete students** with confirmation modal

### Filtering and Search
- Filter students by course category
- Search for students by name, email or course
- Results update in real-time

## 🎨 UI Components

### Student Cards
Each student is represented by a card showing:
- Profile picture
- Name and email
- Course details
- Academic performance (grade and attendance)

### Detail View
Clicking on a student card opens a detailed view showing:
- Complete contact information
- Academic records
- Join date
- Options to edit or delete

### Forms
- **Add Student Form** - Create new student records
- **Edit Form** - Update existing student information

## 🔒 Security Features

- Firebase authentication for secure user management
- Protected actions requiring authentication
- Input validation for all form submissions

## 💾 Data Persistence

The application uses localStorage to persist student data, simulating a backend database. This allows for:
- Data retention between sessions
- Offline capability
- Demonstration of CRUD operations without a real backend

## 🌐 API Documentation

This project uses a mock API built with Axios Mock Adapter to simulate backend functionality:

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/students` | GET | Fetch all students |
| `/api/students` | POST | Add a new student |
| `/api/students` | PUT | Update a student |
| `/api/students/:id` | DELETE | Delete a student |





Created with ❤️ by Amit singh
