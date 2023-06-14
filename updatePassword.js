import bcrypt from 'bcrypt'
import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ibrahim',
  database: 'control_inventario',
});

// Función para hashear una contraseña y actualizarla en la base de datos
const hashAndUpdatePassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10); // Hashear la contraseña

  const sql = 'UPDATE User SET password = ?';
  db.query(sql, [hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Contraseña actualizada correctamente');
  });
};

// Obtener las contraseñas existentes de la base de datos
const sql = 'SELECT password FROM User';
db.query(sql, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

  // Hashear y actualizar cada contraseña
  result.forEach((row) => {
    const password = row.password;
    hashAndUpdatePassword(password);
  });

  db.end(); // Cerrar la conexión después de terminar la actualización
});
