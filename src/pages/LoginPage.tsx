import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Fade,
    Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';

const schema = yup.object({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/songs');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data: LoginFormData) => {
        dispatch(loginUser(data));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Container component="main" maxWidth="sm">
                <Fade in timeout={800}>
                    <Card
                        elevation={24}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                padding: 3,
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                component="h1"
                                variant="h3"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                🎵 Music Hub
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 400,
                                }}
                            >
                                Sign In to Your Account
                            </Typography>
                        </Box>
                        <CardContent sx={{ padding: 4 }}>

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

                            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            autoComplete="email"
                                            autoFocus
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 4,
                                        mb: 3,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                </Button>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        or
                                    </Typography>
                                </Divider>

                                <Box textAlign="center" mb={3}>
                                    <Link
                                        component={RouterLink}
                                        to="/signup"
                                        variant="body1"
                                        sx={{
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Don't have an account? Sign Up
                                    </Link>
                                </Box>

                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 3,
                                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                        borderRadius: 2,
                                        border: '1px solid #e2e8f0',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        align="center"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        🎵 Demo Credentials:
                                        <br />
                                        <strong>Email:</strong> demo@example.com
                                        <br />
                                        <strong>Password:</strong> password
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default LoginPage;
