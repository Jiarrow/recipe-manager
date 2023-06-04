const recipeInput = document.querySelector(".recipe-input input");
const recipeBox = document.querySelector(".recipe-box");
// const APIKey = "c1aeb73bdc6b46b1a099acfc9ecaba78"; // ncufood
// const APIKey = "01f045ce89984e94b2947c5adab48ce5"; // ncufood2
// const APIKey = "ffd949fd26bb48cb81fd04bec35c3e43"; // jia 1
const APIKey = '72790c6a97ae465385b0d0ae0a5aa48a'; // jia 2

const clearBtn = document.getElementById("clearBtn");

// 獲取模態窗口元素
const modal = document.getElementById("myModal");
const titleInModal = modal.querySelector(".modal-content h2");
const imgInModal = modal.querySelector(".modal-content img");
const ingredientsInModal = modal.querySelector(".modal-content ul");
const stepNumInModal = document.querySelector(".step-heading");
const instructionsInModal = modal.querySelector(".modal-content div ol");

// 獲取關閉按鈕元素，並為其添加點擊事件監聽器
const span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  // 當關閉按鈕被點擊時，隱藏模態窗口
  modal.style.display = "none";
};

// all buttons defined here
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const recipeButton = document.getElementById("recipe");
const savedButton = document.getElementById("Saved");
const buylistButton = document.getElementById("BuyList");

// instruction step in modal
let currentStepIndex = 0;
let currentInstruction;

// recipe results by searching
let recipeNumber;
let recipesID;
let recipesIngredient;
let recipesImageURL;
let recipesTitle;
let recipesInstructions;

// Saved recipe
let savedRecipeTitles =
  JSON.parse(localStorage.getItem("recipe-title")) === null
    ? []
    : JSON.parse(localStorage.getItem("recipe-title"));
let savedRecipeImages =
  JSON.parse(localStorage.getItem("recipe-image")) === null
    ? []
    : JSON.parse(localStorage.getItem("recipe-image"));
let savedRecipeIngredients = [];

// buylist
let buylist =
  JSON.parse(localStorage.getItem("buylist")) === null
    ? []
    : JSON.parse(localStorage.getItem("buylist"));

function recipesInit() {
  recipeNumber = 0;
  recipesID = [];
  recipesImageURL = [];
  recipesTitle = [];
  recipesIngredient = null;
  recipesInstructions = null;
}

function savedRecipeInit() {
  if (savedRecipeTitles === null) {
    console.log("no saved recipe title");
    savedRecipeTitles = [];
  }
  if (savedRecipeImages === null) {
    console.log("no saved recipe image");
    savedRecipeImages = [];
  }
}

function findIndexOfRecipe(title) {
  for (let i = 0; i < recipesTitle.length; i++) {
    if (recipesTitle[i] === title) {
      // console.log(recipesTitle[i] + ' ' + title);
      return i;
    }
  }
  return -1;
}

function findIndexOfSavedRecipe(title) {
  for (let i = 0; i < savedRecipeTitles.length; i++) {
    if (savedRecipeTitles[i] === title)
      return i;
  }
  return -1;
}

function setEventForRecipe(recipe) {
  const title = recipe.querySelector(".recipe-title");

  title.addEventListener("click", function () {
    // console.log(recipe);

    // set title in modal
    titleInModal.textContent = title.textContent;
    // set image in modal
    imgInModal.src = recipe.querySelector(".recipe-image").src;
    // set ingredients in modal
    ingredientsInModal.innerHTML = "";
    let index = findIndexOfRecipe(title.textContent);
    let ingredients = recipesIngredient[index];
    for (let i = 0; i < ingredients.length; i++) {
      let ingredient = document.createElement("li");
      ingredient.innerHTML = `${ingredients[i].name} ${ingredients[i].amount.us.value} ${ingredients[i].amount.us.unit}`;
      ingredientsInModal.appendChild(ingredient);
    }

    // set instructions in modal
    // console.log(recipesInstructions[index]);

    currentStepIndex = 0;
    currentInstruction = recipesInstructions[index];
    stepNumInModal.textContent = "Step" + " " + (currentStepIndex + 1);
    instructionsInModal.innerHTML = currentInstruction[currentStepIndex];

    modal.style.display = "block";
  });
}

// set prevButton and nextButton eventListener
prevButton.addEventListener("click", function () {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    stepNumInModal.textContent = "Step" + " " + (currentStepIndex + 1);
    instructionsInModal.innerHTML = currentInstruction[currentStepIndex];
    // console.log(currentStepIndex);
  }
});

