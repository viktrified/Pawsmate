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
usersInstance.getUsers().then((users) => console.log(users));

let submit = document.getElementById("submitButton");

const genderLogic = () => {
  let radio = document.getElementsByName("gender");
  for (i = 0; i < radio.length; i++) {
    if (radio[0].checked) {
      console.log("display only bitches");
    } else {
      console.log("display niggas");
    }
  }
};

submit.addEventListener("click", genderLogic);
