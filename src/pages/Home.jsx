import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { getServiceImage } from '../utils/imageLogic';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/listings');
                setListings(data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredListings = listings.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
            || item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = item.location.toLowerCase().includes(filterLocation.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    const categories = [
        { name: 'Cleaning', icon: '🧹', image: 'https://images.unsplash.com/photo-1612857017655-7b035a3d8a5f?w=800&q=80' }, // Man cleaning gate
        { name: 'Plumbing', icon: '🔧', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80' },
        { name: 'Electrical', icon: '⚡', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
        { name: 'AC Repair', icon: '❄️', image: 'https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?q=80&w=800&auto=format&fit=crop' }, // Man cleaning AC (User Request)
        { name: 'Grocery & Daily Supplies', icon: '🥦', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' },
    ];

    const handleBookClick = (e, itemId) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user.role === 'provider' || user.role === 'vendor') {
                e.preventDefault();
                alert("You must be a customer to book services!");
            }
        }
    };

    // robust image helper now imported
    // import { getServiceImage } from '../utils/imageLogic';

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>

            {/* Hero Section - Asymmetrical & Catchy */}
            <div style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
                <div style={{
                    position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '140%',
                    background: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)', // Warm Stone gradient
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    zIndex: -1, opacity: 0.8,
                    transform: 'rotate(-10deg)',
                    // Removed 'float' animation for grounded feel
                }}></div>

                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
                    <div className="animate-slide-up">
                        <span style={{
                            textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600',
                            fontSize: '0.9rem', color: 'var(--accent)', marginBottom: '1rem', display: 'block'
                        }}>
                            — Chennai's Most Trusted
                        </span>
                        <h1 style={{
                            fontSize: '4.5rem', fontWeight: '700', lineHeight: '1.1', marginBottom: '2rem',
                            color: 'var(--primary)', letterSpacing: '-0.02em'
                        }}>
                            Fix it.<br />
                            Clean it.<br />
                            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Done.</span>
                        </h1>
                        <p style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '3rem', maxWidth: '500px', lineHeight: '1.6' }}>
                            Skip the phone tag. Get verified pros at your door in clicks, not days.
                        </p>

                        {/* Search Bar - Minimal & Left Aligned */}
                        <div style={{
                            background: 'white', padding: '0.75rem', borderRadius: '16px',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', display: 'inline-flex',
                            gap: '0.5rem', border: '1px solid #e2e8f0', maxWidth: '600px', width: '100%'
                        }}>
                            <div style={{ flex: '1', position: 'relative' }}>
                                <span style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }}>📍</span>
                                <input
                                    type="text"
                                    placeholder="Location..."
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '3rem', border: 'none', background: 'transparent' }}
                                />
                            </div>
                            <div style={{ width: '1px', background: '#cbd5e1' }}></div>
                            <div style={{ flex: '1.5', position: 'relative' }}>
                                <span style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="What needs fixing?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '3rem', border: 'none', background: 'transparent' }}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ borderRadius: '10px' }}>Go</button>
                        </div>
                    </div>

                    {/* Floating Abstract Images */}
                    <div className="hide-on-mobile" style={{ position: 'relative', height: '500px' }}>
                        {/* Doodle 1: Soft Organic Blob */}
                        <div className="animate-float" style={{
                            position: 'absolute', top: '10%', right: '40px',
                            width: '320px', height: '320px',
                            background: '#f0fdfa', // Accent Light
                            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                            boxShadow: 'inset 10px 10px 40px rgba(13, 148, 136, 0.05)',
                            zIndex: 1,
                            animationDuration: '8s'
                        }}></div>

                        {/* Doodle 2: Smaller Decorative Circle */}
                        <div style={{
                            position: 'absolute', bottom: '80px', left: '20px',
                            width: '180px', height: '180px',
                            background: 'white',
                            borderRadius: '50%',
                            border: '2px dashed #e7e5e4', // Dashed doodle style
                            zIndex: 0,
                            animation: 'float 12s infinite reverse ease-in-out',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem', opacity: '0.3'
                        }}>
                            ✨
                        </div>

                        {/* Doodle 3: Abstract Line Element */}
                        <div style={{
                            position: 'absolute', top: '40%', right: '-20px',
                            width: '120px', height: '120px',
                            border: '4px solid var(--accent)',
                            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                            opacity: '0.1',
                            zIndex: 2,
                            transform: 'rotate(45deg)'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* Categories - Staggered Wave */}
            <div className="container" style={{ marginBottom: '8rem', marginTop: '-2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '2rem 1rem', scrollbarWidth: 'none' }}>
                    {categories.map((cat, idx) => (
                        <div key={idx}
                            onClick={() => setSearchTerm(cat.name)}
                            className="card"
                            style={{
                                minWidth: '160px', height: '200px',
                                padding: 0, overflow: 'hidden', position: 'relative',
                                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                                cursor: 'pointer', border: 'none',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                                e.currentTarget.querySelector('.cat-overlay').style.opacity = '0.2';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.querySelector('.cat-overlay').style.opacity = '0.5';
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: `url(${cat.image}) center/cover`,
                                zIndex: 0
                            }}></div>
                            <div className="cat-overlay" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'black', opacity: '0.5', transition: 'opacity 0.3s',
                                zIndex: 1
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 2, padding: '1rem', width: '100%', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                                <span style={{ fontWeight: '800', color: 'white', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works - Design Element */}
            <div className="container" style={{ marginBottom: '6rem' }}>
                <div style={{ background: '#f8fafc', borderRadius: '30px', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, background: 'radial-gradient(circle at 10% 10%, #6366f1, transparent 20%), radial-gradient(circle at 90% 90%, #a855f7, transparent 20%)' }}></div>

                    <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>How it works</h2>
                        <div style={{ width: '60px', height: '6px', background: 'var(--accent)', borderRadius: '10px', margin: '1rem auto 0' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', position: 'relative', zIndex: 2 }}>
                        {[
                            { step: '01', title: 'Choose Service', desc: 'Select from our wide range of expert services.', icon: '📱' },
                            { step: '02', title: 'Book Slot', desc: 'Pick a convenient time and date.', icon: '📅' },
                            { step: '03', title: 'Relax', desc: 'Our professional arrives at your doorstep.', icon: '😌' }
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '80px', height: '80px', background: 'white', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                                    margin: '0 auto 1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                    position: 'relative'
                                }}>
                                    {item.icon}
                                    <span style={{
                                        position: 'absolute', top: -5, right: -5, width: '30px', height: '30px',
                                        background: 'var(--accent)', color: 'white', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem'
                                    }}>{item.step}</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Service Listings - Masonry Layout */}
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1' }}>Expert Services<br /><span style={{ color: '#94a3b8' }}>Verified & Reviewed.</span></h2>
                </div>

                {loading ? (
                    <div style={{ columns: '3 300px', columnGap: '2rem' }}>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="card" style={{ marginBottom: '2.5rem', padding: 0, border: 'none', height: '400px', overflow: 'hidden' }}>
                                <div className="skeleton" style={{ width: '100%', height: '220px', borderRadius: '0' }}></div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div className="skeleton" style={{ width: '60%', height: '24px', marginBottom: '1rem' }}></div>
                                    <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: '0.5rem' }}></div>
                                    <div className="skeleton" style={{ width: '80%', height: '16px', marginBottom: '1.5rem' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }}></div>
                                        <div className="skeleton" style={{ width: '80px', height: '40px', borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredListings.length > 0 ? (
                            <div style={{ columns: '3 300px', columnGap: '2.5rem' }}>
                                {filteredListings.map((item, idx) => (
                                    <div key={item._id} className="card animate-scale-in" style={{
                                        padding: 0, overflow: 'hidden', border: 'none',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                        marginBottom: '2.5rem', // Spacing for masonry
                                        breakInside: 'avoid', // Prevent cut-off
                                        animationDelay: `${idx * 0.05}s`
                                    }}>
                                        <div style={{ height: idx % 2 === 0 ? '250px' : '200px', position: 'relative' }}>
                                            <img src={getServiceImage(item)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{
                                                position: 'absolute', top: '1rem', right: '1rem',
                                                background: 'white', padding: '0.4rem 1rem',
                                                borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                            }}>
                                                ₹{item.price}
                                            </div>
                                        </div>

                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', lineHeight: '1.1' }}>{item.title}</h3>
                                            <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                                {item.description.substring(0, 80)}...
                                            </p>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                                                        {item.providerId?.name?.[0] || 'S'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{item.providerId?.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>★ 4.9</div>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/book/${item._id}`}
                                                    onClick={(e) => handleBookClick(e, item._id)}
                                                    className="btn btn-primary"
                                                    style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                                                >
                                                    Book
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '6rem', background: '#f8fafc', borderRadius: '30px', border: '2px dashed #cbd5e1' }}>
                                <h3 style={{ color: '#cbd5e1' }}>No matches found.</h3>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
