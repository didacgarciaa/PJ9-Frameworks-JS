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
        const user = await loginUser(username, password);  
        localStorage.setItem('username', username); // Store username
        console.log(localStorage.getItem('username')); // Should show the username

        if (user.role === 'admin') {
            window.location.href = "../dashboardAdmin.html"; 
        } else if (user.role === 'cliente') {
            window.location.href = "../dashboardClient.html"; 
            
        } else {
            showMessage("Rol no reconegut", messageElement); 
        }
    } catch (error) {
        showMessage(error.message || "Credencials incorrectes", messageElement);
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
    return await response.json(); 
}


function showMessage(message, element) {
    if (element) element.textContent = message;
}
