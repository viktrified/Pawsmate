// dog basics section
let form = document.querySelector("#form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let allChoice = Array.from(form.querySelectorAll("input")).reduce(
    (acc, input) => {
      if (input.type === "radio") {
        if (input.checked) acc[input.name] = input.value;
      } else {
        acc[input.name] = input.value;
      }
      return acc;
    },
    {}
  );

  console.log(allChoice);
});


