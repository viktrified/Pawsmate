let emailInput = document.querySelector(".email_pwd");
let sendBtn = document.querySelector(".btn_pwd1");

const press = () => {
  console.log(1);
};

sendBtn.addEventListener("click", press);

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000); // Ensures a 4-digit code
}

document
  .getElementById("emailForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const code = generateCode();

    try {
      const response = await fetch("https://your-backend-url.com/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        alert("Code sent successfully!");
      } else {
        alert("Failed to send code.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the code.");
    }
  });
