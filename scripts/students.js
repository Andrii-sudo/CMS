// modal
// document.getElementById("btn-add").addEventListener("click", showModalAdd);
document.getElementById("modal-student-close").addEventListener("click", closeModal);
document.getElementById("modal-student-cancel").addEventListener("click", closeModal);

// dialog
document.getElementById("dialog-close").addEventListener("click", closeDialogDel);
document.getElementById("dialog-cancel").addEventListener("click", closeDialogDel);
document.getElementById("dialog-ok").addEventListener("click", deleteStudents);

// table
document.getElementById("main-checkbox").addEventListener("change", changeMainCheckBox);

let id = 0;
const INVISIBLECHAR = "\u200B";

function showModalAdd()
{
    document.getElementById("modal-student-title").innerText = "Add student";
    document.getElementById("modal-student-apply").innerText = "Create";

    document.getElementById("modal-student-apply").removeEventListener("click", addStudent);
    document.getElementById("modal-student-apply").removeEventListener("click", editStudent);
    document.getElementById("modal-student-apply").addEventListener("click", addStudent);

    document.getElementById("modal-student").style.display = "block";
}

function showModalEdit()
{
    document.getElementById("modal-student-title").innerText = "Edit student";
    document.getElementById("modal-student-apply").innerText = "Save";

    document.getElementById("modal-student-apply").removeEventListener("click", addStudent);
    document.getElementById("modal-student-apply").removeEventListener("click", editStudent);
    document.getElementById("modal-student-apply").addEventListener("click", editStudent);

    document.getElementById("modal-student").style.display = "block";
}

function setModalInput(group = "", firstName = "",
                      lastName = "", gender = "M", birthday = "", id = "")
{
    document.getElementById("group").value = group;
    document.getElementById("first-name").value = firstName;
    document.getElementById("last-name").value = lastName;
    document.getElementById("gender").value = gender;
    document.getElementById("birthday").value = birthday;
    document.getElementById("modal-student-id").value = id;
}

function closeModal()
{
    document.getElementById("modal-student").style.display = "none";
    document.getElementById("student-form").classList.remove("submitted");
    setModalInput();

    document.getElementById("group").classList.remove("invalid");
    document.getElementById("first-name").classList.remove("invalid");
    document.getElementById("last-name").classList.remove("invalid");
    document.getElementById("gender").classList.remove("invalid");
    document.getElementById("birthday").classList.remove("invalid");
}

async function addStudent(event)
{
    event.preventDefault(); // prevent page reload

    const group     = document.getElementById("group").value;
    const firstName = document.getElementById("first-name").value;
    const lastName  = document.getElementById("last-name").value;
    const gender    = document.getElementById("gender").value;
    const birthday  = document.getElementById("birthday").value;

    const response = await fetch("server/index.php?action=addStudent", 
    {
        method: "POST",
        headers: 
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
        {
            group:     group,
            firstName: firstName,
            lastName:  lastName,
            gender:    gender,
            birthday:  birthday
        })
    });

    const result = await response.json();

    if (result.success)
    {
        fetchTableDataForPage(currentPage = totalPages);
        closeModal();
    }
    else
    {
        if (!result.isGroupValid) 
        {
            document.getElementById("group").classList.add("invalid");
        }
        if (!result.isFirstNameValid) 
        {
            document.getElementById("first-name").classList.add("invalid");
        }
        if (!result.isLastNameValid) 
        {
            document.getElementById("last-name").classList.add("invalid");
        }
        if (!result.isGenderValid) 
        {
            document.getElementById("gender").classList.add("invalid");
        }
        if (!result.isBirthdayValid) 
        {
            document.getElementById("birthday").classList.add("invalid");
        }   
        if (result.isDuplicate)
        {
            alert("Student already exists");
        }
    }
}

