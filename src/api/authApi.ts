// Mock API for authentication
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Mock users storage (in a real app, this would be a database)
let mockUsers: User[] = [
    {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date('2024-01-01').toISOString(),
    },
    {
        id: '2',
        email: 'john@example.com',
        name: 'John Doe',
        createdAt: new Date('2024-01-02').toISOString(),
    },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const authApi = {
    // Login user
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        await delay(1000); // Simulate network delay

        const user = mockUsers.find(u => u.email === credentials.email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // In a real app, you would verify the password hash
        if (credentials.password !== 'password') {
            throw new Error('Invalid email or password');
        }

        const token = `mock-token-${user.id}-${Date.now()}`;

        return {
            user,
            token,
        };
    },

    // Register new user
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        await delay(1200); // Simulate slower registration

        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser: User = {
            id: Date.now().toString(),
            email: userData.email,
            name: userData.name,
            createdAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);

        const token = `mock-token-${newUser.id}-${Date.now()}`;

        return {
            user: newUser,
            token,
        };
    },

    // Verify token (for protected routes)
    async verifyToken(token: string): Promise<User | null> {
        await delay(500);

        // Extract user ID from mock token
        const tokenParts = token.split('-');
        if (tokenParts.length < 3 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'token') {
            return null;
        }

        const userId = tokenParts[2];
        const user = mockUsers.find(u => u.id === userId);

        return user || null;
    },

    // Logout (in a real app, this might invalidate the token on the server)
    async logout(token: string): Promise<void> {
        await delay(300);
        // In a real app, you would invalidate the token on the server
        console.log('User logged out:', token);
    },

    // Get user by ID
    async getUserById(userId: string): Promise<User | null> {
        await delay(400);

        const user = mockUsers.find(u => u.id === userId);
        return user || null;
    },

    // Update user profile
    async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
        await delay(600);

        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return null;
        }

        const updatedUser = {
            ...mockUsers[userIndex],
            ...updates,
        };

        mockUsers[userIndex] = updatedUser;
        return updatedUser;
    },
};

// Demo credentials for easy testing
export const DEMO_CREDENTIALS = {
    email: 'demo@example.com',
    password: 'password',
    name: 'Demo User',
};
