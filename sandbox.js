// const button = document.querySelector("#submit");
// const todoList = document.querySelector("#todo-list");
// const todoNr = document.querySelector(".todo-nr b");
// const mainTitle = document.querySelector(".main-title");
// const items = todoList.children;
// todoNr.innerHTML = items.length;

// // button.addEventListener("click", (event) => {
// //   const newItem = document.createElement("li");
// //   newItem.classList.add("item");
// //   newItem.innerHTML = `item ${items.length + 1}`;
// //   todoList.appendChild(newItem);
// //   todoNr.innerHTML = items.length;
// // });

// let test = "unused";

// button.addEventListener("click", (event) => {
//   const newItem = document.createElement("li");
//   newItem.classList.add("item");
//   newItem.innerHTML = `item ${items.length + 1}`;
//   newItem.addEventListener("click", deleteItem);
//   todoList.appendChild(newItem);
//   todoNr.innerHTML = items.length;
// });

// for (let item of items) {
//   item.addEventListener("click", deleteItem);
// }

// function deleteItem(e) {
//   e.stopPropagation();
//   e.target.remove();
// }
const todoList = ["Get milk", "Get eggs", "Get bread", "Get cheese"];
function name(params) {
    
}
localStorage.setItem("todo", JSON.stringify(todoList));
let retrieve = JSON.parse(localStorage.getItem("todo"));
console.log(retrieve);
