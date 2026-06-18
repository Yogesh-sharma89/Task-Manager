//toggel logic

const toggleBtn = document.querySelector("#theme-toggle");
const toggleThumb = document.querySelector(".toggle-thumb");

// add task selectors
const addTaskInput = document.querySelector(".add-task-input");
const taskCategory = document.querySelector("#task-category-select");
const addTaskbtn = document.querySelector(".add-task-btn");
const headerAddTaskBtn = document.querySelector(".header-add-task-btn");
const addTaskForm = document.querySelector("#add-task-form");
const taskGrid = document.querySelector(".task-grid");
const taskTime = document.querySelector(".task-time-display");
const clearAllbtn = document.querySelector("#clear-all-btn");

//search input 
const searchInput = document.querySelector("#search-task-input");

//category filter 
const allCategory = document.querySelector(".row-2 #task-category-select");

const totalTask = document.querySelector(".total-task .stat-card-number");
const CompletedTask = document.querySelector(
  ".completed-task .stat-card-number",
);
const pendngTask = document.querySelector(".pending-task .stat-card-number");

const headerDate = document.querySelector(".header-date");

//demo elements
const consoleOutput = document.querySelector(".console-output");
const bubbleBtn = document.querySelector("#bubble");
const captureBtn = document.querySelector("#capture");
const clickMebtn = document.querySelector(".child button");



//search feature 
searchInput.addEventListener("input",(e)=>{

  const searchValue = e.target.value.trim();
  if(!searchValue){
    loadDataFromLocalStorage()
    return;
  }

  const validValue = searchValue.toLowerCase();

  const alltasks = JSON.parse(localStorage.getItem("taskflow_tasks")) || [];

  const filteredTasks = alltasks?.filter((task)=>task.title.toLowerCase().includes(validValue));

  if(!filteredTasks || filteredTasks.length===0){
    taskGrid.innerHTML = `<p>No tasks found. Create one above to get started!</p>`;
    return;
  }

  renderTasks(filteredTasks,false);
})

//filter feature 
allCategory.addEventListener("change",(e)=>{

  const selectedValue = e.target.value.trim();
  if(!selectedValue){
    return;
  }

  //get data from local storage 
  const allTasks = JSON.parse(localStorage.getItem("taskflow_tasks")) || [];

  if(selectedValue==='all'){
    renderTasks(allTasks,false);
    return;
  }

  let filteredTasks;

 filteredTasks = allTasks?.filter((task)=>{
  if(selectedValue==="Completed" || selectedValue==='Pending'){
     return task.status===selectedValue.toLowerCase();
  }else{
    return task.category===selectedValue;
  }

 })

  if(!filteredTasks){
    showErrorToast("No such task exist").showToast();
    return;
  }

  renderTasks(filteredTasks,false);
})


clickMebtn.addEventListener("click", () => {
  Toastify({
    text: "ℹ️ Choose 'Bubbling' or 'Capturing' using the UI buttons below to see how the event travels!",
    duration: 4000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#1e293b",
      color: "#f8fafc",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontFamily: "sans-serif",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
      borderLeft: "5px solid #3b82f6",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
  }).showToast();
});

function updateConsole(line1,line2,line3){
   
  //empty old content 
  consoleOutput.innerHTML = "";

  const logTexts = [line1,line2,line3];
  
  logTexts.forEach((text)=>{
    const para = document.createElement("p");
    para.textContent = text;

    para.classList.add("console-log-line")

    consoleOutput.appendChild(para)
  })

}

bubbleBtn.addEventListener("click",(e)=>{
 updateConsole("▼ Child", "▼ Parent", "▼ Grandparent");
})

captureBtn.addEventListener("click",(e)=>{
  updateConsole("▲ Grandparent", "▲ Parent", "▲ Child");
})

//disable and enable clear button

//update date header
function updateHeaderDate() {
  const now = new Date();

  const longDate = now
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toUpperCase();

  if (headerDate) {
    headerDate.textContent = longDate;
  }
}
//when dom content load run this and update date
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderDate();

  setInterval(() => {
    updateTaskCounters();
  }, 60000);
});

