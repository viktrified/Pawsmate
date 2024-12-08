// Select elements safely
let maggiBtn = document.querySelector("button");
let newMatches = document.querySelector("#newMatches");

// Function to update the display with the current count
function updateDisplay() {
  let count = JSON.parse(localStorage.getItem("num")) || 0;
  if (newMatches) {
    newMatches.textContent = count;
    console.log("Updated newMatches textContent to:", count);
  }
}

// Call updateDisplay when page loads
updateDisplay();

// Increment count and update localStorage on button click (for page1.html)
if (maggiBtn) {
  maggiBtn.addEventListener("click", () => {
    let count = JSON.parse(localStorage.getItem("num")) || 0;
    count++;
    localStorage.setItem("num", JSON.stringify(count));
    console.log("Updated count in localStorage:", count);
  });
}

// Listen for changes in localStorage (this will trigger on other pages or tabs)
window.addEventListener("storage", () => {
  updateDisplay(); // Re-run the update display function when localStorage changes
});




const like = () => {
  const dog = dogs[currentIndex];

  // Create a new div element to display the liked dog
  let likeDiv = document.createElement("div");
  likeDiv.className = "liked-dog";
  likeDiv.innerHTML = `
    <img src="${dog.image}" alt="${dog.name}" style="width: 50px; height: 50px;">
    <p>${dog.name}</p>
  `;
  newMatches.appendChild(likeDiv);

  // Add the dog to the likesArray
  likesArray.push({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex,
  });

  // Store the updated likesArray in localStorage
  localStorage.setItem("likesArray", JSON.stringify(likesArray));

  addActionToHistory("like", currentIndex);
  slideOut("like");
  next();
};

// Event listener for the like button
if (likeBtn) {
  likeBtn.addEventListener("click", like);
}

// Function to update the display of liked dogs from likesArray
function updateLikesDisplay() {
  newMatches.innerHTML = ""; // Clear the current display

  likesArray.forEach((dog) => {
    let likeDiv = document.createElement("div");
    likeDiv.className = "liked-dog";
    likeDiv.innerHTML = `
      <img src="${dog.image}" alt="${dog.name}" style="width: 50px; height: 50px;">
      <p>${dog.name}</p>
    `;
    newMatches.appendChild(likeDiv);
  });
}

// Initial display of liked dogs from likesArray
updateLikesDisplay();

// Listen for changes to likesArray in localStorage
window.addEventListener("storage", () => {
  // Reload the likesArray from localStorage when it changes
  likesArray = JSON.parse(localStorage.getItem("likesArray")) || [];
  updateLikesDisplay();
});
