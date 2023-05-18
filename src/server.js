const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Habilitar CORS
app.use(cors());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Admin123',
  database: 'butiga'
});
connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la BASE DE DATOS !');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log(username);
  connection.query('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta: ', error);
      res.status(500).send('Error al realizar la consulta');
    } else if (results.length === 0) {
      res.status(401).send('Credenciales inválidas');
    } else {
      // res.status(200).send('Inicio de sesión exitoso');
      res.json(true);
    }
  });
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Validar que el nombre de usuario, contraseña y correo no estén vacíos
  if (!username || !password || !email) {
    res.json(400).send('El nombre de usuario, contraseña y correo son requeridos');
    return;
  }

  // Verificar si el usuario ya existe en la base de datos
  connection.query('SELECT * FROM usuarios WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta: ', error);
      res.json(500).send('Error al realizar la consulta');
      return;
    }

   /* if (results.length > 0) {
      res.status(409).send('El nombre de usuario ya está en uso');
      return;
    }*/
console.log(email);
    // Insertar el nuevo usuario en la tabla de usuarios
    connection.query('INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)', [username, password, email], (error, results) => {
      if (error) {
        console.error('Error al insertar el nuevo usuario: ', error);
        res.json(500).send('Error al insertar el nuevo usuario');
        return;
      }

      res.json(201).send('Usuario registrado exitosamente');
    });
  });
});

app.get('/products', (req, res) => {
  connection.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).send('Error al obtener los productos');
    } else {
      res.json(results);
    }
  });
});





app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
