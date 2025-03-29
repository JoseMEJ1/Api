const { Pool } = require('pg');

const pool = new Pool({
    user: "crud_vue_9qu3_user", // Tu usuario de Render
    password: "1WQWFlTr1mRHBaJmX68n8kyfqko6iWgL", // Tu contraseña de Render
    host: "dpg-cvgnf48gph6c73bmil10-a.ohio-postgres.render.com", // El host de Render
    port: 5432, // El puerto por defecto de PostgreSQL
    database: "crud_vue_9qu3", // El nombre de la base de datos en Render
    ssl: { rejectUnauthorized: false } // Descomenta esto si necesitas usar SSL
});

module.exports = {
    query: (text, parms) => pool.query(text, parms)
};