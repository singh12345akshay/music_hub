// Mock API for songs management
export interface Song {
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

export interface CreateSongRequest {
    title: string;
    singer: string;
    album: string;
    year: number;
    genre: string;
    duration: string;
    userId: string;
}

export interface UpdateSongRequest {
    title?: string;
    singer?: string;
    album?: string;
    year?: number;
    genre?: string;
    duration?: string;
}

// Mock data storage (in a real app, this would be a database)
let mockSongs: Song[] = [
    {
        id: '1',
        title: 'Bohemian Rhapsody',
        singer: 'Queen',
        album: 'A Night at the Opera',
        year: 1975,
        genre: 'Rock',
        duration: '5:55',
        userId: '1',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
        id: '2',
        title: 'Imagine',
        singer: 'John Lennon',
        album: 'Imagine',
        year: 1971,
        genre: 'Pop',
        duration: '3:07',
        userId: '1',
        createdAt: new Date('2024-01-16').toISOString(),
        updatedAt: new Date('2024-01-16').toISOString(),
    },
    {
        id: '3',
        title: 'Hotel California',
        singer: 'Eagles',
        album: 'Hotel California',
        year: 1976,
        genre: 'Rock',
        duration: '6:30',
        userId: '1',
        createdAt: new Date('2024-01-17').toISOString(),
        updatedAt: new Date('2024-01-17').toISOString(),
    },
    {
        id: '4',
        title: 'Billie Jean',
        singer: 'Michael Jackson',
        album: 'Thriller',
        year: 1982,
        genre: 'Pop',
        duration: '4:54',
        userId: '1',
        createdAt: new Date('2024-01-18').toISOString(),
        updatedAt: new Date('2024-01-18').toISOString(),
    },
    {
        id: '5',
        title: 'Sweet Child O\' Mine',
        singer: 'Guns N\' Roses',
        album: 'Appetite for Destruction',
        year: 1987,
        genre: 'Rock',
        duration: '5:56',
        userId: '1',
        createdAt: new Date('2024-01-19').toISOString(),
        updatedAt: new Date('2024-01-19').toISOString(),
    },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const songsApi = {
    // Get all songs for a user
    async getSongs(userId: string): Promise<Song[]> {
        await delay(800); // Simulate network delay

        const userSongs = mockSongs.filter(song => song.userId === userId);
        return userSongs;
    },

    // Get a single song by ID
    async getSongById(songId: string): Promise<Song | null> {
        await delay(500);

        const song = mockSongs.find(song => song.id === songId);
        return song || null;
    },

    // Create a new song
    async createSong(songData: CreateSongRequest): Promise<Song> {
        await delay(1000); // Simulate slower creation

        const newSong: Song = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...songData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        mockSongs.push(newSong);
        return newSong;
    },

    // Update an existing song
    async updateSong(songId: string, songData: UpdateSongRequest): Promise<Song | null> {
        await delay(800);

        const songIndex = mockSongs.findIndex(song => song.id === songId);
        if (songIndex === -1) {
            return null;
        }

        const updatedSong: Song = {
            ...mockSongs[songIndex],
            ...songData,
            updatedAt: new Date().toISOString(),
        };

        mockSongs[songIndex] = updatedSong;
        return updatedSong;
    },

    // Delete a song
    async deleteSong(songId: string): Promise<boolean> {
        await delay(600);

        const songIndex = mockSongs.findIndex(song => song.id === songId);
        if (songIndex === -1) {
            return false;
        }

        mockSongs.splice(songIndex, 1);
        return true;
    },

    // Search songs
    async searchSongs(userId: string, query: string): Promise<Song[]> {
        await delay(500);

        const userSongs = mockSongs.filter(song => song.userId === userId);
        const searchTerm = query.toLowerCase();

        return userSongs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            song.singer.toLowerCase().includes(searchTerm) ||
            song.album.toLowerCase().includes(searchTerm) ||
            song.genre.toLowerCase().includes(searchTerm)
        );
    },

    // Get songs by genre
    async getSongsByGenre(userId: string, genre: string): Promise<Song[]> {
        await delay(400);

        return mockSongs.filter(song =>
            song.userId === userId &&
            song.genre.toLowerCase() === genre.toLowerCase()
        );
    },

    // Get songs by year range
    async getSongsByYearRange(userId: string, minYear: number, maxYear: number): Promise<Song[]> {
        await delay(400);

        return mockSongs.filter(song =>
            song.userId === userId &&
            song.year >= minYear &&
            song.year <= maxYear
        );
    },

    // Get statistics
    async getSongStats(userId: string): Promise<{
        totalSongs: number;
        totalArtists: number;
        totalAlbums: number;
        genres: { [key: string]: number };
        yearRange: { min: number; max: number };
    }> {
        await delay(300);

        const userSongs = mockSongs.filter(song => song.userId === userId);
        const artists = new Set(userSongs.map(song => song.singer));
        const albums = new Set(userSongs.map(song => song.album));
        const genres: { [key: string]: number } = {};

        userSongs.forEach(song => {
            genres[song.genre] = (genres[song.genre] || 0) + 1;
        });

        const years = userSongs.map(song => song.year);

        return {
            totalSongs: userSongs.length,
            totalArtists: artists.size,
            totalAlbums: albums.size,
            genres,
            yearRange: {
                min: Math.min(...years),
                max: Math.max(...years),
            },
        };
    },
};

// Error simulation (optional - for testing error handling)
export const simulateApiError = (probability: number = 0.1) => {
    if (Math.random() < probability) {
        throw new Error('Simulated API error - please try again');
    }
};
