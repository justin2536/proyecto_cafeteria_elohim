const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();

// conecto mi bd
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zhamil', 
    database: 'Cafe_Elohim'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conectado con éxito a MySQL Workbench (Cafe_Elohim)');
});

// esta onda Prepara al servidor para recibir datos y mostrar en mi pagina página
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Asigno roles
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// login y registro de usuarios
app.get('/usuario_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuario_login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registro.html'));
});

// inicio de sesion del admin
app.get('/login_admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login_admin.html'));
});

app.get('/registro_admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registro_admin.html'));
});

// lleva al inicio de la pagina
app.get('/inicio_pagina', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inicio_pagina.html'));
});

app.get('/administrador', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'administrador.html'));
});

// Otras páginas del proyecto
app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contacto.html'));
});

app.get('/cafe', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cafe.html'));
});

app.get('/antojo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'antojo.html'));
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'carrito.html'));
});

app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'productos.html'));
});

app.get('/postre', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'postre.html'));
});


// registro de usuarios a la bd

// Registro de usuarios comunes
app.post('/api/registrar', (req, res) => {
    const { nombre, email, password } = req.body; 

    const sql = 'INSERT INTO usuarios (usuario, correo, contrasnia) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) {
            console.error("Error en MySQL: ", err);
            return res.status(500).send('Error al guardar el usuario');
        }
        res.send('<script>alert("¡Usuario registrado exitosamente!"); window.location.href="/usuario_login";</script>');
    });
});

// Login de usuarios comunes
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        if (results.length === 0) {

            return res.send('<script>alert("El correo no está registrado"); window.location.href="/usuario_login";</script>');
        }

        const usuario = results[0];

        if (password === usuario.contrasnia) {

            res.redirect('/inicio_pagina'); 
        } else {
            res.send('<script>alert("Contraseña incorrecta"); window.location.href="/usuario_login";</script>');
        }
    });
});




// Registro de Administradores
app.post('/api/registrar-admin', (req, res) => {
    const { nombre, email, password } = req.body; 

    const sql = 'INSERT INTO usuarios (usuario, correo, contrasnia) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) {
            console.error("Error en MySQL: ", err);
            return res.status(500).send('Error al guardar el administrador');
        }
        res.send('<script>alert("¡Administrador registrado exitosamente!"); window.location.href="/login_admin";</script>');
    });
});

// Login de Administradores
app.post('/api/login-admin', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        if (results.length === 0) {

            return res.send('<script>alert("El correo de administrador no existe"); window.location.href="/login_admin";</script>');
        }

        const usuario = results[0];

        if (password === usuario.contrasnia) {
            res.redirect('/administrador'); 
        } else {

            res.send('<script>alert("Contraseña de administrador incorrecta"); window.location.href="/login_admin";</script>');
        }
    });
});


// para enviar mensaje a la BD
app.post('/api/contacto', (req, res) => {
    const { nombreCompleto, email, mensaje } = req.body;

    const sql = 'INSERT INTO mensajes_contacto (nombre_completo, correo, mensaje) VALUES (?, ?, ?)';

    db.query(sql, [nombreCompleto, email, mensaje], (err, result) => {
        if (err) {
            console.error("Error al guardar el mensaje en MySQL: ", err);
            return res.status(500).send('Error al enviar el mensaje');
        }
        res.send('<script>alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto."); window.location.href="/contacto";</script>');
    });
});


// puerto encendido
app.listen(3000, () => {
    console.log('Servidor corriendo sin errores en http://localhost:3000');
});