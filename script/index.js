document
  .getElementById("emailForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value; // Get user email input
    const code = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit code

    const url =
      "https://app.mailgun.com/app/sending/domains/sandbox3ad6d0b9741c4681beeef372655dabd7.mailgun.org";
    const apiKey = "76b277375c6c50222672b587558a3a64-f55d7446-c9d2935e"; // Replace with your Mailgun API key

    const formData = new FormData();
    formData.append(
      "from",
      "Your Name <you@sandbox3ad6d0b9741c4681beeef372655dabd7.mailgun.org>"
    );
    formData.append("to", email);
    formData.append("subject", "Your Verification Code");
    formData.append("text", `Your verification code is: ${code}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`api:${apiKey}`), // Basic Auth for Mailgun
        },
        body: formData,
      });

      const statusElement = document.getElementById("status");

      if (response.ok) {
        statusElement.textContent = "Code sent successfully!";
        console.log("Verification Code:", code); // Log the code (optional for debugging)
      } else {
        statusElement.textContent =
          "Failed to send the code. Check your API or domain.";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("status").textContent =
        "An error occurred. Try again.";
    }
  });
