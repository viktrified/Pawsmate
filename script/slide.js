let newMatches = document.querySelector("#newMatches");
let swiper = document.querySelector("#swiper");
let likeBtn = document.querySelector("#like");
let dislikeBtn = document.querySelector("#dislike");
let undoBtn = document.querySelector("#undo");

let likesArray = JSON.parse(localStorage.getItem("likesArray")) || [];
let actionHistory = [];
const max_undo = 3;

// Load user preferences from localStorage or set defaults
let userGender = localStorage.getItem("userGender") || "male"; // Default to "male"
let selectedBreeds = JSON.parse(localStorage.getItem("selectedBreeds")) || []; // Default to an empty array
let selectedAgeRange = localStorage.getItem("selectedAgeRange") || ""; // Default to no age range

const savePreferencesToLocalStorage = () => {
  localStorage.setItem("userGender", userGender);
  localStorage.setItem("selectedBreeds", JSON.stringify(selectedBreeds));
  localStorage.setItem("selectedAgeRange", selectedAgeRange);
};

fetch("../users.json")
  .then((response) => response.json())
  .then((data) => {
    let dogs = data.dogs;
    let currentIndex = 0;

    // Function to filter dogs based on preferences
    const filterDogs = () => {
      // Retrieve preferences from localStorage
      const selectedBreeds =
        JSON.parse(localStorage.getItem("selectedBreeds")) || [];
      const selectedAgeRange = localStorage.getItem("selectedAgeRange") || "";

      return dogs.filter((dog) => {
        const genderMatch = dog.sex !== userGender;

        const breedMatch =
          selectedBreeds.length === 0 || selectedBreeds.includes(dog.breed);

        let ageMatch = true;
        if (selectedAgeRange === "sixToTwo") {
          ageMatch = dog.age >= 1 && dog.age <= 2;
        } else if (selectedAgeRange === "twoToSeven") {
          ageMatch = dog.age > 2 && dog.age <= 7;
        } else if (selectedAgeRange === "sevenPlus") {
          ageMatch = dog.age > 7;
        }

        return genderMatch && breedMatch && ageMatch;
      });
    };

    // Function to render filtered dogs
    const renderDogs = () => {
      const filteredDogs = filterDogs();
      swiper.innerHTML = ""; // Clear existing cards

      filteredDogs.forEach((dog, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.display = index === 0 ? "block" : "none"; // Show only the first card initially
        card.style.zIndex = index === 0 ? "2" : "1"; // Ensure correct stacking order
        card.innerHTML = `
  <div class="dog_profile" style="  background-image: url(${dog.image});">
        <span id="dogName">${dog.name}</span>
        <span id="dogAge">${dog.age} Years</span>
        <div id="dogSex">${dog.gender}</div>
        <div id="breed">${dog.breed}</div>
        <div id="location">Jos</div>

        <div class="lifestyle">
          <ul>
            <li>Playful</li>
            <li>Energetic</li>
            <li>Outdoor</li>
            <li>Pure-Breed</li>
          </ul>
        </div>

        <div class="images">
          <i id="undo" class="fa-solid fa-arrow-rotate-left"></i>
          <i id="dislike" class="fa-solid fa-circle-xmark"></i>
          <i id="like" class="fa-regular fa-heart"></i>
          <i id="dm" class="fa-solid fa-paper-plane"></i>
        </div>
      </div>
        `;
        swiper.appendChild(card);
      });

      // Reset current index to 0 to start with the first card
      currentIndex = 0;
    };

    // Save preferences and re-render whenever preferences change
    const updatePreferences = (gender, breeds, ageRange) => {
      userGender = gender;
      selectedBreeds = breeds;
      selectedAgeRange = ageRange;

      savePreferencesToLocalStorage();
      renderDogs(); // Re-render the cards with updated preferences
    };

    // Like Function
    const like = () => {
      const dog = dogs[currentIndex];

      // Add to likesArray and save to localStorage
      likesArray.push({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        sex: dog.sex,
        image: dog.image,
      });
      localStorage.setItem("likesArray", JSON.stringify(likesArray));

      // Log the action in history
      addActionToHistory("like", currentIndex);

      // Move to the next card
      moveToNextCard();
    };

    // Dislike Function
    const dislike = () => {
      // Log the action in history
      addActionToHistory("dislike", currentIndex);

      // Move to the next card
      moveToNextCard();
    };

    // Move to Next Card
    const moveToNextCard = () => {
      const cards = document.querySelectorAll(".card");

      setTimeout(() => {
        cards[currentIndex].style.display = "none";
        currentIndex = (currentIndex + 1) % cards.length; // Loop through cards
        cards[currentIndex].style.display = "block";
      }, 0);
    };

    // Undo Function
    const undo = () => {
      if (actionHistory.length > 0) {
        const lastAction = actionHistory.pop();
        const cards = document.querySelectorAll(".card");

        // Restore the card that was acted upon
        currentIndex = lastAction.index;

        // Update card visibility
        cards.forEach((card, idx) => {
          if (idx === currentIndex) {
            card.style.display = "block";
            card.style.zIndex = "2";
          } else {
            card.style.display = "none";
            card.style.zIndex = "1";
          }
        });

        if (lastAction.type === "like") {
          // Undo the 'like' action
          likesArray.pop(); // Remove the last liked dog
          localStorage.setItem("likesArray", JSON.stringify(likesArray)); // Update localStorage
        }
      } else {
        console.log("No actions to undo");
      }
    };

    // Add Action to History
    const addActionToHistory = (type, index) => {
      actionHistory.push({ type, index });
      if (actionHistory.length > max_undo) {
        actionHistory.shift(); // Maintain max_undo limit
      }
    };

    // Event Listeners
    if (likeBtn) likeBtn.addEventListener("click", like);
    if (dislikeBtn) dislikeBtn.addEventListener("click", dislike);
    if (undoBtn) undoBtn.addEventListener("click", undo);

    // Initial Render
    renderDogs();
  })
  .catch((error) => console.error("Error loading JSON:", error));
