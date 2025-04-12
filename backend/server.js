const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Inicializar base de datos SQLite
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(cors()); // Permite solicitudes de otros dominios
app.use(express.json()); // Para recibir datos en formato JSON

// Crear tabla de compras si no existe
db.run(`CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productos JSON NOT NULL,
    email TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Crear tabla de usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)`);

// Crear tabla de usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    name TEXT NOT NULL
)`);

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de compras!');
});

// 👉 **Ruta /comprar para recibir datos del carrito**
app.post('/comprar', (req, res) => {
    const { productos, userEmail } = req.body;

    if (!productos || productos.length === 0 || !userEmail) {
        return res.status(400).json({ message: '⚠️ No hay productos en el carrito.' });
    }

    db.run(
        `INSERT INTO compras (productos, email) VALUES (?, ?)`,
        [JSON.stringify(productos), userEmail],
        function (err) {
            if (err) {
                console.error('❌ Error al guardar la compra:', err);
                return res.status(500).json({ message: 'Error al guardar la compra.' });
            }
            console.log(`✅ Compra guardada con ID: ${this.lastID}`);
            res.json({ message: 'Compra realizada con éxito!', id: this.lastID });
        }
    );
});

// 👉 **Ruta /login para validar el inicio de sesión**
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '⚠️ Por favor, ingresa email y contraseña.' });
    }

    // Buscar usuario por email
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        if (!user) {
            return res.status(404).json({ message: '⚠️ Usuario no encontrado.' });
        }

        // Comparar contraseña
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            console.log(`✅ Usuario ${user.email} inició sesión.`);
            const { id, password, ...rest } = user;
            res.json({ message: 'Bienvenido!', user: rest });
        } else {
            res.status(401).json({ message: '⚠️ Contraseña incorrecta.' });
        }
    });
});

// 👉 **Ruta /register para validar el inicio de sesión**
app.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: '⚠️ Por favor, introduce todos los campos requeridos.' });
    }

    // Buscar usuario por email
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        if (user) {
            return res.status(401).json({ message: '⚠️ El email ya existe.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10); // Encripta la contraseña
        db.run(
            `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`,
            [firstName, lastName, email, hashedPassword],
            (err) => {
                if (err) console.error('❌ Error al insertar usuario:', err);
                else console.log(`✅ Usuario creado: ${email}`);
            }
        );

        res.json({ message: 'Bienvenido!' });
    });
});

// 👉 **Ruta /contact para guardar un formulario de contacto**
app.post('/contact', async (req, res) => {
    const { email, message, name } = req.body;

    if (!email || !message || !name) {
        return res.status(400).json({ message: '⚠️ Por favor, ingresa email y el mensaje.' });
    }

    db.run(
        `INSERT INTO contact (email, message, name) VALUES (?, ?, ?)`,
        [email, message, name],
        (err) => {
            if (err) {
                console.error('❌ Error al insertar el formulario de contacto:', err);
                res.status(401).json({ message: '⚠️ Ha ocurrido un error al insertar el formulario de contacto.' });
            }
            else {
                console.log('✅ Formulario de contacto creado');
                res.json({ message: 'Gracias por contactarnos' });
            }
        }
    );
});

// Servidor escuchando en el puerto 3000
app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});