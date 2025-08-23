import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <hr />
      <p className="fade-in">Developed by <strong>Debopriyo Choudhury</strong></p>
      
      <p className="fade-in">
        <img
          src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
          alt="Email"
          className="footer-icon"
        />
         <a href="mailto:sridebopriyo@gmail.com">sridebopriyo@gmail.com</a>
      </p>
      
      <p className="fade-in">
        <img
          src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
          alt="LinkedIn"
          className="footer-icon"
        />
         <a
          href="https://www.linkedin.com/in/debopriyo-choudhury-077043275/"
          target="_blank"
          rel="noopener noreferrer"
        >
          debopriyo-choudhury-077043275/
        </a>
      </p>

      <p className="fade-in">
        <img
          src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
          alt="GitHub"
          className="footer-icon"
        />
         <a
          href="https://github.com/DebopriyoChoudhury782004"
          target="_blank"
          rel="noopener noreferrer"
        >
          DebopriyoChoudhury782004
        </a>
      </p>

      <p className="fade-in location">
        📍 Kolkata, India | Passionate MERN Stack Developer
      </p>
    </footer>
  );
};

export default Footer;
