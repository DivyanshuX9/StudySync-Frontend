import React, { useState, useEffect } from "react";
import "./TaskManager.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [currentFilter, setCurrentFilter] = useState("all");
  const [taskTitle, setTaskTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      subject,
      dueDate,
      priority,
      description,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setSubject("");
    setDueDate("");
    setPriority("medium");
    setDescription("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const filterTasks = (status) => {
    setCurrentFilter(status);
  };

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  


  const completedTasks = tasks.filter((task) => task.completed).length;
  const taskCompletionPercentage =
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <div className="task-form">
        <h2>Create New Task</h2>
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div className="task-list-container">
        <h2>My Tasks</h2>
        <div className="task-filters">
          <button onClick={() => filterTasks("all")}>All</button>
          <button onClick={() => filterTasks("pending")}>Pending</button>
          <button onClick={() => filterTasks("completed")}>Completed</button>
        </div>

        <div className="task-list">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.completed ? "completed" : ""}`}
            >
              <div className="task-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <h3>{task.title}</h3>
              </div>
              <p>Subject: {task.subject}</p>
              <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Priority: {task.priority.toUpperCase()}</p>
              {task.description && <p>{task.description}</p>}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-container">
        <h2>Study Progress</h2>
        <div className="progress">
  <div
    className={`progress-bar ${taskCompletionPercentage < 40 ? 'low' : taskCompletionPercentage < 70 ? 'medium' : 'high'}`}
    style={{ width: `${taskCompletionPercentage}%` }}
  >
    {Math.round(taskCompletionPercentage)}%
  </div>
</div>

      </div>
    </div>
  );
};

export default TaskManager;