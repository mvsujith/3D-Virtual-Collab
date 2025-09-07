import React, { useState, useEffect } from "react";
import "./PopupOverlay.css";

// Sample data for the cards
const sampleProjects = [
  {
    id: 1,
    title: "innovationhub",
    description: "A platform connecting innovators worldwide",
    type: "idea",
    roles: 12,
    tasks: 24,
    technology: "React, Node.js",
    location: "San Francisco, CA",
    created: "6/5/2025",
    industry: "Technology",
  },
  {
    id: 2,
    title: "Test",
    description: "Testing new collaboration features",
    type: "project",
    roles: 3,
    tasks: 8,
    technology: "Vue.js, Python",
    location: "Remote",
    created: "6/1/2025",
    industry: "Software",
  },
  {
    id: 3,
    title: "SForger",
    description: "Advanced metalworking simulation platform",
    type: "startup",
    roles: 18,
    tasks: 42,
    technology: "Three.js, WebGL",
    location: "Berlin, Germany",
    created: "5/28/2025",
    industry: "Manufacturing",
  },
  {
    id: 4,
    title: "EcoTracker",
    description: "Environmental impact monitoring system",
    type: "idea",
    roles: 7,
    tasks: 15,
    technology: "React Native, IoT",
    location: "Vancouver, Canada",
    created: "6/3/2025",
    industry: "Environment",
  },
  {
    id: 5,
    title: "FinanceBot",
    description: "AI-powered personal finance assistant",
    type: "startup",
    roles: 9,
    tasks: 31,
    technology: "Python, ML",
    location: "New York, NY",
    created: "5/30/2025",
    industry: "Fintech",
  },
  {
    id: 6,
    title: "HealthSync",
    description: "Integrated healthcare management platform",
    type: "project",
    roles: 15,
    tasks: 28,
    technology: "Angular, Spring",
    location: "Boston, MA",
    created: "6/2/2025",
    industry: "Healthcare",
  },
];

const industries = [
  "All Industries",
  "Technology",
  "Software",
  "Manufacturing",
  "Environment",
  "Fintech",
  "Healthcare",
];
const stages = ["All Stages", "Idea", "Project", "Startup"];

const PopupOverlay = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);

  // Debug logging
  console.log("🎭 PopupOverlay render - isVisible:", isVisible);

  // Filter projects based on search criteria
  useEffect(() => {
    let filtered = sampleProjects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (selectedIndustry !== "All Industries") {
      filtered = filtered.filter(
        (project) => project.industry === selectedIndustry
      );
    }

    // Stage filter
    if (selectedStage !== "All Stages") {
      filtered = filtered.filter(
        (project) => project.type.toLowerCase() === selectedStage.toLowerCase()
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter((project) =>
        project.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedIndustry, selectedStage, locationFilter]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible, onClose]);

  // Prevent body scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Icons as inline SVG components
  const RoleIcon = () => (
    <svg className="card-stat-icon" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );

  const TaskIcon = () => (
    <svg className="card-stat-icon" viewBox="0 0 24 24">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  );

  const TechIcon = () => (
    <svg className="card-stat-icon" viewBox="0 0 24 24">
      <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="card-stat-icon" viewBox="0 0 24 24">
      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
    </svg>
  );
  return (
    <div
      className={`popup-overlay ${isVisible ? "visible" : ""}`}
      onClick={handleOverlayClick}
      style={{
        backgroundColor: isVisible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
        display: isVisible ? "flex" : "none", // Force display for debugging
      }}
    >
      {console.log("🎭 PopupOverlay rendering with isVisible:", isVisible)}
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">
            Discovery Hub - Find Your Next Project
          </h2>
          <button
            className="popup-close"
            onClick={onClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>

        <div className="popup-body">
          {/* Search Section */}
          <div className="search-section">
            <input
              type="text"
              className="search-bar"
              placeholder="Search by name, industry, location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <p className="search-hint">
              Try: tech, San Francisco, developer, seed
            </p>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Industry</label>
              <select
                className="filter-select"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Stage</label>
              <select
                className="filter-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Location (City, Country)"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="card">
                <div className={`card-badge ${project.type}`}>
                  {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                </div>

                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">{project.description}</p>

                <div className="card-stats">
                  <div className="card-stat">
                    <RoleIcon />
                    <span>{project.roles} Roles</span>
                  </div>
                  <div className="card-stat">
                    <TaskIcon />
                    <span>{project.tasks} Tasks</span>
                  </div>
                  <div className="card-stat">
                    <TechIcon />
                    <span>{project.technology}</span>
                  </div>
                  <div className="card-stat">
                    <LocationIcon />
                    <span>{project.location}</span>
                  </div>
                </div>

                <div className="card-footer">Created: {project.created}</div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#6c757d",
                fontSize: "16px",
              }}
            >
              No projects found matching your criteria. Try adjusting your
              filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupOverlay;
