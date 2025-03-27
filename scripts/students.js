// modal
document.getElementById("btn-add").addEventListener("click", showModalAdd);
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-cancel").addEventListener("click", closeModal);

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
    document.getElementById("modal-title").innerText = "Add student";
    document.getElementById("modal-apply").innerText = "Create";

    document.getElementById("modal-apply").removeEventListener("click", addStudent);
    document.getElementById("modal-apply").removeEventListener("click", editStudent);
    document.getElementById("modal-apply").addEventListener("click", addStudent);

    document.getElementById("modal").style.display = "block";
}

function showModalEdit()
{
    document.getElementById("modal-title").innerText = "Edit student";
    document.getElementById("modal-apply").innerText = "Save";

    document.getElementById("modal-apply").removeEventListener("click", addStudent);
    document.getElementById("modal-apply").removeEventListener("click", editStudent);
    document.getElementById("modal-apply").addEventListener("click", editStudent);

    document.getElementById("modal").style.display = "block";
}

function setModalInput(group = "", firstName = "",
                      lastName = "", gender = "M", birthday = "", id = "")
{
    document.getElementById("group").value = group;
    document.getElementById("first-name").value = firstName;
    document.getElementById("last-name").value = lastName;
    document.getElementById("gender").value = gender;
    document.getElementById("birthday").value = birthday;
    document.getElementById("modal-id").value = id;
}

function closeModal()
{
    document.getElementById("modal").style.display = "none";
    setModalInput();
}

function addStudent()
{
    const group     = document.getElementById("group").value;
    const firstName = document.getElementById("first-name").value;
    const lastName  = document.getElementById("last-name").value;
    const gender    = document.getElementById("gender").value;
    const birthday  = document.getElementById("birthday").value;

    if (!group || !firstName || !lastName || !gender || !birthday )
    {
        alert("Please fill all fields");
        return;
    }

    closeModal();

    const tableBody = document.querySelector("tbody");
    const newRow = document.createElement("tr");

    newRow.dataset.id = (id++).toString(); //

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
    //optionEdit.addEventListener("click", showModalEdit);
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

function editStudent()
{
    const group     = document.getElementById("group").value;
    const firstName = document.getElementById("first-name").value;
    const lastName  = document.getElementById("last-name").value;
    const gender    = document.getElementById("gender").value;
    const birthday  = document.getElementById("birthday").value;

    if (!group || !firstName || !lastName || !gender || !birthday )
    {
        alert("Please fill all fields");
        return;
    }

    const id = document.getElementById("modal-id").value;
    const currRow = getRowById(id).querySelectorAll("td");

    currRow[1].textContent = group;
    currRow[2].textContent = firstName + " " + INVISIBLECHAR + lastName;
    currRow[3].textContent = gender;
    currRow[4].textContent = birthday;

    closeModal();
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

function changeMainCheckBox()
{
    const checkBox = document.getElementById("main-checkbox");
    const lsCheckbox = document.querySelectorAll('tbody input[type="checkbox"]');

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
    for (let i = lsRows.length - 1; i >= 0; i--)
    {
        if (lsRows[i].querySelector("td input[type='checkbox']").checked)
        {
            lsRows[i].remove();
        }
    }
    closeDialogDel();
}
