import "../App.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

  return (
    <main className="app">
      <section className="shell">
        <header className="topbar">
          <div className="profile">
            <div className="avatar">🌍</div>
            <div>
              <strong>Level 1</strong>
              <div className="xpbar">
                <span />
              </div>
              <small>0 / 1.000 XP</small>
            </div>
          </div>

          <div className="topstats">
            <span>🔥 0 streak</span>
            <span>🌐 NL</span>
            <span>⚙️</span>
          </div>
        </header>

        <section className="hero">
          <div className="brand">
            <div className="logo">📍</div>
            <h1>PLAATSRADEN</h1>
            <p>Ontdek de wereld vanuit de lucht</p>
          </div>

          <nav className="menu">
            <button
  className="primary"
  onClick={() => navigate("/game")}
>
              🎯 Start spel <small>Ronde 1 van 5</small>
            </button>
            <button>⭐ Dagelijkse challenge <small>Nieuwe uitdaging vandaag</small></button>
            <button>🧠 Leermodus <small>Leer en ontdek de wereld</small></button>
            <button>👥 Speel tegen vrienden <small>Daag je vrienden uit</small></button>
            <button>📊 Statistieken <small>Bekijk je prestaties</small></button>
            <button>👤 Profiel <small>Jouw avontuur & instellingen</small></button>
          </nav>

          <section className="daily">
            <div>
              <strong>🎁 Dagelijkse beloning</strong>
              <p>Kom elke dag terug en verdien extra XP.</p>
            </div>
            <button>Claim</button>
          </section>
        </section>

        <footer className="bottomnav">
          <span>🏆 Ranglijst</span>
          <span>🥇 Prestaties</span>
          <span>🛒 Shop</span>
          <span>📰 Nieuws</span>
        </footer>
      </section>
    </main>
  );
}