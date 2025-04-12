document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;  
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) 
    });

    const data = await response.json(); 
    alert(data.message)

    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "productos.html"; // Redirige tras iniciar sesión
    }
});
