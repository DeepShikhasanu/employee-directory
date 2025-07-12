// DOM Elements
const employeeForm = document.getElementById("employeeForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const department = document.getElementById("department");
const role = document.getElementById("role");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");
let currentEmployeeID;

// Error elements
const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const departmentError = document.getElementById("departmentError");
const roleError = document.getElementById("roleError");

if (localStorage.getItem("currentEmployee")) {
  const currentEmployeeObj = JSON.parse(
    localStorage.getItem("currentEmployee")
  );
  firstName.value = currentEmployeeObj.firstName;
  lastName.value = currentEmployeeObj.lastName;
  email.value = currentEmployeeObj.email;
  department.value = currentEmployeeObj.department;
  role.value = currentEmployeeObj.role;
  currentEmployeeID = currentEmployeeObj.id;
  localStorage.removeItem("currentEmployee");
}

// Initialize form
function initForm() {
  setupEventListeners();

  // Check if we're in edit mode (URL has ?edit=id)
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit");

  if (editId) {
    document.getElementById("formTitle").textContent = "Edit Employee";
    submitBtn.textContent = "Update Employee";

    // In a real app, we would fetch the employee data and populate the form
    // For this example, we'll just simulate it
    // populateFormWithEmployeeData(editId);
  }
}

// Setup event listeners
function setupEventListeners() {
  employeeForm.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", handleCancel);

  // Real-time validation
  firstName.addEventListener("blur", validateFirstName);
  lastName.addEventListener("blur", validateLastName);
  email.addEventListener("blur", validateEmail);
  department.addEventListener("change", validateDepartment);
  role.addEventListener("blur", validateRole);
}

// Form validation functions
function validateFirstName() {
  if (!firstName.value.trim()) {
    showError(firstNameError, "First name is required");
    return false;
  }
  hideError(firstNameError);
  return true;
}

function validateLastName() {
  if (!lastName.value.trim()) {
    showError(lastNameError, "Last name is required");
    return false;
  }
  hideError(lastNameError);
  return true;
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.value.trim()) {
    showError(emailError, "Email is required");
    return false;
  } else if (!emailRegex.test(email.value)) {
    showError(emailError, "Please enter a valid email address");
    return false;
  }
  hideError(emailError);
  return true;
}

function validateDepartment() {
  if (!department.value) {
    showError(departmentError, "Department is required");
    return false;
  }
  hideError(departmentError);
  return true;
}

function validateRole() {
  if (!role.value.trim()) {
    showError(roleError, "Role is required");
    return false;
  }
  hideError(roleError);
  return true;
}

// Show/hide error messages
function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

function hideError(element) {
  element.textContent = "";
  element.style.display = "none";
}

// Validate entire form
function validateForm() {
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isDepartmentValid = validateDepartment();
  const isRoleValid = validateRole();

  return (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isDepartmentValid &&
    isRoleValid
  );
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  if (validateForm()) {
    // In a real app, we would save the data to the backend
    // For this example, we'll just show a success message

    const formData = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      department: department.value,
      role: role.value.trim(),
    };

    let employees = JSON.parse(localStorage.getItem("employeeList"));
    if (currentEmployeeID) {
      formData.id = currentEmployeeID;
      employees = employees.map((eachEmployee) => {
        if (eachEmployee.id === currentEmployeeID) {
          return formData;
        }
        return eachEmployee;
      });
    } else {
      formData.id = new Date().getTime();
      employees = [...employees, formData];
    }

    localStorage.setItem("employeeList", JSON.stringify(employees));
    if (currentEmployeeID) {
      alert("Employee updated successfully!");
    } else {
      alert("Employee saved successfully!");
    }

    // Reset form
    employeeForm.reset();

    // Redirect back to the main page
    window.location.href = "index.html";
  }
}

// Handle cancel
function handleCancel() {
  if (
    confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost."
    )
  ) {
    window.location.href = "index.html";
  }
}

// Initialize the form when DOM is loaded
document.addEventListener("DOMContentLoaded", initForm);
