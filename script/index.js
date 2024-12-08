

let userImage = document.querySelector("#userImage");
let userName = document.querySelector("#userName");
let userAge = document.querySelector("#userAge");
let userGender = document.querySelector("#userGender");
let userBreed = document.querySelector("#userBreed");
let userLocation = document.querySelector("#userLocation");
let dislikeBtn = document.querySelector("#dislike");
let likeBtn = document.querySelector("#like");


class Users {
  async getUsers() {
    try {
      const result = await fetch("../users.json");
      const data = await result.json();
      const users = data.dogs.map((dog) => {
        const { id, breed, age, image, name, sex } = dog;
        return { id, breed, age, image, name, sex };
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
}

const usersInstance = new Users();

usersInstance.getUsers().then((usersList) => {
  if (gender === "male") {
    usersList.forEach((user) => {

      userImage.src = user.image;
      userName.textContent = user.name;
      userAge.textContent = user.age;
      userGender.textContent = user.sex;
      userBreed.textContent = user.breed;
    });
  } else {
    usersList.forEach((user) => {

      userImage.src = user.image;
      userName.textContent = user.name;
      userAge.textContent = user.age;
      userGender.textContent = user.sex;
      userBreed.textContent = user.breed;
    });
  }
});

const updatePicked = (user) => {
  specificBreed[user].isPicked = !specificBreed[user].isPicked;
};

const pickBreed = (event) => {
  let breed = event.target.textContent;

  if (!specificBreed.includes(breed)) {
    let specificBreedObj = {
      id: usersInstance.getUsers().then((users) => users.id),
      breed: breed,
      isPicked: false,
    };
    specificBreed.push(specificBreedObj);
    event.target.style.textDecoration = isPicked ? "line-through" : "none";
  }
};
breeds.forEach((breed) => {
  breed.addEventListener("click", pickBreed);
});
const finish = () => {
  console.log("Selected Breeds:", specificBreed);
};
if (breeds) {
  breeds.forEach((breed) => {
    breed.addEventListener("click", pickBreed);
  });
}
if (finishBtn) {
  finishBtn.addEventListener("click", finish);
}

function appendNewCard() {
  const card = new Users({
    imageUrl: urls[cardCount % urls.length],
    onDismiss: appendNewCard,
    onLike: () => {
      void like.offsetWidth; 
      likeBtn.classList.add("trigger");
      setTimeout(() => like.classList.remove("trigger"), 500);
    },
    onDislike: () => {
      void dislike.offsetWidth; 
      dislikeBtn.classList.add("trigger");
      setTimeout(() => dislike.classList.remove("trigger"), 500);
    },
  });

  swiper.append(card.element);
  cardCount++;

  const cards = swiper.querySelectorAll(".card:not(.dismissing)");
  cards.forEach((card, index) => {
    card.style.setProperty("--i", index);
  });
}

for (let i = 0; i < breedFilter.length; i++) {
  appendNewCard();
}

