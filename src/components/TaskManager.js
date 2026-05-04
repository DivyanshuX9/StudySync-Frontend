import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Navbar from "./Navbar";
import "./TaskManager.css";

const TaskManager = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [taskTitle, setTaskTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, {
      id: Date.now(), title: taskTitle, subject, dueDate, priority, description, completed: false,
    }]);
    setTaskTitle(""); setSubject(""); setDueDate(""); setPriority("medium"); setDescription("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (currentFilter === "completed") return t.completed;
    if (currentFilter === "pending") return !t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pct = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const barClass = pct < 40 ? "low" : pct < 70 ? "medium" : "high";

  return (
    <div className="page-wrapper">
      <Navbar user={user} />
      <div className="task-manager">
        <h1 className="page-title">Task Manager</h1>

        <div className="tm-grid">
          <div className="task-form card">
            <h2>New Task</h2>
            <form onSubmit={addTask}>
              <input type="text" placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
              <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              <button type="submit" className="btn-add">Add Task</button>
            </form>
          </div>

          <div className="task-list-section">
            <div className="task-list-header">
              <h2>My Tasks</h2>
              <div className="task-filters">
                {["all", "pending", "completed"].map((f) => (
                  <button key={f} className={currentFilter === f ? "active" : ""} onClick={() => setCurrentFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-list">
              {filteredTasks.length === 0 && (
                <p className="empty-state">No tasks here. Add one!</p>
              )}
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? "completed" : ""} priority-${task.priority}`}>
                  <div className="task-header">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                      <span className="task-title">{task.title}</span>
                    </label>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete">✕</button>
                  </div>
                  <div className="task-meta">
                    <span>📚 {task.subject}</span>
                    <span>📅 {new Date(task.dueDate + "T00:00:00").toLocaleDateString()}</span>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  {task.description && <p className="task-desc">{task.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="progress-section card">
          <h2>Study Progress</h2>
          <div className="progress-info">
            <span>{completedCount} of {tasks.length} tasks completed</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="progress-track">
            <div className={`progress-fill ${barClass}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
