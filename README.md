<div align="center">

# StudySync Frontend

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=22&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=React+19+%7C+Firebase+Auth+%7C+Gemini+AI;16+Weather+Tones+%7C+Dynamic+Island+Nav;Pomodoro+%7C+Flashcards+%7C+Timetable+%7C+Notes" alt="Typing SVG" />

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Animations-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## Project Structure

```
client/
+-- public/
|   +-- favicon.svg               # Branded SVG favicon
|   +-- index.html                # App shell
|
+-- src/
|   +-- App.js                    # Root: routes, auth guard, ToneApplier
|   +-- index.css                 # Global tokens + 16 weather tones
|   |
|   +-- context/
|   |   +-- WeatherContext.js     # Open-Meteo API, geolocation, toneKey
|   |   +-- ThemeContext.js       # Day/night shim
|   |
|   +-- components/
|       +-- Navbar.js             # Desktop floating nav | Mobile Dynamic Island
|       +-- Navbar.css
|       +-- LandingPage.js        # Hero + weather video bg + arch graph
|       +-- LandingPage.css
|       +-- SignIn.js             # Firebase email + Google OAuth
|       +-- SignIn.css
|       +-- TaskManager.js        # Priority tasks + progress bar
|       +-- TaskManager.css
|       +-- PomodoroTimer.js      # Circular SVG timer + break modes
|       +-- PomodoroTimer.css
|       +-- Timetable.js          # Weekly grid + RAG PDF/image import
|       +-- Timetable.css
|       +-- SubjectManager.js     # Subjects, chapters, PDFs
|       +-- SubjectManager.css
|       +-- FlashCards.js         # Decks + 3D flip + spaced repetition
|       +-- FlashCards.css
|       +-- StudyNotes.js         # Two-panel notes editor + tags + search
|       +-- StudyNotes.css
|       +-- Chatbot.js            # Darwin AI: text / image / PDF
|       +-- Chatbot.css
|       +-- firebase.js           # Firebase config + auth exports
|
+-- .env                          # REACT_APP_API_URL=http://localhost:8000
+-- .env.example
+-- package.json
```

---

## Quick Start

```bash
cd client
npm install
cp .env.example .env
npm start                         # http://localhost:3000
```

Requires the backend running on port 8000. See [backend repo](https://github.com/DivyanshuX9/Study-Sync-Backend).

---

## System Architecture

```
+----------------------------------------------------------+
|                        BROWSER                           |
|                                                          |
|  +----------------+    +----------------+               |
|  | WeatherContext |    |  Firebase SDK  |               |
|  +-------+--------+    +-------+--------+               |
|          |                     |                         |
|          v                     v                         |
|  +-------+--------+    +-------+--------+               |
|  | Open-Meteo API |    | Firebase Auth  |               |
|  | (weather data) |    | Google + Email |               |
|  +----------------+    +----------------+               |
|                                                          |
|  +----------------+                                      |
|  |   fetch()      +----> Express Server :8000            |
|  +----------------+         |                            |
|                              +-- POST /chat              |
|                              +-- POST /parse-timetable   |
+----------------------------------------------------------+
```

---

## Weather Tone System

Weather is fetched from [Open-Meteo](https://open-meteo.com/) (free, no API key).

```
Browser geolocation
      |
      v
Nominatim reverse geocode (OpenStreetMap)
      |
      v
Open-Meteo weather fetch
      |
      v
WMO code  -->  condition key
      |
      v
condition + day/night  -->  toneKey
      |
      v
data-tone on <html>  -->  CSS vars cascade to all components
```

### 16 Weather Tones

| Condition | Day Tone | Night Tone |
|-----------|----------|------------|
| Clear/Sunny | sunny_day | sunny_night |
| Partly Cloudy | partly_cloudy_day | partly_cloudy_night |
| Overcast | overcast_day | overcast_night |
| Cloudy/Fog | cloudy_day | cloudy_night |
| Drizzle | drizzle_day | drizzle_night |
| Rain | rain_day | rain_night |
| Thunderstorm | thunderstorm_day | thunderstorm_night |
| Snow | snow_day | snow_night |

The ray-beam toggle switches between day and night version of the current weather condition.

---

## Navigation

### Desktop (769px and above)
Invisible floating nav. No background, no border. Pure text links over the video background.

### Mobile (768px and below) - Dynamic Island
```
Collapsed:   [ . StudySync ]   <- pulsing dot pill

Expanded:    +------------------+
             | Tasks  Pomodoro  |
             | Notes  Flashcard |
             | [toggle] logout  |
             +------------------+
```
Auto-hides on scroll down, reappears on scroll up. Closes on route change.

---

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| / | LandingPage | Weather video hero, contextual greeting, arch graph |
| /signin | SignIn | Email + Google OAuth with animated toggle panel |
| /tasks | TaskManager | Priority tasks, filters, progress bar |
| /pomodoro | PomodoroTimer | SVG ring timer, focus/short/long break modes |
| /timetable | Timetable | Weekly grid + AI timetable import (RAG) |
| /subject-manager | SubjectManager | Subjects, chapters, PDF uploads |
| /flashcards | FlashCards | Decks, 3D flip cards, know/don't-know scoring |
| /notes | StudyNotes | Sidebar + editor, tags, full-text search |
| /chatbot | Chatbot | Darwin AI: text, image OCR, PDF analysis |

---

## Firebase Setup

Edit `src/components/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
};
```

Enable Email/Password and Google sign-in in Firebase Console.

---

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000
```

For production, set `REACT_APP_API_URL` to your deployed backend URL.

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19 | UI library |
| react-router-dom | 7 | Client-side routing |
| firebase | 11 | Auth |
| react-icons | 5 | Icon set |

---

## Contributing

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

<div align="center">
Made with love for students &nbsp;|&nbsp; <a href="https://github.com/DivyanshuX9/Study-Sync-Backend">Backend Repo</a>
</div>
