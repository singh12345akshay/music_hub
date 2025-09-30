import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    AppBar,
    Toolbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Fade,
    Avatar,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as PlayIcon,
    Logout as LogoutIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSongs, deleteSong, setSearchTerm, setSingerFilter, setYearRangeFilter, setSortBy, setSortOrder, clearFilters } from '../store/slices/songsSlice';
import { logoutUser } from '../store/slices/authSlice';
import { Song } from '../store/slices/songsSlice';

const SongListPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const songsState = useAppSelector((state) => state.songs);
    const songs = (songsState as any).songs;
    const loading = (songsState as any).loading;
    const error = (songsState as any).error;
    const searchTerm = (songsState as any).searchTerm;
    const filters = (songsState as any).filters;

    const [showFilters, setShowFilters] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [songToDelete, setSongToDelete] = useState<Song | null>(null);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchSongs(user.id));
        }
    }, [dispatch, user?.id]);

    // Filter and sort songs
    const filteredAndSortedSongs = useMemo(() => {
        let filtered = songs.filter((song: any) => {
            const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.singer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.album.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSinger = !filters.singer || song.singer.toLowerCase().includes(filters.singer.toLowerCase());

            const matchesYear = song.year >= filters.yearRange.min && song.year <= filters.yearRange.max;

            return matchesSearch && matchesSinger && matchesYear;
        });

        // Sort songs
        filtered.sort((a: any, b: any) => {
            let aValue: any = a[filters.sortBy];
            let bValue: any = b[filters.sortBy];

            if (filters.sortBy === 'createdAt') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (filters.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [songs, searchTerm, filters]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(event.target.value));
    };

    const handleSingerFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSingerFilter(event.target.value));
    };

    const handleYearRangeChange = (event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        dispatch(setYearRangeFilter({ min, max }));
    };

    const handleSortByChange = (event: any) => {
        dispatch(setSortBy(event.target.value));
    };

    const handleSortOrderChange = (event: any) => {
        dispatch(setSortOrder(event.target.value));
    };

    const handleDeleteClick = (song: Song) => {
        setSongToDelete(song);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (songToDelete) {
            dispatch(deleteSong(songToDelete.id));
            setDeleteDialogOpen(false);
            setSongToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSongToDelete(null);
    };

    const handlePlay = (song: any) => {
        // In a real app, this would integrate with a music player
        alert(`Playing: ${song.title} by ${song.singer}`);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const clearAllFilters = () => {
        dispatch(clearFilters());
    };

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <AppBar
                position="static"
                sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                }}
            >
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        🎵 My Music Library
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/api-demo')}
                            sx={{
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            🚀 API Demo
                        </Button>
                        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Welcome, {user?.name}
                        </Typography>
                        <Tooltip title="Logout">
                            <IconButton
                                color="inherit"
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Fade in timeout={600}>
                    <Card
                        elevation={8}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    🎶 My Songs
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/songs/add')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                                        },
                                        transition: 'all 0.3s ease',
                                        px: 3,
                                        py: 1.5,
                                    }}
                                >
                                    Add New Song
                                </Button>
                            </Box>

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        '& .MuiAlert-message': {
                                            fontWeight: 500,
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            {/* Search and Filter Controls */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <TextField
                                            fullWidth
                                            placeholder="🔍 Search songs, singers, or albums..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<FilterIcon />}
                                                onClick={() => setShowFilters(!showFilters)}
                                                sx={{
                                                    borderRadius: 2,
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        borderColor: 'primary.dark',
                                                        background: 'rgba(99, 102, 241, 0.04)',
                                                    },
                                                }}
                                            >
                                                Filters
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={clearAllFilters}
                                                sx={{
                                                    borderRadius: 2,
                                                    borderColor: 'secondary.main',
                                                    color: 'secondary.main',
                                                    '&:hover': {
                                                        borderColor: 'secondary.dark',
                                                        background: 'rgba(236, 72, 153, 0.04)',
                                                    },
                                                }}
                                            >
                                                Clear All
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <Fade in timeout={400}>
                                        <Box
                                            sx={{
                                                mt: 3,
                                                p: 3,
                                                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                borderRadius: 2,
                                                border: '1px solid #e2e8f0',
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                                                🎛️ Advanced Filters
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Filter by Singer"
                                                        value={filters.singer}
                                                        onChange={handleSingerFilterChange}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Sort By</InputLabel>
                                                        <Select
                                                            value={filters.sortBy}
                                                            label="Sort By"
                                                            onChange={handleSortByChange}
                                                        >
                                                            <MenuItem value="title">Title</MenuItem>
                                                            <MenuItem value="singer">Singer</MenuItem>
                                                            <MenuItem value="year">Year</MenuItem>
                                                            <MenuItem value="createdAt">Date Added</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Sort Order</InputLabel>
                                                        <Select
                                                            value={filters.sortOrder}
                                                            label="Sort Order"
                                                            onChange={handleSortOrderChange}
                                                        >
                                                            <MenuItem value="asc">Ascending</MenuItem>
                                                            <MenuItem value="desc">Descending</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
                                                    <Typography gutterBottom>Year Range: {filters.yearRange.min} - {filters.yearRange.max}</Typography>
                                                    <Slider
                                                        value={[filters.yearRange.min, filters.yearRange.max]}
                                                        onChange={handleYearRangeChange}
                                                        valueLabelDisplay="auto"
                                                        min={1900}
                                                        max={new Date().getFullYear()}
                                                        step={1}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Fade>
                                )}
                            </Box>

                            {/* Songs Table */}
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                                    <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                                </Box>
                            ) : (
                                <TableContainer
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>🎵 Title</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>🎤 Singer</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>💿 Album</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>📅 Year</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>🎭 Genre</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>⏱️ Duration</TableCell>
                                                <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>⚡ Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredAndSortedSongs.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                                            {searchTerm || filters.singer || filters.yearRange.min > 1900 || filters.yearRange.max < new Date().getFullYear()
                                                                ? '🔍 No songs match your search criteria'
                                                                : '🎵 No songs found. Add your first song!'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {!searchTerm && !filters.singer && filters.yearRange.min === 1900 && filters.yearRange.max === new Date().getFullYear()
                                                                ? 'Start building your music collection by adding your favorite songs.'
                                                                : 'Try adjusting your search criteria or filters.'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredAndSortedSongs.map((song: any, index: any) => (
                                                    <TableRow
                                                        key={song.id}
                                                        hover
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(99, 102, 241, 0.02)',
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                                                transform: 'scale(1.01)',
                                                                transition: 'all 0.2s ease',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                                {song.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                {song.singer}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {song.album}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {song.year}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={song.genre}
                                                                size="small"
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                                                    color: 'white',
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {song.duration}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                <Tooltip title="Play Song">
                                                                    <IconButton
                                                                        onClick={() => handlePlay(song)}
                                                                        sx={{
                                                                            color: 'success.main',
                                                                            '&:hover': {
                                                                                background: 'rgba(34, 197, 94, 0.1)',
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <PlayIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Edit Song">
                                                                    <IconButton
                                                                        onClick={() => navigate(`/songs/edit/${song.id}`)}
                                                                        sx={{
                                                                            color: 'primary.main',
                                                                            '&:hover': {
                                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete Song">
                                                                    <IconButton
                                                                        onClick={() => handleDeleteClick(song)}
                                                                        sx={{
                                                                            color: 'error.main',
                                                                            '&:hover': {
                                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Fade>
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontWeight: 600,
                }}>
                    🗑️ Delete Song
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to delete this song?
                    </Typography>
                    <Box sx={{
                        p: 2,
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                            "{songToDelete?.title}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            by {songToDelete?.singer}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        ⚠️ This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            },
                            borderRadius: 2,
                        }}
                    >
                        Delete Song
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SongListPage;
