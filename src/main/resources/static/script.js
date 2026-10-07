const API = "";

let allStudents = [];
let allDepartments = [];


// ===============================
// PAGE NAVIGATION
// ===============================

function showSection(sectionId, button) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active-section");
    });

    document.getElementById(sectionId).classList.add("active-section");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");

    const titles = {
        dashboard: [
            "Dashboard",
            "Overview of your student management system"
        ],
        students: [
            "Students",
            "Manage registered students"
        ],
        departments: [
            "Departments",
            "Manage academic departments"
        ]
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionId][0];

    document.getElementById("pageSubtitle").textContent =
        titles[sectionId][1];

    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "students") {
        loadStudents();
        loadDepartments();
    }

    if (sectionId === "departments") {
        loadDepartments();
    }
}


// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API}/api/dashboard`);

        if (!response.ok) {
            throw new Error("Unable to load dashboard");
        }

        const data = await response.json();

        document.getElementById("totalStudents").textContent =
            data.totalStudents;

        document.getElementById("activeStudents").textContent =
            data.activeStudents;

        document.getElementById("inactiveStudents").textContent =
            data.inactiveStudents;

        document.getElementById("totalDepartments").textContent =
            data.totalDepartments;


        const container =
            document.getElementById("departmentOverview");

        container.innerHTML = "";

        data.departments.forEach(department => {

            container.innerHTML += `
                <div class="department-overview">

                    <div>
                        <div class="department-name">
                            ${department.departmentName}
                        </div>

                        <div class="department-code">
                            ${department.departmentCode}
                        </div>
                    </div>

                    <div class="student-count">
                        ${department.studentCount} Students
                    </div>

                </div>
            `;

        });

    } catch (error) {

        showToast(error.message);

    }
}


// ===============================
// STUDENTS
// ===============================

async function loadStudents() {

    try {

        const response =
            await fetch(`${API}/api/students`);

        if (!response.ok) {
            throw new Error("Unable to load students");
        }

        allStudents = await response.json();

        displayStudents(allStudents);

    } catch (error) {

        showToast(error.message);

    }
}


function displayStudents(students) {

    const table =
        document.getElementById("studentTableBody");

    table.innerHTML = "";

    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:30px">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    students.forEach(student => {

        const statusClass =
            student.status.toUpperCase() === "ACTIVE"
                ? "status-active"
                : "status-inactive";

        const registered =
            student.registrationDate
                ? new Date(student.registrationDate)
                    .toLocaleDateString()
                : "-";

        table.innerHTML += `

            <tr>

                <td>${student.studentId}</td>

                <td>
                    <div class="student-name">
                        ${student.name}
                    </div>
                </td>

                <td>
                    <div class="student-email">
                        ${student.email}
                    </div>
                </td>

                <td>${student.phone}</td>

                <td>
                    ${student.department
                        ? student.department.departmentCode
                        : "-"}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${student.status}
                    </span>
                </td>

                <td>${registered}</td>

                <td>
                    <button
                        class="delete-button"
                        onclick="deleteStudent(${student.studentId})">
                        Delete
                    </button>
                </td>

            </tr>

        `;

    });
}


// ===============================
// SEARCH
// ===============================

function searchStudents() {

    const search =
        document.getElementById("searchStudent")
            .value
            .toLowerCase();

    const filtered =
        allStudents.filter(student =>
            student.name
                .toLowerCase()
                .includes(search)
        );

    displayStudents(filtered);
}


// ===============================
// STATUS FILTER
// ===============================

function filterStudents() {

    const status =
        document.getElementById("statusFilter").value;

    if (status === "") {

        displayStudents(allStudents);

        return;
    }

    const filtered =
        allStudents.filter(student =>
            student.status.toUpperCase() === status
        );

    displayStudents(filtered);
}


// ===============================
// DEPARTMENT FILTER
// ===============================

function filterByDepartment() {

    const departmentId =
        document.getElementById("departmentFilter").value;

    if (departmentId === "") {

        displayStudents(allStudents);

        return;
    }

    const filtered =
        allStudents.filter(student =>
            student.department &&
            student.department.departmentId == departmentId
        );

    displayStudents(filtered);
}


// ===============================
// DEPARTMENTS
// ===============================

