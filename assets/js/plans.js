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
  currentSelectedPlan = planName;

  // Update plan title
  const planTitleNode = getElement("target-plan-title");
  if (planTitleNode) {
    planTitleNode.innerHTML = `<i class="fa-solid fa-box-open text-amber-500 mr-2"></i> ${escapeHtml(planName)}`;
  }

  const discountNode = getElement("target-plan-discount");
  const discountText = getElement("discount-text-value");

  const discounts = {
    "prop-gold":
      "10% Semi-Annual Savings Applied! Final checkout total drops to $432 (Save $48)",
    "prop-platinum":
      "25% Annual VIP Savings Applied! Final checkout total drops to $720 (Save $240)",
    "parent-gold":
      "10% Semi-Annual Savings Applied! Final checkout total drops to $804 (Save $90)",
    "parent-platinum":
      "25% Annual VIP Savings Applied! Final checkout total drops to $1341 (Save $447)",
  };

  if (discountNode && discountText) {
    if (discounts[typeKey]) {
      discountText.innerText = discounts[typeKey];
      discountNode.classList.remove("hidden");
    } else {
      discountNode.classList.add("hidden");
    }
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
        "premium-card bg-white p-8 rounded-3xl flex flex-col justify-between h-full cursor-pointer border-2 best-value-card relative shadow-md";
    } else {
      const borderColor = k.includes("silver")
        ? "border-t-slate-400"
        : k.includes("gold")
          ? "border-t-yellow-400"
          : "border-t-blue-400";

      targetCard.className = `premium-card bg-white border border-gray-200 p-8 rounded-3xl flex flex-col justify-between h-full cursor-pointer border-t-4 ${borderColor}`;
    }
  });

  // Highlight active card
  const activeCard = getElement("card-" + activeType);
  if (activeCard) {
    if (activeType === "parent-platinum") {
      activeCard.className =
        "premium-card bg-white p-8 rounded-3xl flex flex-col justify-between cursor-pointer border-4 border-blue-600 best-value-card relative transform scale-105";
    } else {
      activeCard.className =
        "premium-card bg-white border-2 border-amber-500 p-8 rounded-3xl flex flex-col justify-between shadow-xl relative transform scale-105 cursor-pointer";
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
