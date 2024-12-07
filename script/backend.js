// let submit = document.querySelector("#submitButton");


// class Users {
//   async getUsers() {
//     try {
//       const result = await fetch("../users.json");
//       const data = await result.json();
//       const users = data.dogs.map((dog) => {
//         const { id, breed, age, image, name, sex } = dog;
//         return { id, breed, age, image, name, sex };
//       });
//       return users;
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   }
// }

// const usersInstance = new Users();
// usersInstance.getUsers().then((users) => console.log(users));

// const genderLogic = () => {
//   let radio = document.getElementsByName("gender");
//   for (i = 0; i < radio.length; i++) {
//     if (radio[i].checked) {
//       gender = radio[i];
//     }
//   }
// };


// submit.addEventListener("click", genderLogic);

