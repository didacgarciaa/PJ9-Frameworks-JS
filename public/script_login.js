document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validación básica del formulario en el frontend
    if (!name || !password) {
        document.getElementById("message").textContent = "Por favor, ingresa el nombre y la contraseña.";
        return;
    }

    try {
        // Hacer una solicitud POST al backend para validar el usuario
        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Si la respuesta es exitosa, redirigir al dashboard
            window.location.href = "dashboardAdmin.html";
        } else {
            // Si hay un error, mostrar el mensaje de error
            document.getElementById("message").textContent = data.error || "Credenciales incorrectas";
        }
    } catch (error) {
        // Si hay un error al hacer la solicitud, mostrar un mensaje de error
        console.error("Error al conectar con el backend:", error);
        document.getElementById("message").textContent = "Error de conexión con el servidor.";
    }
});
