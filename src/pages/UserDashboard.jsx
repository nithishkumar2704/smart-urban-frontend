import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Review Form State
    const [reviewingBookingId, setReviewingBookingId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/user');
                // Sort by date desc
                const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setBookings(sorted);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleRebook = (booking) => {
        // Use listingId if available (new bookings), otherwise fallback to providerId (legacy/broken but safe try)
        // Actually, BookingPage expects ListingID. Passing ProviderID relies on pure luck or is wrong.
        // We will prefer listingId.
        const targetId = booking.listingId || (booking.providerId && booking.providerId._id);

        if (targetId) {
            navigate(`/book/${targetId}`, {
                state: {
                    bookingType: booking.bookingType || 'Service'
                }
            });
        } else {
            alert('Cannot re-book this service (Details unavailable)');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                bookingId: reviewingBookingId,
                rating,
                comment
            });
            alert('Review submitted! Thank you.');
            setReviewingBookingId(null);
            setComment('');
            setRating(5);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
            {/* Contextual Header */}
            <div style={{ background: 'var(--bg-surface)', padding: '6rem 0 3rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Welcome back, <span style={{ color: 'var(--accent)' }}>{user.name.split(' ')[0]}</span>
                    </h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Manage your home services and history.</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Recent Activity</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="card" style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-body)', border: '2px dashed #cbd5e1' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your dashboard is empty</h3>
                        <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '2rem' }}>Looks like you haven't booked any services yet. Start by exploring trusted pros nearby.</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Browse Services</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {bookings.map((booking, idx) => (
                            <div key={booking._id} className="card animate-slide-up" style={{
                                padding: 0, display: 'flex', flexDirection: 'column',
                                animationDelay: `${idx * 0.1}s` /* Staggered Animation */
                            }}>
                                {/* Ticket Header */}
                                <div style={{ padding: '1.5rem', borderBottom: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'start', background: 'var(--bg-surface)' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: '700' }}>{booking.serviceId}</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--secondary)' }}>by {booking.providerId?.name}</p>
                                    </div>
                                    <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Receipt Body */}
                                <div style={{ padding: '1.5rem', flex: 1, background: '#f8fafc' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Date</small>
                                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{new Date(booking.date).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Time</small>
                                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <div>
                                            <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Service Type</small>
                                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{booking.bookingType || 'Service'}</div>
                                        </div>
                                        <div>
                                            <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Order ID</small>
                                            <div style={{ fontWeight: '500', color: 'var(--secondary)', fontFamily: 'monospace' }}>#{booking._id.slice(-6).toUpperCase()}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => handleRebook(booking)}
                                        className="btn btn-primary"
                                        style={{ flex: 1, fontSize: '0.9rem' }}
                                    >
                                        ↺ Re-book
                                    </button>

                                    {booking.status === 'Completed' && (
                                        <button
                                            onClick={() => setReviewingBookingId(reviewingBookingId === booking._id ? null : booking._id)}
                                            className={`btn ${reviewingBookingId === booking._id ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{ flex: 1, fontSize: '0.9rem' }}
                                        >
                                            {reviewingBookingId === booking._id ? 'Close Review' : 'Write Review'}
                                        </button>
                                    )}
                                </div>

                                {/* Review Form Overlay */}
                                {reviewingBookingId === booking._id && (
                                    <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid #e2e8f0', animation: 'slideDown 0.3s' }}>
                                        <h4 style={{ margin: '0 0 1rem 0' }}>Rate your experience</h4>
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="input-group">
                                                <select value={rating} onChange={e => setRating(e.target.value)} style={{ marginBottom: '1rem' }}>
                                                    <option value="5">★★★★★ Excellent</option>
                                                    <option value="4">★★★★☆ Good</option>
                                                    <option value="3">★★★☆☆ Average</option>
                                                    <option value="2">★★☆☆☆ Poor</option>
                                                    <option value="1">★☆☆☆☆ Terrible</option>
                                                </select>
                                                <textarea
                                                    rows="2"
                                                    placeholder="How was the service?"
                                                    value={comment}
                                                    onChange={e => setComment(e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => setReviewingBookingId(null)} style={{ flex: 1 }}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
