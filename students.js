document.getElementById("btn-add").addEventListener("click", showModalAdd);
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("btn-cancel").addEventListener("click", closeModal);
document.getElementById("btn-create").addEventListener("click", addStudent);
document.getElementById("main-checkbox").addEventListener("change", changeMainCheckBox);

// let lsBtnEdit = document.querySelectorAll(".btn-edit");
// for (let i = 0; i < lsBtnEdit.length; i++)
// {
//     lsBtnEdit[i].addEventListener("click", showModalEdit);
// }

function showModalAdd()
{
    document.getElementById("modal-title").innerText = "Add student";
    document.getElementById("modal").style.display = "block";
}

function showModalEdit()
{
    document.getElementById("modal-title").innerText = "Edit student";
    document.getElementById("modal").style.display = "block";
}

function closeModal()
{
    document.getElementById("modal").style.display = "none";
}

function addStudent()
{
    document.getElementById("modal").style.display = "none";

    const group     = document.getElementById("group").value;
    const firstName = document.getElementById("first-name").value;
    const lastName  = document.getElementById("last-name").value;
    const gender    = document.getElementById("gender").value;
    const birthday  = document.getElementById("birthday").value;

    // очистити дані

    const tableBody = document.getElementsByTagName("tbody")[0];
    const newRow = document.createElement("tr");

    const cellCheckBox = document.createElement("td");
    const cellGroup    = document.createElement("td");
    const cellName     = document.createElement("td");
    const cellGender   = document.createElement("td");
    const cellBirthday = document.createElement("td");
    const cellStatus   = document.createElement("td");
    const cellOptions  = document.createElement("td");

    cellGroup.textContent    = group;
    cellName.textContent     = firstName + " " + lastName;
    cellGender.textContent   = gender;
    cellBirthday.textContent = birthday;

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    const status = document.createElement("span");
    status.className = Math.random() < 0.5 ? "green" : "gray";

    const optionEdit = document.createElement("button");
    optionEdit.className = "btn-edit";

    const iconEdit = document.createElement("i");
    iconEdit.className = "fa-solid fa-pencil";
    optionEdit.appendChild(iconEdit);

    const optionDel = document.createElement("button");
    optionDel.className = "btn-del";

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

function changeMainCheckBox()
{
    const checkBox = document.getElementById("main-checkbox");
    const lsCheckbox = document.querySelectorAll('tbody input[type="checkbox"]');

    for (let i = 0; i < lsCheckbox.length; i++)
    {
        lsCheckbox[i].checked = checkBox.checked;
    }
}