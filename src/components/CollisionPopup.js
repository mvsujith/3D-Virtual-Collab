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
    "Marketing",
    "Consulting",
    "Real Estate",
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
  // Interactive effects similar to the original HTML
  useEffect(() => {
    if (isVisible) {
      // Add interactive effects for startup cards
      const cards = document.querySelectorAll(".startup-card");

      const handleCardMouseEnter = function () {
        this.style.transform = "translateY(-8px) scale(1.02)";
      };

      const handleCardMouseLeave = function () {
        this.style.transform = "translateY(0) scale(1)";
      };

      // Search input focus effects
      const handleSearchInput = function () {
        if (this.value.length > 0) {
          this.style.borderColor = "#4ECDC4";
          this.style.boxShadow = "0 0 30px rgba(78, 205, 196, 0.4)";
        } else {
          this.style.borderColor = "rgba(255, 255, 255, 0.1)";
          this.style.boxShadow = "none";
        }
      };

      // Filter effects
      const handleFilterFocus = function () {
        this.style.borderColor = "#45B7D1";
        this.style.boxShadow = "0 0 20px rgba(69, 183, 209, 0.3)";
      };

      const handleFilterBlur = function () {
        this.style.borderColor = "rgba(255, 255, 255, 0.1)";
        this.style.boxShadow = "none";
      };

      cards.forEach((card) => {
        card.addEventListener("mouseenter", handleCardMouseEnter);
        card.addEventListener("mouseleave", handleCardMouseLeave);
      });

      const searchInput = document.querySelector(".search-input");
      if (searchInput) {
        searchInput.addEventListener("input", handleSearchInput);
      }

      const filterElements = document.querySelectorAll(
        ".filter-select, .filter-button"
      );

      filterElements.forEach((element) => {
        element.addEventListener("focus", handleFilterFocus);
        element.addEventListener("blur", handleFilterBlur);
      });

      // Cleanup function
      return () => {
        cards.forEach((card) => {
          card.removeEventListener("mouseenter", handleCardMouseEnter);
          card.removeEventListener("mouseleave", handleCardMouseLeave);
        });

        if (searchInput) {
          searchInput.removeEventListener("input", handleSearchInput);
        }

        filterElements.forEach((element) => {
          element.removeEventListener("focus", handleFilterFocus);
          element.removeEventListener("blur", handleFilterBlur);
        });
      };
    }
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
  return (
    <div className="collision-popup-overlay">
      <div className="background-pattern"></div>
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      <div className="collision-popup">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">🏠</div>
              <h1 className="title">Home</h1>
            </div>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </header>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, industry, location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-suggestions">
            Try: tech, San Francisco, developer, seed
          </div>
        </div>

        <div className="filters">
          {/* Industry Filter */}
          <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
            <button
              className="filter-button"
              onClick={() => setIsIndustryOpen(!isIndustryOpen)}
            >
              <span>Select industry</span>
              <span
                className={`dropdown-arrow ${isIndustryOpen ? "open" : ""}`}
              >
                ▼
              </span>
            </button>
            {isIndustryOpen && (
              <div className="dropdown-content industry-dropdown">
                <input
                  type="text"
                  placeholder="Search industries…"
                  value={industrySearch}
                  onChange={(e) => setIndustrySearch(e.target.value)}
                  className="dropdown-search"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="dropdown-options">
                  {filteredIndustries.map((industry) => (
                    <div
                      key={industry}
                      className={`dropdown-option ${
                        selectedIndustry === industry ? "selected" : ""
                      }`}
                      onClick={() => handleIndustrySelect(industry)}
                    >
                      {industry}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stage Filter */}
          <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
            <button
              className="filter-button"
              onClick={() => setIsStageOpen(!isStageOpen)}
            >
              <span>{selectedStage}</span>
              <span className={`dropdown-arrow ${isStageOpen ? "open" : ""}`}>
                ▼
              </span>
            </button>
            {isStageOpen && (
              <div className="dropdown-content">
                <div className="dropdown-options">
                  {stages.map((stage) => (
                    <div
                      key={stage}
                      className={`dropdown-option ${
                        selectedStage === stage ? "selected" : ""
                      }`}
                      onClick={() => handleStageSelect(stage)}
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <input
            type="text"
            className="filter-select"
            placeholder="Location (City, Country)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="cards-grid">
          {projectCards.map((project) => (
            <div key={project.id} className="startup-card">
              <div className="card-header">
                <div>
                  <h3 className="startup-name">{project.title}</h3>
                </div>
                <div
                  className={`stage-badge stage-${project.stage.toLowerCase()}`}
                >
                  {project.stage.toUpperCase()}
                </div>
              </div>

              <p className="startup-description">{project.description}</p>

              <div className="stats">
                <div className="stat">
                  <span className="stat-icon">👥</span>
                  <span>{project.roles} Roles</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">✅</span>
                  <span>{project.tasks} Tasks</span>
                </div>
              </div>

              <div className="tags">
                <div className="tag">
                  <span className="tag-icon">�</span>
                  {project.category}
                </div>
                <div className="tag">
                  <span className="tag-icon">📍</span>
                  {project.location}
                </div>
              </div>

              <div className="created-date">Created: {project.created}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollisionPopup;
