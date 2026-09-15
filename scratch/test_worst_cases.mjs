import { marketRatesOracle } from '../frontend/src/services/marketRatesOracle.ts';

console.log("=== STARTING COMPREHENSIVE AI & WORST-CASE SIMULATION ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// ----------------------------------------------------
// TEST 1: Market Rates Oracle - Extreme & Worst Cases
// ----------------------------------------------------
console.log("\n--- TEST SUITE 1: AI Tender Price Floor & Viability Engine ---");

// Worst Case 1.1: Quoted Amount is Zero
try {
  const r0 = marketRatesOracle.evaluateTenderViability('P1', 'Vendor 0', 0, 1500000, 'Visakhapatnam');
  assert(r0.viability_status === 'ABNORMALLY_LOW_REJECTED', "Zero quote rejected as abnormally low");
  assert(r0.viability_score <= 20, "Zero quote receives minimum viability score");
} catch (e) {
  assert(false, `Zero quote threw exception: ${e.message}`);
}

// Worst Case 1.2: Quoted Amount is Negative
try {
  const rNeg = marketRatesOracle.evaluateTenderViability('P1', 'Vendor Neg', -500000, 1500000, 'Visakhapatnam');
  assert(rNeg.viability_status === 'ABNORMALLY_LOW_REJECTED', "Negative quote rejected as abnormally low");
} catch (e) {
  assert(false, `Negative quote threw exception: ${e.message}`);
}

// Worst Case 1.3: Sanctioned Estimate is Zero
try {
  const rZeroSanction = marketRatesOracle.evaluateTenderViability('P1', 'Vendor X', 1200000, 0, 'Visakhapatnam');
  assert(!isNaN(rZeroSanction.variance_from_baseline_pct), "Zero sanctioned estimate handled gracefully without NaN");
  assert(rZeroSanction.baseline_estimate_amount > 0, "Zero sanctioned falls back to default estimate");
} catch (e) {
  assert(false, `Zero sanctioned estimate threw exception: ${e.message}`);
}

// Worst Case 1.4: Extreme Underbidding (-90%)
try {
  const r90 = marketRatesOracle.evaluateTenderViability('P1', 'Predatory Vendor', 150000, 1500000, 'Visakhapatnam');
  assert(r90.viability_status === 'ABNORMALLY_LOW_REJECTED', "-90% bid correctly flagged ABNORMALLY_LOW_REJECTED");
  assert(r90.ai_risk_flag.includes("CRITICAL ALERT"), "Critical alert generated for severe underbidding");
} catch (e) {
  assert(false, `-90% bid threw exception: ${e.message}`);
}

// Worst Case 1.5: Extreme Overbidding (+300% Budget Padding)
try {
  const rHigh = marketRatesOracle.evaluateTenderViability('P1', 'Inflated Vendor', 6000000, 1500000, 'Visakhapatnam');
  assert(rHigh.viability_status === 'INFLATED_REVIEW_REQUIRED', "+300% bid flagged INFLATED_REVIEW_REQUIRED");
  assert(rHigh.ai_risk_flag.includes("PRICE INFLATION DETECTED"), "Price inflation alert logged");
} catch (e) {
  assert(false, `Extreme high bid threw exception: ${e.message}`);
}

// Worst Case 1.6: Unknown District
try {
  const rDist = marketRatesOracle.evaluateTenderViability('P1', 'Vendor Y', 1400000, 1500000, 'NonExistentDistrictXYZ');
  assert(rDist.viability_status === 'VIABLE', "Unknown district falls back safely to default rates");
} catch (e) {
  assert(false, `Unknown district threw exception: ${e.message}`);
}

// Worst Case 1.7: Additional Performance Security Borderline (-12%)
try {
  const rAPS = marketRatesOracle.evaluateTenderViability('P1', 'Aggressive Vendor', 1300000, 1500000, 'Visakhapatnam');
  assert(rAPS.viability_status === 'REQUIRES_PERFORMANCE_BOND', "-12% requires additional performance security");
  assert(rAPS.ai_risk_flag.includes("Additional Performance Security"), "APS requirement documented in alert");
} catch (e) {
  assert(false, `APS test threw exception: ${e.message}`);
}

// ----------------------------------------------------
// TEST 2: Cross-Cadre Blind Dispatch Engine
// ----------------------------------------------------
console.log("\n--- TEST SUITE 2: Anti-Collusion Cross-Cadre Blind Dispatch ---");

try {
  const d1 = marketRatesOracle.assignBlindInspector('P1');
  assert(!!d1.officer.name, `Random officer assigned: ${d1.officer.name} (${d1.officer.parent_department})`);
  assert(d1.noticeWindow.includes("Anti-Collusion Blind Dispatch"), "Anti-collusion protocol notice window generated");
} catch (e) {
  assert(false, `Cross cadre dispatch threw exception: ${e.message}`);
}

console.log(`\n=== TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
