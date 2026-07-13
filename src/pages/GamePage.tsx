import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import GameHeader from "../components/GameHeader";
import GameMap from "../components/GameMap";
import GuessForm from "../components/GuessForm";
import ResultCard from "../components/ResultCard";
import { MAP_ROUNDS } from "../config/map";
import { locations } from "../data/locations";
import { calculateDistanceKm } from "../utils/calculateDistance";
import { calculateXp } from "../utils/calculateXp";
import { checkAnswer } from "../utils/checkAnswer";
import { geocoderResultMatchesLocation } from "../utils/geocoderResultMatchesLocation";
import { getContinentByCountryCode } from "../utils/getContinentByCountryCode";

interface PlaceDetails {
  latitude: number;
  longitude: number;
  countryCode: string;
  countryName: string;
  continent: string;
  geocoderResult: google.maps.GeocoderResult;
}

const ACCEPTED_CITY_TYPES = [
  "locality",
  "postal_town",
  "sublocality",
  "sublocality_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
];

const ALLOWED_CITY_STATE_CODES = new Set([
  "MC",
  "SG",
  "VA",
]);

function isPlaceResult(
  result: google.maps.GeocoderResult,
  countryCode: string
) {
  const isCountryResult =
    result.types.includes("country");

  if (
    isCountryResult &&
    !ALLOWED_CITY_STATE_CODES.has(countryCode)
  ) {
    return false;
  }

  return (
    ALLOWED_CITY_STATE_CODES.has(countryCode) ||
    result.types.some((type) =>
      ACCEPTED_CITY_TYPES.includes(type)
    ) ||
    result.address_components.some((component) =>
      component.types.some((type) =>
        ACCEPTED_CITY_TYPES.includes(type)
      )
    )
  );
}

async function findPlaceDetails(
  placeName: string
): Promise<PlaceDetails | null> {
  const { Geocoder } =
    (await google.maps.importLibrary(
      "geocoding"
    )) as google.maps.GeocodingLibrary;

  const geocoder = new Geocoder();

  const response = await geocoder.geocode({
    address: placeName,
  });

  const firstResult = response.results[0];

  if (!firstResult) {
    return null;
  }

  const countryComponent =
    firstResult.address_components.find((component) =>
      component.types.includes("country")
    );

  const countryCode =
    countryComponent?.short_name?.toUpperCase();

  const countryName = countryComponent?.long_name;

  if (!countryCode || !countryName) {
    return null;
  }

  if (!isPlaceResult(firstResult, countryCode)) {
    return null;
  }

  const continent =
    getContinentByCountryCode(countryCode);

  if (!continent) {
    return null;
  }

  const position = firstResult.geometry.location;

  return {
    latitude: position.lat(),
    longitude: position.lng(),
    countryCode,
    countryName,
    continent,
    geocoderResult: firstResult,
  };
}

