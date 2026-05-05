import React, { useState, useEffect, useRef } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Navbar from "./Navbar";
import "./Timetable.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

const Timetable = () => {
  const [user, setUser]         = useState(null);
  const [timeSlots, setTimeSlots] = useState(() => JSON.parse(localStorage.getItem("timeSlots")) || DEFAULT_TIMES);
  const [schedule, setSchedule]   = useState(() => JSON.parse(localStorage.getItem("studySchedule")) || {});
  const [saved, setSaved]         = useState(false);
  const [parsing, setParsing]     = useState(false);
  const [parseError, setParseError] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);
  useEffect(() => {
    localStorage.setItem("studySchedule", JSON.stringify(schedule));
    localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
  }, [schedule, timeSlots]);

  const handleTimeChange = (i, val) => {
    const u = [...timeSlots]; u[i] = val; setTimeSlots(u);
  };

  const handleCellChange = (day, time, val) => {
    setSchedule({ ...schedule, [`${day}-${time}`]: val });
  };

  const addRow    = () => setTimeSlots([...timeSlots, ""]);
  const deleteRow = (i) => {
    if (timeSlots.length <= 1) return;
    setTimeSlots(timeSlots.filter((_, idx) => idx !== i));
    setSchedule(Object.fromEntries(Object.entries(schedule).filter(([k]) => !k.endsWith(`-${i}`))));
  };

  const saveSchedule = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const clearSchedule = () => { setSchedule({}); localStorage.removeItem("studySchedule"); };

  /* ── RAG Upload ─────────────────────────────────── */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setParseError("");
    setParseSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/parse-timetable`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Parse failed");

      if (data.timeSlots?.length) setTimeSlots(data.timeSlots);
      if (data.schedule) setSchedule(data.schedule);
      setParseSuccess(true);
      setTimeout(() => setParseSuccess(false), 3000);
    } catch (err) {
      setParseError(err.message);
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar user={user} />
      <div className="timetable-page">
        <div className="tt-header">
          <h1 className="page-title">Timetable</h1>
          <div className="tt-actions">
            {/* RAG Upload */}
            <label className={`btn-upload ${parsing ? "uploading" : ""}`} title="Upload timetable PDF or image to auto-fill">
              {parsing ? "⏳ Parsing…" : "📤 Import"}
              <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleUpload} disabled={parsing} />
            </label>
            <button className="btn-action" onClick={addRow}>+ Row</button>
            <button className="btn-action btn-clear" onClick={clearSchedule}>Clear</button>
            <button className="btn-action btn-save" onClick={saveSchedule}>{saved ? "✓ Saved!" : "Save"}</button>
          </div>
        </div>

        {parseError   && <div className="parse-msg parse-err">⚠ {parseError}</div>}
        {parseSuccess && <div className="parse-msg parse-ok">✓ Timetable imported successfully!</div>}

        <div className="table-wrapper">
          <table className="tt-table">
            <thead>
              <tr>
                <th className="time-col">Time</th>
                {DAYS.map(d => <th key={d}>{d}</th>)}
                <th className="action-col" />
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, ti) => (
                <tr key={ti}>
                  <td className="time-col">
                    <input type="text" value={time} onChange={e => handleTimeChange(ti, e.target.value)} placeholder="Time" className="time-input" />
                  </td>
                  {DAYS.map((_, di) => (
                    <td key={di}>
                      <input type="text" value={schedule[`${di}-${ti}`] || ""} onChange={e => handleCellChange(di, ti, e.target.value)} placeholder="—" className="cell-input" />
                    </td>
                  ))}
                  <td className="action-col">
                    <button className="row-delete" onClick={() => deleteRow(ti)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
