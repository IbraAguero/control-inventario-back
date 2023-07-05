import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ibrahim',
  database: 'control_inventario',
});

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM User';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: err });
    return res.json(result);
  });
});

app.post('/checkUserExistence', (req, res) => {
  const { usuario } = req.body;

  const sql = 'SELECT * FROM User WHERE usuario = ?';
  db.query(sql, [usuario], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length > 0) {
      return res.json({ exists: true }); // El usuario existe
    } else {
      return res.json({ exists: false }); // El usuario no existe
    }
  });
});

app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  const sql = 'SELECT * FROM User WHERE usuario = ?';
  db.query(sql, [usuario], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length > 0) {
      const hashedPassword = data[0].password; // Obtén la contraseña hasheada almacenada en la base de datos
      bcrypt.compare(password, hashedPassword, (compareErr, result) => {
        if (compareErr) {
          return res.json(compareErr);
        }
        if (result) {
          return res.json('Success');
        } else {
          return res.json('Invalid credentials');
        }
      });
    } else {
      return res.json('Invalid credentials');
    }
  });
});

app.post('/api/users', (req, res) => {
  const { name, password } = req.body;

  // Verifica si el nombre de usuario ya existe en la base de datos
  const checkUserQuery = 'SELECT * FROM User WHERE usuario = ?';
  db.query(checkUserQuery, [name], (checkUserErr, checkUserData) => {
    if (checkUserErr) {
      return res.json(checkUserErr);
    }
    if (checkUserData.length > 0) {
      return res.json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Genera el hash de la contraseña
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return res.json(hashErr);
      }

      // Inserta el nuevo usuario en la base de datos
      const insertUserQuery =
        'INSERT INTO User (usuario, password) VALUES (?, ?)';
      db.query(
        insertUserQuery,
        [name, hashedPassword],
        (insertUserErr, insertUserResult) => {
          if (insertUserErr) {
            return res.json(insertUserErr);
          }
          return res.json({ message: 'Usuario creado exitosamente' });
        }
      );
    });
  });
});

