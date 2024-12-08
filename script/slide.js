let newMatches = document.querySelector("#newMatches");
let like = document.querySelector("#like");
let dislike = document.querySelector("#dislike");
let undo = document.querySelector("#undo");

let likesArray = [];
let actionHistory = [];
const max_undo = 3;

fetch("../users.json")
  .then((response) => response.json())
  .then((data) => {
    const dogs = data.dogs;
    const swiper = document.querySelector("#swiper");
    let currentIndex = 0;

    dogs.forEach((dog, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
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

    like.addEventListener("click", () => {
      const dog = dogs[currentIndex];

      let likeDiv = document.createElement("div");
      likeDiv.classList.add("liked-dog");
      likeDiv.innerHTML = `
        <img src="${dog.image}" alt="${dog.name}" style="width: 50px; height: 50px;">
        <p>${dog.name}</p>
      `;
      newMatches.appendChild(likeDiv);

      likesArray.push({ img: dog.image, name: dog.name });

      addActionToHistory("like", currentIndex);
      slideOut("like");
      next();
    });

    dislike.addEventListener("click", () => {
      addActionToHistory("dislike", currentIndex);
      slideOut("dislike");
      next();
    });

    undo.addEventListener("click", () => {
      if (actionHistory.length > 0) {
        const lastAction = actionHistory.pop(); // Get the most recent action
        const cards = document.querySelectorAll(".card");
        const previousCard = cards[lastAction.index];

        // Ensure all other cards are hidden except the undone card
        cards.forEach((card, idx) => {
          if (idx !== lastAction.index) {
            card.style.display = "none";
            card.style.zIndex = "1";
          }
        });

        // Restore the undone card to the top
        previousCard.style.display = "block";
        previousCard.style.opacity = "1";
        previousCard.style.transform = "translateX(0)";
        previousCard.style.zIndex = "2"; // Bring it to the top

        if (lastAction.type === "like") {
          const lastLiked = newMatches.lastChild;
          if (lastLiked) newMatches.removeChild(lastLiked);
          likesArray.pop();
        }

        // Restore the index to the undone card
        currentIndex = lastAction.index;
      }
    });

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
        actionHistory.shift(); // Remove the oldest action to maintain history size
      }
    };
  })
  .catch((error) => console.error("Error loading JSON:", error));
