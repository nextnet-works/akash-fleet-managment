import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BLOCK_TIME_MS } from "./consts";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * (current chain height - first block height) * BLOCK_TIME_MS
 * @param firstBlock
 * @param currentBlock
 * @param BLOCK_TIME_MS
 */
export const getLeaseActiveTimeInMinutes = (
  firstBlock: number,
  currentBlock: number,
) => {
  return ((currentBlock - firstBlock) * BLOCK_TIME_MS) / 1000 / 60;
};

export const convertToReadableTime = (totalMilliseconds: number) => {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format hours, minutes, and seconds with leading zeros if necessary
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
