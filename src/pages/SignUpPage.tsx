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
import { registerUser, clearError } from '../store/slices/authSlice';

const schema = yup.object({
    name: yup
        .string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
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

    const onSubmit = async (data: SignUpFormData) => {
        const { confirmPassword, ...userData } = data;
        dispatch(registerUser(userData));
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
                                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
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
                                🎵 Join Music Hub
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 400,
                                }}
                            >
                                Create Your Account
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
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Full Name"
                                            autoComplete="name"
                                            autoFocus
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
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
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
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
                                            autoComplete="new-password"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
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

                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Confirm Password"
                                            type="password"
                                            id="confirmPassword"
                                            autoComplete="new-password"
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
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

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 4,
                                        mb: 3,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                                </Button>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        or
                                    </Typography>
                                </Divider>

                                <Box textAlign="center">
                                    <Link
                                        component={RouterLink}
                                        to="/login"
                                        variant="body1"
                                        sx={{
                                            color: 'secondary.main',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Already have an account? Sign In
                                    </Link>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default SignUpPage;
