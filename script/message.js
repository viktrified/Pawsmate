// document.addEventListener("DOMContentLoaded", () => {
//   const newMatches = document.querySelector("#newMatches");

//   if (newMatches) {
//     // Ensure the element is found
//     let storedLikes = JSON.parse(localStorage.getItem("likedDogs")) || [];

//     // Populate the matches container
//     storedLikes.forEach((dog) => {
//       let likeDiv = document.createElement("div");
//       likeDiv.classList.add("liked-dog");
//       likeDiv.innerHTML = `
//         <img src="${dog.img}" alt="${dog.name}" style="width: 50px; height: 50px;">
//         <p>${dog.name}</p>
//       `;
//       newMatches.appendChild(likeDiv);
//     });
//   } else {
//     console.error("Element with id 'newMatches' not found.");
//   }
// });
