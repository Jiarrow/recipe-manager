// const taskInput = document.querySelector(".task-input input"),
//     filters = document.querySelectorAll(".filters span"),
//     clearAll = document.querySelector(".clear-btn"),
//     taskBox = document.querySelector(".task-box");


// const APIKey = '64261b5e6cc445b09f8648d41dfb925c';

// // fetch(`https://api.spoonacular.com/recipes/716429/information?apiKey=${APIKey}&includeNutrition=true`);



// let editId,
//     isEditTask = false,
//     todos = JSON.parse(localStorage.getItem("todo-list"));

// filters.forEach(btn => {
//     btn.addEventListener("click", () => {
//         document.querySelector("span.active").classList.remove("active");
//         btn.classList.add("active");
//         showTodo(btn.id);
//     });
// });

// function showTodo(filter) {
//     let liTag = "";
//     if (todos) {
//         todos.forEach((todo, id) => {
//             let BuyList = todo.status == "BuyList" ? "checked" : "";
//             if (filter == todo.status || filter == "recipe") {
//                 liTag += `<li class="task">
//                     <label for="${id}">
//                         <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${BuyList}>
//                         <p class="${BuyList}">${todo.name}</p>
//                     </label>
//                     <div class="settings">
//                         <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
//                         <ul class="task-menu">
//                             <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
//                             <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
//                         </ul>
//                     </div>
//                 </li>`;
//             }
//         });
//     }

//     taskBox.innerHTML = liTag || `<img src="https://spoonacular.com/recipeImages/716429-556x370.jpg" style="width: 50%; height: 50%;">`;
//     let checkTask = taskBox.querySelectorAll(".task");
//     !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
//     taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");

// }
// showTodo("Recipe");

// //i have added a task before tutorial so that shows here for test
// // if you don't have any tasks no problem it isn't bug

// function showMenu(selectedTask) {
//     let menuDiv = selectedTask.parentElement.lastElementChild;
//     menuDiv.classList.add("show");
//     document.addEventListener("click", e => {
//         if (e.target.tagName != "I" || e.target != selectedTask) {
//             menuDiv.classList.remove("show");
//         }
//     });
// }

// function updateStatus(selectedTask) {
//     let taskName = selectedTask.parentElement.lastElementChild;
//     if (selectedTask.checked) {
//         taskName.classList.add("checked");
//         todos[selectedTask.id].status = "BuyList";
//     } else {
//         taskName.classList.remove("checked");
//         todos[selectedTask.id].status = "Saved";
//     }
//     localStorage.setItem("todo-list", JSON.stringify(todos))
// }

// function editTask(taskId, textName) {
//     editId = taskId;
//     isEditTask = true;
//     taskInput.value = textName;
//     taskInput.focus();
//     taskInput.classList.add("active");
// }

// function deleteTask(deleteId, filter) {
//     isEditTask = false;
//     todos.splice(deleteId, 1);
//     localStorage.setItem("todo-list", JSON.stringify(todos));
//     showTodo(filter);
// }

// clearAll.addEventListener("click", () => {
//     isEditTask = false;
//     todos.splice(0, todos.length);
//     localStorage.setItem("todo-list", JSON.stringify(todos));
//     showTodo();
// });

// taskInput.addEventListener("keyup", e => {
//     let userTask = taskInput.value.trim();
//     if (e.key == "Enter" && userTask) {
//         if (!isEditTask) {
//             todos = !todos ? [] : todos;
//             let taskInfo = { name: userTask, status: "Saved" };
//             todos.push(taskInfo);
//         } else {
//             isEditTask = false;
//             todos[editId].name = userTask;
//         }
//         taskInput.value = "";
//         localStorage.setItem("todo-list", JSON.stringify(todos));
//         showTodo(document.querySelector("span.active").id);
//     }
// });

// ------------------------------------

const taskInput = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box');
const APIKey = 'c1aeb73bdc6b46b1a099acfc9ecaba78';
const clearBtn = document.getElementById('clearBtn');


function addTask(title, imageUrl) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<p class="recipe-title" >${title}</p>
      <img class="recipe-image" src="${imageUrl}" alt="Recipe Image">
      <i class="uil uil-plus"></i>`;
      
  
    taskBox.appendChild(listItem);
      // 在每個 <li> 元素後插入 <hr> <br>元素
    const horizontalLine0 = document.createElement('br');
    const horizontalLine1 = document.createElement('hr');
    const horizontalLine2= document.createElement('br');
    taskBox.appendChild(horizontalLine0);
    taskBox.appendChild(horizontalLine1);
    taskBox.appendChild(horizontalLine2);
    taskBox.scrollTop = taskBox.scrollHeight;

  }
  
// 打開新視窗，載入指定食譜的詳細內容
function openRecipeWindow(recipeId) {
    // const recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${APIKey}&includeNutrition=true`;
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${APIKey}&includeNutrition=true`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            data.nutrition.ingredients.forEach(ingredient => {
                console.log(ingredient.name);
            })
            console.log();
            // console.log(data.nutrition.ingredients);
        })
    // window.open(recipeUrl, '_blank');
}

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        taskBox.innerHTML = '';
        const taskText = taskInput.value;
        if (taskText === '') {
            return;
        }

        fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${taskText}&apiKey=${APIKey}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                data.results.forEach(recipe => {
                    addTask(recipe.title, recipe.image);
                    openRecipeWindow(recipe.id);
                });
                // console.log(data);
            })
        // 呼叫 API 取得食譜圖片的 URL
        // fetch(`https://api.spoonacular.com/recipes/716429/information?apiKey=${APIKey}&includeNutrition=true`)
        //     .then(response => response.json())
        //     .then(data => {
        //         const title = data.title;
        //         const imageUrl = data.image; // 假設 API 回傳的資料有圖片的 URL
        //         addTask(title, imageUrl);
        //         console.log(data);
        //     })
        //     .catch(error => console.error(error));

        taskInput.value = '';
    }
});

taskBox.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('uil-trash-alt')) {
        const listItem = target.parentElement;
        listItem.remove();
    }
});

clearBtn.addEventListener('click', () => {
    taskBox.innerHTML = '';
});