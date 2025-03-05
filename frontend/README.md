# React Redux Frontend for Project Management Application

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)
![Material-UI](https://img.shields.io/badge/Material--UI-5-0081CB?logo=material-ui)
![i18next](https://img.shields.io/badge/i18next-Multilingual-26A69A)

## 📋 Overview

This is the frontend component of the Project Management Application, built with React and Redux. It provides a modern, responsive user interface for managing projects and tasks.

## 🧠 Learning Experience

Developing this frontend allowed me to deepen my understanding of React and Redux. Through this project, I:

- Mastered Redux Toolkit for efficient state management
- Implemented complex form handling with Formik and Yup
- Created a responsive design using Material-UI components
- Implemented internationalization with i18next
- Developed a clean component architecture
- Practiced modern React patterns including hooks and context

## 🛠️ Technologies Used

- **React**: UI library for building the user interface
- **Redux & Redux Toolkit**: State management for complex application state
- **Material-UI**: Component library for modern, responsive design
- **i18next**: Internationalization for multilingual support
- **Formik & Yup**: Form handling and validation
- **Axios**: HTTP client for API communication
- **React Router**: Navigation and routing

## 📁 Project Structure

```
frontend/
├── public/             # Static files
└── src/                # React source code
    ├── components/     # Reusable React components
    │   ├── auth/       # Authentication components
    │   ├── layout/     # Layout components
    │   ├── projects/   # Project-related components
    │   └── tasks/      # Task-related components
    ├── i18n/           # Internationalization
    │   └── locales/    # Language files
    ├── pages/          # Page components
    ├── redux/          # Redux store and slices
    │   ├── slices/     # Redux Toolkit slices
    │   └── store.js    # Redux store configuration
    ├── services/       # API services
    ├── utils/          # Utility functions
    ├── App.js          # Main application component
    └── index.js        # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

   The frontend development server will start on http://localhost:3000.

## 🎨 Features and Implementation

### User Authentication
- Login and registration forms with validation
- JWT token management
- Protected routes for authenticated users
- User profile management

### Project Management
- Project listing with filtering and sorting
- Project creation and editing forms
- Project details view with task management
- Project deletion with confirmation

### Task Management
- Task listing with filtering by status, priority, and assignee
- Task creation and editing forms
- Task status updates with drag-and-drop interface
- Due date management with date picker
- Task assignment to users

### Multilingual Support
- English and Turkish language support
- Language switcher component
- Persistent language preference

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly components for mobile users

## 🧪 Testing

Run the tests with:

```bash
npm test
# or
yarn test
```

## 📝 Key Learnings from React/Redux Development

### 1. Redux Toolkit
- Implemented createSlice for efficient reducer creation
- Used createAsyncThunk for handling async operations
- Managed complex state with normalized data structures
- Implemented optimistic updates for better UX

### 2. React Component Design
- Created reusable, composable components
- Implemented custom hooks for shared logic
- Used React.memo and useCallback for performance optimization
- Implemented error boundaries for graceful error handling

### 3. Form Handling
- Built complex forms with Formik
- Implemented validation schemas with Yup
- Created custom form components for reusability
- Handled form submission and error states

### 4. Internationalization
- Implemented i18next for multilingual support
- Created translation files for multiple languages
- Built a language switcher component
- Handled dynamic content translation

### 5. Material-UI Customization
- Created a custom theme for consistent styling
- Built responsive layouts with Grid and Box components
- Implemented custom styled components
- Used Material-UI's theming system for dark/light mode

## 🚧 Future Improvements

- Add comprehensive test coverage with Jest and React Testing Library
- Implement Storybook for component documentation
- Add advanced filtering and searching capabilities
- Implement data visualization for project metrics
- Add drag-and-drop for task prioritization
- Implement offline support with service workers
