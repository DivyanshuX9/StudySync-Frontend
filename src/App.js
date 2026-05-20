import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth, isFirebaseConfigured, onAuthStateChanged } from "./components/firebase";
import { WeatherProvider, useWeather } from "./context/WeatherContext";

import Chatbot from "./components/Chatbot";
import FlashCards from "./components/FlashCards";
import LandingPage from "./components/LandingPage";
import PomodoroTimer from "./components/PomodoroTimer";
import SignIn from "./components/SignIn";
import StudyNotes from "./components/StudyNotes";
import SubjectManager from "./components/SubjectManager";
import TaskManager from "./components/TaskManager";
import Timetable from "./components/Timetable";

// Apply data-tone to <html> globally so inner pages also get the right tone
function ToneApplier() {
  const { toneKey } = useWeather();
  useEffect(() => {
    document.documentElement.setAttribute("data-tone", toneKey);
  }, [toneKey]);
  return null;
}

function App() {
  const [user, setUser] = useState(isFirebaseConfigured ? undefined : null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Show loading state only if Firebase is configured
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <WeatherProvider>
      <Router>
        <ToneApplier />
        <Routes>
          <Route path="/"                element={<LandingPage user={user} />} />
          <Route path="/signin"          element={<SignIn />} />
          <Route path="/tasks"           element={<TaskManager   user={user} />} />
          <Route path="/pomodoro"        element={<PomodoroTimer user={user} />} />
          <Route path="/timetable"       element={<Timetable     user={user} />} />
          <Route path="/subject-manager" element={<SubjectManager user={user} />} />
          <Route path="/chatbot"         element={<Chatbot       user={user} />} />
          <Route path="/flashcards"      element={<FlashCards    user={user} />} />
          <Route path="/notes"           element={<StudyNotes    user={user} />} />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}

export default App;
