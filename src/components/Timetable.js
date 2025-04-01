import React, { useState, useEffect } from "react";
import "./Timetable.css";

const Timetable = () => {
  const initialTimes = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const [timeSlots, setTimeSlots] = useState(() => {
    return JSON.parse(localStorage.getItem("timeSlots")) || initialTimes;
  });

  const [schedule, setSchedule] = useState(() => {
    return JSON.parse(localStorage.getItem("studySchedule")) || {};
  });

  useEffect(() => {
    localStorage.setItem("studySchedule", JSON.stringify(schedule));
    localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
  }, [schedule, timeSlots]);

  const handleTimeChange = (index, value) => {
    const newTimes = [...timeSlots];
    newTimes[index] = value;
    setTimeSlots(newTimes);
  };

  const handleInputChange = (day, time, value) => {
    const newSchedule = { ...schedule, [`${day}-${time}`]: value };
    setSchedule(newSchedule);
  };

  const addRow = () => {
    const newTimeSlots = [...timeSlots, ""]; // Add empty slot
    setTimeSlots(newTimeSlots);
  };

  const deleteRow = (index) => {
    if (timeSlots.length > 1) {
      const newTimeSlots = timeSlots.filter((_, i) => i !== index);
      const newSchedule = Object.keys(schedule).reduce((acc, key) => {
        const [day, time] = key.split("-");
        if (parseInt(time) !== index) {
          acc[key] = schedule[key];
        }
        return acc;
      }, {});

      setTimeSlots(newTimeSlots);
      setSchedule(newSchedule);
    } else {
      alert("At least one row must be present.");
    }
  };

  const saveSchedule = () => {
    alert("Schedule Saved!");
  };

  const clearSchedule = () => {
    setSchedule({});
    localStorage.removeItem("studySchedule");
    alert("Schedule Cleared!");
  };

  return (
    <div className="container">
      <h2>TimeTable</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <th key={day}>{day}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, timeIndex) => (
            <tr key={timeIndex}>
              <td>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => handleTimeChange(timeIndex, e.target.value)}
                />
              </td>
              {[...Array(7)].map((_, dayIndex) => (
                <td key={dayIndex}>
                  <input
                    type="text"
                    value={schedule[`${dayIndex}-${timeIndex}`] || ""}
                    onChange={(e) => handleInputChange(dayIndex, timeIndex, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button className="delete-btn" onClick={() => deleteRow(timeIndex)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <button className="ttbuttons" onClick={saveSchedule}>Save Schedule</button>
        <button className="ttbuttons" onClick={clearSchedule}>Clear Schedule</button>
        <button className="ttbuttons" onClick={addRow}>Add Row</button>
      </div>
    </div>
  );
};

export default Timetable;
