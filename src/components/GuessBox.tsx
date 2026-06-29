import { useMemo, useState } from 'react';
import type { City } from '../types/game';

type Props = {
  cities: City[];
  disabled: boolean;
  onSubmit: (city: City) => void;
};

export default function GuessBox({ cities, disabled, onSubmit }: Props) {
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return cities
      .filter((city) => `${city.name} ${city.country}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, cities]);

  function submitCity(city?: City) {
    const chosen = city ?? suggestions[0];
    if (!chosen || disabled) return;
    onSubmit(chosen);
    setQuery('');
  }

  return (
    <div className="guessBox">
      <label>Doe een gok</label>
      <div className="guessRow">
        <input
          value={query}
          disabled={disabled}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitCity()}
          placeholder="Typ een plaatsnaam..."
        />
        <button disabled={disabled || suggestions.length === 0} onClick={() => submitCity()}>
          Verstuur
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((city) => (
            <button key={city.id} onClick={() => submitCity(city)}>
              {city.name}, {city.country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
