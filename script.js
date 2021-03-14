const form = document.querySelector("form");
const todos = document.querySelector(".todos");
const input = document.querySelector("#value");
const alertEl = document.querySelector(".alert");
const clear = document.querySelector(".clear");
let storageTodos = localStorage.todos
  ? JSON.parse(localStorage.getItem("todos"))
  : [];
storageTodos.forEach(({ h2, id }) => {
  displayItem(h2, true, id);
});
let IsEdit = false;
let data = {};
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let input = e.target.value;
  let { value } = input;
  if (value.trim()) {
    if (!IsEdit) {
      displayItem(value);
      LS();
      alertFn("add", alertEl);
    } else {
      data.input = value;
      EditedH2(data);
      reset();
      IsEdit = false;
      LS();
      alertFn("updated", alertEl);
    }
  } else {
    alertFn("err", alertEl);
  }

  input.value = "";
});

todos.addEventListener("click", function (e) {
  let todo = e.target.parentElement.parentElement;
  if (e.target.classList.contains("delete")) {
    removeEl(todo);
  }
  if (e.target.classList.contains("edit")) {
    edit(todo);
  }
  if (e.target.classList.contains("clear") && todos.children.length > 1) {
    e.stopImmediatePropagation();
    clearTodo();
  }
});
clear.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  clearTodo();
});
function clearTodo() {
  todos.classList.add("clearNow");
  setTimeout(() => {
    todos.classList.remove("clearNow");
    setTimeout(() => {
      todos.innerHTML = `<button class="clear">Clear All</button>`;
    }, 1000);
  }, 1000);
  console.log("HIIIIII");
  //   todos.innerHTML = `<button class="clear">Clear All</button>`;
}
function edit(todo) {
  IsEdit = true;
  let h2 = todo.querySelector("h2");
  let id = todo.id;
  form.value.value = h2.textContent;
  data = DataObj(h2, id);
  form.submit.innerText = "Edit";
  form.submit.classList.add("edited");
}

function displayItem(value, Ls = false, id) {
  if (Ls) {
    CreateTodo(value, id);
  } else {
    let id = new Date().getTime();
    CreateTodo(value, id);
  }
}
function CreateTodo(value, id) {
  let div = document.createElement("div");
  div.classList.add("todo");
  div.setAttribute("id", id);
  div.innerHTML = `
          <h2 id="${id}">${value}</h2>
                <div class="btns">
                  <button class="edit" id="${id}"><i class="fas fa-edit"></i></button>
                  <button class="delete" id="${id}"><i class="fas fa-trash"></i></button>
                </div>
          `;
  todos.prepend(div);
}
function reset() {
  form.submit.innerText = "Add";
  form.submit.classList.remove("edited");
  form.value.value = "";
  IsEdit = false;
}
function DataObj(input, id) {
  return { input, id };
}
function EditedH2({ id, input }) {
  const h2s = document.querySelectorAll("h2");
  h2s.forEach((h2) => {
    if (h2.id == id) {
      h2.innerText = input;
    }
  });
}

function LS() {
  let todosLocalStorage = [];

  let todoAll = document.querySelectorAll(".todo");
  todoAll.forEach((todo) => {
    let h2 = todo.querySelector("h2").innerText;
    let id = todo.querySelector("h2").id;
    todosLocalStorage.push({ h2, id });
  });
  localStorage.setItem("todos", JSON.stringify(todosLocalStorage));
}

function removeEl(todo) {
  todo.classList.add("removeEl");
  alertFn("removed", alertEl);
  todo.addEventListener("animationend", () => {
    todo.remove();
    reset();
    LS();
  });
}

function alertFn(cls, el) {
  el.classList.add(cls);
  if (cls == "removed") {
    el.innerText = "Todo Removed";
  } else if (cls == "updated") {
    el.innerText = "Todo Updated";
  } else if (cls == "add") {
    el.innerText = "Todo Added";
  } else if (cls == "err") {
    el.innerText = "Please Add Your Value !";
  }

  setTimeout(() => {
    el.classList.remove(cls);
  }, 1000);
}