function addRow(group, firstName, lastName, gender, birthday, studentId)
{
    const tableBody = document.querySelector("tbody");
    const newRow = document.createElement("tr");

    newRow.dataset.id = studentId.toString();

    const cellCheckBox = document.createElement("td");
    const cellGroup    = document.createElement("td");
    const cellName     = document.createElement("td");
    const cellGender   = document.createElement("td");
    const cellBirthday = document.createElement("td");
    const cellStatus   = document.createElement("td");
    const cellOptions  = document.createElement("td");

    cellGroup.textContent    = group;
    cellName.textContent     = firstName + " " + INVISIBLECHAR + lastName;
    cellGender.textContent   = gender;
    cellBirthday.textContent = birthday;

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.ariaLabel = "Select student";

    const status = document.createElement("span");
    status.className = Math.random() < 0.5 ? "green" : "gray";

    const optionEdit = document.createElement("button");
    optionEdit.className = "btn-square";
    optionEdit.ariaLabel = "Edit student";
    optionEdit.addEventListener("click", function ()
    {
        const currRow = getRowById(newRow.dataset.id).querySelectorAll("td");
        const fullName = currRow[2].textContent.split(INVISIBLECHAR);
        
        setModalInput(currRow[1].textContent, fullName[0].slice(0, -1), fullName[1], currRow[3].textContent,
                      currRow[4].textContent, newRow.dataset.id);
        showModalEdit();
    });

    const iconEdit = document.createElement("i");
    iconEdit.className = "fa-solid fa-pencil";
    optionEdit.appendChild(iconEdit);

    const optionDel = document.createElement("button");
    optionDel.className = "btn-square";
    optionDel.ariaLabel = "Remove student";
    optionDel.addEventListener("click", showDialogDel);

    const iconDel = document.createElement("i");
    iconDel.className = "fa-solid fa-xmark";
    optionDel.appendChild(iconDel);

    cellCheckBox.appendChild(checkBox);
    cellStatus.appendChild(status);
    cellOptions.appendChild(optionEdit);
    cellOptions.appendChild(optionDel);

    newRow.appendChild(cellCheckBox);
    newRow.appendChild(cellGroup);
    newRow.appendChild(cellName);
    newRow.appendChild(cellGender);
    newRow.appendChild(cellBirthday);
    newRow.appendChild(cellStatus);
    newRow.appendChild(cellOptions);

    tableBody.appendChild(newRow);
}

function getRowById(id)
{
    const rows = document.querySelectorAll("tbody tr");
    let i = 0;
    for (; i < rows.length; i++)
    {
        if (rows[i].dataset.id === id)
        {
            return rows[i];
        }
    }
    throw "Invalid ID";
}

async function editStudent(event)
{    
    event.preventDefault(); // prevent page reload

    const group     = document.getElementById("group").value;
    const firstName = document.getElementById("first-name").value;
    const lastName  = document.getElementById("last-name").value;
    const gender    = document.getElementById("gender").value;
    const birthday  = document.getElementById("birthday").value;

    const id = document.getElementById("modal-student-id").value;

    const response = await fetch("server/index.php?action=editStudent", 
    {
        method: "POST",
        headers: 
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
        {
            id:        id,
            group:     group,
            firstName: firstName,
            lastName:  lastName,
            gender:    gender,
            birthday:  birthday
        })
    });

    const result = await response.json();

    if (result.success)
    {
        fetchTableDataForPage(currentPage);
        closeModal();
    }
    else
    {
        if (!result.isGroupValid) 
        {
            document.getElementById("group").classList.add("invalid");
        }
        if (!result.isFirstNameValid) 
        {
            document.getElementById("first-name").classList.add("invalid");
        }
        if (!result.isLastNameValid) 
        {
            document.getElementById("last-name").classList.add("invalid");
        }
        if (!result.isGenderValid) 
        {
            document.getElementById("gender").classList.add("invalid");
        }
        if (!result.isBirthdayValid) 
        {
            document.getElementById("birthday").classList.add("invalid");
        }   
        if (result.isDuplicate)
        {
            alert("Student already exists");
        }
    }
}

function changeMainCheckBox()
{
    const checkBox = document.getElementById("main-checkbox");
    const lsCheckbox = document.querySelectorAll("tbody input[type='checkbox']");

    for (let i = 0; i < lsCheckbox.length; i++)
    {
        lsCheckbox[i].checked = checkBox.checked;
    }
}

function showDialogDel()
{
    let strUsernames = "";
    const lsRows = document.querySelectorAll("tbody tr");
    for (let i = 0; i < lsRows.length; i++)
    {
        if (lsRows[i].querySelector("td input[type='checkbox']").checked)
        {
            strUsernames += lsRows[i].querySelectorAll("td")[2].innerText + ", ";
        }
    }

    if (strUsernames !== "")
    {
        strUsernames = strUsernames.slice(0, -2);
        document.getElementById("dialog").style.display = "block";
        document.getElementById("dialog-usernames").innerText = strUsernames;
    }
    else
    {
        alert("Select at least one student");
    }
}

