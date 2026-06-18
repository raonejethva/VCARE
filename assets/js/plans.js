/**
 * VCARE - Plans Module
 * Handles service plan selection and display
 */

// Global state
let currentSelectedPlan = "";

/**
 * Activate a plan and show its services
 * @param {string} planName - Plan name to display
 * @param {string} typeKey - Plan type key (e.g., 'prop-silver')
 */
function activatePlanFlow(planName, typeKey) {
  // Define metadata dictionary for detailed plans
  const planDetails = {
    "prop-silver": {
      name: "Property Care - Silver Plan",
      price: 80,
      originalPrice: 80,
      duration: "1 Month",
      savings: 0,
      savingsPercent: 0,
      monthlyEquivalent: 80,
    },
    "prop-gold": {
      name: "Property Care - Gold Plan",
      price: 432,
      originalPrice: 480,
      duration: "6 Months",
      savings: 48,
      savingsPercent: 10,
      monthlyEquivalent: 72,
    },
    "prop-platinum": {
      name: "Property Care - Platinum Plan",
      price: 720,
      originalPrice: 960,
      duration: "12 Months",
      savings: 240,
      savingsPercent: 25,
      monthlyEquivalent: 60,
    },
    "parent-silver": {
      name: "Parental Care - Silver Pro Plan",
      price: 149,
      originalPrice: 149,
      duration: "1 Month",
      savings: 0,
      savingsPercent: 0,
      monthlyEquivalent: 149,
    },
    "parent-gold": {
      name: "Parental Care - Gold Pro Plan",
      price: 804,
      originalPrice: 894,
      duration: "6 Months",
      savings: 90,
      savingsPercent: 10,
      monthlyEquivalent: 134,
    },
    "parent-platinum": {
      name: "Parental Care - Platinum Pro Plan",
      price: 1341,
      originalPrice: 1788,
      duration: "12 Months",
      savings: 447,
      savingsPercent: 25,
      monthlyEquivalent: 111.75,
    },
  };

  const plan = planDetails[typeKey] || {
    name: planName,
    price: 80,
    originalPrice: 80,
    duration: "Month",
    savings: 0,
    savingsPercent: 0,
    monthlyEquivalent: 80,
  };

  // Set the selection state
  if (plan.savings > 0) {
    currentSelectedPlan = `${plan.name} (${plan.duration} - Billed $${plan.price} USD - Saved $${plan.savings})`;
  } else {
    currentSelectedPlan = `${plan.name} ($${plan.price} USD / ${plan.duration})`;
  }

  // Dynamically build the header
  const headerNode = getElement("interactive-plan-header");
  if (headerNode) {
    let savingsMarkup = "";
    if (plan.savings > 0) {
      savingsMarkup = `
        <div class="bg-emerald-500 text-slate-950 rounded-xl p-3.5 space-y-1 shadow-sm flex flex-col justify-between shrink-0">
          <span class="text-[9px] text-emerald-950 font-black uppercase tracking-wider block">Immediate Savings</span>
          <div class="flex items-center gap-1.5">
            <span class="text-xl font-black">Save $${plan.savings}</span>
            <span class="px-1.5 py-0.5 bg-slate-950 text-amber-400 text-[8px] font-black uppercase rounded">${plan.savingsPercent}% OFF</span>
          </div>
        </div>
      `;
    } else {
      savingsMarkup = `
        <div class="bg-white/5 border border-white/10 text-slate-400 rounded-xl p-3.5 space-y-1 flex flex-col justify-between shrink-0">
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Savings Applied</span>
          <div class="text-xs font-extrabold flex items-center gap-1.5 py-1">
            <i class="fa-solid fa-check text-emerald-500"></i> Standard Rate
          </div>
        </div>
      `;
    }

    headerNode.innerHTML = `
      <div class="w-full space-y-5">
        <!-- Plan Header Metadata -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
          <div class="space-y-1">
            <span class="text-[9px] text-amber-400 font-black tracking-widest uppercase block flex items-center gap-1">
              <i class="fa-solid fa-fingerprint animate-pulse"></i> ACTIVE REGISTRATION
            </span>
            <h3 class="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <i class="fa-solid fa-box-open text-amber-500"></i> ${plan.name}
            </h3>
          </div>
          <span class="px-3 py-1 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-md shadow-sm">
            ${plan.duration} Contract
          </span>
        </div>

        <!-- Metrics Breakdown -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Billed Total -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Final Billed Total</span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-white">$${plan.price}</span>
              <span class="text-xs text-slate-400 font-semibold">USD</span>
              ${plan.savings > 0 ? `<span class="text-[10px] text-slate-500 line-through font-semibold ml-1">$${plan.originalPrice}</span>` : ""}
            </div>
          </div>

          <!-- Savings Card -->
          ${savingsMarkup}

          <!-- Equivalent monthly -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Effective Monthly Rate</span>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-white">$${plan.monthlyEquivalent}</span>
              <span class="text-[10px] text-slate-400 font-semibold lowercase">/month equivalent</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Hide all service panels
  const serviceKeys = [
    "prop-silver",
    "prop-gold",
    "prop-platinum",
    "parent-silver",
    "parent-gold",
    "parent-platinum",
  ];

  serviceKeys.forEach((k) => {
    const element = getElement("services-" + k);
    if (element) {
      element.classList.add("hidden");
    }
  });

  // Show selected service panel
  const activeDeliverable = getElement("services-" + typeKey);
  if (activeDeliverable) {
    activeDeliverable.classList.remove("hidden");
  }

  // Show services panel
  const servicesPanel = getElement("dynamic-services-panel");
  if (servicesPanel) {
    servicesPanel.classList.remove("hidden");
  }

  // Update card styling
  updateCardStyling(typeKey, serviceKeys);

  // Scroll to services
  if (servicesPanel) {
    scrollToElement(servicesPanel);
  }

  // Dispatch event
  document.dispatchEvent(
    new CustomEvent("planActivated", {
      detail: { planName, typeKey },
    }),
  );
}

/**
 * Update card styling based on selected plan
 * @param {string} activeType - Active plan type
 * @param {array} allKeys - All available plan keys
 */
function updateCardStyling(activeType, allKeys) {
  allKeys.forEach((k) => {
    const targetCard = getElement("card-" + k);
    if (!targetCard) return;

    // Reset card styling
    if (k === "parent-platinum") {
      targetCard.className =
        "premium-card bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-between h-full cursor-pointer best-value-card relative shadow-md text-slate-900 dark:text-slate-100 transition-all duration-300";
    } else {
      const borderColor = k.includes("silver")
        ? "border-t-slate-400"
        : k.includes("gold")
          ? "border-t-amber-500"
          : "border-t-blue-400";

      targetCard.className = `premium-card bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-between h-full cursor-pointer border-t-4 ${borderColor} text-slate-900 dark:text-slate-100 transition-all duration-300`;
    }
  });

  // Highlight active card
  const activeCard = getElement("card-" + activeType);
  if (activeCard) {
    if (activeType === "parent-platinum") {
      activeCard.className =
        "premium-card bg-white dark:bg-slate-900 p-8 rounded-3xl flex flex-col justify-between cursor-pointer border-4 border-blue-600 dark:border-blue-500 best-value-card relative transform scale-105 shadow-2xl bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-950/20 text-slate-900 dark:text-slate-100 transition-all duration-300";
    } else {
      activeCard.className =
        "premium-card bg-white dark:bg-slate-900 border-2 border-amber-500 dark:border-amber-400 p-8 rounded-3xl flex flex-col justify-between shadow-xl relative transform scale-105 cursor-pointer text-slate-900 dark:text-slate-100 transition-all duration-300";
    }
  }
}

/**
 * Get currently selected plan
 * @returns {string} Current plan name
 */
function getSelectedPlan() {
  return currentSelectedPlan;
}

/**
 * Reset plan selection
 */
function resetPlanSelection() {
  currentSelectedPlan = "";
  const planTitleNode = getElement("target-plan-title");
  if (planTitleNode) {
    planTitleNode.innerHTML = "Select a Plan";
  }
}

/**
 * Listen for plan activation
 */
document.addEventListener("planActivated", (event) => {
  console.log("Plan activated:", event.detail.planName);
});
