const login = document.getElementById("login-form");
const email = document.getElementById("login-email");
const password = document.getElementById("login-password");
login.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the input values
  const Email = email.value;
  const Password = password.value;

  fetch("/login/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email, Password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        // Redirect to the dashboard
        window.location.href = "/dashboard";
      } else {
        // Handle login failure, e.g., display an error message
        console.error("Login failed: " + data.message);
      }
    })
    .catch((error) => console.error(error));

  // Clear the input fields
  email.value = "Try Again";
  password.value = "";
});
