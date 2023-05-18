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

app.post('/cart', (req, res) => {
  const productId = req.body.productId;
  const userId = req.body.userId; // Asegúrate de enviar el userId en el cuerpo de la solicitud

  // Verificar si el producto ya existe en el carrito del usuario
  const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
  const checkValues = [userId, productId];

  connection.query(checkQuery, checkValues, (checkError, checkResults) => {
    if (checkError) {
      console.error('Error al verificar el producto en el carrito:', checkError);
      res.status(500).json({ error: 'Error al verificar el producto en el carrito' });
    } else if (checkResults.length > 0) {
      // El producto ya está en el carrito, se actualiza la cantidad
      const existingItem = checkResults[0];
      const newQuantity = existingItem.quantity + 1;

      const updateQuery = 'UPDATE cart SET quantity = ? WHERE id = ?';
      const updateValues = [newQuantity, existingItem.id];

      connection.query(updateQuery, updateValues, (updateError, updateResults) => {
        if (updateError) {
          console.error('Error al actualizar la cantidad del producto en el carrito:', updateError);
          res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
        } else {
          res.status(200).json({ message: 'Producto agregado al carrito' });
        }
      });
    } else {
      // El producto no está en el carrito, se agrega como nuevo
      const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
      const insertValues = [userId, productId, 1]; // La cantidad inicial es 1

      connection.query(insertQuery, insertValues, (insertError, insertResults) => {
        if (insertError) {
          console.error('Error al agregar el producto al carrito:', insertError);
          res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        } else {
          res.status(200).json({ message: 'Producto agregado al carrito' });
        }
      });
    }
  });
});



app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
