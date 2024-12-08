let newMatches = document.querySelector("#newMatches");
let likeBtn = document.querySelector("#like");
let dislikeBtn = document.querySelector("#dislike");
let undoBtn = document.querySelector("#undo");

let likesArray = [];
let actionHistory = [];
const max_undo = 3;

const urlParams = new URLSearchParams(window.location.search);
const userGender = urlParams.get("gender"); // Owner's selected gender
const selectedBreeds = urlParams.get("breeds")?.split(",") || [];
const selectedAgeRange = urlParams.get("ageRange");

// Fetch dogs data
fetch("../users.json")
  .then((response) => response.json())
  .then((data) => {
    let dogs = data.dogs;
    const swiper = document.querySelector("#swiper");
    let currentIndex = 0;

    // Filters
    const filterDogs = () => {
      return dogs.filter((dog) => {
        // Gender filter
        const genderMatch = dog.sex !== userGender;

        // Breed filter
        const breedMatch =
          selectedBreeds.length === 0 || selectedBreeds.includes(dog.breed);

        // Age range filter
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

    // Render dogs
    const renderDogs = () => {
      const filteredDogs = filterDogs();
      swiper.innerHTML = ""; // Clear current cards

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
      dogs = filteredDogs; // Update dogs list to match filtered results
    };

    renderDogs();

    // Slide functionality
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

    // Handle like button
    const like = () => {
      const dog = dogs[currentIndex];

      let likeDiv = document.createElement("div");
      likeDiv.className = "liked-dog";
      likeDiv.innerHTML = `
        <img src="${dog.image}" alt="${dog.name}" style="width: 50px; height: 50px;">
        <p>${dog.name}</p>
      `;
      newMatches.appendChild(likeDiv);

      likesArray.push({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        sex: dog.sex,
      });

      addActionToHistory("like", currentIndex);
      slideOut("like");
      next();
    };
    if (likeBtn) {
      likeBtn.addEventListener("click", like);
    }

    // Handle dislike button
    const dislike = () => {
      addActionToHistory("dislike", currentIndex);
      slideOut("dislike");
      next();
    };
    if (dislikeBtn) {
      dislikeBtn.addEventListener("click", dislike);
    }

    // Handle undo button
    const undo = () => {
      if (actionHistory.length > 0) {
        const lastAction = actionHistory.pop();
        const cards = document.querySelectorAll(".card");
        const previousCard = cards[lastAction.index];

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

        if (lastAction.type === "like") {
          const lastLiked = newMatches.lastChild;
          if (lastLiked) newMatches.removeChild(lastLiked);
          likesArray.pop();
        }

        currentIndex = lastAction.index;
      }
    };

    if (undoBtn) {
      undoBtn.addEventListener("click", undo);
    }

    // Show the next card
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

    // Add action to history
    const addActionToHistory = (type, index) => {
      actionHistory.push({ type, index });
      if (actionHistory.length > max_undo) {
        actionHistory.shift();
      }
    };
  })
  .catch((error) => console.error("Error loading JSON:", error));
