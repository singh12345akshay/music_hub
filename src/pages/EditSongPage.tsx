import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
    Card,
    CardContent,
    Fade,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSong, clearError } from '../store/slices/songsSlice';
import { Song } from '../store/slices/songsSlice';

const schema = yup.object({
    title: yup
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must be less than 100 characters')
        .required('Title is required'),
    singer: yup
        .string()
        .min(1, 'Singer is required')
        .max(100, 'Singer name must be less than 100 characters')
        .required('Singer is required'),
    album: yup
        .string()
        .min(1, 'Album is required')
        .max(100, 'Album name must be less than 100 characters')
        .required('Album is required'),
    year: yup
        .number()
        .min(1900, 'Year must be 1900 or later')
        .max(new Date().getFullYear() + 1, `Year must be ${new Date().getFullYear() + 1} or earlier`)
        .required('Year is required'),
    genre: yup
        .string()
        .min(1, 'Genre is required')
        .max(50, 'Genre must be less than 50 characters')
        .required('Genre is required'),
    duration: yup
        .string()
        .matches(/^\d{1,2}:\d{2}$/, 'Duration must be in MM:SS format')
        .required('Duration is required'),
});

interface SongFormData {
    title: string;
    singer: string;
    album: string;
    year: number;
    genre: string;
    duration: string;
}

const EditSongPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector((state) => state.auth);
    const { songs, loading, error } = useAppSelector((state) => state.songs);

    const [song, setSong] = useState<Song | null>(null);
    const [loadingSong, setLoadingSong] = useState(true);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SongFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            singer: '',
            album: '',
            year: new Date().getFullYear(),
            genre: '',
            duration: '',
        },
    });

    useEffect(() => {
        if (id && songs.length > 0) {
            const foundSong = songs.find(s => s.id === id);
            if (foundSong) {
                setSong(foundSong);
                reset({
                    title: foundSong.title,
                    singer: foundSong.singer,
                    album: foundSong.album,
                    year: foundSong.year,
                    genre: foundSong.genre,
                    duration: foundSong.duration,
                });
            } else {
                // Song not found, redirect to songs list
                navigate('/songs');
            }
            setLoadingSong(false);
        }
    }, [id, songs, reset, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data: SongFormData) => {
        if (song && user?.id) {
            const result = await dispatch(updateSong({
                id: song.id,
                songData: {
                    ...data,
                },
            }));

            if (updateSong.fulfilled.match(result)) {
                navigate('/songs');
            }
        }
    };

    const handleBack = () => {
        navigate('/songs');
    };

    if (loadingSong) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!song) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Alert severity="error">
                        Song not found.
                    </Alert>
                    <Button onClick={handleBack} sx={{ mt: 2 }}>
                        Back to Songs
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <AppBar
                position="static"
                sx={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleBack}
                        sx={{
                            mr: 2,
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        ✏️ Edit Song
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                padding: 3,
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                ✏️ Edit Song
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 400,
                                }}
                            >
                                Update your music collection
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
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

                            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <Controller
                                            name="title"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="🎵 Song Title"
                                                    error={!!errors.title}
                                                    helperText={errors.title?.message}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'secondary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <Controller
                                            name="singer"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="🎤 Singer/Artist"
                                                    error={!!errors.singer}
                                                    helperText={errors.singer?.message}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'secondary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <Controller
                                            name="album"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="💿 Album"
                                                    error={!!errors.album}
                                                    helperText={errors.album?.message}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'secondary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <Controller
                                            name="year"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="📅 Year"
                                                    type="number"
                                                    error={!!errors.year}
                                                    helperText={errors.year?.message}
                                                    required
                                                    inputProps={{
                                                        min: 1900,
                                                        max: new Date().getFullYear() + 1,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'secondary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <Controller
                                            name="genre"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="🎭 Genre"
                                                    error={!!errors.genre}
                                                    helperText={errors.genre?.message}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'secondary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                        <Controller
                                            name="duration"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="⏱️ Duration (MM:SS)"
                                                    placeholder="3:45"
                                                    error={!!errors.duration}
                                                    helperText={errors.duration?.message || 'Format: MM:SS (e.g., 3:45)'}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'secondary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                        disabled={loading}
                                        size="large"
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1.5,
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            '&:hover': {
                                                borderColor: 'primary.dark',
                                                background: 'rgba(99, 102, 241, 0.04)',
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        size="large"
                                        sx={{
                                            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
                                            },
                                            transition: 'all 0.3s ease',
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1.5,
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Song'}
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default EditSongPage;
