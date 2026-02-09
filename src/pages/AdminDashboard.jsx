import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Stats State
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalBookings: 0,
        totalListings: 0
    });

    // Data State
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState([]); // [{ location: 'Chennai', topServices: [] }]
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/auth');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const { data: statsData } = await api.get('/admin/stats');
                setStats(statsData);

                const { data: usersData } = await api.get('/admin/users');
                setUsers(usersData);

                // Try to fetch analytics - fail gracefully if endpoint not ready
                try {
                    const { data: analyticsData } = await api.get('/admin/analytics');
                    setAnalytics(analyticsData);
                } catch (err) {
                    console.warn("Analytics endpoint might not be ready", err);
                }

            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user, navigate]);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user");
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
            {/* Operational Header */}
            <div style={{ background: '#0f172a', color: 'white', padding: '6rem 0 3rem 0', boxShadow: 'var(--shadow-md)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.5px', margin: 0, color: 'white' }}>Operations Center</h1>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: '400', color: 'var(--secondary-light)' }}>System overview and regional demand insights</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
                {/* 1. High Level Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {[
                        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'blue' },
                        { label: 'Service Providers', value: stats.totalProviders, icon: '🛠️', color: 'emerald' },
                        { label: 'Total Bookings', value: stats.totalBookings, icon: '📦', color: 'orange' },
                        { label: 'Active Services', value: stats.totalListings, icon: '📑', color: 'purple' }
                    ].map((stat, idx) => (
                        <div key={idx} className="card animate-scale-in" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', animationDelay: `${idx * 0.1}s` }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'var(--bg-body)', border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Visual Analytics (Regional Demand) */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>Regional Demand Patterns</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {analytics.length > 0 ? (
                            analytics.map((region, idx) => (
                                <div key={idx} className="card" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>📍 {region.location}</h4>
                                        <span className="badge badge-blue">Highest Demand</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {region.topServices.map((service, sIdx) => (
                                            <div key={sIdx}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>{service.category}</span>
                                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{service.count} bookings</span>
                                                </div>
                                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${Math.min((service.count / (region.topServices[0].count || 1)) * 100, 100)}%`,
                                                        height: '100%',
                                                        background: idx % 2 === 0 ? 'var(--accent)' : 'var(--accent-hover)',
                                                        borderRadius: '4px',
                                                        transition: 'width 1s ease-out'
                                                    }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card" style={{ padding: '3rem', gridColumn: '1/-1', textAlign: 'center', color: 'var(--secondary)', border: '2px dashed var(--border)' }}>
                                <p style={{ fontSize: '1.1rem' }}>Data accumulation in progress. Demand patterns will appear here once bookings are made.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. User & Provider Management Table */}
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-body)' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>User Directory</h3>
                        <span className="badge badge-gray" style={{ fontSize: '0.85rem' }}>{users.length} Total Accounts</span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead style={{ background: 'var(--bg-surface)', borderBottom: '2px solid var(--border)' }}>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Role</th>
                                    <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Joined</th>
                                    <th style={{ textAlign: 'right', padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'provider' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.8rem' }}>
                                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="btn btn-secondary"
                                                    style={{
                                                        color: 'var(--danger)',
                                                        borderColor: 'var(--danger-bg)',
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Refuse Access
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
