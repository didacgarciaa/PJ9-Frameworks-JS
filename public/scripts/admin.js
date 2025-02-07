document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("createUserForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const name  = document.getElementById("username").value.trim();
        const role = document.getElementById("role").value;
        const password = document.getElementById("password").value.trim();
        if (!name || !password) return showMessage("Emplena tots els camps", "createMessage");
        createUserForm(name,role,password);
        
    });

    document.getElementById("updateUserForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const name  = document.getElementById("updateUsername").value.trim();
        const role = document.getElementById("updateRole").value;
        const password = document.getElementById("updatePassword").value.trim();
        if (!name || !password) return showMessage("Emplena tots els camps", "updateMessage");
        updateUserForm(name,role,password);
        
    });
    
    document.getElementById("deleteUserForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const name = document.getElementById("deleteUsername").value.trim();
        if (!name) return showMessage("Introdueix un nom d'usuari", "deleteMessage");
        deleteUserForm(name);
    });
});

function showMessage(message, elementId) {
    document.getElementById(elementId).textContent = message;
}

async function deleteUserForm(name) {
    try {
        const response = await fetch("/user/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        const result = await response.json();
        showMessage(result.message || "Usuari esborrat correctament", "deleteMessage");
    } catch (error) {
        showMessage("Error", "deleteMessage");
    }
}

async function createUserForm(name, role, password) {
    try {
        const response = await fetch("/user/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, role ,password })
        });
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        const result = await response.json();
        showMessage(result.message || "Usuari creat correctament", "createMessage");
    } catch (error) {   
        showMessage("Error", "createMessage");
    }
}

async function updateUserForm(name, role, password) {
    try {
        const response = await fetch("/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, role, password })
        });
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        const result = await response.json();
        showMessage(result.message || "Usuari actualitzat correctament", "updateMessage");
    } catch (error) {
        showMessage("Error", "updateMessage");
    }
}