clearAllbtn.addEventListener("click", (e) => {
  const storedData = localStorage.getItem("taskflow_tasks");
  if (!storedData) {
    showErrorToast("No task available").showToast();
    return;
  }

  const taskArray = JSON.parse(storedData);
  if (!taskArray || taskArray.length === 0) {
    showErrorToast("No task available").showToast();
    return;
  }

  const areYouSure = confirm("Are you sure want to clear all task");

  if (!areYouSure) return;
  //clear all todos

  taskGrid.innerHTML = "";

  localStorage.removeItem("taskflow_tasks");

  updateTaskCounters();

  loadDataFromLocalStorage();
});

//intialize data theme if body has not
if (!document.body.hasAttribute("data-theme")) {
  //intialize data theme
  document.body.setAttribute("data-theme", "light");
  toggleThumb.innerHTML = '<i class="ri-sun-line"></i>';
}

//it means body has attribute or has set to light mode
toggleBtn.addEventListener("click", (e) => {
  if (!toggleBtn) return;

  const currentTheme = document.body.dataset.theme;

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.body.setAttribute("data-theme", newTheme);

  //now change thumb icon
  toggleThumb.innerHTML =
    newTheme === "dark"
      ? '<i class="ri-moon-line"></i>'
      : '<i class="ri-sun-line"></i>';
});

//add task functionality

//first handle top header task button
headerAddTaskBtn.addEventListener("click", (e) => {
  addTaskForm.scrollIntoView({ behavior: "smooth" });

  //focus the add task input
  addTaskInput.focus();
});

//increase count for task
function updateTaskCounters(e) {
  //get all cards
  const allTasks = taskGrid.querySelectorAll(".task-card");

  let totalTasksCount = allTasks.length;
  let completedTasksCount = 0;
  let pendingTasksCount = 0;

  allTasks?.forEach((task) => {
    const status = task.getAttribute("data-status");
    if (status === "completed") completedTasksCount++;
    else {
      pendingTasksCount++;
    }
  });

  if (totalTask) totalTask.textContent = totalTasksCount;
  if (CompletedTask) CompletedTask.textContent = completedTasksCount;
  if (pendngTask) pendngTask.textContent = pendingTasksCount;
}

//show error function
function showErrorToast(errorName) {
  return Toastify({
    text: `${errorName}`,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#fff5f5" /* Light red background */,
      color: "#c53030" /* Dark premium red text */,
      border: "1.5px solid #e53e3e" /* Solid red border */,
      borderRadius: "12px" /* Smooth modern corners */,
      padding: "12px 24px" /* Good premium padding */,
      fontWeight: "500",
      fontSize: "16px",
      textAlign: "center" /* Clean text weight */,
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.06)" /* Soft premium shadow */,
    },
  });
}

