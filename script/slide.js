let newMatches = document.querySelector("#newMatches");
let swiper = document.querySelector("#swiper");
let likeBtn = document.querySelector("#like");
let dislikeBtn = document.querySelector("#dislike");
let undoBtn = document.querySelector("#undo");

let likesArray = JSON.parse(localStorage.getItem("likesArray")) || [];
let actionHistory = [];
const max_undo = 3;

// Load user preferences from localStorage or set defaults
let userGender = localStorage.getItem("userGender") || "male";
let selectedBreeds = JSON.parse(localStorage.getItem("selectedBreeds")) || [];
let selectedAgeRange = localStorage.getItem("selectedAgeRange") || "";

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

const slideOut = (direction) => {
  const cards = document.querySelectorAll(".card");
  const currentCard = cards[currentIndex];
  const nextCard = cards[(currentIndex + 1) % cards.length];

  // Prepare next card for visibility
  nextCard.style.display = "block";
  nextCard.style.zIndex = "1";
  nextCard.style.opacity = "1";

  // Animate the current card out
  currentCard.style.transform =
    direction === "like" ? "translateX(100%)" : "translateX(-100%)";
  currentCard.style.transition = "transform 0.5s ease";

  // Reset styles after animation
  setTimeout(() => {
    currentCard.style.display = "none";
    currentCard.style.transform = "translateX(0)";
    currentCard.style.opacity = "1";
    currentCard.style.zIndex = "1";
    nextCard.style.zIndex = "2";

    // Update current index
    currentIndex = (currentIndex + 1) % cards.length;
  }, 500);
};


    const filterDogs = () => {
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

    const renderDogs = () => {
      const filteredDogs = filterDogs();
      swiper.innerHTML = "";

      filteredDogs.forEach((dog, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.display = index === 0 ? "block" : "none";
        card.style.zIndex = index === 0 ? "2" : "1";
        card.innerHTML = `
          <div class="dog_profile content" style="background: url(${dog.image}) center/cover no-repeat;">
            <div class="topOne">
              <div class="giveSpace">
                <span id="dogName">${dog.name}</span>
                <span id="dogAge">${dog.age} Years</span>
              </div>
              <div class="giveSpace">
                <span id="dogSex">${dog.sex}</span>
                <span id="breed">${dog.breed}</span>
              </div>
              <div id="location" class="giveSpace">Location: Jos</div>
              <div class="lifestyle giveSpace">
                <ul>
                  <li>Playful</li>
                  <li>Energetic</li>
                  <li>Outdoor</li>
                  <li>Pure-Breed</li>
                </ul>
              </div>
            </div>
          </div>`;
        swiper.appendChild(card);
      });

      currentIndex = 0;
    };

    const like = () => {
      const dog = dogs[currentIndex];
      likesArray.push({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        sex: dog.sex,
        image: dog.image,
      });
      localStorage.setItem("likesArray", JSON.stringify(likesArray));
      addActionToHistory("like", currentIndex);
      slideOut("like");
    };

    const dislike = () => {
      addActionToHistory("dislike", currentIndex);
      slideOut("dislike");
    };

    const undo = () => {
      if (actionHistory.length > 0) {
        const lastAction = actionHistory.pop();
        const cards = document.querySelectorAll(".card");
        currentIndex = lastAction.index;

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
          likesArray.pop();
          localStorage.setItem("likesArray", JSON.stringify(likesArray));
        }
      } else {
        console.log("No actions to undo");
      }
    };

    const addActionToHistory = (type, index) => {
      actionHistory.push({ type, index });
      if (actionHistory.length > max_undo) {
        actionHistory.shift();
      }
    };

    if (likeBtn) likeBtn.addEventListener("click", like);
    if (dislikeBtn) dislikeBtn.addEventListener("click", dislike);
    if (undoBtn) undoBtn.addEventListener("click", undo);

    renderDogs();
  })
  .catch((error) => console.error("Error loading JSON:", error));
