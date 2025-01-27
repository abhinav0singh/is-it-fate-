const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");

const showPopup = (message) => {
    popupMessage.textContent = message;
    popup.style.display = "flex";
};

popupClose.addEventListener("click", () => {
    popup.style.display = "none";
});

document.getElementById("signupButton").addEventListener("click", () => {
    loginPage.style.transform = "rotateY(90deg)";
    setTimeout(() => {
        loginPage.style.display = "none";
        signupPage.style.display = "block";
        signupPage.style.transform = "rotateY(0deg)";
    }, 500);
});

document.getElementById("backToLogin").addEventListener("click", () => {
    signupPage.style.transform = "rotateY(90deg)";
    setTimeout(() => {
        signupPage.style.display = "none";
        loginPage.style.display = "block";
        loginPage.style.transform = "rotateY(0deg)";
    }, 500);
});

document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (email && password) {
        // Simulating successful registration
        window.location.href = "dashboard.html";
    } else {
        showPopup("Registration failed! Please fill all fields.");
    }
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === "user@example.com" && password === "password123") {
        // Simulating successful login
        window.location.href = "dashboard.html";
    } else {
        showPopup("Login failed! Incorrect email or password.");
    }
});
