const toDoList = document.querySelector(".todo-list");
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const mainInput = document.querySelector(".new-todo");
const btnClearCompleted = document.querySelector(".clear-completed");

btnClearCompleted.addEventListener("click", clearCompleted);
mainInput.addEventListener("keyup", createTask);
window.addEventListener("load", loadTasks);
window.addEventListener("hashchange", toggleModes);

const generateId = generator();

function* generator(){
    let id = 0;
    while(true){
        yield id++;
    }
}

function hideMainFooter(){
    const hasTasks = toDoList.childElementCount;

    if(!hasTasks){
        main.classList.add("hidden");
        footer.classList.add("hidden");
    }
    else {
        main.classList.remove("hidden");
        footer.classList.remove("hidden");
    }
}

function createTask(
    event, 
    { 
        checkEvent = true,
        task = undefined 
    } = {})
{
    if(checkEvent && event.keyCode !== 13){
        console.log(event.keyCode);
        return;
    }

    if(!task){
        task = mainInput.value.trim();
    }

    if(task == ""){
        console.log("La tarea no puede estar vacia");
        return;
    }

    mainInput.value = "";

    const newTaskLi = document.createElement("li");
    const id = generateId.next().value;
    newTaskLi.id = "id" + id;

    const newTaskDiv = document.createElement("div");
    newTaskDiv.classList.add("view");

    const newTaskInput = document.createElement("input");
    newTaskInput.classList.add("toggle");
    newTaskInput.type = "checkbox";
    newTaskInput.addEventListener("click", () => toggleCompleted(id));

    const newTaskLabel = document.createElement("label");
    newTaskLabel.innerText = task;
    newTaskLabel.addEventListener("dblclick", () => toggleEditing(id, newTaskInputEdit));

    const newTaskButton = document.createElement("button");
    newTaskButton.classList.add("destroy");
    newTaskButton.addEventListener("click", () => deleteTask(id));

    const newTaskInputEdit = document.createElement("input");
    newTaskInputEdit.classList.add("edit");
    newTaskInputEdit.value = task;
    newTaskInputEdit.addEventListener(
        "keyup", 
        (event) => editTask(event, id, newTaskInputEdit, newTaskLabel)
    );

    newTaskDiv.append(
        newTaskInput,
        newTaskLabel,
        newTaskButton
    );

    newTaskLi.append(
        newTaskDiv,
        newTaskInputEdit
    );

    toDoList.appendChild(newTaskLi);
    hideMainFooter();
    updateFooter();
    updateLocalStorage();
}

function toggleCompleted(id){
    const task = document.getElementById("id" + id);
    task.classList.toggle("completed")

}

function toggleEditing(id, input){
    const task = document.getElementById("id" + id);
    task.classList.toggle("editing");
    if(task.classList.contains("editing")){
        input.focus();
    }
}

function editTask(event, id, input, label){
    if(event.keyCode == 27){
        input.value = label.innerText;
        toggleEditing(id);
        return;    
    }
    if(event.keyCode !== 13){
        console.log("do nothing");
        return;
    }
    
    const task = input.value.trim();
    if(task == ""){
        console.log("La cadena no puede esta vacia");
        input.value = label.innerText;
        toggleEditing(id);
        return;
    }

    label.innerText = task;
    input.value = task;
    toggleEditing(id);
    updateLocalStorage();
}

function deleteTask(id){
    const task = document.getElementById("id" + id);
    toDoList.removeChild(task);
    hideMainFooter();
    updateFooter();
    updateLocalStorage();
}

//------------------------------------//
// Footer
//------------------------------------//

function updateFooter(){
    const items = toDoList.childElementCount;
    const span = document.querySelector(".todo-count");
    if(items == 1){
        span.innerHTML = "<strong>1</strong> item left";
    }
    else {
        span.innerHTML = `<strong>${items}</strong> items left`;
    }
}

function clearCompleted(){
    let tasksCompleted = document.getElementsByClassName("completed");
    tasksCompleted = Object.values(tasksCompleted);
    tasksCompleted.forEach(task => {
        toDoList.removeChild(task);
    });
    hideMainFooter();
    updateFooter();
    updateLocalStorage();
}

//-------------------------------------------//
// Others
//-------------------------------------------//

function updateLocalStorage(){
    const key = "mydayapp-js";
    const views = document.getElementsByClassName("view");
    const items = Object.values(views);

    saveTasks = [];

    items.forEach(item => {
        const task = item.children[1].innerText;
        saveTasks.push(task);
    });

    localStorage.setItem(key, JSON.stringify(saveTasks));
}

function loadTasks(){
    const key = "mydayapp-js";
    let tasks = localStorage.getItem(key);
    tasks = JSON.parse(tasks);

    if(tasks.length == 0){
        console.log("no hay tareas");
        hideMainFooter();
        return;
    }

    tasks.forEach(task => {
        createTask(event, { checkEvent: false, task});
    });

    if(location.hash != "#"){
        location.hash = "#";
    }
    hideMainFooter();
}

function toggleModes(){
    const filters = document.querySelector(".filters").children;

    let completed = document.getElementsByClassName("completed");
    completed = Object.values(completed);

    const pendingObj = toDoList.children;
    const pending = [];

    for(let i = 0; i < toDoList.childElementCount; i++){
        const isCompleted = pendingObj[i].classList.contains("completed"); 
        if(!isCompleted){
            pending.push(pendingObj[i]);
        }
    }

    if(location.hash == ""){
        filters[0].children[0].classList.add("selected");
        filters[1].children[0].classList.remove("selected");
        filters[2].children[0].classList.remove("selected");

        pending.forEach(item => {
            item.classList.remove("hidden");
        });

        completed.forEach(item => {
            item.classList.remove("hidden");
        });
    }
    else if(location.hash == "#pending"){
        filters[0].children[0].classList.remove("selected");
        filters[1].children[0].classList.add("selected");
        filters[2].children[0].classList.remove("selected");

        pending.forEach(item => {
            item.classList.remove("hidden");
        });

        completed.forEach(item => {
            item.classList.add("hidden");
        });
    }
    else if(location.hash == "#completed"){
        filters[0].children[0].classList.remove("selected");
        filters[1].children[0].classList.remove("selected");
        filters[2].children[0].classList.add("selected");

        pending.forEach(item => {
            item.classList.add("hidden");
        });

        completed.forEach(item => {
            item.classList.remove("hidden");
        });
    }
}