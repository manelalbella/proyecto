// Cargar productos dinámicamente cuando la página esté lista
document.addEventListener("DOMContentLoaded", function () {
    handleUserSession();

    handleLogout();

    mostrarProductos();

    if (document.getElementById("carrito-container")) {
        mostrarCarrito();
    }

    const btnComprar = document.getElementById("btn-comprar");
    if (btnComprar) {
        btnComprar.addEventListener("click", comprar);
    }
});

// Lista de productos
const productos = [
    {
        id: 1,
        nombre: "Procesador Ryzen 5",
        precio: 200,
        descripcion: "Un excelente procesador para gaming.",
        imagen: "/images/products/ryzen5.jpg"
    },
    {
        id: 2,
        nombre: "Tarjeta gráfica RTX 3060",
        precio: 400,
        descripcion: "Potente GPU para juegos en 1080p.",
        imagen: "/images/products/tarjeta.jpg"
    },
    {
        id: 3,
        nombre: "Ratón Logitech G Pro Wireless",
        precio: 100,
        descripcion: "El Logitech G Pro Wireless es un ratón ultraligero y preciso para gamers.",
        imagen: "/images/products/logitech.png"
    },
    {
        id: 4,
        nombre: "Teclado Logitech G Pro Wireless",
        precio: 140,
        descripcion: "El teclado Logitech G Pro es compacto, mecánico y diseñado para gamers",
        imagen: "/images/products/tecladologitech.png"
    },
];

// FUNCION PARA MOSTRAR EL DETALLE DEL PRODUCTO
function mostrarProductos() {
    const divLista = document.getElementById("productos-lista");

    if (!divLista) return;

    divLista.innerHTML = productos.map((p, i) => (
        `
        <div class="producto">
            <div>
                <img src="${p.imagen}" alt="${p.nombre}" />
            </div>
            <div>
                <h2>${p.nombre}</h2>
                <p>${p.descripcion}</p>
                <p>Precio: ${p.precio}€</p>
                <button
                    class="agregar-carrito"
                    data-id="${p.id}"
                    onclick="agregarAlCarrito(${p.id})"
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
        ${productos.length - 1 !== i ? "<hr />" : ""}
        `
    )).join("");
}

// CARGAR CARRITO DESDE LOCALSTORAGE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        console.error(`⚠️ Error: Producto con ID ${id} no encontrado`);
        return;
    }

    // FUNCION PARA EVITAR PRODUCTOS DUPLICADOS
    const yaEnCarrito = carrito.find(p => p.id === id);
    if (yaEnCarrito) {
        alert(`⚠️ El producto "${producto.nombre}" ya está en el carrito.`);
        return;
    }

    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`✅ Producto "${producto.nombre}" agregado al carrito`);
}

// ✅ FUNCIÓN PARA MOSTRAR EL CARRITO
function mostrarCarrito() {
    const contenedor = document.getElementById("carrito-container");
    if (!contenedor) {
        console.error("⚠️ No se encontró el contenedor del carrito.");
        return;
    }
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    carrito.forEach(producto => {
        if (!producto || !producto.nombre || !producto.precio) {
            console.error(`⚠️ Producto inválido en el carrito:`, producto);
            return;
        }
        let div = document.createElement("div");
        div.innerHTML = `<p>Producto: ${producto.nombre}</p><p>Precio: ${producto.precio}€</p>`;
        contenedor.appendChild(div);
    });

    //FUNCION PARA  MOSTRAR EL TOTAL DE LA COMPRA
    let total = carrito.reduce((sum, p) => sum + p.precio, 0);
    let totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<hr><p><strong>Total a pagar:</strong> ${total}€</p>`;
    contenedor.appendChild(totalDiv);
}

// ✅ FUNCIÓN PARA COMPRAR
function comprar() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("⚠️ Debes iniciar sesión para realizar una compra.");
        window.location.href = "login.html";
        return;
    }

    if (carrito.length === 0) {
        alert("⚠️ El carrito está vacío.");
        return;
    }

    fetch("http://localhost:3000/comprar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            productos: carrito,
            userEmail: JSON.parse(localStorage.getItem("user"))?.email
        })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            carrito = [];
            localStorage.removeItem("carrito");
            mostrarCarrito();
        })
        .catch(error => {
            console.error("❌ Error al realizar la compra:", error);
            alert("⚠️ No se pudo realizar la compra.");
        });
}

//FUNCIONES DE SESION
function handleUserSession() {
    const userStorage = JSON.parse(localStorage.getItem("user"));

    const navUser = document.querySelector(".nav-user");
    if (!navUser) return;

    if (userStorage) {
        navUser.innerHTML = `
            <li>${userStorage.firstName}</li>
            <li id="nav-logout">Cerrar sesión</li>
        `;
    } else {
        navUser.innerHTML = `
            <li>
                <a href="login.html">Iniciar sesión</a>
            </li>
            <li>
                <a href="registro.html">Registrar</a>
            </li>
        `;
    }
}

function handleLogout() {
    document.getElementById("nav-logout")?.addEventListener("click", function () {
        localStorage.removeItem("user");
        window.location.reload();
    });
}
