document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const breed = document.getElementById("breed").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const location = document.getElementById("location").value;

    
    document.getElementById("profileName").textContent = `Name: ${name}`;
    document.getElementById("profileAge").textContent = `Age: ${age}`;
    document.getElementById("profileBreed").textContent = `Breed: ${breed}`;
    document.getElementById("profileGender").textContent = `Gender: ${gender}`;
    document.getElementById("profileLocation").textContent = `Location: ${location}`;

    
    document.getElementById("profile").style.display = "block";
});
