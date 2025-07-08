// src/pages/About/AboutDesktop.jsx
import React, { useState, useCallback } from 'react';
import { useMedia } from '../../context/MediaContext'; // Adjust path as needed
import closeup from '../../assets/Trucks/closeup.jpg'; // Adjust path as needed
import WhiteBTtruck from '../../assets/Trucks/blackClose.jpg'; // Adjust path as needed
import './AboutStyles.css'; // Make sure this points to the new combined CSS file

export default function AboutDesktop() {
    const { owners } = useMedia(); // We don't need `isMobile` here directly, as this component IS desktop

    // State for which section is active. Default to 'about' for desktop.
    const [activeSection, setActiveSection] = useState('about');

    // Handler for mouse enter (hover to expand)
    const handleMouseEnter = useCallback((sectionName) => {
        setActiveSection(sectionName);
    }, []);

    // Handler for mouse leave (collapse when mouse leaves wrapper)
    const handleMouseLeave = useCallback(() => {
        setActiveSection('about'); // Revert to 'about' as the default
    }, []);

    // Handler for mini-navbar clicks or column clicks (explicit expansion)
    const handleSectionClick = useCallback((sectionName) => {
        // Toggle if clicking the active section, otherwise set new active
        setActiveSection(prev => (prev === sectionName ? 'about' : sectionName)); // If clicked active, revert to 'about'
    }, []);

    // Helper function to determine column class
    const getColumnClass = useCallback((columnName) => {
        let classes = `interactive-column ${columnName}-column`;
        if (activeSection === columnName) {
            classes += ' is-expanded'; // This column is expanded
        } else { // Other columns are collapsed if something is expanded
            classes += ' is-collapsed';
        }
        return classes;
    }, [activeSection]);

    return (
        <div className="interactive-about-container">
            {/* Mini Navbar */}
            <nav className="about-mini-navbar">
                <button
                    className={`nav-item ${activeSection === 'andrew' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('andrew')}
                >
                    Andrew
                </button>
                <button
                    className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('about')}
                >
                    About
                </button>
                <button
                    className={`nav-item ${activeSection === 'josh' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('josh')}
                >
                    Joshua
                </button>
            </nav>

            <div
                className="interactive-columns-wrapper"
                onMouseEnter={handleMouseEnter.bind(null, 'about')} // Hover on wrapper to reset to 'about'
                onMouseLeave={handleMouseLeave} // Collapse all when leaving the wrapper
            >
                {/* Andrew's Section */}
                <div
                    className={getColumnClass('andrew')}
                    onMouseEnter={handleMouseEnter.bind(null, 'andrew')}
                    onClick={() => handleSectionClick('andrew')}
                >
                    <div className="column-content">
                        <div className="section-title">
                            <h1>Meet Andrew</h1>
                        </div>
                        <img src={owners.andrew} alt="Andrew Royer" className="owner-image" />
                        <div className="text-block">
                            <h2>Andrew Royer</h2>
                            <p>
                                Andrew runs Better State Mo. Don't hesitate to call! or something idk. he hasn't
                                really given me anything to put here
                                <span className="andrew-number">573-823-6325</span>
                            </p>
                            <div className={`hidden-details ${activeSection === 'andrew' ? 'show' : ''}`}>
                                <p>Andrew founded Better State in 2023, leveraging over a decade of experience in pool maintenance and care. His passion for delivering "Better Pools" drives the company's commitment to excellence and customer satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us Section */}
                <div
                    className={getColumnClass('about')}
                    onMouseEnter={handleMouseEnter.bind(null, 'about')}
                    onClick={() => handleSectionClick('about')}
                >
                    <div className="column-content">
                        <div className="section-title">
                            <h1>About Us</h1>
                        </div>
                        <p className="about-sec-p">
                            Founded in 2023, with over 10 years of experience. Better State is dedicated to giving
                            you Better Pools.
                        </p>
                        <p className="about-sec-p">
                            Proudly serving Mid-Missouri with expert, eco-friendly pool cleaning services.
                        </p>
                        <p className="about-sec-p">
                            We are built on Trust, Reliability, and Quality.
                        </p>
                        <div className="about-trucks-container">
                            <img className="about-images" src={closeup} alt="Truck" />
                            <img className="about-images" src={WhiteBTtruck} alt="Truck" />
                        </div>
                        <div className={`hidden-details ${activeSection === 'about' ? 'show' : ''}`}>
                            <p>Our mission is to ensure every pool in Mid-Missouri is sparkling clean, safe, and a source of enjoyment for its owners. We utilize the latest eco-friendly techniques and products to minimize environmental impact.</p>
                        </div>
                    </div>
                </div>

                {/* Josh's Section */}
                <div
                    className={getColumnClass('josh')}
                    onMouseEnter={handleMouseEnter.bind(null, 'josh')}
                    onClick={() => handleSectionClick('josh')}
                >
                    <div className="column-content">
                        <div className="section-title">
                            <h1>Meet Joshua</h1>
                        </div>
                        <img src={owners.josh} alt="Joshua Efferson" className="owner-image" />
                        <div className="text-block">
                            <h2>Joshua Efferson</h2>
                            <p>
                                Joshua is an U.S Army Veteran. He runs our other company,{' '}
                                <a href="https://coatyourpool.com/" className="Othersite-link">
                                    Coat Your Pool
                                </a>
                            </p>
                            <div className={`hidden-details ${activeSection === 'josh' ? 'show' : ''}`}>
                                <p>Joshua, a proud U.S. Army Veteran, brings discipline and precision to every aspect of Better State's operations. His expertise also extends to pool coating through his other successful venture, Coat Your Pool, ensuring comprehensive pool solutions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}