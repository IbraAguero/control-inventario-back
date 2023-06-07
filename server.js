import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ibrahim',
  database: 'control_inventario',
});

app.get('/lugares', (req, res) => {
  const sql = 'SELECT * FROM lugar';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
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

app.get('/monitores/fabricantes', (req, res) => {
  const sql = 'SELECT * FROM monitorfabricante';
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
