import type { City } from '../types/game';

type Props = {
  city: City;
  xp: number;
  onNext: () => void;
  onExplore: () => void;
};

export default function ResultModal({ city, xp, onNext, onExplore }: Props) {
  return (
    <div className="modalBackdrop">
      <div className="modal">
        <div className="success">Goed geraden!</div>
        <h2>{city.name}</h2>
        <p className="country">{city.country}</p>
        <div className="xp">+{xp} XP verdiend</div>
        <h3>3 feitjes</h3>
        <ul>
          {city.facts.slice(0, 3).map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <div className="modalActions">
          <button onClick={onNext}>Volgende stad</button>
          <button className="secondary" onClick={onExplore}>Nog even rondkijken</button>
        </div>
      </div>
    </div>
  );
}