async function loadDepartments() {

    try {

        const response =
            await fetch(`${API}/api/departments`);

        if (!response.ok) {
            throw new Error("Unable to load departments");
        }

        allDepartments = await response.json();

        displayDepartments(allDepartments);

        populateDepartmentSelects();

    } catch (error) {

        showToast(error.message);

    }
}


function displayDepartments(departments) {

    const table =
        document.getElementById("departmentTableBody");

    table.innerHTML = "";

    departments.forEach(department => {

        const created =
            department.createdAt
                ? new Date(department.createdAt)
                    .toLocaleDateString()
                : "-";

        table.innerHTML += `

            <tr>

                <td>${department.departmentId}</td>

                <td>
                    <div class="student-name">
                        ${department.departmentName}
                    </div>
                </td>

                <td>${department.departmentCode}</td>

                <td>${created}</td>

                <td>

                    <button
                        class="delete-button"
                        onclick="deleteDepartment(${department.departmentId})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });
}


// ===============================
// DEPARTMENT DROPDOWNS
// ===============================

function populateDepartmentSelects() {

    const studentSelect =
        document.getElementById("studentDepartment");

    const filterSelect =
        document.getElementById("departmentFilter");

    studentSelect.innerHTML =
        `<option value="">Select Department</option>`;

    filterSelect.innerHTML =
        `<option value="">All Departments</option>`;


    allDepartments.forEach(department => {

        studentSelect.innerHTML += `
            <option value="${department.departmentId}">
                ${department.departmentName}
            </option>
        `;

        filterSelect.innerHTML += `
            <option value="${department.departmentId}">
                ${department.departmentName}
            </option>
        `;

    });
}


// ===============================
// ADD STUDENT
// ===============================

function openStudentModal() {

    loadDepartments();

    document
        .getElementById("studentModal")
        .classList.add("show");
}


function closeStudentModal() {

    document
        .getElementById("studentModal")
        .classList.remove("show");

    document
        .getElementById("studentForm")
        .reset();
}


document
    .getElementById("studentForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value;

        const email =
            document.getElementById("studentEmail").value;

        const phone =
            document.getElementById("studentPhone").value;

        const departmentId =
            document.getElementById("studentDepartment").value;

        const status =
            document.getElementById("studentStatus").value;


        const body = {

            name: name,
            email: email,
            phone: phone,
            status: status

        };


        try {

            const response =
                await fetch(
                    `/api/students?departmentId=${departmentId}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(body)
                    }
                );


            if (!response.ok) {

                const error =
                    await response.json();

                throw new Error(
                    error.message || "Unable to add student"
                );

            }


            closeStudentModal();

            showToast("Student registered successfully");

            await loadStudents();

            await loadDashboard();

        } catch (error) {

            showToast(error.message);

        }

    });


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.message || "Unable to delete student"
            );
        }

        showToast("Student deleted successfully");

        await loadStudents();

        await loadDashboard();

    } catch (error) {

        showToast(error.message);

    }
}


// ===============================
// ADD DEPARTMENT
// ===============================

function openDepartmentModal() {

    document
        .getElementById("departmentModal")
        .classList.add("show");
}


function closeDepartmentModal() {

    document
        .getElementById("departmentModal")
        .classList.remove("show");

    document
        .getElementById("departmentForm")
        .reset();
}


document
    .getElementById("departmentForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("departmentName").value;

        const code =
            document.getElementById("departmentCode").value;


        const body = {

            departmentName: name,
            departmentCode: code

        };


        try {

            const response =
                await fetch(
                    "/api/departments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(body)
                    }
                );


            if (!response.ok) {

                const error =
                    await response.json();

                throw new Error(
                    error.message || "Unable to add department"
                );

            }


            closeDepartmentModal();

            showToast("Department added successfully");

            await loadDepartments();

            await loadDashboard();

        } catch (error) {

            showToast(error.message);

        }

    });


// ===============================
// DELETE DEPARTMENT
// ===============================

async function deleteDepartment(id) {

    if (!confirm(
        "Are you sure? Departments with students may not be deletable."
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/departments/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.message || "Unable to delete department"
            );

        }


        showToast("Department deleted successfully");

        await loadDepartments();

        await loadDashboard();

    } catch (error) {

        showToast(error.message);

    }
}


// ===============================
// TOAST
// ===============================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);
}


// ===============================
// INITIAL LOAD
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadStudents();

    loadDepartments();

});