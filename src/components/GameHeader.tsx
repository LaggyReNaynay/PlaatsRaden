interface GameHeaderProps {
  currentRound: number;
  totalRounds: number;
  seconds: number;
  score: number;
  onBack: () => void;
}

export default function GameHeader({
  currentRound,
  totalRounds,
  seconds,
  score,
  onBack,
}: GameHeaderProps) {
  return (
    <header className="topbar">
      <button onClick={onBack}>← Terug</button>

      <div className="topstats">
        <span>
          Ronde {currentRound} / {totalRounds}
        </span>
        <span>⏱️ {seconds}s</span>
        <span>⭐ {score} XP</span>
      </div>
    </header>
  );
}