# Music Management Website

A user-specific music management website built with ReactJS, Redux, and Material-UI.

## Features

### Authentication
- **Sign Up Page**: User registration with form validation
- **Login Page**: User authentication with demo credentials
- **Protected Routes**: Secure access to authenticated pages
- **Session Management**: Persistent login state

### Song Management
- **Song List Page**: View all user's songs with advanced features:
  - Add, Edit, Delete, and Play buttons for each song
  - Search functionality (by title, singer, or album)
  - Advanced filters:
    - Filter by singer
    - Filter by year range (slider)
    - Sort by title, singer, year, or date added
    - Sort order (ascending/descending)
  - Responsive table layout
  - Confirmation dialog for deletions

- **Add New Song Page**: Create new songs with validation:
  - Song title, singer, album, year, genre, duration
  - Form validation with error messages
  - Duration format validation (MM:SS)

- **Edit Song Page**: Modify existing songs:
  - Pre-populated form with current song data
  - Same validation as Add Song page
  - Update functionality

## Technology Stack

- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **Emotion** for styling

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd music-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: demo@example.com
- **Password**: password

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── SongListPage.tsx
│   ├── AddSongPage.tsx
│   └── EditSongPage.tsx
├── store/              # Redux store configuration
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       └── songsSlice.ts
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Features Implementation

### Authentication Flow
- Mock authentication system with localStorage persistence
- Automatic session restoration on app reload
- Protected route implementation
- Form validation with comprehensive error handling

### Song Management
- Mock data with sample songs for demonstration
- Full CRUD operations (Create, Read, Update, Delete)
- Advanced search and filtering capabilities
- Responsive design for mobile and desktop
- Confirmation dialogs for destructive actions

### State Management
- Redux Toolkit for predictable state updates
- Separate slices for authentication and songs
- Async thunks for API simulation
- TypeScript integration for type safety

### UI/UX
- Material-UI components for consistent design
- Responsive layout that works on all devices
- Loading states and error handling
- Intuitive navigation with breadcrumbs
- Form validation with real-time feedback

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Future Enhancements

- Real backend API integration
- User profile management
- Playlist functionality
- Music file upload and playback
- Social features (sharing, recommendations)
- Advanced analytics and reporting
- Dark/light theme toggle
- Offline support with service workers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.