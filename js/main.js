// Mock employee data
let employees = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'HR', role: 'Manager' },
    { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', department: 'IT', role: 'Developer' },
    { id: 3, firstName: 'Charlie', lastName: 'Lee', email: 'charlie@example.com', department: 'Finance', role: 'Analyst' },
    { id: 4, firstName: 'Diana', lastName: 'Williams', email: 'diana@example.com', department: 'Marketing', role: 'Designer' },
    { id: 5, firstName: 'Ethan', lastName: 'Brown', email: 'ethan@example.com', department: 'IT', role: 'Developer' },
    { id: 6, firstName: 'Fiona', lastName: 'Davis', email: 'fiona@example.com', department: 'HR', role: 'Recruiter' },
    { id: 7, firstName: 'George', lastName: 'Miller', email: 'george@example.com', department: 'Finance', role: 'Analyst' },
    { id: 8, firstName: 'Hannah', lastName: 'Wilson', email: 'hannah@example.com', department: 'Marketing', role: 'Manager' },
    { id: 9, firstName: 'Ian', lastName: 'Moore', email: 'ian@example.com', department: 'IT', role: 'Team Lead' },
    { id: 10, firstName: 'Julia', lastName: 'Taylor', email: 'julia@example.com', department: 'HR', role: 'Manager' }
];

if(localStorage.getItem("employeeList"))
    employees = JSON.parse(localStorage.getItem("employeeList"));
else
    localStorage.setItem("employeeList", JSON.stringify(employees))

// DOM Elements
const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtn = document.getElementById('filterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const applyFilters = document.getElementById('applyFilters');
const resetFilters = document.getElementById('resetFilters');
const sortSelect = document.getElementById('sortSelect');
const itemsPerPage = document.getElementById('itemsPerPage');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Pagination variables
let currentPage = 1;
let itemsPerPageValue = 10;
let filteredEmployees = [...employees];

// Initialize the app
function init() {
    renderEmployeeList();
    setupEventListeners();
    updatePaginationInfo();
}

// Render employee list
function renderEmployeeList() {
    // In a real app, this would be replaced with Freemarker template rendering
    // For this example, we'll simulate it with JavaScript
    
    const startIndex = (currentPage - 1) * itemsPerPageValue;
    const endIndex = startIndex + itemsPerPageValue;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
    
    let html = '';
    let employeeList=document.getElementById("employeeList")
    
    paginatedEmployees.forEach(employee => {
        html += `
            <div class="employee-card" data-id="${employee.id}">
                <h3>${employee.firstName} ${employee.lastName}</h3>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Role:</strong> ${employee.role}</p>
                <div class="employee-actions">
                    <button class="edit-btn" data-id="${employee.id}" onclick="editEmployee(${employee.id})">Edit</button>
                    <button class="delete-btn" data-id="${employee.id}" onclick="deleteEmployee(${employee.id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    employeeList.innerHTML = html || '<p>No employees found matching your criteria.</p>';
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

function editEmployee(id){
    const currentEmployeeObj = filteredEmployees.find(e=>e.id===id);
    localStorage.setItem('currentEmployee', JSON.stringify(currentEmployeeObj));
    window.location.href=`add-edit.html?edit=${id}`;
}

function deleteEmployee(id){
    filteredEmployees = employees.filter(e=>e.id !==id);
    localStorage.setItem("employeeList", JSON.stringify(filteredEmployees))
    renderEmployeeList()
}

function addEmployee(){
    window.location.href="add-edit.html"
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Filter sidebar
    filterBtn.addEventListener('click', () => {
        filterSidebar.classList.toggle('active');
    });
    
    // Apply filters
    applyFilters.addEventListener('click', applyEmployeeFilters);
    resetFilters.addEventListener('click', resetEmployeeFilters);
    
    // Sorting
    sortSelect.addEventListener('change', handleSort);
    
    // Pagination
    itemsPerPage.addEventListener('change', () => {
        itemsPerPageValue = parseInt(itemsPerPage.value);
        currentPage = 1;
        renderEmployeeList();
        updatePaginationInfo();
    });
    
    prevPage.addEventListener('click', goToPrevPage);
    nextPage.addEventListener('click', goToNextPage);
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm) {
        filteredEmployees = employees.filter(emp => 
            emp.firstName.toLowerCase().includes(searchTerm) || 
            emp.lastName.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredEmployees = [...employees];
    }
    
    currentPage = 1;
    renderEmployeeList();
    updatePaginationInfo();
}

// Apply filters
function applyEmployeeFilters() {
    const firstNameFilter = document.getElementById('filterFirstName').value.toLowerCase();
    const departmentFilter = document.getElementById('filterDepartment').value;
    const roleFilter = document.getElementById('filterRole').value;
    
    filteredEmployees = employees.filter(emp => {
        const matchesFirstName = firstNameFilter ? 
            emp.firstName.toLowerCase().includes(firstNameFilter) : true;
        const matchesDepartment = departmentFilter ? 
            emp.department === departmentFilter : true;
        const matchesRole = roleFilter ? 
            emp.role === roleFilter : true;
        
        return matchesFirstName && matchesDepartment && matchesRole;
    });
    
    currentPage = 1;
    renderEmployeeList();
    updatePaginationInfo();
    filterSidebar.classList.remove('active');
}

// Reset filters
function resetEmployeeFilters() {
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';
    
    filteredEmployees = [...employees];
    currentPage = 1;
    renderEmployeeList();
    updatePaginationInfo();
    filterSidebar.classList.remove('active');
}

// Handle sorting
function handleSort() {
    const sortBy = sortSelect.value;
    
    if (sortBy) {
        filteredEmployees.sort((a, b) => {
            return a[sortBy].localeCompare(b[sortBy])
        });
        
        currentPage = 1;
        renderEmployeeList();
        updatePaginationInfo();
    }
}

// Handle edit
function handleEdit(e) {
    const employeeId = parseInt(e.target.dataset.id);
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (employee) {
        // In a real app, this would redirect to the edit form with the employee data
        // For this example, we'll just show an alert
        alert(`Editing employee: ${employee.firstName} ${employee.lastName}`);
        // window.location.href = add-edit.html?edit=${employeeId};
    }
}

// Handle delete
function handleDelete(e) {
    const employeeId = parseInt(e.target.dataset.id);
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (employee && confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
        employees = employees.filter(emp => emp.id !== employeeId);
        filteredEmployees = filteredEmployees.filter(emp => emp.id !== employeeId);
        
        // Adjust current page if we're on a page that might now be empty
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPageValue);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        renderEmployeeList();
        updatePaginationInfo();
    }
}

// Pagination functions
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderEmployeeList();
        updatePaginationInfo();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPageValue);
    
    if (currentPage < totalPages) {
        currentPage++;
        renderEmployeeList();
        updatePaginationInfo();
    }
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPageValue) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
}





// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);