export default function GamePage() {
  const navigate = useNavigate();

  const location = useMemo(
    () =>
      locations[
        Math.floor(Math.random() * locations.length)
      ],
    []
  );

  const [currentRound, setCurrentRound] = useState(0);
  const [guess, setGuess] = useState("");
  const [submittedGuess, setSubmittedGuess] =
    useState("");
  const [inputError, setInputError] = useState("");

  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] =
    useState<number | null>(null);

  const [guessedCountryName, setGuessedCountryName] =
    useState<string | null>(null);
  const [guessedContinent, setGuessedContinent] =
    useState<string | null>(null);
  const [isCountryCorrect, setIsCountryCorrect] =
    useState<boolean | null>(null);
  const [isContinentCorrect, setIsContinentCorrect] =
    useState<boolean | null>(null);

  const [
    isCalculatingDistance,
    setIsCalculatingDistance,
  ] = useState(false);

  const [isMapReady, setIsMapReady] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameFinished, setGameFinished] =
    useState(false);

  const roundNumber = currentRound + 1;
  const totalRounds = MAP_ROUNDS.length;
  const isLastRound =
    currentRound === totalRounds - 1;

  useEffect(() => {
    if (
      !isMapReady ||
      isAnswered ||
      gameFinished
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setSeconds(
        (currentSeconds) => currentSeconds + 1
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    isMapReady,
    isAnswered,
    gameFinished,
    currentRound,
  ]);

  function awardCorrectAnswer() {
    const newEarnedXp = calculateXp(
      roundNumber,
      seconds
    );

    setIsCorrect(true);
    setIsAnswered(true);
    setEarnedXp(newEarnedXp);
    setScore(newEarnedXp);
  }

  async function submitAnswer() {
    if (
      !isMapReady ||
      isAnswered ||
      gameFinished ||
      !guess.trim()
    ) {
      return;
    }

    const currentGuess = guess.trim();

    setInputError("");

    const directAnswerIsCorrect = checkAnswer(
      currentGuess,
      location.name,
      location.alternativeAnswers
    );

    if (directAnswerIsCorrect) {
      setSubmittedGuess(currentGuess);
      awardCorrectAnswer();
      return;
    }

    setIsCalculatingDistance(true);

    try {
      const guessedPlace =
        await findPlaceDetails(currentGuess);

      if (!guessedPlace) {
        setInputError(
          "Voer een geldige plaatsnaam in. Landen zijn niet toegestaan."
        );
        return;
      }

      const translatedNameIsCorrect =
        geocoderResultMatchesLocation(
          guessedPlace.geocoderResult,
          location.name,
          location.alternativeAnswers
        );

      setSubmittedGuess(currentGuess);

      if (translatedNameIsCorrect) {
        awardCorrectAnswer();
        return;
      }

      setIsAnswered(true);
      setIsCorrect(false);
      setEarnedXp(0);

      const calculatedDistance =
        calculateDistanceKm(
          guessedPlace.latitude,
          guessedPlace.longitude,
          location.latitude,
          location.longitude
        );

      setDistanceKm(calculatedDistance);
      setGuessedCountryName(
        guessedPlace.countryName
      );
      setGuessedContinent(
        guessedPlace.continent
      );

      setIsCountryCorrect(
        guessedPlace.countryCode.toUpperCase() ===
          location.countryCode.toUpperCase()
      );

      setIsContinentCorrect(
        guessedPlace.continent.toLowerCase() ===
          location.continent.toLowerCase()
      );
    } catch (error) {
      console.error(error);

      setInputError(
        "Deze plaats kon niet worden gevonden. Controleer de spelling."
      );
    } finally {
      setIsCalculatingDistance(false);
    }
  }

  function continueGame() {
    if (isCorrect || isLastRound) {
      setGameFinished(true);
      return;
    }

    setCurrentRound((round) => round + 1);
    setGuess("");
    setSubmittedGuess("");
    setInputError("");
    setEarnedXp(0);
    setSeconds(0);
    setDistanceKm(null);
    setGuessedCountryName(null);
    setGuessedContinent(null);
    setIsCountryCorrect(null);
    setIsContinentCorrect(null);
    setIsMapReady(false);
    setIsAnswered(false);
    setIsCorrect(false);
  }

  if (gameFinished) {
    return (
      <main className="app">
        <section className="shell">
          <section className="end-screen">
            <div className="logo">
              {isCorrect ? "🏆" : "🗺️"}
            </div>

            <h1>Spel afgelopen</h1>

            {isCorrect ? (
              <>
                <p>
                  Je hebt{" "}
                  <strong>{location.name}</strong>{" "}
                  geraden in ronde {roundNumber}.
                </p>

                <strong className="end-score">
                  +{score} XP
                </strong>
              </>
            ) : (
              <p>
                Het juiste antwoord was{" "}
                <strong>{location.name}</strong>.
              </p>
            )}

            <button
              className="primary"
              onClick={() => window.location.reload()}
            >
              Opnieuw spelen
            </button>

            <button onClick={() => navigate("/")}>
              Terug naar home
            </button>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="shell">
        <GameHeader
          currentRound={roundNumber}
          totalRounds={totalRounds}
          seconds={seconds}
          score={score}
          onBack={() => navigate("/")}
        />

        <section className="hero">
          <div className="brand">
            <div className="logo">🛰️</div>
            <h1>Waar is dit?</h1>
            <p>
              Bekijk de satellietkaart en raad de plaats.
            </p>
          </div>

          <div className="game-card">
            <GameMap
              location={location}
              roundIndex={currentRound}
              onReady={() => setIsMapReady(true)}
            />

            <div className="guess-box">
              <GuessForm
                guess={guess}
                isAnswered={
                  isAnswered || !isMapReady
                }
                errorMessage={inputError}
                onGuessChange={(value) => {
                  setGuess(value);
                  setInputError("");
                }}
                onSubmit={submitAnswer}
              />

              {isAnswered && (
                <ResultCard
                  isCorrect={isCorrect}
                  guessedPlaceName={submittedGuess}
                  guessedCountryName={
                    guessedCountryName
                  }
                  guessedContinent={
                    guessedContinent
                  }
                  isCountryCorrect={
                    isCountryCorrect
                  }
                  isContinentCorrect={
                    isContinentCorrect
                  }
                  roundNumber={roundNumber}
                  seconds={seconds}
                  earnedXp={earnedXp}
                  distanceKm={distanceKm}
                  isCalculatingDistance={
                    isCalculatingDistance
                  }
                  isLastRound={isLastRound}
                  onContinue={continueGame}
                />
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}