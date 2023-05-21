const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

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

// Configuración de sesión
app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: true
}));


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta: ', error);
      res.status(500).send('Error al realizar la consulta');
    } else if (results.length === 0) {
      res.status(401).send('Credenciales inválidas');
    } else {
      const userId = results[0].id; // Obtiene el ID del usuario

      // Almacena el ID del usuario en la sesión
      req.session.userId = userId;


      res.json({ success: true, userId: req.session.userId }); // Devuelve el ID del usuario al cliente
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

//----------------------------FACTURA Y INSERAT CARRITO ------------------------------------------------------------


/*app.post('/api/insertar_factura', (req, res) => {
  const { userId, total } = req.body;

  const insertQuery = 'INSERT INTO factura (user_id, total) VALUES (?, ?)';

  connection.query(insertQuery, [userId, total], (error, result) => {
    if (error) {
      console.error('Error al insertar la factura:', error);
      res.status(500).send({ message: 'Error al crear la factura' });
      return;
    }

    const facturaId = result.insertId;

    res.status(200).json({ message: 'Factura creada exitosamente', facturaId });
  });
});

app.post('/api/insertar_cart', (req, res) => {
  const cartItems = req.body;
  const userId = req.session.userId; // ID del usuario actual obtenido al iniciar sesión

  // Obtener el ID de la última factura insertada
  connection.query('SELECT MAX(id) AS facturaId FROM factura', (error, results) => {
    if (error) {
      console.error('Error al obtener el ID de la última factura:', error);
      res.status(500).send('Error al guardar el carrito');
      return;
    }

    const facturaId = results[0].facturaId; // Obtener el ID de la factura

    const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity, factura_id) VALUES (?, ?, ?, ?)';

    cartItems.forEach((cartItem) => {
      const { product_id, quantity } = cartItem;
      connection.query(insertQuery, [userId, product_id, quantity, facturaId], (error, result) => {
        if (error) {
          console.error('Error al insertar el producto en el carrito:', error);
          res.status(500).send('Error al guardar el carrito');
          return;
        }
      });
    });

    res.status(200).send('Carrito guardado exitosamente');
  });
});*/






app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
