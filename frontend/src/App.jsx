import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  FolderKanban,
  Ticket,
  LogOut,
  Activity,
  Plus,
} from "lucide-react";
import "./App.css";

const API_URL = "";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketProjectId, setTicketProjectId] = useState("");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [ticketStatus, setTicketStatus] = useState("open");
  const [ticketSearch, setTicketSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loadDashboard = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [projectsResponse, ticketsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/v1/projects/`, { headers }),
        axios.get(`${API_URL}/api/v1/tickets/`, { headers }),
      ]);

      setProjects(projectsResponse.data);
      setTickets(ticketsResponse.data);

      setApiStatus("Healthy");

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setUsername(payload.username);
    } catch (error) {
      console.error(error);
      setApiStatus("Unavailable");
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/login`,
        {
          username: loginUsername,
          password: loginPassword,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      setToken(response.data.access_token);
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProjects([]);
    setTickets([]);
    setUsername("");
  };

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  );

  const highPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "high"
  );

  if (!token) {
    return (
      <div className="app">
        <div className="login-card">
          <div className="brand">
            <div className="brand-icon">
              <BarChart3 size={22} />
            </div>

            <div>
              <h1>IssueFlow</h1>
              <p>Issue Tracking Platform</p>
            </div>
          </div>

          <div className="welcome">
            <h2>Welcome back</h2>
            <p>
              Sign in to manage your projects and tickets.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={loginUsername}
              onChange={(event) =>
                setLoginUsername(event.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(event) =>
                setLoginPassword(event.target.value)
              }
              required
            />

            <button type="submit">
              Sign in
            </button>
          </form>

          <p className="footer-text">
            CDD Issue Tracker · Secure workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BarChart3 size={20} />
          </div>

          <div>
            <strong>IssueFlow</strong>
            <span>Workspace</span>
          </div>
        </div>

        <nav>
        <button
          className={`nav-item ${
            activePage === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActivePage("dashboard")}
        >
          <BarChart3 size={18} />
          Dashboard
        </button>

        <button
          className={`nav-item ${
            activePage === "projects" ? "active" : ""
          }`}
          onClick={() => setActivePage("projects")}
        >
          <FolderKanban size={18} />
          Projects
        </button>

        <button
          className={`nav-item ${
            activePage === "tickets" ? "active" : ""
          }`}
          onClick={() => setActivePage("tickets")}
        >
          <Ticket size={18} />
          Tickets
        </button>
         </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

            <main className="main-content">
        {activePage === "projects" ? (
          <section className="page-section">
            <div className="topbar">
              <div>
                <h1>Projects</h1>
                <p>Manage your issue-tracking projects.</p>
                <span className="page-count">
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}
              </span>
              </div>

              <button
                className="small-button"
                onClick={() => setShowProjectForm(true)}
              >
                <Plus size={16} />
                New Project
              </button>
            </div>

             {showProjectForm && (
            <div className="panel project-form-panel">
              <div className="panel-header">
                <div>
                  <h2>New Project</h2>
                  <p>Create a project for your workspace.</p>
                </div>
              </div>

              <form
                onSubmit={async (event) => {
                  event.preventDefault();

                  try {
                    await axios.post(
                      `${API_URL}/api/v1/projects/`,
                      {
                        name: projectName,
                        description: projectDescription,
                        owner_id: 4,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    setProjectName("");
                    setProjectDescription("");
                    setShowProjectForm(false);

                    await loadDashboard();
                  } catch (error) {
                    alert(
                      error.response?.data?.detail ||
                        "Failed to create project."
                    );
                  }
                }}
              >
                <label>Project Name</label>

                <input
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(event) =>
                    setProjectName(event.target.value)
                  }
                  required
                />

                <label>Description</label>

                <textarea
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(event) =>
                    setProjectDescription(event.target.value)
                  }
                  rows="4"
                />

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowProjectForm(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="small-button">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="project-search">
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(event) =>
                  setProjectSearch(event.target.value)
                }
              />

              {projectSearch && (
                <button
                  className="clear-search"
                  onClick={() => setProjectSearch("")}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="projects-grid">
              {projects.filter((project) =>
                  project.name
                    .toLowerCase()
                    .includes(projectSearch.toLowerCase())
                ).length === 0 ? (
                  <div className="empty-state">
                    <FolderKanban size={30} />
                    <p>
                      {projectSearch
                        ? "No matching projects."
                        : "No projects yet."}
                    </p>
                  </div>
                ) : (
                  projects
                    .filter((project) =>
                      project.name
                        .toLowerCase()
                        .includes(projectSearch.toLowerCase())
                    )
                    .map((project) => (
                  <div className="project-card" key={project.id}>
                    <div className="project-icon">
                      <FolderKanban size={20} />
                    </div>

                    <div>
                      <h2>{project.name}</h2>
                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>
                    </div>

                    <span>Project #{project.id}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : activePage === "tickets" ? (
  <section className="page-section">
    <div className="topbar">
      <div>
        <h1>Tickets</h1>
        <p>Track and manage project issues.</p>
        <span className="page-count">
          {tickets.length}{" "}
          {tickets.length === 1 ? "ticket" : "tickets"}
        </span>
      </div>

      <button
        className="small-button"
        onClick={() => setShowTicketForm(true)}
      >
        <Plus size={16} />
        New Ticket
      </button>
    </div>

    <div className="panel">
      <div className="ticket-search">
        <input
          type="text"
          placeholder="Search tickets..."
          value={ticketSearch}
          onChange={(event) =>
            setTicketSearch(event.target.value)
          }
        />

        {ticketSearch && (
          <button
            className="clear-search"
            onClick={() => setTicketSearch("")}
          >
            Clear
          </button>
        )}
      </div>

      {showTicketForm && (
        <div className="ticket-form">
          <div className="panel-header">
            <div>
              <h2>New Ticket</h2>
              <p>Create a new issue for a project.</p>
            </div>
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              try {
                await axios.post(
                  `${API_URL}/api/v1/tickets/`,
                  {
                    title: ticketTitle,
                    description: ticketDescription,
                    project_id: Number(ticketProjectId),
                    created_by: 4,
                    status: ticketStatus,
                    priority: ticketPriority,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setTicketTitle("");
                setTicketDescription("");
                setTicketProjectId("");
                setTicketPriority("medium");
                setTicketStatus("open");
                setShowTicketForm(false);

                await loadDashboard();
              } catch (error) {
                alert(
                  error.response?.data?.detail ||
                    "Failed to create ticket."
                );
              }
            }}
          >
            <label>Ticket Title</label>

            <input
              type="text"
              placeholder="Enter ticket title"
              value={ticketTitle}
              onChange={(event) =>
                setTicketTitle(event.target.value)
              }
              required
            />

            <label>Project</label>

            <select
              value={ticketProjectId}
              onChange={(event) =>
                setTicketProjectId(event.target.value)
              }
              required
            >
              <option value="">Select a project</option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>

            <label>Priority</label>

            <select
              value={ticketPriority}
              onChange={(event) =>
                setTicketPriority(event.target.value)
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label>Status</label>

            <select
              value={ticketStatus}
              onChange={(event) =>
                setTicketStatus(event.target.value)
              }
            >
              <option value="open">Open</option>
              <option value="in_progress">
                In Progress
              </option>
              <option value="closed">Closed</option>
            </select>

            <label>Description</label>

            <textarea
              placeholder="Describe the issue"
              value={ticketDescription}
              onChange={(event) =>
                setTicketDescription(event.target.value)
              }
              rows="4"
            />

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowTicketForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="small-button"
              >
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {tickets.filter((ticket) =>
        ticket.title
          .toLowerCase()
          .includes(ticketSearch.toLowerCase())
      ).length === 0 ? (
        <div className="empty-state">
          <Ticket size={30} />
          <p>
            {ticketSearch
              ? "No matching tickets."
              : "No tickets yet."}
          </p>
        </div>
      ) : (
        <div className="ticket-list">
          {tickets
            .filter((ticket) =>
              ticket.title
                .toLowerCase()
                .includes(ticketSearch.toLowerCase())
            )
            .map((ticket) => (
              <div
                className="ticket-row"
                key={ticket.id}
              >
                <div>
                  <strong>{ticket.title}</strong>
                  <span>
                    Project #{ticket.project_id}
                  </span>
                </div>

                <div className="ticket-meta">
                  <span
                  className={`status ${ticket.status}`}
                >
                  {ticket.status === "in_progress"
                    ? "In Progress"
                    : ticket.status}
                </span>

                  <span
                    className={`priority ${ticket.priority}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  </section>
        ) : (
          <>
            <header className="topbar">
              <div>
                <h1>Dashboard</h1>
                <p>
                  Welcome back, {username || "User"}.
                </p>
              </div>

              <div className="user-badge">
                {username?.charAt(0).toUpperCase()}
              </div>
            </header>

            <section className="stats-grid">
              <div
                className="stat-card"
                onClick={() => setActivePage("projects")}
              >
                <FolderKanban size={20} />
                <span>Projects</span>
                <strong>{projects.length}</strong>
              </div>
              <div
                  className="stat-card"
                  onClick={() => setActivePage("tickets")}
                >
                  <Ticket size={20} />
                  <span>Tickets</span>
                  <strong>{tickets.length}</strong>
                </div>

              <div className="stat-card">
                <Activity size={22} />
                <span>Open Tickets</span>
                <strong>{openTickets.length}</strong>
              </div>

              <div className="stat-card">
                <Ticket size={22} />
                <span>High Priority</span>
                <strong>{highPriorityTickets.length}</strong>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Recent Tickets</h2>
                    <p>Your latest issue activity</p>
                  </div>

                    <button
                    className="small-button"
                    onClick={() => {
                      setActivePage("tickets");
                      setShowTicketForm(true);
                    }}
                  >
                    <Plus size={16} />
                    New Ticket
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="empty-state">
                    <Ticket size={30} />
                    <p>No tickets yet.</p>
                  </div>
                ) : (
                  <div className="ticket-list">
                    {tickets
                      .slice(-5)
                      .reverse()
                      .map((ticket) => (
                        <div
                          className="ticket-row"
                          key={ticket.id}
                        >
                          <div>
                            <strong>{ticket.title}</strong>
                            <span>
                              Project #{ticket.project_id}
                            </span>
                          </div>

                          <div className="ticket-meta">
                            <span
                              className={`status ${ticket.status}`}
                            >
                              {ticket.status}
                            </span>

                            <span
                              className={`priority ${ticket.priority}`}
                            >
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>System Status</h2>
                    <p>Application health</p>
                  </div>
                </div>

                <div className="health-card">
                  <span
                    className={`health-dot ${
                      apiStatus === "Healthy"
                        ? "healthy"
                        : ""
                    }`}
                  />

                  <div>
                    <strong>API Server</strong>
                    <span>{apiStatus}</span>
                  </div>
                </div>

                <div className="health-card">
                  <span className="health-dot healthy" />

                  <div>
                    <strong>Database</strong>
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;