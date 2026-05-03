 //Select DOM
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const dateTime = document.querySelector('.datetime');

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteTodo);
filterOption.addEventListener('change', filterTodo);

//Functions
function getItemFromLocalStorage() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  return todos;
}

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();

  if (todoInput.value.trim() === '') {
    openmodal('red', 'Please enter a Task!');
    return;
  }

  // alert("Duplicate task")
  if (isDuplicate(todoInput.value)) {
    openmodal('red', 'This Task is already added!');
    return;
  }

  let newTodoItem = {
    id: Math.round(Math.random() * 100), //id for selection
    task: todoInput.value,
    status: 'incomplete',
  };

  //Save to local - do this last
  saveLocalTodos(newTodoItem);

  //Create todo div
  createTodo(newTodoItem);
  todoInput.value = '';
}

function createTodo(todo) {
  //Create todo div
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  todoDiv.setAttribute('key', todo.id);

  //Create list
  const newTodo = document.createElement('li');
  newTodo.innerText = todo.task;
  newTodo.classList.add('todo-item');
  todoDiv.appendChild(newTodo);

  const edit = document.createElement('div');
  edit.innerHTML = `<form class="editform"><input type="text" placeholder="${todo.task}" id="edit-${todo.id}" required /><div class="editDiv" style="margin:auto;"><button id="editBtn-${todo.id}" type="submit"><i class="fas fa-plus-square"></i></button></div></form>`;
  edit.classList.add('hide');
  todoDiv.appendChild(edit);

  //Create Completed Button
  const completedButton = document.createElement('button');
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton);

  //Create edit button
  const editButton = document.createElement('button');
  editButton.innerHTML = `<i class="fas fa-pen"></i>`;
  editButton.classList.add('edit-btn');
  editButton.addEventListener('click', () => editTodo(todo, todoDiv));
  todoDiv.appendChild(editButton);

  //Create trash button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);

  //attach final Todo
  todoList.appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === 'trash-btn') {
    const todo = item.parentElement;
    todo.classList.add('fall');

    //at the end
    removeLocalTodos(todo);
    todo.addEventListener('transitionend', () => {
      todo.remove();
    });
  }

  if (item.classList[0] === 'complete-btn') {
    const todo = item.parentElement;
    todo.classList.toggle('completed');
    const id = todo.getAttribute('key');
    saveStatus(id);
  }
}

//save the status of the task -> and persist by saving it to the localstorage
function saveStatus(id) {
  const todos = getItemFromLocalStorage();
  const intId = Number(id);

  todos.forEach((todo) => {
    if (todo.id === intId) {
      todo.status = todo.status === 'incomplete' ? 'completed' : 'incomplete';
    }
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function filterTodo(e) {
  const todos = todoList.childNodes;

  todos.forEach(function(todo) {
    switch (e.target.value) {
      case 'all':
        todo.style.display = 'flex';
        break;
      case 'completed':
        if (todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
      case 'incomplete':
        if (!todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
    }
  });
}

//save the task to the local storage
function saveLocalTodos(todo) {
  let todos = getItemFromLocalStorage();
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

//function to delete a task
function removeLocalTodos(todo) {
  let todos = getItemFromLocalStorage();
  const todoIndex = todo.children[0].innerText;
  todos = todos.filter((item) => item.task !== todoIndex);
  localStorage.setItem('todos', JSON.stringify(todos));
}

//function to toggle display
function editTodo(todo, todoDiv) {
  for (let i = 0; i < todoDiv.children.length; i++) {
    if (i == 1) {
      todoDiv.children[i].classList.remove('hide');
    } else {
      todoDiv.children[i].classList.add('hide');
    }
  }

  const editBtn = document.getElementById(`editBtn-${todo.id}`);
  editBtn.addEventListener('click', () => editTask(todo, todoDiv));
}

function editTask(todo, todoDiv) {
  let todos = getItemFromLocalStorage();
  const editInput = document.getElementById(`edit-${todo.id}`).value;

  if (editInput === '') {
    openmodal('red', 'Fill the box');
    return;
  }

  todos.forEach((t) => {
    if (t.id == todo.id) {
      t.task = editInput;
    }
  });

  localStorage.setItem('todos', JSON.stringify(todos));
  todoDiv.children[0].innerText = editInput;
}

function isDuplicate() {
  let todos = getItemFromLocalStorage();
  let tasks = [];

  for (var i = 0; i < todos.length; i++) {
    tasks.push(todos[i].task);
  }

  return tasks.includes(todoInput.value);
}

function getTodos() {
  let todos = getItemFromLocalStorage();

  todos.forEach(function(todo) {
    createTodo(todo);
    if (todo.status == 'completed') {
      todoList.lastChild.classList.add('completed');
    }
  });
}

// for live date, time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  document.getElementById('d1').innerHTML = now.toLocaleString('en-IN', options);
}

setInterval(updateDateTime, 1000);
updateDateTime();

function deleteAll() {
  [...document.getElementsByClassName('todo')].map((n) => n && n.remove());
  localStorage.removeItem('todos');
  document.getElementById('confirmation_box').classList.add('hide');
}

function openmodal(color, message) {
  document.getElementById('content').classList.add(color);
  document.getElementById('modal-text').innerText = message;
  document.getElementById('Modal').classList.add('true');
}

function closemodal() {
  document.getElementById('Modal').classList.remove('true');
}

function goback() {
  document.getElementById('confirmation_box').classList.add('hide');
}
