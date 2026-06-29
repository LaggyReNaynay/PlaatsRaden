import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { cities, type City } from './data/cities';
import { distanceKm } from './lib/geo';

type Guess = { name: string; km: number };
const xpByStep = [100, 75, 50, 25, 10];
const zooms = [17, 16, 15, 12, 7];
const panRadiusKm = [0.3, 0.6, 1, 9999, 9999];

function App() {
  const [city, setCity] = useState<City>(() => cities[Math.floor(Math.random() * cities.length)]);
  const [step, setStep] = useState(0);
  const [guessText, setGuessText] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [won, setWon] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const suggestions = useMemo(() => {
    const q = guessText.trim().toLowerCase();
    if (!q) return [];
    return cities.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [guessText]);

  function newRound() {
    const next = cities[Math.floor(Math.random() * cities.length)];
    setCity(next); setStep(0); setGuessText(''); setGuesses([]); setWon(false); setShowDone(false);
  }

  function submitGuess() {
    const selected = cities.find(c => c.name.toLowerCase() === guessText.trim().toLowerCase());
    if (!selected) return;
    const km = Math.round(distanceKm(selected.lat, selected.lng, city.lat, city.lng));
    const correct = selected.id === city.id;
    setGuesses(g => [...g, { name: selected.name, km }]);
    setGuessText('');
    if (correct) { setWon(true); setShowDone(true); return; }
    if (step < 4) setStep(s => s + 1);
    else setShowDone(true);
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${city.lng-0.02},${city.lat-0.012},${city.lng+0.02},${city.lat+0.012}&layer=mapnik&marker=${step>=3 ? `${city.lat},${city.lng}` : ''}`;
  const xp = won ? xpByStep[Math.min(guesses.length, 4)] : 0;

  return <div className="app">
    <header><div><b>PlaatsRaden</b><span>Satellietpuzzel met exacte afstand</span></div><button onClick={newRound}>Nieuwe stad</button></header>
    <main>
      <section className="mapPanel">
        <div className="mapTop"><span>Stap {step+1}/5</span><span>Zoomniveau: {['±300m','±600m','±1km','±10km','±300km'][step]}</span></div>
        <iframe title="kaart" src={mapUrl} />
        <p className="note">Prototype gebruikt nu OSM kaartlaag. In de professionele versie vervangen we dit door satellietbeelden/API.</p>
      </section>
      <aside>
        <h2>Doe je gok</h2>
        <input value={guessText} onChange={e=>setGuessText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') submitGuess()}} placeholder="Typ een stad..." disabled={won || showDone && !won}/>
        {suggestions.length>0 && <div className="suggestions">{suggestions.map(c=><button key={c.id} onClick={()=>setGuessText(c.name)}>{c.name}, {c.country}</button>)}</div>}
        <button className="primary" onClick={submitGuess}>Gok</button>
        <h3>Afstandslog</h3>
        <div className="log">{guesses.length===0 ? <p>Nog geen gokken.</p> : guesses.map((g,i)=><div key={i}><b>{i+1}. {g.name}</b><span>{g.km === 0 ? 'Correct' : `${g.km} km`}</span></div>)}</div>
        <div className="cards"><div><b>XP</b><span>{xp}</span></div><div><b>Hints</b><span>Gratis testfase</span></div></div>
      </aside>
    </main>
    {showDone && <div className="modal"><div className="modalBox"><h2>{won ? 'Goed geraden!' : 'Helaas!'}</h2><p>Het was <b>{city.name}, {city.country}</b>.</p>{won && <p className="xp">+{xp} XP verdiend</p>}<h3>3 feitjes</h3><ul>{city.facts.map(f=><li key={f}>{f}</li>)}</ul><button className="primary" onClick={newRound}>Volgende stad</button><button onClick={()=>setShowDone(false)}>Nog even rondkijken</button></div></div>}
  </div>
}

createRoot(document.getElementById('root')!).render(<App />);