app.get('/estados', (req, res) => {
  const sql = 'SELECT * FROM estado';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

app.get('/computadoras', (req, res) => {
  const sql = 'SELECT * FROM computadoras';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

// Peticiones para los monitores
// GET
app.get('/monitores', (req, res) => {
  const sql = 'SELECT * FROM control_inventario.vwmonitor';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

// LUGARES

app.get('/lugares', (req, res) => {
  const sql = 'SELECT * FROM lugar';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

app.post('/lugares', (req, res) => {
  console.log(req);
  const sql = 'INSERT INTO lugar (`nombre`) VALUES (?)';
  const values = [req.body.nombre];

  console.log(req);
  console.log(values);

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    console.log(result);
    return res.json(result);
  });
});

app.delete('/lugares/:id', (req, res) => {
  const sql = 'DELETE FROM lugar WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put('/lugares/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE lugar SET `nombre`=? WHERE id = ?';
  db.query(sql, [req.body.nombre, id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

// MONITORES - FABRICANTE

app.get('/monitores/fabricantes', (req, res) => {
  const sql = 'SELECT * FROM monitorfabricante';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

app.post('/monitores/fabricantes', (req, res) => {
  console.log(req);
  const sql = 'INSERT INTO monitorfabricante (`nombre`) VALUES (?)';
  const values = [req.body.nombre];

  console.log(req);
  console.log(values);

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    console.log(result);
    return res.json(result);
  });
});

app.delete('/monitores/fabricantes/:id', (req, res) => {
  const sql = 'DELETE FROM monitorfabricante WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put('/monitores/fabricantes/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE monitorfabricante SET `nombre`=? WHERE id = ?';
  db.query(sql, [req.body.nombre, id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get('/monitores/fabricantes2', (req, res) => {
  const sql = `
    SELECT f.id, f.nombre, JSON_ARRAYAGG(JSON_OBJECT('id', m.id, 'nombre', m.nombre)) AS modelos
    FROM monitorfabricante f
    LEFT JOIN monitormodelo m ON f.id = m.IDFabricante
    GROUP BY f.id, f.nombre
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

app.get('/monitores/tipos', (req, res) => {
  const sql = 'SELECT * FROM monitortipo';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

app.get('/monitores/modelos/:id', (req, res) => {
  const sql = 'SELECT * FROM monitormodelo WHERE idFabricante = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get('/monitores/read/:id', (req, res) => {
  const id = req.params.id;
  const sql = `CALL control_inventario.spGetMonitorForNroInv('${id}')`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});
app.get('/monitores/modelos/read/:id', (req, res) => {
  const id = req.params.id;
  const sql = `CALL control_inventario.spGetModelosPorFabricante('${id}')`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

// VALIDATION

app.get('/monitores/validacion/:nroinventario', (req, res) => {
  const nroinventario = req.params.nroinventario;
  const sql = 'SELECT COUNT(*) AS count FROM monitor WHERE nroinventario = ?';
  db.query(sql, [nroinventario], (err, result) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).json({ error: 'Error al realizar la consulta' });
    }
    const count = result[0].count;
    const isRegistered = count > 0;
    res.json({ isRegistered });
  });
});

// POST
app.post('/monitores', (req, res) => {
  console.log(req);
  const sql =
    'INSERT INTO monitor (`nroInventario`,`idlugar`,`idfabricante`, `idmodelo`,`idtipo`,`nroserie`,`pulgadas`,`idestado`) VALUES (?)';
  const values = [
    req.body.nroinventario,
    req.body.lugar,
    req.body.fabricante,
    req.body.modelo,
    req.body.tipo,
    req.body.nroserie,
    req.body.pulgadas,
    req.body.estado,
  ];

  console.log(req);
  console.log(values);

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    console.log(result);
    return res.json(result);
  });
});

app.put('/monitores/update/:id', (req, res) => {
  const id = req.params.id;
  const sql =
    'UPDATE monitor SET `nroserie`=?,`idlugar`=?, `idfabricante`=?, `idmodelo`=?,`idtipo`=?,`pulgadas`=?,`idestado`=?, `fechaUltModificacion`=? WHERE nroinventario = ?';
  db.query(
    sql,
    [
      req.body.nroserie,
      req.body.lugar,
      req.body.fabricante,
      req.body.modelo,
      req.body.tipo,
      req.body.pulgadas,
      req.body.estado,
      req.body.fechaUltModificacion,
      id,
    ],
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
    }
  );
});

// DELETE

app.delete('/monitores/delete/:id', (req, res) => {
  const sql = 'DELETE FROM monitor WHERE nroinventario = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

// Peticiones para las computadoras

app.post('/computadoras', (req, res) => {
  console.log(req);
  const sql =
    'INSERT INTO computadoras (`lugar`,`cpucomputadora`,`ram`,`discohd`,`estado`) VALUES (?)';
  const values = [
    req.body.lugar,
    req.body.cpucomputadora,
    req.body.ram,
    req.body.discohd,
    req.body.estado,
  ];

  console.log(req);
  console.log(values);

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get('/read/:id', (req, res) => {
  const sql = 'SELECT * FROM computadoras WHERE ID = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put('/update/:id', (req, res) => {
  const sql =
    'UPDATE computadoras SET `lugar`=?, `cpucomputadora`=?, `ram`=?,`discohd`=?,`estado`=? WHERE id=? ';
  const id = req.params.id;
  db.query(
    sql,
    [
      req.body.lugar,
      req.body.cpucomputadora,
      req.body.ram,
      req.body.discohd,
      req.body.estado,
      id,
    ],
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
    }
  );
});

app.delete('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM computadoras WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.listen('8000', function () {
  console.log('Aplicacion iniciado en el puerto 8000');
});
