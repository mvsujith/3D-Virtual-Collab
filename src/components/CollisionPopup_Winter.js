import React, { useState, useEffect } from "react";
import "./CollisionPopup.css";

const CollisionPopup = ({ isVisible, onClose, collisionInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [location, setLocation] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [industrySearch, setIndustrySearch] = useState("");

  const industries = [
    "All Industries",
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "E-commerce",
    "Manufacturing",
    "Retail",
    "Transportation",
    "Entertainment",
    "Food & Beverage",
    "Energy",
    "Real Estate",
    "Agriculture",
    "Construction",
  ];

  const stages = ["All Stages", "Idea", "Early", "Seed", "Growth", "Scale"];

  const projectCards = [
    {
      id: 1,
      title: "innovationhub",
      stage: "Idea",
      description:
        "Revolutionary platform connecting innovators with investors and mentors worldwide",
      roles: 0,
      tasks: 0,
      category: "Technology",
      location: "India",
      created: "6/5/2025",
    },
    {
      id: 2,
      title: "Test",
      stage: "Seed",
      description:
        "Next-generation testing framework for modern web applications",
      roles: 0,
      tasks: 0,
      category: "Technology",
      location: "Poland",
      created: "6/3/2025",
    },
    {
      id: 3,
      title: "SForger",
      stage: "Growth",
      description: "AI-powered software development acceleration platform",
      roles: 0,
      tasks: 0,
      category: "Technology",
      location: "San Francisco",
      created: "6/1/2025",
    },
  ];

  const filteredIndustries = industries.filter((industry) =>
    industry.toLowerCase().includes(industrySearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsIndustryOpen(false);
      setIsStageOpen(false);
    };

    if (isVisible) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isVisible]);

  // Create snowflakes effect
  useEffect(() => {
    if (!isVisible) return;

    const createSnowflake = () => {
      const snowflake = document.createElement("div");
      snowflake.className = "winter-snowflake";
      snowflake.innerHTML = Math.random() > 0.5 ? "❄" : "❅";
      snowflake.style.left = Math.random() * 100 + "vw";
      snowflake.style.animationDuration = Math.random() * 5 + 5 + "s";
      snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
      snowflake.style.opacity = Math.random() * 0.6 + 0.4;

      const overlay = document.querySelector(".winter-popup-overlay");
      if (overlay) {
        overlay.appendChild(snowflake);

        setTimeout(() => {
          if (snowflake.parentNode) {
            snowflake.remove();
          }
        }, 10000);
      }
    };

    const snowInterval = setInterval(createSnowflake, 200);

    return () => {
      clearInterval(snowInterval);
      // Clean up snowflakes
      const snowflakes = document.querySelectorAll(".winter-snowflake");
      snowflakes.forEach((flake) => flake.remove());
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setIsIndustryOpen(false);
    setIndustrySearch("");
  };

  const handleStageSelect = (stage) => {
    setSelectedStage(stage);
    setIsStageOpen(false);
  };

  const handleCloseClick = () => {
    // Add closing animation effect
    const container = document.querySelector(".winter-container");
    if (container) {
      container.style.transform = "scale(0.95)";
      container.style.opacity = "0.5";
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <div className="winter-popup-overlay">
      <div className="winter-container">
        <div className="winter-header">
          <div className="winter-header-content">
            <div className="winter-home-title">
              <span className="winter-home-icon">🏠</span>
              Home
            </div>
            <div className="winter-close-btn" onClick={handleCloseClick}>
              ✕
            </div>
          </div>
        </div>

        <div className="winter-search-section">
          <div className="winter-search-bar">
            <input
              type="text"
              className="winter-search-input"
              placeholder="Search by name, industry, location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) =>
                (e.target.parentElement.style.transform = "scale(1.02)")
              }
              onBlur={(e) =>
                (e.target.parentElement.style.transform = "scale(1)")
              }
            />
            <div className="winter-search-suggestions">
              Try: tech, San Francisco, developer, seed
            </div>
          </div>

          <div className="winter-filters">
            {/* Industry Filter */}
            <div
              className="winter-filter-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`winter-filter-button ${
                  isIndustryOpen ? "active" : ""
                }`}
                onClick={() => {
                  setIsIndustryOpen(!isIndustryOpen);
                  setIsStageOpen(false);
                }}
              >
                <span>{selectedIndustry}</span>
                <span
                  className={`winter-dropdown-arrow ${
                    isIndustryOpen ? "rotated" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`winter-dropdown-menu ${
                  isIndustryOpen ? "show" : ""
                }`}
              >
                <div className="winter-dropdown-search">
                  <input
                    type="text"
                    placeholder="Search industries…"
                    value={industrySearch}
                    onChange={(e) => setIndustrySearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="winter-dropdown-options">
                  {filteredIndustries.map((industry) => (
                    <div
                      key={industry}
                      className={`winter-dropdown-option ${
                        selectedIndustry === industry ? "selected" : ""
                      }`}
                      onClick={() => handleIndustrySelect(industry)}
                    >
                      {industry}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Filter */}
            <div
              className="winter-filter-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`winter-filter-button ${
                  isStageOpen ? "active" : ""
                }`}
                onClick={() => {
                  setIsStageOpen(!isStageOpen);
                  setIsIndustryOpen(false);
                }}
              >
                <span>{selectedStage}</span>
                <span
                  className={`winter-dropdown-arrow ${
                    isStageOpen ? "rotated" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`winter-dropdown-menu ${isStageOpen ? "show" : ""}`}
              >
                <div className="winter-dropdown-options">
                  {stages.map((stage) => (
                    <div
                      key={stage}
                      className={`winter-dropdown-option ${
                        selectedStage === stage ? "selected" : ""
                      }`}
                      onClick={() => handleStageSelect(stage)}
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <input
              type="text"
              className="winter-filter-select"
              placeholder="Location (City, Country)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="winter-startups-grid">
          {projectCards.map((project) => (
            <div key={project.id} className="winter-startup-card">
              <div className="winter-startup-header">
                <h3 className="winter-startup-name">{project.title}</h3>
                <span
                  className={`winter-stage-badge winter-stage-${project.stage.toLowerCase()}`}
                >
                  {project.stage.toUpperCase()}
                </span>
              </div>

              <p className="winter-startup-description">
                {project.description}
              </p>

              <div className="winter-startup-stats">
                <div className="winter-stat-item">
                  <span className="winter-stat-icon">👥</span>
                  <span>{project.roles} Roles</span>
                </div>
                <div className="winter-stat-item">
                  <span className="winter-stat-icon">✅</span>
                  <span>{project.tasks} Tasks</span>
                </div>
              </div>

              <div className="winter-startup-tags">
                <span className="winter-tag">💻 {project.category}</span>
                <span className="winter-tag">📍 {project.location}</span>
              </div>

              <div className="winter-startup-date">
                Created: {project.created}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollisionPopup;
