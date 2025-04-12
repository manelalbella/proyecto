document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const response = await fetch("http://localhost:3000/contact", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }) 
    });

    const data = await response.json(); 
    
    if (response.ok) {
        alert(data.message);
        const resetButton = document.querySelector('[type=reset]');
        resetButton.click();
    }
});