nextButton.addEventListener("click", function () {
  if (currentStepIndex < currentInstruction.length - 1) {
    currentStepIndex++;
    stepNumInModal.textContent = "Step" + " " + (currentStepIndex + 1);
    instructionsInModal.innerHTML = currentInstruction[currentStepIndex];
    // console.log(currentStepIndex);
  }
});

function setEventForPlusIcon(recipe) {
  const plusIcon = recipe.querySelector(".uil-plus");

  plusIcon.addEventListener("click", function () {
    console.log("You clicked the plus icon!");
    // 執行其他操作...
    savedRecipeTitles.push(recipe.querySelector(".recipe-title").textContent);
    console.log(recipe.querySelector(".recipe-title").textContent);
    console.log(savedRecipeTitles);
    savedRecipeImages.push(recipe.querySelector(".recipe-image").src);
    let index = findIndexOfRecipe(
      recipe.querySelector(".recipe-title").textContent
    );
    savedRecipeIngredients.push(recipesIngredient[index]);
    for (let i = 0; i < recipesIngredient[index].length; i++) {
      let ingredient = recipesIngredient[index][i];
      let existed = false;
      for (let j = 0; buylist !== null && j < buylist.length; j++) {
        if (ingredient.name === buylist[j][0]) {
          buylist[j][1] += ingredient.amount.metric.value;
          existed = true;
          break;
        }
      }
      if (!existed) {
        buylist.push([
          ingredient.name,
          ingredient.amount.metric.value,
          ingredient.amount.metric.unit,
        ]);
      }
    }
    localStorage.setItem("recipe-title", JSON.stringify(savedRecipeTitles));
    localStorage.setItem("recipe-image", JSON.stringify(savedRecipeImages));
    localStorage.setItem("buylist", JSON.stringify(buylist));
    // console.log(savedRecipeTitles);
    // console.log(savedRecipeImages);
  });
}

function setEventForTrashIcon(recipe) {
  const trashIcon = recipe.querySelector(".uil-trash");
  trashIcon.addEventListener("click", function () {
    console.log("You clicked the trash icon!");
    let index = findIndexOfSavedRecipe(
      recipe.querySelector(".recipe-title").textContent
    );
    // delete saved recipe title
    savedRecipeTitles = savedRecipeTitles.filter(
      (title) => title !== recipe.querySelector(".recipe-title").textContent
    );
    localStorage.setItem("recipe-title", JSON.stringify(savedRecipeTitles));
    
    // delete saved recipe image
    savedRecipeImages = savedRecipeImages.filter(
      (image) => image !== recipe.querySelector(".recipe-image").src
    );
    localStorage.setItem("recipe-image", JSON.stringify(savedRecipeImages));
    
    // delete saved recipe ingredients
    
    console.log(index);
    for (let i = index; savedRecipeIngredients != null && i < savedRecipeIngredients[index].length; i++) {
      const ingr = savedRecipeIngredients[index][i];
      for (let j = 0; buylist !== null && j < buylist.length; j++) {
        if (ingr.name === buylist[j][0]) {
          buylist[j][1] -= ingr.amount.metric.value;
          if (buylist[j][1] <= 0) {
            buylist.splice(j, 1);
            localStorage.setItem("buylist", JSON.stringify(buylist));
          }
          break;
        }
      }
    }
    savedRecipeIngredients.splice(index, 1);
    refresh();
  });
}

function refresh() {
  if (savedRecipeTitles === null) {
    return;
  }
  recipeBox.innerHTML = "";
  for (let i = 0; i < savedRecipeTitles.length; i++) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<p class="recipe-title" >${savedRecipeTitles[i]}</p>
      <img class="recipe-image" src="${savedRecipeImages[i]}" alt="Recipe Image">
      <i class="uil uil-trash trash-icon"></i>`;
    setEventForRecipe(listItem);
    setEventForTrashIcon(listItem);
    recipeBox.appendChild(listItem);
    recipeBox.appendChild(document.createElement("br"));
    recipeBox.appendChild(document.createElement("hr"));
    recipeBox.appendChild(document.createElement("br"));
    recipeBox.scrollTop = recipeBox.scrollHeight;
  }
}

async function fetchRecipeIngredients() {
  const ingredientPromises = recipesID.map((rID) => {
    return fetch(
      `https://api.spoonacular.com/recipes/${rID}/ingredientWidget.json?apiKey=${APIKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process and store ingredient data
        const ingredients = data.ingredients;
        return ingredients;
      });
  });

  const ingredientDataArray = await Promise.all(ingredientPromises);
  // console.log(ingredientDataArray);
  recipesIngredient = ingredientDataArray;
  // Store ingredient data in separate one-dimensional array if needed
}

