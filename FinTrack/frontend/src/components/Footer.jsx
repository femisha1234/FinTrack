import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
      <>
  <section className="info_section layout_padding2">
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-lg-3 info_col">
          <div className="info_contact">
            <h4>Contact</h4>
            <div className="contact_link_box">
              <a href="">
                <i className="fa fa-phone" aria-hidden="true" />
                <span>Call +91 8765436789</span>
              </a>
              <a href="">
                <i className="fa fa-envelope" aria-hidden="true" />
                <span>FinTrack@gmail.com</span>
              </a>
            </div>
          </div>
          <div className="info_social">
            <a href="">
            <i class="fa-brands fa-facebook"/>           </a>
            <a href="">
            <i class="fa-brands fa-twitter"/>
                        </a>
            <a href="">
            <i class="fa-brands fa-linkedin"/> 
                     </a>
            <a href="">
            <i class="fa-brands fa-instagram"/>       
              </a>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 info_col">
          <div className="info_detail">
            
      <h4>Mission</h4>
      <p>Our goal is to help individuals take control of their finances
         by providing easy-to-use tools for budgeting, tracking expenses, and planning for the future.</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-2 mx-auto info_col">
          <div className="info_link_box">
            <h4>Links</h4>
            <div className="info_links">
              <a className="active" href="index.html">
                Home
              </a>
              <a className="" href="about.html">
                About
              </a>
              <a className="" href="service.html">
                Services
              </a>
              <a className="" href="why.html">
                Why Us
              </a>
              <a className="" href="team.html">
                Team
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 info_col ">
          <h4>Subscribe</h4>
          <form action="#">
            <input type="text" placeholder="Enter email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  </section>
 
  <section className="footer_section">
    <div className="container">
      <p>
        © <span id="displayYear" />      2025 Personal Finance Tracker. All rights reserved.

      </p>
    </div>
  </section>
</>

  );
};

export default Footer;