function closeDialogDel()
{
    document.getElementById("dialog").style.display = "none";
}

function deleteStudents()
{
    const lsRows = document.querySelectorAll("tbody tr");
    
    const idsToDelete = [];

    let isPageEmtpy = true;
    for (let i = lsRows.length - 1; i >= 0; i--)
    {
        if (lsRows[i].querySelector("td input[type='checkbox']").checked)
        {
            idsToDelete.push(lsRows[i].dataset.id);
        }
        else
        {
            isPageEmtpy = false;
        }
    }

    fetch("server/index.php?action=delStudents", 
    {
        method: "POST",
        headers: 
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: idsToDelete })
    })
    .then(response => 
    {
        if (response.ok) 
        {
            fetchTableDataForPage(isPageEmtpy ? --currentPage : currentPage);
            closeDialogDel();
        }
        else
        {
            alert("Помилка при видаленні на сервері");
        }
    })
    .catch(error => alert("Помилка з'єднання:", error));
}

// LogIn
document.getElementById("btnLogin").addEventListener("click", showLoginForm);
document.getElementById("modal-login-close").addEventListener("click", closeLoginForm);
document.getElementById("modal-login-cancel").addEventListener("click", closeLoginForm);

function showLoginForm()
{
    document.getElementById("modal-login").style.display = "block";
}

function closeLoginForm()
{
    document.getElementById("modal-login").style.display = "none";
}

let currentUser = null;
let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", checkAuthentication);

function checkAuthentication()
{
    fetch("server/index.php?action=checkAuth")
        .then(response => response.json())
        .then(data =>
        {
            if (data.isAuthenticated) 
            {
                currentUser = data.username;

                document.querySelector("header .dropdown-notify").style.display = "inline-block";
                document.querySelector("header .dropdown-profile").style.display = "flex";
                document.querySelector("header .dropdown-profile .user-name").textContent = currentUser;

                document.getElementById("btn-add").addEventListener("click", showModalAdd);

                const nav = document.querySelectorAll("#navbar-list li a");
                nav[0].href = "./dashboard.html";
                nav[1].href = "./students.html";
                nav[2].href = "./tasks.html";

                fetchTableDataForPage(currentPage);
            }
            else
            {
                document.getElementById("btnLogin").style.display = "block";
                document.querySelector("header .dropdown-notify").style.display = "none";
                document.querySelector("header .dropdown-profile").style.display = "none";

                if (data.error === "1")
                {
                    showLoginForm();
                    document.getElementById("login-error").style.display = "block";
                }
            }
        })
        .catch(error => 
        {
            console.error("Authentication check failed:", error);
        });
}

function fetchTableDataForPage(page) 
{
    fetch(`server/index.php?action=pagination&page=${page}`)
        .then(response => response.json())
        .then(data => 
        {
            console.log("Page data:", data);

            const rows = document.querySelector("tbody").querySelectorAll("tr");
            rows.forEach(row => row.remove());

            totalPages = data.totalPages;
            for (student of data.rows)
            {
                addRow(student.group, student.firstName, student.lastName, student.gender, student.birthday, student.id);
            }

            updatePagination();
        })
        .catch(error => 
        {
            console.error("Failed to fetch page data:", error);
        });
}

function updatePagination()
{
    const pagination = document.getElementById("pagination-container");
    const pagButtons = pagination.querySelectorAll("button");

    for (btn of pagButtons)
    {
        btn.remove();
    }

    const left  = document.createElement("button");
    const right = document.createElement("button");
    
    left.textContent  = "<";
    right.textContent = ">";

    left.classList  = "btn-square";
    right.classList = "btn-square";

    left.addEventListener("click", event => 
    {
        if (currentPage > 1)
        {
            fetchTableDataForPage(--currentPage);
        }
    })

    right.addEventListener("click", event => 
    {
        if (currentPage < totalPages)
        {
            fetchTableDataForPage(++currentPage);
        }
    })

    pagination.appendChild(left);

    for (let i = 1; i <= totalPages; i++)
    {
        const btn = document.createElement("button");
        btn.classList = "btn-square";
        btn.textContent = i.toString();

        if (i === currentPage)
        {
            btn.classList.add("active");
        }

        btn.addEventListener("click", event =>
        {
            currentPage = i;
            fetchTableDataForPage(currentPage);
        });

        pagination.appendChild(btn);
    }

    pagination.appendChild(right);
}