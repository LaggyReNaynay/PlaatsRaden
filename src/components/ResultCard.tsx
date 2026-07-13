interface ResultCardProps {
  isCorrect: boolean;
  guessedPlaceName: string;
  guessedCountryName: string | null;
  guessedContinent: string | null;
  isCountryCorrect: boolean | null;
  isContinentCorrect: boolean | null;
  roundNumber: number;
  seconds: number;
  earnedXp: number;
  distanceKm: number | null;
  isCalculatingDistance: boolean;
  isLastRound: boolean;
  onContinue: () => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }

  return `${Math.round(distanceKm).toLocaleString("nl-NL")} km`;
}

function FeedbackIcon({ correct }: { correct: boolean | null }) {
  if (correct === null) {
    return <span>❔</span>;
  }

  return <span>{correct ? "✅" : "❌"}</span>;
}

export default function ResultCard({
  isCorrect,
  guessedPlaceName,
  guessedCountryName,
  guessedContinent,
  isCountryCorrect,
  isContinentCorrect,
  roundNumber,
  seconds,
  earnedXp,
  distanceKm,
  isCalculatingDistance,
  isLastRound,
  onContinue,
}: ResultCardProps) {
  return (
    <section
      className={`result-card ${
        isCorrect
          ? "result-card-correct"
          : "result-card-wrong"
      }`}
    >
      <div className="result-card-title">
        <span>{isCorrect ? "✅" : "❌"}</span>

        <div>
          <strong>
            {isCorrect
              ? "Goed geraden!"
              : "Niet goed geraden"}
          </strong>

          <p>
            {isCorrect
              ? `Je hebt ${guessedPlaceName} gevonden.`
              : "Bekijk hieronder welke onderdelen van je gok kloppen."}
          </p>
        </div>
      </div>

      {!isCorrect && (
        <div className="guess-feedback">
          <div className="guess-feedback-row">
            <span>📍 {guessedPlaceName}</span>
            <span>❌</span>
          </div>

          <div className="guess-feedback-row">
            <span>
              🏳️ {guessedCountryName ?? "Land onbekend"}
            </span>

            <FeedbackIcon correct={isCountryCorrect} />
          </div>

          <div className="guess-feedback-row">
            <span>
              🌍 {guessedContinent ?? "Werelddeel onbekend"}
            </span>

            <FeedbackIcon correct={isContinentCorrect} />
          </div>
        </div>
      )}

      <div className="result-details">
        <div>
          <small>Ronde</small>
          <strong>{roundNumber} van 5</strong>
        </div>

        <div>
          <small>Tijd</small>
          <strong>{formatTime(seconds)}</strong>
        </div>

        <div>
          <small>Verdiende XP</small>
          <strong className="earned-xp">
            +{isCorrect ? earnedXp : 0} XP
          </strong>
        </div>

        {!isCorrect && (
          <div>
            <small>Afstand</small>

            <strong>
              {isCalculatingDistance
                ? "Berekenen..."
                : distanceKm !== null
                  ? formatDistance(distanceKm)
                  : "Niet gevonden"}
            </strong>
          </div>
        )}
      </div>

      <button
        className="primary"
        onClick={onContinue}
        disabled={isCalculatingDistance}
      >
        {isCorrect || isLastRound
          ? "Bekijk eindresultaat"
          : `Ga naar ronde ${roundNumber + 1}`}
      </button>
    </section>
  );
}