function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[-_.]/g, " ")
    .replace(/\s+/g, " ");
}

export function checkAnswer(
  guess: string,
  correctAnswer: string,
  alternativeAnswers: string[] = []
) {
  const normalizedGuess = normalizeAnswer(guess);

  const acceptedAnswers = [correctAnswer, ...alternativeAnswers].map(
    normalizeAnswer
  );

  return acceptedAnswers.includes(normalizedGuess);
}