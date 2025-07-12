<#-- Freemarker template for rendering employee list -->
<#-- In a real implementation, this would be processed server-side -->
<#-- For this example, we'll just show a basic structure -->

<#assign employeeData = [
    {"id": 1, "firstName": "Alice", "lastName": "Smith", "email": "alice@example.com", "department": "HR", "role": "Manager"},
    {"id": 2, "firstName": "Bob", "lastName": "Johnson", "email": "bob@example.com", "department": "IT", "role": "Developer"},
    {"id": 3, "firstName": "Charlie", "lastName": "Lee", "email": "charlie@example.com", "department": "Finance", "role": "Analyst"}
]>

<#list employeeData as employee>
    <div class="employee-card" data-id="${employee.id}">
        <h3>${employee.firstName} ${employee.lastName}</h3>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Department:</strong> ${employee.department}</p>
        <p><strong>Role:</strong> ${employee.role}</p>
        <div class="employee-actions">
            <button class="edit-btn" data-id="${employee.id}">Edit</button>
            <button class="delete-btn" data-id="${employee.id}">Delete</button>
        </div>
    </div>
</#list>