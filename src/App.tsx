import { useMemo, useState } from 'react';
import MapView from './components/MapView';
import GuessBox from './components/GuessBox';
import ResultModal from './components/ResultModal';
import { cities } from './data/cities';
import { haversineKm } from './lib/distance';
import { loadStats, saveStats } from './lib/storage';
import type { City, Guess } from './types/game';

const xpByStep: Record<number, number> = { 1: 100, 2: 75, 3: 50, 4: 25, 5: 10 };

function pickCity() {
  return cities[Math.floor(Math.random() * cities.length)];
}

function pickPoint(city: City) {
  return city.playPoints[Math.floor(Math.random() * city.playPoints.length)];
}

export default function App() {
  const [targetCity, setTargetCity] = useState(() => pickCity());
  const [playPoint, setPlayPoint] = useState(() => pickPoint(targetCity));
  const [step, setStep] = useState(1);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [won, setWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [stats, setStats] = useState(() => loadStats());

  const xpEarned = useMemo(() => xpByStep[step] ?? 0, [step]);

  function newRound() {
    const nextCity = pickCity();
    setTargetCity(nextCity);
    setPlayPoint(pickPoint(nextCity));
    setStep(1);
    setGuesses([]);
    setWon(false);
    setShowModal(false);
    setUnlocked(false);
  }

  function handleGuess(city: City) {
    if (won) return;

    const distanceKm = haversineKm(city, targetCity);
    setGuesses((current) => [...current, { cityName: `${city.name}, ${city.country}`, distanceKm }]);

    const correct = city.id === targetCity.id || distanceKm <= 5;

    if (correct) {
      const updated = {
        ...stats,
        played: stats.played + 1,
        won: stats.won + 1,
        totalXp: stats.totalXp + xpEarned,
        currentStreak: stats.currentStreak + 1,
        bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1),
        winsByStep: { ...stats.winsByStep, [step]: (stats.winsByStep[step] ?? 0) + 1 },
      };
      setStats(updated);
      saveStats(updated);
      setWon(true);
      setUnlocked(true);
      setShowModal(true);
      return;
    }

    if (step >= 5) {
      const updated = { ...stats, played: stats.played + 1, lost: stats.lost + 1, currentStreak: 0 };
      setStats(updated);
      saveStats(updated);
      setUnlocked(true);
      alert(`Helaas! Het was ${targetCity.name}, ${targetCity.country}.`);
      return;
    }

    setStep((s) => s + 1);
  }

  return (
    <div className="appShell">
      <header>
        <div>
          <h1>🌍 PlaatsRaden</h1>
          <p>Niet gokken. Oplossen.</p>
        </div>
        <div className="topStats">
          <strong>Stap {step}/5</strong>
          <span>{stats.totalXp} XP</span>
        </div>
      </header>

      <main>
        <section className="mapPanel">
          <div className="photoBadge">Foto {step}/5</div>
          <MapView
            lat={playPoint.lat}
            lng={playPoint.lng}
            step={step}
            showMarker={step >= 4}
            unlocked={unlocked}
          />
        </section>

        <aside className="sidePanel">
          <GuessBox cities={cities} disabled={won} onSubmit={handleGuess} />

          <div className="card">
            <h2>Jouw gokken</h2>
            {guesses.length === 0 && <p className="muted">Nog geen gok gedaan.</p>}
            {guesses.map((guess, index) => (
              <div className="guessItem" key={`${guess.cityName}-${index}`}>
                <span>{index + 1}. {guess.cityName}</span>
                <strong>{guess.distanceKm} km</strong>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Statistieken</h2>
            <div className="statGrid">
              <span>Gespeeld</span><strong>{stats.played}</strong>
              <span>Gewonnen</span><strong>{stats.won}</strong>
              <span>Win%</span><strong>{stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%</strong>
              <span>Beste streak</span><strong>{stats.bestStreak}</strong>
            </div>
          </div>

          <div className="card">
            <h2>Hints</h2>
            <p className="muted">Gratis tijdens de testfase. Later geschikt voor coins of betalingen.</p>
            <button className="hintButton" onClick={() => alert(`Hint: continent/regio en leermodus komen in de volgende sprint.`)}>Hint gebruiken</button>
          </div>
        </aside>
      </main>

      {showModal && (
        <ResultModal
          city={targetCity}
          xp={xpEarned}
          onNext={newRound}
          onExplore={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
