import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { getServiceImage } from '../utils/imageLogic';

const BookingPage = () => {
    const { providerId } = useParams();
    const listingId = providerId;

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const [listing, setListing] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);

    // Booking Type State - Initialize from Location State if available
    const [bookingType, setBookingType] = useState(location.state?.bookingType || 'Service');

    useEffect(() => {
        // Redirect logic if needed
    }, [user, navigate]);

    useEffect(() => {
        const fetchListingAndReviews = async () => {
            try {
                const { data: listingData } = await api.get(`/listings/${listingId}`);
                setListing(listingData);

                if (listingData && listingData.providerId) {
                    const { data: reviewData } = await api.get(`/reviews/${listingData.providerId._id}?service=${encodeURIComponent(listingData.title)}`);
                    setReviews(reviewData);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                alert('Error loading details');
            } finally {
                setLoading(false);
            }
        };
        fetchListingAndReviews();
    }, [listingId]);


    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to book.");
            navigate('/auth');
            return;
        }

        if (user.role === 'provider') {
            alert("Providers cannot book services. Please use a Customer account.");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Please select both a date and time.");
            return;
        }

        const combinedDate = new Date(`${selectedDate}T${selectedTime}`);

        try {
            await api.post('/bookings', {
                providerId: listing.providerId._id,
                serviceId: listing.title,
                listingId: listing._id,
                date: combinedDate,
                bookingType // Send the selected type
            });

            // Show success interaction
            setSuccess(true);
            setTimeout(() => {
                navigate('/user-dashboard');
            }, 3000);

        } catch (error) {
            console.error("Booking error:", error);
            const msg = error.response?.data?.message || 'Booking failed. Please try again.';
            alert(msg);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="card animate-scale-in" style={{ textAlign: 'center', padding: '3rem', maxWidth: '400px' }}>
                    <div style={{
                        width: '80px', height: '80px', background: 'var(--success-bg)', borderRadius: '50%', color: 'var(--success)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem auto',
                    }}>✓</div>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Booking Confirmed!</h2>
                    <p style={{ color: 'var(--secondary)' }}>Your request for <strong>{bookingType}</strong> has been sent to the provider.</p>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginTop: '2rem' }}>Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="loader"></div>
        </div>
    );
    if (!listing) return <div className="container" style={{ padding: '2rem' }}>Service not found.</div>;

    if (!user) {
        return (
            <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                <h2>Login Required</h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>You must be logged in to book a service.</p>
                <button className="btn btn-primary" onClick={() => navigate('/auth')}>Go to Login</button>
            </div>
        );
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 'New';

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {/* Left: Service Details */}
                <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ height: '300px', background: `url('${getServiceImage(listing)}') center/cover` }}></div>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{listing.title}</h1>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>by {listing.providerId?.name} <span className="badge badge-blue" style={{ marginLeft: '0.5rem' }}>Verified</span></p>
                                </div>
                                <span className="badge badge-warning" style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>★ {avgRating}</span>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>About this Service</h3>
                                <p style={{ lineHeight: '1.7', color: 'var(--primary-light)' }}>{listing.description}</p>

                                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                                    <div>
                                        <p className="label">Category</p>
                                        <p style={{ fontWeight: 600 }}>{listing.category}</p>
                                    </div>
                                    <div>
                                        <p className="label">Location</p>
                                        <p style={{ fontWeight: 600 }}>{listing.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ background: 'var(--bg-body)', border: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Provider Contact Info</h3>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div>
                                <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase' }}>Email</small>
                                <p style={{ fontWeight: '600' }}>{listing.providerId?.email}</p>
                            </div>
                            <div>
                                <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase' }}>Location</small>
                                <p style={{ fontWeight: '600' }}>{listing.location}, Chennai</p>
                            </div>
                            <div>
                                <small style={{ fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase' }}>Available</small>
                                <p style={{ fontWeight: '600' }}>Mon - Sat</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h3 style={{ marginBottom: '1.5rem' }}>Customer Reviews ({reviews.length})</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                            {reviews.length === 0 ? <p className="text-muted">No reviews yet. Be the first!</p> : (
                                reviews.map(review => (
                                    <div key={review._id} className="card" style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--accent)', fontSize: '1rem' }}>
                                                    {review.userId?.name?.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{review.userId?.name}</span>
                                            </div>
                                            <span className="badge badge-warning">★ {review.rating}</span>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--primary-light)', lineHeight: '1.6' }}>"{review.comment}"</p>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Booking Form */}
                <div style={{ flex: '1 1 350px', position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Select Option</h2>

                        {/* Option 1: Inspection */}
                        <div
                            onClick={() => setBookingType('Inspection')}
                            style={{
                                padding: '1rem',
                                border: `2px solid ${bookingType === 'Inspection' ? 'var(--accent)' : '#e2e8f0'}`,
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                background: bookingType === 'Inspection' ? 'var(--accent-light)' : 'white',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700' }}>Inspection / Visit</span>
                                <span style={{ fontWeight: '800', color: 'var(--accent)' }}>₹{listing.inspectionPrice || 200}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                Book a professional to inspect the issue and provide a quote. Ideal if you are unsure about the problem.
                            </p>
                        </div>

                        {/* Option 2: Full Service */}
                        <div
                            onClick={() => setBookingType('Service')}
                            style={{
                                padding: '1rem',
                                border: `2px solid ${bookingType === 'Service' ? 'var(--accent)' : '#e2e8f0'}`,
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '2rem',
                                cursor: 'pointer',
                                background: bookingType === 'Service' ? 'var(--accent-light)' : 'white',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700' }}>Full Service</span>
                                <span style={{ fontWeight: '800', color: 'var(--accent)' }}>₹{listing.price}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                Book the complete service directly. includes standard charges.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="label">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="label">Time</label>
                                <input
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-body)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>Total to Pay</span>
                                <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
                                    ₹{bookingType === 'Service' ? listing.price : (listing.inspectionPrice || 200)}
                                </span>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}>
                                Book {bookingType}
                            </button>
                        </form>
                    </div>

                    <div className="text-center" style={{ marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                            Free cancellation up to 24 hours before
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
