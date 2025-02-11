import React from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
  return (
    <><div id='maindiv'>
    <Navbar/>
    <div id="contact-container">
      <div id="contact-title">
        <h2>Contact Us</h2>
        <form id="contact-form">
          <div id="input-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name" />
          </div>
          <div id="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div id="input-group" >
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Enter your message"
              rows="4"
            ></textarea>
          </div>
          <button type="submit" id="contact-button">Submit</button>
        </form>
      </div>
    </div>
    <div style={{backgroundColor:'#eafaf7',marginTop:'15px'}}>
    <Footer/>
    </div>
    </div>

    </>
  );
}

export default Contact;
