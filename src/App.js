import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth, onAuthStateChanged } from "./components/firebase";

import Chatbot from "./components/Chatbot";
import LandingPage from "./components/LandingPage";
import PomodoroTimer from "./components/PomodoroTimer";
import SignIn from "./components/SignIn";
import SubjectManager from "./components/SubjectManager";
import TaskManager from "./components/TaskManager";
import Timetable from "./components/Timetable";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/tasks" element={user ? <TaskManager /> : <Navigate to="/signin" replace />} />
        <Route path="/pomodoro" element={user ? <PomodoroTimer /> : <Navigate to="/signin" replace />} />
        <Route path="/timetable" element={user ? <Timetable /> : <Navigate to="/signin" replace />} />
        <Route path="/subject-manager" element={user ? <SubjectManager /> : <Navigate to="/signin" replace />} />
        <Route path="/chatbot" element={user ? <Chatbot /> : <Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
