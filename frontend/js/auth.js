let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;

  document.getElementById("form-title").innerText =
    isLogin ? "Login" : "Register";

  document.querySelector("button").innerText =
    isLogin ? "Login" : "Register";
}

async function handleAuth() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    return showError("Please fill all fields");
  }

  if (password.length < 6) {
    return showError("Password must be at least 6 characters");
  }

  try {
    const endpoint = isLogin ? "/login.php" : "/register.php"; //edited

    const data = await apiRequest(endpoint, "POST", {
      email,
      password
    });

    //deleted line no tokens used

    window.location.href = "dashboard.html";

  } catch (err) {
    showError(err.message);
  }
}

function showError(msg) {
  document.getElementById("error-msg").innerText = msg;
}
