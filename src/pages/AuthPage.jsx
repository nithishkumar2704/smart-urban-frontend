import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Default role
    });

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const { name, email, password, role } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password, role);
            }
        } catch (error) {
            // Consider using a toast notification here in the future
            alert('Authentication failed! Check credentials.');
            console.error(error);
        }
    };

    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-body)'
        }}>
            <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: 'var(--secondary)' }}>
                        {isLogin ? 'Enter your credentials to access your account' : 'Join thousands of local service providers and users'}
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={onChange}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label className="label">I want to...</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <label
                                    className={`btn ${role === 'user' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                        cursor: 'pointer',
                                        justifyContent: 'center',
                                        background: role === 'user' ? 'var(--accent)' : 'transparent',
                                        color: role === 'user' ? 'white' : 'var(--primary)',
                                        border: role === 'user' ? '1px solid var(--accent)' : '1px solid #e2e8f0'
                                    }}
                                >
                                    <input type="radio" name="role" value="user" checked={role === 'user'} onChange={onChange} style={{ display: 'none' }} />
                                    Find Services
                                </label>
                                <label
                                    className={`btn ${role === 'provider' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                        cursor: 'pointer',
                                        justifyContent: 'center',
                                        background: role === 'provider' ? 'var(--accent)' : 'transparent',
                                        color: role === 'provider' ? 'white' : 'var(--primary)',
                                        border: role === 'provider' ? '1px solid var(--accent)' : '1px solid #e2e8f0'
                                    }}
                                >
                                    <input type="radio" name="role" value="provider" checked={role === 'provider'} onChange={onChange} style={{ display: 'none' }} />
                                    Offer Services
                                </label>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent)',
                                fontWeight: '600',
                                marginLeft: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            {isLogin ? "Register now" : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
