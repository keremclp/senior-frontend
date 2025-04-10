# 🧠 AI-Assisted Development Guide for Advisor Matching App (React Native + Expo + Cursor AI)

## 📌 Project Summary
An AI-powered mobile application that helps university students match with the most suitable academic advisors based on their uploaded resumes. The app uses Large Language Models (LLMs) for semantic analysis and provides personalized advisor suggestions.

## 🛠️ Technologies Used
### Frontend (React Native + Expo):
- React Native (with Expo CLI)
- React Navigation
- React Native Paper or React Native Elements (for UI)
- Expo Document Picker & FileSystem
- Axios
- AsyncStorage
- @expo/vector-icons

### Backend (Node.js + MongoDB):
- Node.js with Express.js
- MongoDB (via Mongoose)
- JWT for Authentication
- OpenAI API integration for LLM functionality

---

# 📦 Modules Breakdown (with Cursor AI Prompts)

## 1️⃣ Authentication Module
### ✅ Screens:
- LoginScreen
- RegisterScreen
- ForgotPasswordScreen

### 📌 Technologies:
- Custom backend JWT auth (login/register endpoints)
- Form validation via `react-hook-form` or manual logic

### 💬 Cursor Prompts:
```
"Generate a functional React Native login screen with email and password inputs, including validation and secure token handling."

"Build a registration form with full name, email, password, and confirm password. Validate password matching."

"Create a forgot password flow using a text input for email and success confirmation message."
```

---

## 2️⃣ CV Upload Module
### ✅ Screens:
- UploadCVScreen
- CVReviewScreen

### 📌 Technologies:
- `expo-document-picker`
- `expo-file-system`
- Axios to send file to Node.js backend
- Backend: Multer for file parsing, OpenAI API integration

### 💬 Cursor Prompts:
```
"Create a screen that lets users pick a resume file (PDF or DOCX) using Expo Document Picker."

"Write a function to upload the selected file to a Node.js backend API using Axios. Show a loading indicator and handle success/failure."

"Create a component that receives and displays AI-extracted keywords and suggested fields from the resume analysis."
```

---

## 3️⃣ Advisor Matching Module
### ✅ Screens:
- MatchedAdvisorsScreen
- AdvisorDetailScreen

### 📌 Technologies:
- FlatList for advisor cards
- Card components from `react-native-paper` or custom
- Backend API fetches matched advisors using OpenAI LLM semantic analysis

### 💬 Cursor Prompts:
```
"Generate a scrollable list of matched advisors with cards showing name, expertise, image, and match percentage."

"Design a detailed advisor screen displaying bio, publications, projects, and expertise areas fetched from backend."

"Use conditional styling to highlight top-matched advisors visually."
```

---

## 4️⃣ Feedback Module
### ✅ Screens:
- FeedbackScreen
- ThankYouScreen

### 📌 Technologies:
- Star rating input (custom or library)
- Text feedback input
- Send data to feedback endpoint in Node backend

### 💬 Cursor Prompts:
```
"Create a screen with a star rating component and optional comment box. Submit results to the backend."

"After successful feedback submission, show a confirmation screen or toast notification."
```

---

## 5️⃣ Navigation & Context Setup
### 📌 Technologies:
- `@react-navigation/native`
- Context API

### 💬 Cursor Prompts:
```
"Set up a Stack Navigator with authentication and main app screens. Use conditional routing based on login state."

"Implement AuthContext to store and retrieve login state. Use AsyncStorage for persistence."
```

---

## 6️⃣ UI Polish & Reusability
### 📌 Technologies:
- `react-native-paper` or `react-native-elements`
- CustomButton component
- Toasts, Modals, Loaders

### 💬 Cursor Prompts:
```
"Create a reusable button component with custom color, icon, and loading state."

"Add a modal popup for confirmation prompts or error messages."

"Style all input fields with placeholders, icons, and validation error messages."
```

---

## 🧪 Testing & Debugging
Use Cursor to:
- Analyze performance bottlenecks
- Refactor long functio