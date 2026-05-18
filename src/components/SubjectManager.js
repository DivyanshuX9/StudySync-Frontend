import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import GuestBanner from "./GuestBanner";
import Navbar from "./Navbar";
import PageBackground from "./PageBackground";
import "./SubjectManager.css";

const SubjectManager = () => {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState(() => {
    try {
      const stored = localStorage.getItem("subjects");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse subjects from localStorage:", err);
      return [];
    }
  });
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterNames, setNewChapterNames] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setSubjects([...subjects, { name: newSubjectName.trim(), chapters: [] }]);
    setNewSubjectName("");
  };

  const deleteSubject = (si) => {
    setSubjects(subjects.filter((_, i) => i !== si));
  };

  const addChapter = (si) => {
    const name = newChapterNames[si]?.trim();
    if (!name) return;
    setSubjects(subjects.map((s, i) =>
      i === si ? { ...s, chapters: [...s.chapters, { name, pdfs: [] }] } : s
    ));
    setNewChapterNames({ ...newChapterNames, [si]: "" });
  };

  const deleteChapter = (si, ci) => {
    setSubjects(subjects.map((s, i) =>
      i === si ? { ...s, chapters: s.chapters.filter((_, j) => j !== ci) } : s
    ));
  };

  const uploadPDF = (si, ci, file) => {
    if (!file) return;
    setSubjects(subjects.map((s, i) =>
      i === si
        ? { ...s, chapters: s.chapters.map((ch, j) =>
            j === ci ? { ...ch, pdfs: [...ch.pdfs, file.name] } : ch
          )}
        : s
    ));
  };

  const deletePDF = (si, ci, pi) => {
    setSubjects(subjects.map((s, i) =>
      i === si
        ? { ...s, chapters: s.chapters.map((ch, j) =>
            j === ci ? { ...ch, pdfs: ch.pdfs.filter((_, k) => k !== pi) } : ch
          )}
        : s
    ));
  };

  return (
    <div className="page-wrapper">
      <PageBackground />
      <Navbar user={user} />
      {!user && <GuestBanner />}
      <div className="sm-page">
        <h1 className="page-title">Subject Manager</h1>

        <form className="add-subject-form" onSubmit={addSubject}>
          <input
            type="text"
            placeholder="New subject name..."
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <button type="submit">+ Add Subject</button>
        </form>

        {subjects.length === 0 && (
          <p className="empty-state">No subjects yet. Add one above!</p>
        )}

        <div className="subjects-list">
          {subjects.map((subject, si) => (
            <div key={si} className="subject-card">
              <div className="subject-header">
                <h2>{subject.name}</h2>
                <button className="btn-danger-sm" onClick={() => deleteSubject(si)}>Delete Subject</button>
              </div>

              <div className="add-chapter-row">
                <input
                  type="text"
                  placeholder="New chapter name..."
                  value={newChapterNames[si] || ""}
                  onChange={(e) => setNewChapterNames({ ...newChapterNames, [si]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addChapter(si)}
                />
                <button className="btn-secondary-sm" onClick={() => addChapter(si)}>+ Chapter</button>
              </div>

              {subject.chapters.length === 0 && (
                <p className="empty-sub">No chapters yet.</p>
              )}

              <div className="chapters-list">
                {subject.chapters.map((chapter, ci) => (
                  <div key={ci} className="chapter-card">
                    <div className="chapter-header">
                      <h3>📖 {chapter.name}</h3>
                      <button className="btn-icon-danger" onClick={() => deleteChapter(si, ci)} title="Delete chapter">✕</button>
                    </div>

                    <label className="upload-label">
                      <span>📎 Upload PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => uploadPDF(si, ci, e.target.files[0])}
                      />
                    </label>

                    {chapter.pdfs.length > 0 && (
                      <div className="pdf-list">
                        {chapter.pdfs.map((pdf, pi) => (
                          <div key={pi} className="pdf-item">
                            <span>📄 {pdf}</span>
                            <button className="btn-icon-danger" onClick={() => deletePDF(si, ci, pi)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectManager;
