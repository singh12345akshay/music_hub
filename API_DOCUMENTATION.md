# Music Management App - Dummy API Documentation

This document describes the dummy APIs implemented for the Music Management application.

## Overview

The application uses mock APIs that simulate real backend behavior with:
- Network delays to simulate real API calls
- Error handling and validation
- Persistent data storage (in-memory)
- Realistic response structures

## Authentication API (`authApi.ts`)

### Endpoints

#### `login(credentials: LoginRequest)`
- **Purpose**: Authenticate user with email and password
- **Delay**: 1000ms
- **Demo Credentials**: 
  - Email: `demo@example.com`
  - Password: `password`

#### `register(userData: RegisterRequest)`
- **Purpose**: Create new user account
- **Delay**: 1200ms
- **Validation**: Checks for existing email addresses

#### `verifyToken(token: string)`
- **Purpose**: Verify authentication token
- **Delay**: 500ms

#### `logout(token: string)`
- **Purpose**: Logout user (invalidates token)
- **Delay**: 300ms

### Data Structures

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
```

## Songs API (`songsApi.ts`)

### Endpoints

#### `getSongs(userId: string)`
- **Purpose**: Get all songs for a specific user
- **Delay**: 800ms
- **Returns**: Array of user's songs

#### `getSongById(songId: string)`
- **Purpose**: Get single song by ID
- **Delay**: 500ms

#### `createSong(songData: CreateSongRequest)`
- **Purpose**: Add new song to user's collection
- **Delay**: 1000ms
- **Auto-generates**: ID, createdAt, updatedAt

#### `updateSong(songId: string, songData: UpdateSongRequest)`
- **Purpose**: Update existing song
- **Delay**: 800ms
- **Auto-updates**: updatedAt timestamp

#### `deleteSong(songId: string)`
- **Purpose**: Remove song from collection
- **Delay**: 600ms

#### `searchSongs(userId: string, query: string)`
- **Purpose**: Search songs by title, singer, album, or genre
- **Delay**: 500ms

#### `getSongsByGenre(userId: string, genre: string)`
- **Purpose**: Filter songs by genre
- **Delay**: 400ms

#### `getSongsByYearRange(userId: string, minYear: number, maxYear: number)`
- **Purpose**: Filter songs by year range
- **Delay**: 400ms

#### `getSongStats(userId: string)`
- **Purpose**: Get user's song statistics
- **Delay**: 300ms
- **Returns**: Total songs, artists, albums, genre breakdown, year range

### Data Structures

```typescript
interface Song {
  id: string;
  title: string;
  singer: string;
  album: string;
  year: number;
  genre: string;
  duration: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateSongRequest {
  title: string;
  singer: string;
  album: string;
  year: number;
  genre: string;
  duration: string;
  userId: string;
}

interface UpdateSongRequest {
  title?: string;
  singer?: string;
  album?: string;
  year?: number;
  genre?: string;
  duration?: string;
}
```

## Sample Data

The APIs come pre-loaded with sample songs:

1. **Bohemian Rhapsody** - Queen (1975)
2. **Imagine** - John Lennon (1971)
3. **Hotel California** - Eagles (1976)
4. **Billie Jean** - Michael Jackson (1982)
5. **Sweet Child O' Mine** - Guns N' Roses (1987)

## Error Handling

All APIs include proper error handling:
- Network timeouts
- Validation errors
- Not found errors
- Duplicate entry errors

## Usage Examples

### Authentication
```typescript
import { authApi } from './api/authApi';

// Login
const response = await authApi.login({
  email: 'demo@example.com',
  password: 'password'
});

// Register
const newUser = await authApi.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});
```

### Songs Management
```typescript
import { songsApi } from './api/songsApi';

// Get user's songs
const songs = await songsApi.getSongs('1');

// Add new song
const newSong = await songsApi.createSong({
  title: 'New Song',
  singer: 'Artist Name',
  album: 'Album Name',
  year: 2024,
  genre: 'Pop',
  duration: '3:30',
  userId: '1'
});

// Search songs
const results = await songsApi.searchSongs('1', 'queen');
```

## Integration with Redux

The APIs are integrated with Redux Toolkit using `createAsyncThunk`:

```typescript
export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await songsApi.getSongs(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Testing

To test the APIs:

1. **Login**: Use `demo@example.com` / `password`
2. **View Songs**: Navigate to the songs list to see pre-loaded data
3. **Add Songs**: Use the "Add Song" button to create new entries
4. **Search**: Use the search bar to find specific songs
5. **Filter**: Use the filter options to narrow down results

## Future Enhancements

When connecting to a real backend:

1. Replace mock delays with actual HTTP requests
2. Implement proper authentication tokens (JWT)
3. Add pagination for large song collections
4. Implement file upload for song covers
5. Add real-time updates with WebSockets
6. Implement caching strategies
7. Add offline support with service workers
