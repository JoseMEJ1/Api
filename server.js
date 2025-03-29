const express = require('express');
const cors = require('cors');
const db = require('./connection');

const app = express();
app.use(cors());
app.use(express.json());

const validarTabla = (req, res, next) => {
  const { tabla } = req.params;
  if (!['producto', 'proveedor'].includes(tabla)) {
    return res.status(400).json({ error: "Tabla no válida" });
  }
  next();
};

app.get("/api/seleccionarencabezado/:tabla", validarTabla, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = $1 ORDER BY ordinal_position`,
      [req.params.tabla]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener encabezados" });
  }
});

app.get("/api/seleccionarcontenido/:tabla", validarTabla, async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM ${req.params.tabla}`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener contenido" });
  }
});

app.post("/api/agregar/:tabla", validarTabla, async (req, res) => {
  try {
    const columnas = Object.keys(req.body);
    const valores = Object.values(req.body);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `INSERT INTO ${req.params.tabla} (${columnas.join(', ')}) 
                   VALUES (${placeholders}) RETURNING *`;
    
    const { rows } = await db.query(query, valores);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar registro" });
  }
});

app.put("/api/editar/:tabla/:id", validarTabla, async (req, res) => {
  try {
    const idColumn = req.params.tabla === "producto" ? "id_producto" : "id_proveedor";
    const columnas = Object.keys(req.body);
    const valores = Object.values(req.body);
    
    const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(', ');
    
    const query = `UPDATE ${req.params.tabla} SET ${setClause} 
                   WHERE ${idColumn} = $${columnas.length + 1} RETURNING *`;
    
    const { rows } = await db.query(query, [...valores, req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar registro" });
  }
});

app.delete("/api/eliminar/:tabla/:id", validarTabla, async (req, res) => {
  try {
    const idColumn = req.params.tabla === "producto" ? "id_producto" : "id_proveedor";
    const { rowCount } = await db.query(
      `DELETE FROM ${req.params.tabla} WHERE ${idColumn} = $1`,
      [req.params.id]
    );
    
    if (rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar registro" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));