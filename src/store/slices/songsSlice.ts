import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { songsApi, Song, CreateSongRequest, UpdateSongRequest } from '../../api/songsApi';

export type { Song } from '../../api/songsApi';

export interface SongsState {
    songs: Song[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    filters: {
        singer: string;
        yearRange: { min: number; max: number };
        sortBy: 'title' | 'singer' | 'year' | 'createdAt';
        sortOrder: 'asc' | 'desc';
    };
}

const initialState: SongsState = {
    songs: [],
    loading: false,
    error: null,
    searchTerm: '',
    filters: {
        singer: '',
        yearRange: { min: 1900, max: new Date().getFullYear() },
        sortBy: 'title',
        sortOrder: 'asc',
    },
};

// Removed mock data - now using API

// Async thunks for songs
export const fetchSongs = createAsyncThunk(
    'songs/fetchSongs',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await songsApi.getSongs(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch songs');
        }
    }
);

export const addSong = createAsyncThunk(
    'songs/addSong',
    async (songData: CreateSongRequest, { rejectWithValue }) => {
        try {
            const response = await songsApi.createSong(songData);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to add song');
        }
    }
);

export const updateSong = createAsyncThunk(
    'songs/updateSong',
    async ({ id, songData }: { id: string; songData: UpdateSongRequest }, { rejectWithValue }) => {
        try {
            const response = await songsApi.updateSong(id, songData);
            if (!response) {
                throw new Error('Song not found');
            }
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update song');
        }
    }
);

export const deleteSong = createAsyncThunk(
    'songs/deleteSong',
    async (songId: string, { rejectWithValue }) => {
        try {
            const success = await songsApi.deleteSong(songId);
            if (!success) {
                throw new Error('Song not found');
            }
            return songId;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete song');
        }
    }
);

export const searchSongs = createAsyncThunk(
    'songs/searchSongs',
    async ({ userId, query }: { userId: string; query: string }, { rejectWithValue }) => {
        try {
            const response = await songsApi.searchSongs(userId, query);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to search songs');
        }
    }
);

export const getSongStats = createAsyncThunk(
    'songs/getSongStats',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await songsApi.getSongStats(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to get song statistics');
        }
    }
);

const songsSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setSingerFilter: (state, action: PayloadAction<string>) => {
            state.filters.singer = action.payload;
        },
        setYearRangeFilter: (state, action: PayloadAction<{ min: number; max: number }>) => {
            state.filters.yearRange = action.payload;
        },
        setSortBy: (state, action: PayloadAction<'title' | 'singer' | 'year' | 'createdAt'>) => {
            state.filters.sortBy = action.payload;
        },
        setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
            state.filters.sortOrder = action.payload;
        },
        clearFilters: (state) => {
            state.searchTerm = '';
            state.filters = {
                singer: '',
                yearRange: { min: 1900, max: new Date().getFullYear() },
                sortBy: 'title',
                sortOrder: 'asc',
            };
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch songs
            .addCase(fetchSongs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongs.fulfilled, (state, action) => {
                state.loading = false;
                state.songs = action.payload;
                state.error = null;
            })
            .addCase(fetchSongs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add song
            .addCase(addSong.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSong.fulfilled, (state, action) => {
                state.loading = false;
                state.songs.push(action.payload);
                state.error = null;
            })
            .addCase(addSong.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update song
            .addCase(updateSong.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSong.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.songs.findIndex(song => song.id === action.payload.id);
                if (index !== -1) {
                    state.songs[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateSong.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete song
            .addCase(deleteSong.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSong.fulfilled, (state, action) => {
                state.loading = false;
                state.songs = state.songs.filter(song => song.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteSong.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setSearchTerm,
    setSingerFilter,
    setYearRangeFilter,
    setSortBy,
    setSortOrder,
    clearFilters,
    clearError,
} = songsSlice.actions;

export default songsSlice.reducer;
