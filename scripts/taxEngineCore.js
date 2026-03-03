/**
 * Phase 1 (MVP) Income Tax Calculation Engine
 * Indian Income Tax - Individual (Below 60 years)
 */

// 1. Centralized Configuration for Tax Rules (Scalable for future Union Budgets)
const TaxRulesConfig = {
  "2024-25": {
    // Financial Year 2023-24
    cessRate: 0.04,
    oldRegime: {
      standardDeduction: 50000,
      deductionLimits: {
        sec80C: 150000,
        sec80D: 25000,
      },
      rebate87A: {
        maxIncomeLimit: 500000,
        maxRebate: 12500,
      },
      slabs: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 },
      ],
    },
    newRegime: {
      standardDeduction: 50000,
      rebate87A: {
        maxIncomeLimit: 700000,
        maxRebate: 25000,
      },
      slabs: [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.1 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 },
      ],
    },
  },
  "2025-26": {
    // Financial Year 2024-25 (Budget 2024 updates)
    cessRate: 0.04,
    oldRegime: {
      standardDeduction: 50000,
      deductionLimits: {
        sec80C: 150000,
        sec80D: 25000,
      },
      rebate87A: {
        maxIncomeLimit: 500000,
        maxRebate: 12500,
      },
      slabs: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 },
      ],
    },
    newRegime: {
      standardDeduction: 50000, // Phase 1 Scope: Specified 50,000 for New Regime standard deduction
      rebate87A: {
        maxIncomeLimit: 700000,
        maxRebate: 25000,
      },
      slabs: [
        { limit: 300000, rate: 0 },
        { limit: 700000, rate: 0.05 },
        { limit: 1000000, rate: 0.1 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 },
      ],
    },
  },
};

/**
 * Helper function to calculate the base tax using progressive slabs.
 * @param {number} taxableIncome
 * @param {Array} slabs
 * @returns {number} The base tax liability before rebates and cess
 */
function calculateTaxBase(taxableIncome, slabs) {
  let tax = 0;
  let previousLimit = 0;

  for (const slab of slabs) {
    if (taxableIncome > previousLimit) {
      const taxableInThisSlab =
        Math.min(taxableIncome, slab.limit) - previousLimit;
      tax += taxableInThisSlab * slab.rate;
      previousLimit = slab.limit;
    } else {
      break;
    }
  }

  return tax;
}

/**
 * Calculates tax liability under both Old and New regimes for a given Assessment Year.
 * @param {Object} params - The inputs for calculation.
 * @param {string} params.assessmentYear - The string key for the assessment year (e.g., "2025-26").
 * @param {number} params.grossSalary - The total gross salary.
 * @param {Object} [params.deductions] - The deductions eligible (sec80C, sec80D).
 * @returns {Object} Structured calculation output.
 */
function calculateTax({ assessmentYear, grossSalary, deductions = {} }) {
  const config = TaxRulesConfig[assessmentYear];
  if (!config) {
    throw new Error(
      `Tax rules for Assessment Year ${assessmentYear} not found or unsupported.`,
    );
  }

  const { oldRegime, newRegime, cessRate } = config;

  // ================================
  // --- Old Regime Engine Engine ---
  // ================================

  // 1. Standard Deduction
  let oldTaxableIncome = Math.max(0, grossSalary - oldRegime.standardDeduction);

  // 2. Chapter VI-A Deductions
  const sec80C = Math.min(
    deductions.sec80C || 0,
    oldRegime.deductionLimits.sec80C,
  );
  const sec80D = Math.min(
    deductions.sec80D || 0,
    oldRegime.deductionLimits.sec80D,
  );
  const totalEligibleDeductions = sec80C + sec80D;
  oldTaxableIncome = Math.max(0, oldTaxableIncome - totalEligibleDeductions);

  // 3. Compute base tax
  let oldBaseTax = calculateTaxBase(oldTaxableIncome, oldRegime.slabs);

  // 4. Section 87A Rebate
  if (oldTaxableIncome <= oldRegime.rebate87A.maxIncomeLimit) {
    oldBaseTax = Math.max(0, oldBaseTax - oldRegime.rebate87A.maxRebate);
  }

  // 5. Health and Education Cess
  const oldRegimeTax = Math.round(oldBaseTax + oldBaseTax * cessRate);

  // ================================
  // --- New Regime Engine (Sec 115BAC) ---
  // ================================

  // 1. Strip away 80C & 80D. Only allow standard deduction.
  let newTaxableIncome = Math.max(0, grossSalary - newRegime.standardDeduction);

  // 2. Compute base tax
  let newBaseTax = calculateTaxBase(newTaxableIncome, newRegime.slabs);

  // 3. Section 87A Rebate
  if (newTaxableIncome <= newRegime.rebate87A.maxIncomeLimit) {
    newBaseTax = Math.max(0, newBaseTax - newRegime.rebate87A.maxRebate);
  }

  // 4. Health and Education Cess
  const newRegimeTax = Math.round(newBaseTax + newBaseTax * cessRate);

  // ================================
  // --- Final Comparison & Output ---
  // ================================

  let recommendation = "";
  let taxSavings = 0;

  if (newRegimeTax < oldRegimeTax) {
    taxSavings = oldRegimeTax - newRegimeTax;
    recommendation = `The New Regime is better. You save ₹${taxSavings.toLocaleString("en-IN")} compared to the Old Regime.`;
  } else if (oldRegimeTax < newRegimeTax) {
    taxSavings = newRegimeTax - oldRegimeTax;
    recommendation = `The Old Regime is better. You save ₹${taxSavings.toLocaleString("en-IN")} compared to the New Regime.`;
  } else {
    recommendation = "Both regimes result in the exact same tax liability.";
  }

  return {
    oldRegimeTax,
    newRegimeTax,
    taxSavings,
    recommendation,
  };
}

// ----------------------------------------------------
// Example Console Log Usage
// ----------------------------------------------------
const exampleInputs = {
  assessmentYear: "2025-26",
  grossSalary: 1200000, // 12 Lakhs
  deductions: {
    sec80C: 150000, // Maxed out 80C
    sec80D: 25000, // Standard Health Insurance
  },
};

console.log("--- Tax Calculation Core Engine initialized ---\n");
console.log(`Calculating for Gross Salary: ₹${exampleInputs.grossSalary}`);
console.log(
  `Deductions Claimed: 80C=₹${exampleInputs.deductions.sec80C}, 80D=₹${exampleInputs.deductions.sec80D}\n`,
);

const result = calculateTax(exampleInputs);

console.log("RESULT:");
console.log(
  `Old Regime Tax Liability : ₹${result.oldRegimeTax.toLocaleString("en-IN")}`,
);
console.log(
  `New Regime Tax Liability : ₹${result.newRegimeTax.toLocaleString("en-IN")}\n`,
);
console.log(`Recommendation: ${result.recommendation}`);
