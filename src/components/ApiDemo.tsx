import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Divider,
} from '@mui/material';
import { songsApi, authApi, DEMO_CREDENTIALS } from '../api';

const ApiDemo: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleApiCall = async (apiCall: () => Promise<any>, description: string) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await apiCall();
            setResult({ description, data: response });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const apiTests = [
        {
            name: 'Login Demo User',
            description: 'Authenticate with demo credentials',
            action: () => authApi.login(DEMO_CREDENTIALS),
        },
        {
            name: 'Get User Songs',
            description: 'Fetch all songs for user ID 1',
            action: () => songsApi.getSongs('1'),
        },
        {
            name: 'Search Songs',
            description: 'Search for songs containing "queen"',
            action: () => songsApi.searchSongs('1', 'queen'),
        },
        {
            name: 'Get Song Stats',
            description: 'Get statistics for user ID 1',
            action: () => songsApi.getSongStats('1'),
        },
        {
            name: 'Create New Song',
            description: 'Add a new song to the collection',
            action: () => songsApi.createSong({
                title: 'Test Song',
                singer: 'Test Artist',
                album: 'Test Album',
                year: 2024,
                genre: 'Test',
                duration: '3:30',
                userId: '1',
            }),
        },
    ];

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{
                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 3
            }}>
                🚀 API Demo Console
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Test the dummy APIs with pre-configured examples. Each API call includes realistic delays
                to simulate real network requests.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                {apiTests.map((test, index) => (
                    <Button
                        key={index}
                        variant="outlined"
                        onClick={() => handleApiCall(test.action, test.description)}
                        disabled={loading}
                        sx={{
                            minWidth: 200,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                                color: 'white',
                                borderColor: 'transparent',
                            },
                        }}
                    >
                        {test.name}
                    </Button>
                ))}
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress size={40} sx={{ color: 'primary.main' }} />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        ❌ API Error
                    </Typography>
                    {error}
                </Alert>
            )}

            {result && (
                <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            ✅ {result.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{
                            bgcolor: 'background.paper',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Response Data:
                            </Typography>
                            <pre style={{
                                fontSize: '12px',
                                overflow: 'auto',
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </Box>

                        {Array.isArray(result.data) && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Quick Stats:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={`${result.data.length} items`}
                                        color="primary"
                                        size="small"
                                    />
                                    {result.data.length > 0 && typeof result.data[0] === 'object' && (
                                        <Chip
                                            label={`Type: ${Object.keys(result.data[0]).join(', ')}`}
                                            color="secondary"
                                            size="small"
                                        />
                                    )}
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    💡 Demo Credentials:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Email: <code>demo@example.com</code> | Password: <code>password</code>
                </Typography>
            </Box>
        </Box>
    );
};

export default ApiDemo;
