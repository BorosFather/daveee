var host = "http://localhost:3000";

const emptabla = document.querySelector("#emptabla");

//gomb készítése
const addgomb = document.getElementById("addgomb");
const empname = document.querySelector("#name");
const edit_idElem = document.querySelector("#edit_id")
const edit_nameElem = document.querySelector("#edit_name")
const savegomb = document.querySelector("#saveButton");

var actuTr;
var tbody = document.createElement('tbody');
emptabla.appendChild(tbody);

(() => {
    console.log("kívül");
    getEmployees();
})();


function getEmployees (){
    let endpoint = "employees";
    let url = host + "/" + endpoint;
    //console.log("Betöltés");

    fetch(url)
//megkapom a szükséges adatokat
.then( response => response.json())
.then(result => {
    //console.log(result[0].name);
    renderTable(result);
    })
.catch(err => {
    console.log("elírtál valamit te gyökér!!");
    console.log(err)});
}

function renderTable(employees){
    // console.log(employees[1]);
    tbody.innerHTML = "";
    employees.forEach( employee => {
        
        let tr = document.createElement("tr");
        let tdId = document.createElement("td");
        let tdName = document.createElement("td");
        let tdgomb = document.createElement("td");
        let delgomb =  makeDelButton(employee.id);
        let editgomb =  makeEditButton(employee);
        
      

        //tábla hozzáfűzés
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdgomb);
        tdgomb.appendChild(delgomb);
        tdgomb.appendChild(editgomb);
        tbody.appendChild(tr);
    
        //tábla feltöltése
        tdId.textContent = employee.id;
        tdName.textContent = employee.name;
    });
   
}

function makeDelButton(id){
    let delgomb = document.createElement("button");
    delgomb.classList.add("btn");
    delgomb.classList.add("btn-secondary");
    delgomb.classList.add("m-1");
    // delgomb.textContent = "Delete";
    delgomb.innerHTML= '<i class="bi bi-trash"></i>';
    delgomb.addEventListener("click", () => {
        //console.log(employee.id);
        let ans = confirm("Biztosan törlöd?");
        if (ans){
            deleteEmp(id);
            actuTr = delgomb.parentElement.parentElement;
            actuTr.parentNode.removeChild(actuTr);
        }
       
    });
    return delgomb;
}

addgomb.addEventListener("click", () => {

    addEmployee();

});

function addEmployee(){
    let endpoint = "employees";
    let url = host + "/" + endpoint;
    let employee = {
        name: empname.value
    }
    fetch(url, {
        method: "post",
        body: JSON.stringify(employee),//át kell alakítani
        headers: {"Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        empname.value = "";
        addEmployeeto(result);
    });
};

function addEmployeeto(employee){
    let tr = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdName = document.createElement("td");
    let tdButton = document.createElement("td");

    tdId.textContent = employee.id;
    tdName.textContent = employee.name;
    
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdButton);

    let delButton = makeDelButton(employee.id);
    let editgomb = makeEditButton(employee);
    tdButton.appendChild(delButton);
    tdButton.appendChild(editgomb);
    tbody.appendChild(tr);


}

//paraméternek jön a dolgozó id-ja
function deleteEmp(id){
    //console.log(id);
    let endpoint = "employees";
    let url = host + "/" + endpoint + "/" + id;
    fetch(url, {
        method: "delete"
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);

    });
}

function makeEditButton(employee){
    let editgomb = document.createElement("button");
    editgomb.classList.add("btn");
    editgomb.classList.add("btn-secondary");
    //adatok hozzáadása
    editgomb.setAttribute("data-empid", employee.id);
    editgomb.setAttribute("data-empname", employee.name);
    editgomb.setAttribute("data-bs-toggle", "modal");
    editgomb.setAttribute("data-bs-target", "#editModal");
    

    editgomb.textContent = "Edit";
    editgomb.addEventListener("click", () => {
        console.log("Szerkezrés megy!");

        

        edit_idElem.value = editgomb.dataset.empid;
        edit_nameElem.value = editgomb.dataset.empname;
        actuTr = editgomb.parentElement.parentElement;
        console.log(employee.id);
    });
    return editgomb;
}

savegomb.addEventListener("click", () =>{
    console.log("rest api mentés");
    actuTr.childNodes[1].textContent = edit_nameElem.value;

    actuTr.childNodes[2].lastChild.setAttribute("data-empname", edit_nameElem.value);
    updateEmployee();
   

});

function updateEmployee(){
    //edit_idElem.value
    let endpoint = "employees" ;
    let url = host + "/" + endpoint+ "/" + edit_idElem.value;
    //console.log(url);
    fetch(url, {
        method: "put", 
        body: JSON.stringify({
            id: edit_idElem.value,
            name: edit_nameElem.value
        }),
        headers: {
            "Contetnt-Type": "application/json"
        }
    })
    //promis
    .then(response => response.json())
    .then(result=> {
        console.log(result);
    });
}



// .then((res) => res.json())
// .then(data => {
//     console.log(data);
// });

