import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'control_inventario',
});

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM computadoras';
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: 'Error inside server' });
    return res.json(result);
  });
});

app.post('/computadoras', (req, res) => {
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
