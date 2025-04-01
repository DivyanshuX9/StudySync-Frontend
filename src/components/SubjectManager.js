import React, { useState, useEffect } from "react";
import "./SubjectManager.css";


const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    setSubjects(storedSubjects);
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    const subjectName = prompt("Enter subject name:");
    if (!subjectName) return;
    setSubjects([...subjects, { name: subjectName, chapters: [] }]);
  };

  const deleteSubject = (index) => {
    if (
      window.confirm(
        `Delete subject "${subjects[index].name}" and all its data?`
      )
    ) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const addChapter = (subjectIndex) => {
    const chapterName = prompt("Enter chapter name:");
    if (!chapterName) return;
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters.push({ name: chapterName, pdfs: [] });
    setSubjects(newSubjects);
  };

  const uploadPDF = (subjectIndex, chapterIndex, file) => {
    if (!file) return;
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex].pdfs.push(file.name);
    setSubjects(newSubjects);
  };

  const deletePDF = (subjectIndex, chapterIndex, pdfIndex) => {
    if (window.confirm("Delete this PDF?")) {
      const newSubjects = [...subjects];
      newSubjects[subjectIndex].chapters[chapterIndex].pdfs.splice(pdfIndex, 1);
      setSubjects(newSubjects);
    }
  };

  return (
    <div className="container">
      <h2>Subject Manager</h2>
      <button onClick={addSubject}>+ Add Subject</button>
      <div id="subjects">
        {subjects.map((subject, subjectIndex) => (
          <div key={subjectIndex} className="subject">
            <h3>{subject.name}</h3>
            <button onClick={() => addChapter(subjectIndex)}>
              + Add Chapter
            </button>
            <button
              onClick={() => deleteSubject(subjectIndex)}
              style={{ background: "red", color: "white" }}
            >
              Delete Subject
            </button>
            <div className="chapters">
              {subject.chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="chapter">
                  <h4>{chapter.name}</h4>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      uploadPDF(subjectIndex, chapterIndex, e.target.files[0])
                    }
                  />
                  <div className="pdf-list">
                    {chapter.pdfs.length > 0
                      ? chapter.pdfs.map((pdf, pdfIndex) => (
                          <div key={pdfIndex}>
                            {pdf}
                            <button
                              onClick={() =>
                                deletePDF(subjectIndex, chapterIndex, pdfIndex)
                              }
                              style={{ background: "darkred", color: "white" }}
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      : "No PDFs uploaded"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default SubjectManager;
