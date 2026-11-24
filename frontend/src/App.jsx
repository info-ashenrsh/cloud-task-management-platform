import { useEffect, useMemo, useState } from "react";
import {
  getTasks,
  createTask as createTaskAPI,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI
} from "./services/api";
import {
  LayoutDashboard, CheckSquare, Clock3, CircleCheck,
  Plus, Search, Menu, Sun, Moon, Trash2, Zap, X
} from "lucide-react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Complete DevOps assignment", description: "Finish the cloud deployment workflow.", status: "Pending", priority: "High" },
  { id: 2, title: "Build React dashboard", description: "Create a responsive task management interface.", status: "In Progress", priority: "Medium" },
  { id: 3, title: "Configure GitHub repository", description: "Prepare repository and documentation.", status: "Completed", priority: "Low" }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === "Pending").length,
    progress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length
  }), [tasks]);
  useEffect(() => {
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  loadTasks();
}, []);

  const visibleTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || task.status === filter)
  );

  const addTask = async () => {
  if (!title.trim()) return;

  try {
    const newTask = await createTaskAPI({
      title: title.trim(),
      description: description.trim(),
      priority
    });

    setTasks(prev => [newTask, ...prev]);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setShowForm(false);
    setApiError("");
  } catch (error) {
    setApiError(error.message);
  }
};

  const updateStatus = async (id, status) => {
  try {
    const updatedTask = await updateTaskAPI(id, { status });

    setTasks(prev =>
      prev.map(task => task.id === id ? updatedTask : task)
    );
    setApiError("");
  } catch (error) {
    setApiError(error.message);
  }
};

  const deleteTask = async (id) => {
  try {
    await deleteTaskAPI(id);
    setTasks(prev => prev.filter(task => task.id !== id));
    setApiError("");
  } catch (error) {
    setApiError(error.message);
  }
};

  const completion = stats.total
    ? Math.round(stats.completed / stats.total * 100)
    : 0;

  return (
    <div className={`app-shell ${dark ? "dark" : "light"}`}>
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"><CheckSquare /></div>
            <span>Cloud<span className="brand-highlight">Tasks</span></span>
            <button className="mobile-close" onClick={() => setSidebarOpen(false)}><X /></button>
          </div>

          <p className="nav-label">WORKSPACE</p>

          <button className="nav-item active" onClick={() => setFilter("All")}>
            <LayoutDashboard /> Dashboard
          </button>
          <button className="nav-item" onClick={() => setFilter("All")}>
            <CheckSquare /> All Tasks <span className="nav-count">{stats.total}</span>
          </button>
          <button className="nav-item" onClick={() => setFilter("Pending")}>
            <Clock3 /> Pending
          </button>
          <button className="nav-item" onClick={() => setFilter("Completed")}>
            <CircleCheck /> Completed
          </button>

          <div className="sidebar-bottom">
            <div className="workspace-card">
              <Zap />
              <strong>Stay productive</strong>
              <p>Small steps create big results.</p>
            </div>
            <div className="profile">
              <div className="avatar">A</div>
              <div><strong>My Workspace</strong><small>Personal account</small></div>
            </div>
          </div>
        </aside>
      )}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </button>
          <div className="breadcrumb">Workspace / Dashboard</div>
          <button className="icon-button" onClick={() => setDark(!dark)}>
            {dark ? <Sun /> : <Moon />}
          </button>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <div className="eyebrow"><Zap size={14} /> YOUR PRODUCTIVITY SPACE</div>
              <h1>Welcome back, <span>Ashen.</span></h1>
              <p>Organize your work, focus on what matters, and make progress.</p>
            </div>
            <button className="primary-button" onClick={() => setShowForm(!showForm)}>
              <Plus size={18} /> Create New Task
            </button>
          </section>

          <section className="stats-grid">
            {[
              ["Total Tasks", stats.total, "Tasks in workspace"],
              ["Pending", stats.pending, "Waiting to start"],
              ["In Progress", stats.progress, "Currently working"],
              ["Completed", stats.completed, "Successfully finished"]
            ].map(([label, value, note]) => (
              <div className="stat-card" key={label}>
                <div className="stat-top"><span>{label}</span><Zap size={18} /></div>
                <strong>{value}</strong>
                <small>{note}</small>
              </div>
            ))}
          </section>

          <section className="content-grid">
            <div className="task-panel">
              <div className="panel-heading">
                <div><h2>My Tasks</h2><p>Manage and track your daily activities</p></div>
                <button className="secondary-button" onClick={() => setShowForm(!showForm)}>
                  <Plus size={16} /> Add task
                </button>
              </div>

              {showForm && (
                <div className="create-form">
                  <h3>Create a new task</h3>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" />
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Task description (optional)" />
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                  <div className="form-actions">
                    <button className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                    <button className="primary-button" onClick={addTask}>Create Task</button>
                  </div>
                </div>
              )}
              {loading && (
                <p className="empty-state">Loading tasks from backend...</p>
              )}

              {apiError && (
                <p style={{ color: "#ef4444" }}>
                  Backend error: {apiError}
                </p>
              )}

              <div className="task-toolbar">
                <div className="search-box">
                  <Search size={17} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." />
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                  <option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>

              {visibleTasks.length === 0 && <p className="empty-state">No tasks found.</p>}

              {visibleTasks.map(task => (
                <article className="task-row" key={task.id}>
                  <div className="task-main">
                    <div className={`task-marker ${task.status === "Completed" ? "done" : ""}`} />
                    <div className="task-info">
                      <strong>{task.title}</strong>
                      <p>{task.description || "No description provided"}</p>
                      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
                    </div>
                  </div>
                  <div className="task-controls">
                    <select className={`status-select ${task.status.toLowerCase().replace(" ", "-")}`} value={task.status} onChange={e => updateStatus(task.id, e.target.value)}>
                      <option>Pending</option><option>In Progress</option><option>Completed</option>
                    </select>
                    <button className="delete-button" onClick={() => deleteTask(task.id)} title="Delete task"><Trash2 size={17} /></button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="progress-panel">
              <div className="panel-heading"><div><h2>Overview</h2><p>Your productivity</p></div><Zap /></div>
              <div className="progress-ring" style={{ "--progress": `${completion}%` }}>
                <div><strong>{completion}%</strong><span>Completed</span></div>
              </div>
              <p className="progress-caption">Overall task completion</p>
              <div className="progress-detail"><span>Total tasks</span><strong>{stats.total}</strong></div>
              <div className="progress-detail"><span>Completed</span><strong>{stats.completed}</strong></div>
              <div className="progress-detail"><span>Remaining</span><strong>{stats.total - stats.completed}</strong></div>
              <div className="motivation"><Zap /><p>Keep going! Every completed task brings you closer to your goals.</p></div>
            </aside>
          </section>

          <footer className="footer">
            <span>CloudTasks © 2026</span>
            <span>Built for productivity</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
export default App;

