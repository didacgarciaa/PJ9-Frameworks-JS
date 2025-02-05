document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("createUserForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const name  = document.getElementById("username").value.trim();
        const role = document.getElementById("role").value;
        const password = document.getElementById("password").value.trim();
        if (!name || !password) return showMessage("Emplena tots els camps", "createMessage");
        try {
            const response = await fetch("/user/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, role ,password })
            });
            const result = await response.json();
            showMessage(result.message || "Usuari creat correctament", "createMessage");
        } catch (error) {
            showMessage("Error", "createMessage");
        }
    });
    
    document.getElementById("deleteUserForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const name = document.getElementById("deleteUsername").value.trim();
        if (!name) return showMessage("Introdueix un nom d'usuari", "deleteMessage");
        try {
            const response = await fetch("/user/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            const result = await response.json();
            showMessage(result.message || "Usuari esborrat correctament", "deleteMessage");
        } catch (error) {
            showMessage("Error", "deleteMessage");
        }
    });
    
    
});

function showMessage(message, elementId) {
    document.getElementById(elementId).textContent = message;
}