function getTaskFormattedTime(timestamp) {
  if (!timestamp || isNaN(timestamp)) return "Just now";
  const now = Date.now();
  const diff = now - timestamp;

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msperMonth = msPerDay * 30;
  const msPeryear = msperMonth * 12;

  if (diff < msPerMinute) {
    return "Just now";
  } else if (diff < msPerHour) {
    const minutes = Math.floor(diff / msPerMinute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diff < msPerDay) {
    const hour = Math.floor(diff / msPerHour);
    return `${hour} ${hour === 1 ? "hour" : "hours"} ago`;
  } else if (diff < msperMonth) {
    const days = Math.floor(diff / msPerDay);
    reutrn`${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (diff < msPeryear) {
    const months = Math.floor(diff / msperMonth);
    return `${months} ${months == 1 ? "month" : "months"} ago`;
  } else {
    const year = Math.floor(diff / msPeryear);
    return `${year} ${year === 1 ? "year" : "years"} ago`;
  }
}

// function to store new card data in localStorage

function addTasktoLocalStorage(newCardElement) {
  const savedData = localStorage.getItem("taskflow_tasks");
  const currentTasks = savedData ? JSON.parse(savedData) : [];

  //get new card data
  const newCardData = {
    id: newCardElement.getAttribute("data-id"),
    status: newCardElement.getAttribute("data-status"),
    category: newCardElement.getAttribute("data-category"),
    title: newCardElement.querySelector(".task-title").textContent.trim(),
    timestamp: newCardElement.getAttribute("data-timestamp"),
  };

  currentTasks.push(newCardData);

  //set the item
  localStorage.setItem("taskflow_tasks", JSON.stringify(currentTasks));

  loadDataFromLocalStorage();
}

//now handle add task form submission
addTaskForm.addEventListener("submit", (e) => {
  //prevent default form reload
  if (!addTaskForm) return;
  e.preventDefault();

  const taskValue = addTaskInput.value.trim();
  const selectedCategory = taskCategory.value;

  if (!taskValue) {
    showErrorToast("Invalid task").showToast();
    addTaskInput.value = "";
    addTaskInput.focus();
    return;
  }

  if (!selectedCategory || selectedCategory.value === "") {
    showErrorToast("Invalid Category").showToast();
    selectedCategory.focus();
    return;
  }

  try {
    //create secure Id
    const secureId = crypto.randomUUID();

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    //current time when task was created
    const currentTime = Date.now();

    //now set attributes
    taskCard.setAttribute("data-id", secureId);
    taskCard.setAttribute("data-status", "pending");
    taskCard.setAttribute("data-category", selectedCategory);
    taskCard.setAttribute("data-timestamp", currentTime);

    const badgeClass = `badge-${selectedCategory.toLowerCase()}`;

    //insert html into task card
    taskCard.innerHTML = `
              <div class="top">
                <h3 class="task-title">${taskValue}</h3>
                <div class="badge ${badgeClass}">${selectedCategory}</div>
              </div>
              <p class="task-time-display">${getTaskFormattedTime(currentTime)}</p>
              <div class="task-btns">
                <button class="task-btn edit-btn">Edit</button>
                <button class="task-btn done-btn">Done</button>
                <button onclick="handleTaskDelete()" class="task-btn del-btn">Delete</button>
              </div>
    `;

    const emptyMsg = taskGrid.querySelector("p");
    if (emptyMsg) {
      taskGrid.innerHTML = "";
    }

    taskGrid.appendChild(taskCard);

    updateTaskCounters(); //when new card added update counters;

    //save new task to localstorage
    addTasktoLocalStorage(taskCard);

    addTaskForm.reset();
  } catch (err) {
    console.log("Error in creating new task ", err);
    showErrorToast(err).showToast();
  }
});

//delete task from local storage function

function deleteTaskFromLocalStorage(taskId) {
  const storedData = localStorage.getItem("taskflow_tasks");
  if (!storedData) {
    return;
  }

  const taskArrays = JSON.parse(storedData);
  const updatedData = taskArrays.filter((task) => task.id !== taskId);

  localStorage.setItem("taskflow_tasks", JSON.stringify(updatedData));
}

//delete task
taskGrid.addEventListener("click", (e) => {
  const targetElem = e.target;

  //find the closest taskcard
  const taskCard = targetElem.closest(".task-card");
  if (!taskCard) return;

  if (targetElem.classList.contains("del-btn")) {
    const areYouSure = confirm("Are you want to delete the task ?");
    if (!areYouSure) return;

    //get the id of that task card so that we can updated local storage
    const taskId = taskCard.getAttribute("data-id");
    if (!taskId) {
      showErrorToast("Invalid task Id").showToast();
      return;
    }

    //remove task
    taskCard.remove();

    deleteTaskFromLocalStorage(taskId);

    updateTaskCounters();
  }
});

//update local stroage task
function updateTaskToLocalStorage(taskId, newValue) {
  const storedData = localStorage.getItem("taskflow_tasks");
  if (!storedData) {
    return;
  }

  const taskArrays = JSON.parse(storedData);
  if (taskArrays.length === 0) {
    showErrorToast("No task available").showToast();
    return;
  }

  const updatedData = taskArrays.map((task) => {
    if (task.id === taskId) {
      task.title = newValue;
    }
    return task;
  });

  localStorage.setItem("taskflow_tasks", JSON.stringify(updatedData));
}

//edit task
taskGrid.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.target.classList.contains("edit-input"));
  e.preventDefault();

  const taskCard = e.target.closest(".task-card");
  const editBtn = taskCard.querySelector(".edit-btn");

  editBtn.click();
});

//edit task
taskGrid.addEventListener("click", (e) => {
  const targetElem = e.target;

  const taskCard = targetElem.closest(".task-card");
  if (!taskCard) return;

  if (targetElem.classList.contains("edit-btn")) {
    const cardHeader = taskCard.querySelector(".top");
    if (targetElem.textContent === "Edit") {
      const cardTitle = cardHeader.querySelector(".task-title");
      const oldValue = cardTitle.textContent;
      //create an input field
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.classList.add("edit-input");
      editInput.value = oldValue;

      //now update button styles
      targetElem.textContent = "Save";
      targetElem.classList.add("editing");

      //replace
      cardTitle.replaceWith(editInput);

      editInput.focus();
    } else {
      const editInput = cardHeader.querySelector(".edit-input");
      const newValue = editInput.value.trim();

      if (!newValue) {
        showErrorToast("Invalid Update").showToast();
        editInput.focus();
        return;
      }

      // then create new h3 and replace with edit input
      const cardTitle = document.createElement("h3");
      cardTitle.textContent = newValue;
      cardTitle.classList.add("task-title");

      editInput.replaceWith(cardTitle);

      targetElem.textContent = "Edit";
      targetElem.classList.remove("editing");

      //update in local storage also
      const taskId = taskCard.getAttribute("data-id");

      updateTaskToLocalStorage(taskId, newValue);
    }
  }
});

//now every 30 seconds update the time of task card

setInterval(() => {
  const allCards = document.querySelectorAll(".task-card");

  if (allCards.length === 0) return;

  allCards.forEach((card) => {
    const rawtimestamp = card.getAttribute("data-timestamp");
    const actualTimeStamp = Number(rawtimestamp);
    const localTaskTime = card.querySelector(".task-time-display");
    if (localTaskTime && actualTimeStamp) {
      localTaskTime.textContent = getTaskFormattedTime(actualTimeStamp);
    }
  });
}, 30000);

function renderTasks(taskArray,shouldUpdateCounter = true){

   if (taskArray.length === 0) {
    taskGrid.innerHTML = `<p>No tasks found. Create one above to get started!</p>`;
    updateTaskCounters();
    return;
  }

  taskGrid.innerHTML = "";

  taskArray.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    taskCard.setAttribute("data-id", task.id);
    taskCard.setAttribute("data-status", task.status);
    taskCard.setAttribute("data-category", task.category);
    taskCard.setAttribute("data-timestamp", task.timestamp);

    const badgeClass = `badge-${task.category.toLowerCase()}`;

    if (task.status === "completed") {
      taskCard.classList.add("is-completed");
    }

    taskCard.innerHTML = `
        <div class="top">
                <h3 class="task-title">${task.title}</h3>
                <div class="badge ${badgeClass}">${task.category}</div>
              </div>
              <p class="task-time-display">${getTaskFormattedTime(task.time)}</p>
              <div class="task-btns">
                <button class="task-btn edit-btn">Edit</button>
                <button class="task-btn done-btn">Done</button>
                <button class="task-btn del-btn">Delete</button>
              </div>
    `;
    taskGrid.appendChild(taskCard);
  });

  if(shouldUpdateCounter){
    updateTaskCounters()
  }

}

function loadDataFromLocalStorage() {
  const savedData = localStorage.getItem("taskflow_tasks");

  const taskArray = savedData ?  JSON.parse(savedData) : [];

  renderTasks(taskArray)
}

loadDataFromLocalStorage();
