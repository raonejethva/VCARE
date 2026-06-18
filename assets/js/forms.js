/**
 * VCARE - Forms Module
 * Handles form validation and submission
 */

/**
 * Validate form fields
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with errors
 */
function validateFormData(formData) {
  const errors = {};

  // Validate name
  if (!formData.nriName || formData.nriName.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Validate email
  if (
    !formData.nriEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.nriEmail)
  ) {
    errors.email = "Please enter a valid email address";
  }

  // Validate phone
  if (!validatePhone(formData.abroadPhone)) {
    errors.phone = "Invalid phone number (7-15 digits required)";
  }

  // Validate address
  if (!formData.vatanAddress || formData.vatanAddress.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }

  // Validate plan selection
  if (!formData.planSelected || formData.planSelected.trim().length === 0) {
    errors.plan = "Please select a service plan";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Show form validation errors
 * @param {object} errors - Validation errors
 */
function showFormErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".form-error").forEach((el) => {
    el.classList.add("hidden");
  });

  // Show new errors
  Object.entries(errors).forEach(([field, message]) => {
    const errorNode = getElement(`${field}-error-node`);
    if (errorNode) {
      errorNode.textContent = message;
      errorNode.classList.remove("hidden");
    }

    // Highlight field
    const fieldNode = getElement(`form-${field}`);
    if (fieldNode) {
      fieldNode.classList.add("border-red-500", "ring-2", "ring-red-200");
    }
  });
}

/**
 * Clear form errors
 */
function clearFormErrors() {
  document.querySelectorAll(".form-error").forEach((el) => {
    el.classList.add("hidden");
  });
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    el.classList.remove("border-red-500", "ring-2", "ring-red-200");
  });
}

/**
 * Collect form data
 * @returns {object} Form data
 */
function collectFormData() {
  return {
    nriName: getElement("form-name")?.value || "",
    nriEmail: getElement("form-email")?.value || "",
    profession: getElement("form-profession")?.value || "",
    abroadPhone: getElement("form-intl-phone")?.value || "",
    planSelected: getSelectedPlan(),
    vatanAddress: getElement("form-address")?.value || "",
    elderScopeIssues: getElement("form-work")?.value || "",
  };
}

/**
 * Handle form submission
 * @param {Event} event - Form submission event
 */
async function handleAdvancedDetailsSubmit(event) {
  event.preventDefault();

  // Clear previous errors
  clearFormErrors();

  // Collect form data
  const formData = collectFormData();

  // Validate form
  const validation = validateFormData(formData);
  if (!validation.isValid) {
    showFormErrors(validation.errors);
    showToast("Please fix the errors in the form", "error");
    return;
  }

  // Get submit button
  const submitBtn = getElement("form-submit-btn");
  const defaultText = getElement("btn-default-text");
  const loadingText = getElement("btn-loading-text");

  // Show loading state
  if (submitBtn) submitBtn.disabled = true;
  if (defaultText) defaultText.classList.add("hidden");
  if (loadingText) loadingText.classList.remove("hidden");

  try {
    // Submit form
    const response = await fetch(APP_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: APP_CONFIG.API_HEADERS,
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Show success message
      displaySuccessMessage(formData);
      navigateTo("success");
      showToast("Booking activated successfully!", "success");

      // Dispatch event
      document.dispatchEvent(
        new CustomEvent("formSubmitted", {
          detail: formData,
        }),
      );
    } else {
      throw new Error("Server returned unsuccessful response");
    }
  } catch (error) {
    console.error("Form submission error:", error);
    showToast("Failed to submit form. Please try again.", "error");
  } finally {
    // Hide loading state
    if (submitBtn) submitBtn.disabled = false;
    if (loadingText) loadingText.classList.add("hidden");
    if (defaultText) defaultText.classList.remove("hidden");
  }
}

/**
 * Display success message with form details
 * @param {object} formData - Submitted form data
 */
function displaySuccessMessage(formData) {
  const node = getElement("success-dynamic-text-node");
  if (node) {
    node.innerHTML = `
      <div class="text-left bg-slate-50/50 p-6 rounded-2xl text-xs space-y-3 my-4 border border-gray-200/60 max-w-md mx-auto">
        <div class="border-b border-gray-200/50 pb-2 flex justify-between items-center">
          <span class="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Summary Details</span>
          <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold rounded-md text-[9px] uppercase tracking-wider">Active</span>
        </div>
        <div class="grid grid-cols-3 gap-2 pt-1">
          <span class="text-gray-400 font-semibold">Client Name:</span>
          <span class="col-span-2 text-slate-900 font-extrabold text-right">${escapeHtml(formData.nriName)}</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <span class="text-gray-400 font-semibold">Email ID:</span>
          <span class="col-span-2 text-slate-900 font-extrabold text-right">${escapeHtml(formData.nriEmail)}</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <span class="text-gray-400 font-semibold">Selected Plan:</span>
          <span class="col-span-2 text-slate-900 font-extrabold text-right">${escapeHtml(formData.planSelected)}</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <span class="text-gray-400 font-semibold">Property Address:</span>
          <span class="col-span-2 text-slate-900 font-medium text-right leading-tight">${escapeHtml(formData.vatanAddress)}</span>
        </div>
      </div>
    `;
  }
}

/**
 * Reset form to initial state
 */
function resetForm() {
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (el.type !== "hidden") {
      el.value = "";
    }
  });
  clearFormErrors();
  resetPlanSelection();
}

/**
 * Listen for form submissions
 */
document.addEventListener("formSubmitted", (event) => {
  console.log("Form submitted:", event.detail);
});
