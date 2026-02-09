import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext);
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [inspectionPrice, setInspectionPrice] = useState('200');
    const [image, setImage] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: myListings } = await api.get('/listings/my');
                setListings(myListings);

                const { data: myBookings } = await api.get('/bookings/provider');
                setBookings(myBookings);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateListing = async (e) => {
        e.preventDefault();
        try {
            const { data: newListing } = await api.post('/listings', {
                title, description, category, price, inspectionPrice, location, image
            });
            setListings([...listings, newListing]);
            setShowForm(false);
            setTitle(''); setDescription(''); setCategory(''); setPrice(''); setInspectionPrice('200'); setLocation(''); setImage('');

            // Enhanced success notification
            const successDiv = document.createElement('div');
            successDiv.innerHTML = `
                <div style="
                    position: fixed; top: 20px; right: 20px; z-index: 9999;
                    background: linear-gradient(135deg, #059669, #10b981);
                    color: white; padding: 1.5rem 2rem; border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(5, 150, 105, 0.4);
                    font-weight: 600; font-size: 1rem;
                    animation: slideInRight 0.3s ease-out;
                ">
                    ✅ Service Published Successfully!
                </div>
            `;
            document.body.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);
        } catch (error) {
            console.error(error);
            alert('Failed to create listing');
        }
    };

    const handleDeleteListing = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await api.delete(`/listings/${id}`);
            setListings(listings.filter(l => l._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}`, { status });
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (error) {
            alert('Update failed');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ marginTop: '0', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ background: 'var(--bg-surface)', padding: '6rem 0 3rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Provider Dashboard</h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Manage your service listings and bookings</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>

                {/* MY SERVICES SECTION */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>My Services</h2>
                        <button className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel' : '+ Create Service'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="card animate-slide-down" style={{ marginBottom: '2rem', border: '1px solid var(--accent-light)', boxShadow: 'var(--shadow-lg)' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Create New Listing</h3>
                            <form onSubmit={handleCreateListing}>
                                <div className="input-group">
                                    <label className="label">Service Title</label>
                                    <input type="text" placeholder="e.g. Emergency Pipe Fix" value={title} onChange={e => setTitle(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label className="label">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} required>
                                        <option value="">Select a category...</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="AC Repair">AC Repair</option>
                                        <option value="Grocery & Daily Supplies">Grocery & Daily Supplies</option>
                                        <option value="Pest Control">Pest Control</option>
                                        <option value="Carpentry">Carpentry</option>
                                        <option value="Gardening">Gardening</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label className="label">Base Price (₹)</label>
                                        <input type="number" placeholder="500" value={price} onChange={e => setPrice(e.target.value)} required />
                                    </div>
                                    <div className="input-group">
                                        <label className="label">Inspection Fee (₹)</label>
                                        <input type="number" placeholder="200" value={inspectionPrice} onChange={e => setInspectionPrice(e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="label">Location</label>
                                    <input type="text" placeholder="Chennai (e.g. T. Nagar)" value={location} onChange={e => setLocation(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label className="label">Image URL (Optional)</label>
                                    <input type="text" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="label">Description</label>
                                    <textarea rows="3" placeholder="Describe your service in detail..." value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%' }}>Publish Listing</button>
                            </form>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {listings.length === 0 && !showForm ? (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #cbd5e1', background: 'var(--bg-body)' }}>
                                <p style={{ color: 'var(--secondary)' }}>No services listed yet. Create one to get started.</p>
                            </div>
                        ) : null}

                        {listings.map(item => (
                            <div key={item._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
                                {item.image && (
                                    <div style={{ width: '120px', background: `url('${item.image}') center/cover`, display: 'none', '@media (min-width: 600px)': { display: 'block' } }}></div>
                                )}
                                <div style={{ padding: '1.5rem', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h4>
                                        <button className="btn btn-ghost" style={{ color: 'var(--danger)', padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleDeleteListing(item._id)}>Delete</button>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{item.category}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div>
                                            <p className="label" style={{ fontSize: '0.7rem' }}>Price</p>
                                            <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{item.price}</p>
                                        </div>
                                        <div>
                                            <p className="label" style={{ fontSize: '0.7rem' }}>Visit</p>
                                            <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{item.inspectionPrice || 200}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* INCOMING BOOKINGS SECTION */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Incoming Bookings</h2>
                    {bookings.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #cbd5e1', background: 'var(--bg-body)' }}>
                            <p style={{ color: 'var(--secondary)' }}>No bookings received yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {bookings.map(booking => (
                                <div key={booking._id} className="card animate-slide-up" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{booking.serviceId}</span>
                                        <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Cancelled' ? 'badge-danger' : booking.status === 'Accepted' ? 'badge-blue' : 'badge-warning'}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div style={{ background: 'var(--bg-body)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            <span style={{ color: 'var(--secondary)' }}>Type</span>
                                            <span style={{ fontWeight: '600' }}>{booking.bookingType || 'Service'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            <span style={{ color: 'var(--secondary)' }}>Date</span>
                                            <span style={{ fontWeight: '600' }}>{new Date(booking.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span style={{ color: 'var(--secondary)' }}>Time</span>
                                            <span style={{ fontWeight: '600' }}>{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--accent)', fontSize: '0.8rem' }}>
                                            {booking.userId?.name?.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: '0.95rem' }}>{booking.userId?.name}</span>
                                    </div>

                                    {booking.status === 'Pending' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <button onClick={() => handleUpdateStatus(booking._id, 'Accepted')} className="btn btn-primary">Accept</button>
                                            <button onClick={() => handleUpdateStatus(booking._id, 'Cancelled')} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Reject</button>
                                        </div>
                                    )}
                                    {booking.status === 'Accepted' && (
                                        <button onClick={() => handleUpdateStatus(booking._id, 'Completed')} className="btn btn-primary" style={{ width: '100%', background: 'var(--success)', borderColor: 'var(--success)' }}>Mark as Complete</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProviderDashboard;
