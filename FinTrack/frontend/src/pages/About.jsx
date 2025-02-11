import React from "react";
import "./About.css"; // Add styles here or use a CSS framework
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const aboutSections = [
  {
    title: "Our Mission",
    description:
      "Empowering individuals to take control of their financial future through intuitive tools and insightful analytics.",
    icon: "🎯",
  },
  {
    title: "Why Choose Us",
    description:
      "We simplify financial management with user-friendly interfaces, robust features, and a focus on security.",
    icon: "💡",
  },
  {
    title: "Our Team",
    description:
      "A passionate group of developers, designers, and finance experts dedicated to helping you achieve financial clarity.",
    icon: "👥",
  },
  {
    title: "Our Vision",
    description:
      "To be the leading personal finance tool globally, making money management accessible to everyone.",
    icon: "🌍",
  },
  {
    title: "Core Values",
    description:
      "Transparency, innovation, and a relentless focus on user satisfaction drive everything we do.",
    icon: "⚙️",
  },
  {
    title: "Contact Us",
    description:
      "Have questions or feedback? Reach out to us anytime to learn more about how we can help you.",
    icon: "📩",
  },
];

const About = () => {
  return (
    <>
<Navbar/>
    <div className="about-page">
      <header className="about-header">
        <h1>About Us</h1>
        <p>Learn more about who we are and what we stand for.</p>
      </header>

      <section className="about-grid">
        {aboutSections.map((section, index) => (
          <div className="about-card" key={index}>
            <div className="about-icon">{section.icon}</div>
            <h3 className="about-title">{section.title}</h3>
            <p className="about-description">{section.description}</p>
          </div>
        ))}
      </section>
    </div>
   
    <Footer/>
    </>
  );
};

export default About;
