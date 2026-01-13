export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

export function gasEstimate({
  distanceKm,
  litersPer100Km,
  gasPricePerLiter,
}: {
  distanceKm: number;
  litersPer100Km: number;
  gasPricePerLiter: number;
}) {
  const gasLiters = distanceKm * (litersPer100Km / 100);
  const gasCost = gasLiters * gasPricePerLiter;
  return { gasLiters, gasCost };
}

