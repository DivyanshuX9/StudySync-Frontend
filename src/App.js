import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth, onAuthStateChanged } from "./components/firebase";
import { WeatherProvider, useWeather } from "./context/WeatherContext";

import Chatbot        from "./components/Chatbot";
import FlashCards     from "./components/FlashCards";
import LandingPage    from "./components/LandingPage";
import PomodoroTimer  from "./components/PomodoroTimer";
import SignIn         from "./components/SignIn";
import StudyNotes     from "./components/StudyNotes";
import SubjectManager from "./components/SubjectManager";
import TaskManager    from "./components/TaskManager";
import Timetable      from "./components/Timetable";

// Apply data-tone to <html> globally so inner pages also get the right tone
function ToneApplier() {
  const { toneKey } = useWeather();
  useEffect(() => {
    document.documentElement.setAttribute("data-tone", toneKey);
  }, [toneKey]);
  return null;
}

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  if (user === undefined) return null;

  const guard = (el) => (user ? el : <Navigate to="/signin" replace />);

  return (
    <WeatherProvider>
      <Router>
        <ToneApplier />
        <Routes>
          <Route path="/"                element={<LandingPage user={user} />} />
          <Route path="/signin"          element={<SignIn />} />
          <Route path="/tasks"           element={guard(<TaskManager />)} />
          <Route path="/pomodoro"        element={guard(<PomodoroTimer />)} />
          <Route path="/timetable"       element={guard(<Timetable />)} />
          <Route path="/subject-manager" element={guard(<SubjectManager />)} />
          <Route path="/chatbot"         element={guard(<Chatbot />)} />
          <Route path="/flashcards"      element={guard(<FlashCards />)} />
          <Route path="/notes"           element={guard(<StudyNotes />)} />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}

export default App;
