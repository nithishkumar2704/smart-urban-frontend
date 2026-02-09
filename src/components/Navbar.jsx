import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <Link to="/" className="logo" style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.02em', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                        width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}>🏠</div>
                    <span>Urban<span style={{ color: 'var(--accent)' }}>Ease</span></span>
                </Link>

                <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: 0 }}>
                    <li><Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link></li>
                    <li><Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link></li>

                    {!user ? (
                        <>
                            <li><Link to="/auth" className="btn btn-primary">Sign In</Link></li>
                        </>
                    ) : (
                        <>
                            {user.role === 'provider' ? (
                                <li><Link to="/provider-dashboard" className={`nav-link ${isActive('/provider-dashboard')}`}>Dashboard</Link></li>
                            ) : user.role === 'admin' ? (
                                <li><Link to="/admin-dashboard" className={`nav-link ${isActive('/admin-dashboard')}`}>Admin</Link></li>
                            ) : (
                                <li><Link to="/user-dashboard" className={`nav-link ${isActive('/user-dashboard')}`}>My Bookings</Link></li>
                            )}
                            <li><button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Sign Out</button></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
