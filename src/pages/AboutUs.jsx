import React from 'react';

const AboutUs = () => {
    return (
        <div className="animate-fade-in" style={{ padding: '6rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div className="badge badge-blue animate-scale-in" style={{ marginBottom: '1rem' }}>Our Story</div>
                    <h1 className="page-title animate-slide-up" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>About UrbanEase</h1>
                    <p className="animate-slide-up" style={{ fontSize: '1.25rem', color: 'var(--secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', animationDelay: '0.1s' }}>
                        Revolutionizing how you access local services. Reliable, fast, and transparent. We are building the future of urban convenience.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div className="animate-slide-right" style={{ animationDelay: '0.2s' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--accent-light)', borderRadius: '50%', zIndex: -1 }}></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                                alt="Team"
                                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                            />
                            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary-light)', borderRadius: '50%', opacity: 0.1, zIndex: -1 }}></div>
                        </div>
                    </div>
                    <div className="animate-slide-left" style={{ animationDelay: '0.3s' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Our Mission</h2>
                        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--primary-light)', lineHeight: '1.7' }}>
                            At <span style={{ color: 'var(--accent)', fontWeight: 700 }}>UrbanEase</span>, we believe that finding a trusted professional for your home needs shouldn't be a hassle.
                            Our platform connects you with verified local experts in seconds, ensuring quality and peace of mind.
                        </p>
                        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--primary-light)', lineHeight: '1.7' }}>
                            Whether it's a leaky tap, a malfunctioning AC, or a deep cleaning requirement,
                            we bring the best of the city to your doorstep. We are committed to empowering local service providers while delighting our customers.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--accent-light)', background: 'var(--bg-surface)' }}>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', margin: 0 }}>50k+</h3>
                                <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>Happy Customers</p>
                            </div>
                            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--accent-light)', background: 'var(--bg-surface)' }}>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', margin: 0 }}>1000+</h3>
                                <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>Verified Experts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
