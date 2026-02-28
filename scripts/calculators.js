/**
 * L R B & Company - Financial Calculators
 * SIP, Home Loan EMI, and Income Tax Calculators
 */

// ========== SIP Calculator ==========
class SIPCalculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.init();
  }

  init() {
    this.monthlyInvestment = 5000;
    this.expectedReturn = 12;
    this.timePeriod = 10;

    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const inputs = this.container.querySelectorAll(
      'input[type="range"], input[type="number"]',
    );
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const name = e.target.name;
        const value = parseFloat(e.target.value);

        if (name === "monthlyInvestment") this.monthlyInvestment = value;
        if (name === "expectedReturn") this.expectedReturn = value;
        if (name === "timePeriod") this.timePeriod = value;

        // Sync range and number inputs
        const siblingSelector =
          e.target.type === "range"
            ? `input[type="number"][name="${name}"]`
            : `input[type="range"][name="${name}"]`;
        const sibling = this.container.querySelector(siblingSelector);
        if (sibling) sibling.value = value;

        this.calculate();
      });
    });
  }

  calculate() {
    const P = this.monthlyInvestment;
    const r = this.expectedReturn / 100 / 12; // Monthly rate
    const n = this.timePeriod * 12; // Total months

    // SIP Future Value Formula: P × [(1+r)^n - 1] / r × (1+r)
    const futureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const investedAmount = P * n;
    const estimatedReturns = futureValue - investedAmount;

    this.updateDisplay({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(futureValue),
    });
  }

  updateDisplay(results) {
    const invested = this.container.querySelector('[data-result="invested"]');
    const returns = this.container.querySelector('[data-result="returns"]');
    const total = this.container.querySelector('[data-result="total"]');

    if (invested)
      invested.textContent = this.formatCurrency(results.investedAmount);
    if (returns)
      returns.textContent = this.formatCurrency(results.estimatedReturns);
    if (total) total.textContent = this.formatCurrency(results.totalValue);

    // Update chart if present
    this.updateChart(results);
  }

  updateChart(results) {
    const investedBar = this.container.querySelector('[data-chart="invested"]');
    const returnsBar = this.container.querySelector('[data-chart="returns"]');

    if (!investedBar || !returnsBar) return;

    const total = results.investedAmount + results.estimatedReturns;
    const investedPercent = (results.investedAmount / total) * 100;
    const returnsPercent = (results.estimatedReturns / total) * 100;

    investedBar.style.width = `${investedPercent}%`;
    returnsBar.style.width = `${returnsPercent}%`;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

// ========== Home Loan EMI Calculator ==========
class HomeLoanCalculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.init();
  }

  init() {
    this.loanAmount = 5000000;
    this.interestRate = 8.5;
    this.loanTenure = 20;

    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const inputs = this.container.querySelectorAll(
      'input[type="range"], input[type="number"]',
    );
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const name = e.target.name;
        const value = parseFloat(e.target.value);

        if (name === "loanAmount") this.loanAmount = value;
        if (name === "interestRate") this.interestRate = value;
        if (name === "loanTenure") this.loanTenure = value;

        const siblingSelector =
          e.target.type === "range"
            ? `input[type="number"][name="${name}"]`
            : `input[type="range"][name="${name}"]`;
        const sibling = this.container.querySelector(siblingSelector);
        if (sibling) sibling.value = value;

        this.calculate();
      });
    });
  }

  calculate() {
    const P = this.loanAmount;
    const r = this.interestRate / 100 / 12; // Monthly rate
    const n = this.loanTenure * 12; // Total months

    // EMI Formula: P × r × (1+r)^n / [(1+r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    this.updateDisplay({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principal: P,
    });
  }

  updateDisplay(results) {
    const emi = this.container.querySelector('[data-result="emi"]');
    const interest = this.container.querySelector('[data-result="interest"]');
    const total = this.container.querySelector('[data-result="total"]');
    const principal = this.container.querySelector('[data-result="principal"]');

    if (emi) emi.textContent = this.formatCurrency(results.emi);
    if (interest)
      interest.textContent = this.formatCurrency(results.totalInterest);
    if (total) total.textContent = this.formatCurrency(results.totalPayment);
    if (principal)
      principal.textContent = this.formatCurrency(results.principal);

    this.updateChart(results);
  }

  updateChart(results) {
    const principalBar = this.container.querySelector(
      '[data-chart="principal"]',
    );
    const interestBar = this.container.querySelector('[data-chart="interest"]');

    if (!principalBar || !interestBar) return;

    const total = results.principal + results.totalInterest;
    const principalPercent = (results.principal / total) * 100;
    const interestPercent = (results.totalInterest / total) * 100;

    principalBar.style.width = `${principalPercent}%`;
    interestBar.style.width = `${interestPercent}%`;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

// ========== Income Tax Calculator ==========
class IncomeTaxCalculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.init();
  }

  init() {
    this.grossIncome = 1000000;
    this.deductions80C = 150000;
    this.deductions80D = 25000;
    this.hra = 0;
    this.otherDeductions = 0;
    this.regime = "new";

    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const inputs = this.container.querySelectorAll(
      'input[type="range"], input[type="number"]',
    );
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const name = e.target.name;
        const value = parseFloat(e.target.value) || 0;

        if (name === "grossIncome") this.grossIncome = value;
        if (name === "deductions80C") this.deductions80C = value;
        if (name === "deductions80D") this.deductions80D = value;
        if (name === "hra") this.hra = value;
        if (name === "otherDeductions") this.otherDeductions = value;

        const siblingSelector =
          e.target.type === "range"
            ? `input[type="number"][name="${name}"]`
            : `input[type="range"][name="${name}"]`;
        const sibling = this.container.querySelector(siblingSelector);
        if (sibling) sibling.value = value;

        this.calculate();
      });
    });

    const regimeInputs = this.container.querySelectorAll(
      'input[name="regime"]',
    );
    regimeInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        this.regime = e.target.value;
        this.toggleDeductionFields();
        this.calculate();
      });
    });
  }

  toggleDeductionFields() {
    const deductionFields = this.container.querySelector(".deduction-fields");
    if (deductionFields) {
      deductionFields.style.opacity = this.regime === "old" ? "1" : "0.5";
      deductionFields.style.pointerEvents =
        this.regime === "old" ? "auto" : "none";
    }
  }

  calculateOldRegime(taxableIncome) {
    // Old Regime Tax Slabs FY 2025-26
    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.3;
    }

    // Rebate under 87A for income up to 5L
    if (taxableIncome <= 500000) {
      tax = 0;
    }

    return tax;
  }

  calculateNewRegime(taxableIncome) {
    // New Regime Tax Slabs FY 2025-26
    let tax = 0;

    // Standard deduction of 75,000 under new regime
    const standardDeduction = 75000;
    const adjustedIncome = Math.max(0, taxableIncome - standardDeduction);

    if (adjustedIncome <= 300000) {
      tax = 0;
    } else if (adjustedIncome <= 700000) {
      tax = (adjustedIncome - 300000) * 0.05;
    } else if (adjustedIncome <= 1000000) {
      tax = 20000 + (adjustedIncome - 700000) * 0.1;
    } else if (adjustedIncome <= 1200000) {
      tax = 20000 + 30000 + (adjustedIncome - 1000000) * 0.15;
    } else if (adjustedIncome <= 1500000) {
      tax = 20000 + 30000 + 30000 + (adjustedIncome - 1200000) * 0.2;
    } else {
      tax = 20000 + 30000 + 30000 + 60000 + (adjustedIncome - 1500000) * 0.3;
    }

    // Rebate under 87A for income up to 7L (new regime)
    if (adjustedIncome <= 700000) {
      tax = 0;
    }

    return tax;
  }

  calculate() {
    // Calculate taxable income based on regime
    let taxableIncomeOld = this.grossIncome;
    let taxableIncomeNew = this.grossIncome;

    // Old regime with deductions
    const totalDeductionsOld =
      Math.min(this.deductions80C, 150000) +
      this.deductions80D +
      this.hra +
      this.otherDeductions +
      50000; // Standard deduction
    taxableIncomeOld = Math.max(0, this.grossIncome - totalDeductionsOld);

    // Calculate taxes
    const taxOld = this.calculateOldRegime(taxableIncomeOld);
    const taxNew = this.calculateNewRegime(taxableIncomeNew);

    // Add cess (4%)
    const cessOld = taxOld * 0.04;
    const cessNew = taxNew * 0.04;

    const totalTaxOld = taxOld + cessOld;
    const totalTaxNew = taxNew + cessNew;

    this.updateDisplay({
      taxOld: Math.round(totalTaxOld),
      taxNew: Math.round(totalTaxNew),
      taxableIncomeOld: Math.round(taxableIncomeOld),
      taxableIncomeNew: Math.round(taxableIncomeNew - 75000),
      savings: Math.abs(Math.round(totalTaxOld - totalTaxNew)),
      betterRegime: totalTaxNew <= totalTaxOld ? "new" : "old",
    });
  }

  updateDisplay(results) {
    const taxOld = this.container.querySelector('[data-result="taxOld"]');
    const taxNew = this.container.querySelector('[data-result="taxNew"]');
    const savings = this.container.querySelector('[data-result="savings"]');
    const recommendation = this.container.querySelector(
      '[data-result="recommendation"]',
    );

    if (taxOld) taxOld.textContent = this.formatCurrency(results.taxOld);
    if (taxNew) taxNew.textContent = this.formatCurrency(results.taxNew);
    if (savings) savings.textContent = this.formatCurrency(results.savings);

    if (recommendation) {
      recommendation.textContent =
        results.betterRegime === "new"
          ? "New Tax Regime is better for you!"
          : "Old Tax Regime is better for you!";
      recommendation.style.color = "var(--success)";
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

// ========== Initialize calculators on page load ==========
document.addEventListener("DOMContentLoaded", () => {
  // Check which calculator page we're on
  if (document.getElementById("sip-calculator")) {
    new SIPCalculator("sip-calculator");
  }

  if (document.getElementById("home-loan-calculator")) {
    new HomeLoanCalculator("home-loan-calculator");
  }

  if (document.getElementById("income-tax-calculator")) {
    new IncomeTaxCalculator("income-tax-calculator");
  }
});
