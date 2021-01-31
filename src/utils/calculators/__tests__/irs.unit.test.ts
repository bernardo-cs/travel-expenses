import { IRS, WORKER_STATUS } from "../irs";

describe("IRS", () => {
  describe("with 0 dependents", () => {
    it("applies 1st tier taxing when salary is less than the minimum wage", () => {
      const irs = IRS({
        grossIncome: 345,
        numberOfDependent: 0,
        year: 2021,
        workerStatus: WORKER_STATUS.NOT_MARRIED
      });

      expect(irs).toEqual({ finalTax: 0, tax: 0, tier: 0, totalTiers: 35 });
    });

    it("calculates IRS for 5000", () => {
      const irs = IRS({
        grossIncome: 5000,
        numberOfDependent: 0,
        year: 2021,
        workerStatus: WORKER_STATUS.NOT_MARRIED
      });

      expect(irs).toEqual({
        finalTax: 20.22,
        tax: 1010.78,
        tier: 24,
        totalTiers: 35
      });
    });

    it("calculates IRS for 500000", () => {
      const irs = IRS({
        grossIncome: 500000,
        numberOfDependent: 0,
        year: 2021,
        workerStatus: WORKER_STATUS.NOT_MARRIED
      });

      expect(irs).toEqual({
        finalTax: 43.81,
        tax: 219025.23,
        tier: 35,
        totalTiers: 35
      });
    });
  });
});
