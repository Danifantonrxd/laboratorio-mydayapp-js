const toDoList = document.querySelector(".todo-list");
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const mainInput = document.querySelector(".new-todo");

function hideMainFooter(){
    const hasTasks = toDoList.innerHTML == "";

    if(!hasTasks){
        main.classList.add("hidden");
        footer.classList.add("hidden");
    }
    else {
        main.classList.remove("hidden");
        footer.classList.remove("hidden");
    }
}

function createTask(event){
    if(event.keyCode !== 13){
        console.log(event.keyCode);
        return;
    }

    const task = mainInput.value.trim();

    if(task == ""){
        console.log("La tarea no puede estar vacia");
        return;
    }

    mainInput.value = "";

    const newTaskLi = document.createElement("li");

    const newTaskDiv = document.createElement("div");
    newTaskDiv.classList.add("view");

    const newTaskInput = document.createElement("input");
    newTaskInput.classList.add("toggle");
    newTaskInput.type = "checkbox";

    const newTaskLabel = document.createElement("label");
    newTaskLabel.innerText = task;

    const newTaskButton = document.createElement("button");
    newTaskButton.classList.add("destroy");

    const newTaskInputEdit = document.createElement("input");
    newTaskInputEdit.classList.add("edit");
    newTaskInputEdit.value = task;

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
}

mainInput.addEventListener("keyup", createTask);
