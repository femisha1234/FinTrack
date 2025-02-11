import React from "react";
import "./Features.css"; // Add styles here or use a CSS framework
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const featuresData = [
  {
    title: "Expense Tracking",
    description:
      "Add, categorize, and monitor your daily expenses with ease. Visual insights with pie charts for spending breakdowns.",
    icon: "💸", // Replace with icons or SVGs as needed
  },
  {
    title: "Income Management",
    description:
      "Record income sources and maintain a clear understanding of your cash flow. Compare income vs. expenditure with graphical analytics.",
    icon: "📈",
  },
  {
    title: "Budget Planning",
    description:
      "Set monthly/weekly budgets and receive real-time updates on remaining limits. Alerts for budget thresholds to prevent overspending.",
    icon: "📊",
  },
  {
    title: "Goal Setting",
    description:
      "Define financial goals and track progress. Milestone tracking to stay motivated.",
    icon: "🎯",
  },
  {
    title: "Reports and Analytics",
    description:
      "Detailed reports on spending habits over custom timeframes. Interactive charts for trends in income and expenses.",
    icon: "📜",
  },
  {
    title: "Bill Reminders",
    description:
      "Never miss a due date with automated bill reminders. Calendar view for upcoming expenses and payments.",
    icon: "⏰",
  },
];

const Features = () => {
  return (
    <>
    <Navbar/>
    <div className="features-page" >
      <header className="features-header">
        <h1>Features</h1>
        <p>Take Control of Your Finances – Effortlessly Manage, Track, and Plan!</p>
      </header>

      <section className="features-grid">
        {featuresData.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default Features;
