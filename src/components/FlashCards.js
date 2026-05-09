import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Navbar from "./Navbar";
import "./FlashCards.css";

const FlashCards = () => {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState(() => JSON.parse(localStorage.getItem("ss-decks")) || []);
  const [activeDeck, setActiveDeck] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ know: 0, dontKnow: 0 });
  const [newDeckName, setNewDeckName] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);
  useEffect(() => { localStorage.setItem("ss-decks", JSON.stringify(decks)); }, [decks]);

  const createDeck = (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    setDecks([...decks, { id: Date.now(), name: newDeckName.trim(), cards: [] }]);
    setNewDeckName("");
  };

  const deleteDeck = (id) => setDecks(decks.filter((d) => d.id !== id));

  const addCard = (e) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    const updated = decks.map((d) =>
      d.id === activeDeck.id
        ? { ...d, cards: [...d.cards, { id: Date.now(), q: newQ.trim(), a: newA.trim() }] }
        : d
    );
    setDecks(updated);
    setActiveDeck(updated.find((d) => d.id === activeDeck.id));
    setNewQ(""); setNewA(""); setAddingCard(false);
  };

  const deleteCard = (cardId) => {
    const updated = decks.map((d) =>
      d.id === activeDeck.id
        ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
        : d
    );
    setDecks(updated);
    setActiveDeck(updated.find((d) => d.id === activeDeck.id));
    if (cardIndex >= activeDeck.cards.length - 1) setCardIndex(0);
  };

  const startStudy = (deck) => {
    setActiveDeck(deck);
    setCardIndex(0);
    setFlipped(false);
    setScore({ know: 0, dontKnow: 0 });
  };

  const next = (knew) => {
    setScore((s) => ({ ...s, [knew ? "know" : "dontKnow"]: s[knew ? "know" : "dontKnow"] + 1 }));
    setFlipped(false);
    setTimeout(() => setCardIndex((i) => i + 1), 150);
  };

  const currentCard = activeDeck?.cards[cardIndex];
  const done = activeDeck && cardIndex >= activeDeck.cards.length;
  const total = score.know + score.dontKnow;

  return (
    <div className="page-wrapper">
      <Navbar user={user} />
      <div className="fc-page">
        <h1 className="page-title">Flashcards</h1>

        {/* Study mode */}
        {activeDeck && !done && currentCard && (
          <div className="study-mode">
            <div className="study-header">
              <button className="btn-back" onClick={() => setActiveDeck(null)}>← Back</button>
              <span className="study-progress">{cardIndex + 1} / {activeDeck.cards.length}</span>
            </div>
            <div className={`fc-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
              <div className="fc-front">
                <span className="fc-side-label">Question</span>
                <p>{currentCard.q}</p>
                <span className="fc-hint">Tap to reveal</span>
              </div>
              <div className="fc-back">
                <span className="fc-side-label">Answer</span>
                <p>{currentCard.a}</p>
              </div>
            </div>
            {flipped && (
              <div className="study-actions">
                <button className="btn-dontknow" onClick={() => next(false)}>✗ Don't Know</button>
                <button className="btn-know" onClick={() => next(true)}>✓ Know It</button>
              </div>
            )}
          </div>
        )}

        {/* Done screen */}
        {activeDeck && done && (
          <div className="study-done">
            <div className="done-card">
              <h2>Session Complete! 🎉</h2>
              <div className="done-stats">
                <div className="done-stat know">
                  <span>{score.know}</span>
                  <label>Knew</label>
                </div>
                <div className="done-stat dontknow">
                  <span>{score.dontKnow}</span>
                  <label>Missed</label>
                </div>
                <div className="done-stat pct">
                  <span>{total > 0 ? Math.round((score.know / total) * 100) : 0}%</span>
                  <label>Score</label>
                </div>
              </div>
              <div className="done-actions">
                <button className="btn-retry" onClick={() => startStudy(activeDeck)}>Retry</button>
                <button className="btn-back" onClick={() => setActiveDeck(null)}>Back to Decks</button>
              </div>
            </div>
          </div>
        )}

        {/* Deck list */}
        {!activeDeck && (
          <>
            <form className="create-deck-form" onSubmit={createDeck}>
              <input
                type="text"
                placeholder="New deck name…"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
              />
              <button type="submit">+ Create Deck</button>
            </form>

            {decks.length === 0 && <p className="empty-state">No decks yet. Create one above!</p>}

            <div className="decks-grid">
              {decks.map((deck) => (
                <div key={deck.id} className="deck-card">
                  <div className="deck-info">
                    <h3>{deck.name}</h3>
                    <span>{deck.cards.length} cards</span>
                  </div>
                  <div className="deck-actions">
                    <button className="btn-study" onClick={() => startStudy(deck)} disabled={!deck.cards.length}>
                      Study
                    </button>
                    <button className="btn-edit" onClick={() => { setActiveDeck(deck); setCardIndex(deck.cards.length); }}>
                      Edit
                    </button>
                    <button className="btn-del" onClick={() => deleteDeck(deck.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Edit deck (card index >= cards.length means edit mode) */}
        {activeDeck && cardIndex >= activeDeck.cards.length && done && (
          <div className="edit-deck">
            <div className="edit-header">
              <h2>{activeDeck.name}</h2>
              <button className="btn-back" onClick={() => setActiveDeck(null)}>← Back</button>
            </div>
            <button className="btn-add-card" onClick={() => setAddingCard(true)}>+ Add Card</button>
            {addingCard && (
              <form className="add-card-form" onSubmit={addCard}>
                <textarea placeholder="Question" value={newQ} onChange={(e) => setNewQ(e.target.value)} rows={2} />
                <textarea placeholder="Answer" value={newA} onChange={(e) => setNewA(e.target.value)} rows={2} />
                <div className="add-card-btns">
                  <button type="submit">Add</button>
                  <button type="button" onClick={() => setAddingCard(false)}>Cancel</button>
                </div>
              </form>
            )}
            <div className="cards-list">
              {activeDeck.cards.map((c, i) => (
                <div key={c.id} className="card-row">
                  <span className="card-num">{i + 1}</span>
                  <div className="card-qa">
                    <p className="card-q">{c.q}</p>
                    <p className="card-a">{c.a}</p>
                  </div>
                  <button className="btn-del" onClick={() => deleteCard(c.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCards;
