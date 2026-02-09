import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you shortly.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="animate-fade-in" style={{ padding: '6rem 0' }}>
            <div className="container">
                <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '0', display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/* Contact Info Sidebar */}
                        <div style={{ flex: '1 1 300px', background: 'var(--primary)', color: 'white', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>Get in Touch</h2>
                            <p style={{ opacity: 0.8, marginBottom: '3rem', lineHeight: '1.6' }}>Have questions about our services or need support? We'd love to hear from you. Reach out to us anytime.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📍</div>
                                    <div>
                                        <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Address</p>
                                        <p style={{ margin: 0, fontWeight: '500' }}>Anna Nagar, Chennai, TN</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</div>
                                    <div>
                                        <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Phone</p>
                                        <p style={{ margin: 0, fontWeight: '500' }}>+91 98765 43210</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
                                    <div>
                                        <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Email</p>
                                        <p style={{ margin: 0, fontWeight: '500' }}>support@urbanease.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{ flex: '2 1 400px', padding: '3rem 3rem 4rem 3rem', background: 'var(--bg-surface)' }}>
                            <h2 style={{ marginBottom: '0.5rem' }}>Send us a Message</h2>
                            <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>We respect your privacy. No spam, ever.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Message</label>
                                    <textarea
                                        rows="4"
                                        placeholder="How can we help you?"
                                        required
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
