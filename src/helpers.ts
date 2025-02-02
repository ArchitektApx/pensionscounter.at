export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates the retirement date based on the user's birthdate.
 * Retirement is defined as the first day of the month following the 65th birthday.
 *
 * @param birthDate - The user's birth date.
 * @returns The calculated retirement date.
 */
export const calculateRetirementDate = (birthDate: Date): Date => {
  return new Date(birthDate.getFullYear() + 65, birthDate.getMonth() + 1, 1);
};

/**
 * Calculates the time left until the target date.
 *
 * @param targetDate - The retirement date.
 * @returns An object containing days, hours, minutes, and seconds left.
 */
export const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return { days, hours, minutes, seconds };
};

export const explanationText = "Alle Daten werden ausschließlich in Ihrem Browser gespeichert und lokal berechnet. Es werden keine Daten über das Internet übertragen. Das Pensionsdatum wird gemäß österreichischer Regelung berechnet: Erster Tag des Monats nach dem 65. Geburtstag.";