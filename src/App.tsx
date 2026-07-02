import { useMemo, useState } from 'react';
import { GoogleGameMap } from './components/GoogleGameMap';
import { cities, type City } from './data/cities';
import { distanceKm } from './lib/distance';
import './styles.css';

type Guess = { city: City; distance: number };

function pickRandomCity(excludeId?: string) {
  const pool = cities.filter((c) => c.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

function xpForStep(step: number) {
  return [100, 80, 60, 40, 20][step] ?? 10;
}

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem('plaatsraden_stats') || '{}') as {
      played?: number;
      won?: number;
      xp?: number;
      firstTry?: number;
      streak?: number;
      bestStreak?: number;
    };
  } catch {
    return {};
  }
}

function saveStats(stats: ReturnType<typeof loadStats>) {
  localStorage.setItem('plaatsraden_stats', JSON.stringify(stats));
}

export default function App() {
  const [target, setTarget] = useState<City>(() => pickRandomCity());
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [solved, setSolved] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [stats, setStats] = useState(loadStats);
  const [message, setMessage] = useState('');

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return cities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [input]);

  function submitGuess(city?: City) {
    const selected = city ?? cities.find((c) => c.name.toLowerCase() === input.trim().toLowerCase());
    if (!selected) {
      setMessage('Kies een plaats uit de suggesties.');
      return;
    }

    const distance = distanceKm(selected, target);
    const nextGuesses = [...guesses, { city: selected, distance }];
    setGuesses(nextGuesses);
    setInput('');
    setMessage('');

    if (selected.id === target.id) {
      const xp = xpForStep(step);
      const newStats = {
        played: (stats.played ?? 0) + 1,
        won: (stats.won ?? 0) + 1,
        xp: (stats.xp ?? 0) + xp,
        firstTry: (stats.firstTry ?? 0) + (step === 0 ? 1 : 0),
        streak: (stats.streak ?? 0) + 1,
        bestStreak: Math.max(stats.bestStreak ?? 0, (stats.streak ?? 0) + 1)
      };
      saveStats(newStats);
      setStats(newStats);
      setEarnedXp(xp);
      setSolved(true);
      setShowWin(true);
      return;
    }

    if (step >= 4) {
      const newStats = {
        ...stats,
        played: (stats.played ?? 0) + 1,
        streak: 0
      };
      saveStats(newStats);
      setStats(newStats);
      setMessage(`Helaas. Het was ${target.name}, ${target.country}.`);
      setSolved(true);
      return;
    }

    setStep((s) => s + 1);
  }

  function nextCity() {
    setTarget(pickRandomCity(target.id));
    setStep(0);
    setInput('');
    setGuesses([]);
    setSolved(false);
    setShowWin(false);
    setEarnedXp(0);
    setMessage('');
  }

  return (
    <main className="app-shell">
      <section className="map-panel">
        <div className="brandbar">
          <div>
            <h1>🌍 PlaatsRaden</h1>
            <p>Niet gokken. Oplossen.</p>
          </div>
          <div className="step-pill">Stap {step + 1}/5</div>
        </div>
        <GoogleGameMap key={`${target.id}-${step}-${solved}`} city={target} step={step} solved={solved} />
      </section>

      <aside className="side-panel">
        <div className="card">
          <h2>Doe een gok</h2>
          <div className="input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitGuess();
              }}
              placeholder="Typ een plaats..."
              disabled={solved && showWin}
            />
            <button onClick={() => submitGuess()} disabled={solved && showWin}>Verstuur</button>
          </div>
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((city) => (
                <button key={city.id} onClick={() => submitGuess(city)}>
                  {city.name}, {city.country}
                </button>
              ))}
            </div>
          )}
          {message && <p className="message">{message}</p>}
        </div>

        <div className="card">
          <h2>Jouw gokken</h2>
          {guesses.length === 0 ? <p className="muted">Nog geen gokken gedaan.</p> : null}
          <div className="guess-list">
            {guesses.map((guess, index) => (
              <div className="guess-row" key={`${guess.city.id}-${index}`}>
                <span>{index + 1}. {guess.city.name}</span>
                <strong>{guess.distance} km</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card stats-card">
          <h2>Statistieken</h2>
          <div><span>Gespeeld</span><strong>{stats.played ?? 0}</strong></div>
          <div><span>Gewonnen</span><strong>{stats.won ?? 0}</strong></div>
          <div><span>XP</span><strong>{stats.xp ?? 0}</strong></div>
          <div><span>1e poging goed</span><strong>{stats.firstTry ?? 0}</strong></div>
          <div><span>Streak</span><strong>{stats.streak ?? 0}</strong></div>
        </div>

        <div className="card hint-card">
          <h2>Hint</h2>
          <p>Hints komen straks gratis in de testfase. Later bereiden we dit voor op coins of betaling.</p>
        </div>
      </aside>

      {showWin && (
        <div className="modal-backdrop">
          <div className="win-modal">
            <h2>🎉 Goed geraden!</h2>
            <p className="city-line">{target.name}, {target.country}</p>
            <div className="xp-badge">+{earnedXp} XP</div>
            <h3>3 feitjes</h3>
            <ul>
              {target.facts.map((fact) => <li key={fact}>{fact}</li>)}
            </ul>
            <div className="modal-actions">
              <button onClick={nextCity}>Volgende stad</button>
              <button className="secondary" onClick={() => setShowWin(false)}>Nog even rondkijken</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
