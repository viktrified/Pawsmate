let newMatches = document.querySelector("#newMatches");
let likeBtn = document.querySelector("#like");
let dislikeBtn = document.querySelector("#dislike");
let undoBtn = document.querySelector("#undo");

let likesArray = JSON.parse(localStorage.getItem("likesArray")) || []; // Load likesArray from localStorage

let actionHistory = [];
const max_undo = 3;

let formTag = document.querySelector("#form");
let ownerGender = null;

const urlParams = new URLSearchParams(window.location.search);
const userGender = urlParams.get("gender");
const selectedBreeds = urlParams.get("breeds")?.split(",") || [];
const selectedAgeRange = urlParams.get("ageRange");

fetch("../users.json")
  .then((response) => response.json())
  .then((data) => {
    let dogs = data.dogs;
    const swiper = document.querySelector("#swiper");
    let currentIndex = 0;

    const filterDogs = () => {
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
      // dogs = filterGender();
      swiper.innerHTML = "";

      filteredDogs.forEach((dog, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.display = index === 0 ? "block" : "none";
        card.innerHTML = `
          <img src="${dog.image}" alt="${dog.name}">
          <h3>${dog.name}</h3>
          <p>Breed: ${dog.breed}</p>
          <p>Age: ${dog.age}</p>
          <p>Sex: ${dog.sex}</p>
        `;
        swiper.appendChild(card);
      });
      dogs = filteredDogs;
    };

    renderDogs();

    const slideOut = (direction) => {
      const cards = document.querySelectorAll(".card");
      const currentCard = cards[currentIndex];
      const nextCard = cards[(currentIndex + 1) % cards.length];

      nextCard.style.display = "block";
      nextCard.style.zIndex = "1";
      currentCard.style.zIndex = "2";

      currentCard.style.transform =
        direction === "like" ? "translateX(100%)" : "translateX(-100%)";

      setTimeout(() => {
        currentCard.style.display = "none";
        currentCard.style.transform = "translateX(0)";
        currentCard.style.opacity = "1";
        currentCard.style.zIndex = "1";
        nextCard.style.zIndex = "2";
      }, 500);
    };
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

      // Add the like action to the action history
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
    const dislike = () => {
      addActionToHistory("dislike", currentIndex);
      slideOut("dislike");
      next();
    };
    if (dislikeBtn) {
      dislikeBtn.addEventListener("click", dislike);
    }

    const undo = () => {
      if (actionHistory.length > 0) {
        const lastAction = actionHistory.pop();
        const cards = document.querySelectorAll(".card");
        const previousCard = cards[lastAction.index];

        // Hide all cards except the previous one
        cards.forEach((card, idx) => {
          if (idx !== lastAction.index) {
            card.style.display = "none";
            card.style.zIndex = "1";
          }
        });

        previousCard.style.display = "block";
        previousCard.style.opacity = "1";
        previousCard.style.transform = "translateX(0)";
        previousCard.style.zIndex = "2";

        // Undo like action: remove the last liked dog
        if (lastAction.type === "like") {
          const lastLiked = newMatches.lastChild;
          if (lastLiked) newMatches.removeChild(lastLiked);
          likesArray.pop(); // Remove last liked dog from array

          // Update localStorage with the modified likesArray
          localStorage.setItem("likesArray", JSON.stringify(likesArray));
        }

        currentIndex = lastAction.index;
      }
    };

    if (undoBtn) {
      undoBtn.addEventListener("click", undo);
    }

    const next = () => {
      const cards = document.querySelectorAll(".card");

      setTimeout(() => {
        cards[currentIndex].style.transform = "translateX(0)";
        cards[currentIndex].style.opacity = "1";

        cards[currentIndex].style.display = "none";
        currentIndex = (currentIndex + 1) % cards.length;
        cards[currentIndex].style.display = "block";
      }, 500);
    };

    const addActionToHistory = (type, index) => {
      actionHistory.push({ type, index });
      if (actionHistory.length > max_undo) {
        actionHistory.shift(); // Remove the oldest action if history exceeds max_undo
      }
    };
  })
  .catch((error) => console.error("Error loading JSON:", error));
