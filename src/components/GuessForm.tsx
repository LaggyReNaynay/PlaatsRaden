import { useMemo, useState } from "react";
import { cities } from "../data/cities";

interface GuessFormProps {
  guess: string;
  isAnswered: boolean;
  errorMessage: string;
  onGuessChange: (value: string) => void;
  onSubmit: () => void;
}

export default function GuessForm({
  guess,
  isAnswered,
  errorMessage,
  onGuessChange,
  onSubmit,
}: GuessFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    const searchValue = guess.trim().toLowerCase();

    if (searchValue.length < 2) {
      return [];
    }

    return cities
      .filter((city) =>
        city.toLowerCase().startsWith(searchValue)
      )
      .slice(0, 5);
  }, [guess]);

  function selectCity(city: string) {
    onGuessChange(city);
    setIsOpen(false);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!guess.trim() || isAnswered) {
      return;
    }

    setIsOpen(false);
    onSubmit();
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <div className="autocomplete">
        <input
          type="text"
          placeholder="Typ een plaatsnaam..."
          value={guess}
          disabled={isAnswered}
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            onGuessChange(event.target.value);
            setIsOpen(true);
          }}
        />

        {isOpen &&
          suggestions.length > 0 &&
          !isAnswered && (
            <div className="suggestions">
              {suggestions.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="suggestion-item"
                  onClick={() => selectCity(city)}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          )}
      </div>

      {errorMessage && (
        <p className="guess-error">{errorMessage}</p>
      )}

      {!isAnswered && (
        <button className="primary" type="submit">
          Raad plaats
        </button>
      )}
    </form>
  );
}