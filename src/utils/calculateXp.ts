import { XP_CONFIG } from "../config/xp";

const FREE_SECONDS = 3;
const XP_DECREASE_DURATION_SECONDS = 120;

export function calculateXp(round: number, seconds: number): number {
  const roundConfig = XP_CONFIG.find((config) => config.round === round);

  if (!roundConfig) {
    return 0;
  }

  const effectiveSeconds = Math.max(0, seconds - FREE_SECONDS);

  const cappedSeconds = Math.min(
    effectiveSeconds,
    XP_DECREASE_DURATION_SECONDS
  );

  const xpDifference = roundConfig.maxXp - roundConfig.minXp;
  const timePercentage = cappedSeconds / XP_DECREASE_DURATION_SECONDS;
  const xpLoss = xpDifference * timePercentage;

  return Math.round(roundConfig.maxXp - xpLoss);
}