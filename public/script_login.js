document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const messageElement = document.getElementById("message");

    if (!username || !password) {
        return showMessage("Por favor, ingresa el nombre y la contraseña.", messageElement);
    }

    try {
        await loginUser(username, password);
        window.location.href = "dashboardAdmin.html";
    } catch (error) {
        showMessage(error.message || "Credenciales incorrectas", messageElement);
    }
}

async function loginUser(username, password) {
    const response = await fetch("/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error en la autenticación");
    }
}

function showMessage(message, element) {
    if (element) element.textContent = message;
}
