import { round } from "@/math";

export enum WORKER_TYPE {
  DEPENDENT = "DEPENDENT"
}

export enum WORKER_STATUS {
  NOT_MARRIED = "NOT_MARRIED",
  MARRIED_SINGLE_WORKER = "MARRIED_SINGLE_WORKER",
  MARRIED_TWO_WORKERS = "MARRIED_TWO_WORKERS",
  NOT_MARRIED_IMPAIRED = "NOT_MARRIED_IMPAIRED",
  MARRIED_SINGLE_WORKER_IMPAIRED = "MARRIED_SINGLE_WORKER_IMPAIRED",
  MARRIED_TWO_WORKERS_IMPAIRED = "MARRIED_TWO_WORKERS_IMPAIRED"
}

export const IRS_TABLE: {
  [key: number]: { [key: string]: Array<Array<number>> };
} = {
  [2021]: {
    [WORKER_STATUS.NOT_MARRIED]: [
      [686.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [718.0, 4.0, 0.7, 0.0, 0.0, 0.0, 0.0],
      [739.0, 7.2, 2.7, 0.0, 0.0, 0.0, 0.0],
      [814.0, 8.0, 4.5, 1.0, 0.0, 0.0, 0.0],
      [922.0, 10.2, 6.8, 3.5, 0.0, 0.0, 0.0],
      [1005.0, 11.4, 8.0, 5.7, 1.4, 0.0, 0.0],
      [1065.0, 12.2, 8.9, 6.6, 3.3, 0.0, 0.0],
      [1143.0, 13.2, 10.8, 8.4, 5.1, 2.7, 0.2],
      [1225.0, 14.2, 11.9, 9.4, 6.1, 3.6, 1.2],
      [1321.0, 15.3, 12.9, 10.6, 7.1, 4.6, 2.2],
      [1424.0, 16.3, 13.9, 11.5, 8.1, 6.6, 4.0],
      [1562.0, 17.3, 14.9, 12.4, 10.1, 7.6, 5.0],
      [1711.0, 18.7, 16.4, 14.9, 11.5, 9.0, 6.6],
      [1870.0, 20.1, 18.3, 17.4, 14.6, 12.6, 11.8],
      [1977.0, 21.1, 19.5, 18.3, 15.6, 14.6, 12.6],
      [2090.0, 22.1, 20.4, 19.4, 16.5, 15.6, 13.6],
      [2218.0, 23.0, 21.5, 20.5, 17.6, 16.6, 14.6],
      [2367.0, 24.0, 22.4, 21.5, 18.6, 17.7, 15.6],
      [2535.0, 25.0, 24.4, 22.4, 20.6, 18.6, 17.7],
      [2767.0, 26.0, 25.3, 23.5, 21.6, 19.6, 18.6],
      [3104.0, 27.2, 26.6, 24.7, 22.7, 20.8, 19.8],
      [3534.0, 28.8, 28.5, 27.0, 25.4, 24.8, 23.2],
      [4118.0, 29.9, 29.7, 27.9, 26.4, 25.8, 25.2],
      [4650.0, 31.7, 31.2, 29.6, 27.8, 27.2, 26.7],
      [5194.0, 32.6, 32.1, 31.6, 29.1, 28.2, 27.6],
      [5880.0, 33.6, 33.1, 32.5, 30.0, 29.4, 28.6],
      [6727.0, 35.6, 35.2, 34.4, 32.5, 32.1, 31.8],
      [7939.0, 36.6, 36.2, 35.8, 34.5, 33.1, 32.7],
      [9560.0, 38.5, 38.1, 37.7, 36.5, 36.1, 34.7],
      [11282.0, 39.5, 39.1, 38.7, 37.8, 37.0, 35.7],
      [18854.0, 40.5, 40.1, 39.7, 38.8, 38.4, 36.7],
      [20221.0, 41.5, 41.1, 40.7, 39.8, 39.4, 37.6],
      [22749.0, 42.2, 42.0, 41.7, 40.8, 40.4, 38.8],
      [25276.0, 43.2, 43.0, 42.6, 41.7, 41.4, 40.0],
      [25276.0, 44.2, 44.0, 43.6, 42.7, 42.3, 41.0]
    ]
  }
};

export function IRS({
  grossIncome,
  numberOfDependent,
  year,
  workerStatus
}: {
  grossIncome: number;
  numberOfDependent: number;
  year: number;
  workerStatus: WORKER_STATUS;
}) {
  const irs = IRS_TABLE[year][workerStatus];
  const index = irs.findIndex(([income]) => income >= grossIncome);

  let _, scale;
  if (index == -1) {
    /**
     * We went through the entire table and found no lower income:
     * Last value from scale will be applied
     */
    [_, ...scale] = [...irs].pop() || [];
  } else {
    [_, ...scale] = irs[index];
  }

  const taxScales = index === -1 ? irs : irs.slice(0, index + 1);

  const tax = calculateTax(
    grossIncome,
    taxScales.map(([value, ...scales]) => [value, scales[numberOfDependent]])
  );

  return {
    tier: index === -1 ? irs.length : index,
    tax,
    finalTax: round((100 * tax) / grossIncome, 2) || 0,
    totalTiers: irs.length
  };
}

function calculateTax(
  grossIncome: number,
  scales: Array<Array<number>>
): number {
  if (scales.length < 2) {
    return 0;
  }

  const [lastScale, ...otherScales] = [...scales].reverse();

  const firstLevelsTax = otherScales
    .map(([value, tax], index) => {
      const nextValue = otherScales[index + 1];

      return (value - (nextValue ? nextValue[0] : 0)) * (tax / 100);
    })
    .reduce((res, v) => res + v, 0);

  const lastLevelTax =
    Math.abs(lastScale[0] - grossIncome) * (lastScale[1] / 100);

  return round(((firstLevelsTax + lastLevelTax) * 100) / 100, 2);
}