async function fetchRecipeInstructions() {
  const instructionPromises = recipesID.map((rID) => {
    return fetch(
      `https://api.spoonacular.com/recipes/${rID}/analyzedInstructions?apiKey=${APIKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process and store instruction data
        const instructions = data[0].steps.map((step) => step.step);
        return instructions;
      });
  });

  const instructionDataArray = await Promise.all(instructionPromises);
  // console.log(instructionDataArray);
  recipesInstructions = instructionDataArray;
  // Store instruction data in separate one-dimensional array if needed
}

recipeInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    recipesInit();
    recipeBox.innerHTML = "";
    const inputText = recipeInput.value;
    if (inputText === "") {
      return;
    }

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${inputText}&apiKey=${APIKey}`
      );
      const data = await response.json();

      data.results.forEach((recipe) => {
        recipesID.push(recipe.id);
        recipesTitle.push(recipe.title);
        recipesImageURL.push(recipe.image);
      });

      // console.log(recipesID);
      // console.log(recipesTitle);
      // console.log(recipesImageURL);

      // Call other functions here
      await fetchRecipeIngredients();
      await fetchRecipeInstructions();

      renderRecipeItems();
    } catch (error) {
      console.log(error);
    }

    recipeInput.value = "";
  }
});

recipeBox.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("uil-trash-alt")) {
    const listItem = target.parentElement;
    listItem.remove();
  }
});

clearBtn.addEventListener("click", () => {
  recipeBox.innerHTML = "";
  localStorage.removeItem("buylist");
});

function createRecipeListItem(title, imageUrl) {
  const listItem = document.createElement("li");
  recipeNumber += 1;
  listItem.id = "recipe" + recipeNumber;
  listItem.classList.add("recipe-item");
  listItem.innerHTML = `<p class="recipe-title">${title}</p>
      <img class="recipe-image" src="${imageUrl}" alt="Recipe Image">
      <i class="uil uil-plus saved-icon"></i>`;

  setEventForRecipe(listItem);
  setEventForPlusIcon(listItem);

  return listItem;
}

function renderRecipeItems() {
  recipeBox.innerHTML = "";
  if (recipesTitle == null) return;
  for (let i = 0; i < recipesTitle.length; i++) {
    const listItem = createRecipeListItem(recipesTitle[i], recipesImageURL[i]);
    recipeBox.appendChild(listItem);
    // 在每個 <li> 元素後插入 <hr> <br>元素
    const horizontalLine0 = document.createElement("br");
    const horizontalLine1 = document.createElement("hr");
    const horizontalLine2 = document.createElement("br");
    recipeBox.appendChild(horizontalLine0);
    recipeBox.appendChild(horizontalLine1);
    recipeBox.appendChild(horizontalLine2);
  }
  recipeBox.scrollTop = recipeBox.scrollHeight;
}

recipeButton.addEventListener("click", () => {
  updateStatus(recipeButton);
  renderRecipeItems();
});

savedButton.addEventListener("click", function () {
  updateStatus(savedButton);
  // 清空 recipe-box 的內容
  recipeBox.innerHTML = "";

  // 根據儲存的食譜清單重新生成內容
  if (savedRecipeTitles == null) return;
  for (let i = 0; i < savedRecipeTitles.length; i++) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<p class="recipe-title" >${savedRecipeTitles[i]}</p>
      <img class="recipe-image" src="${savedRecipeImages[i]}" alt="Recipe Image">
      <i class="uil uil-trash trash-icon"></i>`;
    setEventForRecipe(listItem);
    setEventForTrashIcon(listItem);
    recipeBox.appendChild(listItem);
    recipeBox.appendChild(document.createElement("br"));
    recipeBox.appendChild(document.createElement("hr"));
    recipeBox.appendChild(document.createElement("br"));
    recipeBox.scrollTop = recipeBox.scrollHeight;
  }
});

buylistButton.addEventListener("click", function () {
  updateStatus(buylistButton);
  recipeBox.innerHTML = "";
  if (buylist === null) return;
  for (let i = 0; i < buylist.length; i++) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="ingredient-name">${buylist[i][0]}</span>
    <span class="ingredient-quantity">${buylist[i][1] + buylist[i][2]}</span>`;

    recipeBox.appendChild(listItem);
    recipeBox.appendChild(document.createElement("br"));
    recipeBox.appendChild(document.createElement("hr"));
    recipeBox.appendChild(document.createElement("br"));
    recipeBox.scrollTop = recipeBox.scrollHeight;
  }
});

function updateStatus(btn) {
  document.querySelector("span.active").classList.remove("active");
  btn.classList.add("active");
}
