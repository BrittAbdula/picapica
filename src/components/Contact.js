import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/send-message', formData);
      if (res.status === 200) {
        alert('Thank you for reaching out!');
      } else {
        alert('Something went wrong. Please try again.');
      }
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(`Failed to send message: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="contact-container">
        <div className="contact-form">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            />
            <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            />
            <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            ></textarea>
            <button type="submit">Send Message</button>
        </form>
        {status && <p>{status}</p>}
        </div>
    </div>
  );
};

export default Contact;
