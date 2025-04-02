const { Pool } = require('pg');

const pool = new Pool({
    user: "vue_6ov9_user", // Tu usuario de Render
    password: "DEgOdW3sP9p5tFu4Tjod9KtgNOQlyU3B", // Tu contraseña de Render
    host: "dpg-cvmq29be5dus739megr0-a.oregon-postgres.render.com", // El host de Render
    port: 5432, // El puerto por defecto de PostgreSQL
    database: "vue_6ov9", // El nombre de la base de datos en Render
    ssl: { rejectUnauthorized: false } // Descomenta esto si necesitas usar SSL
});

module.exports = {
    query: (text, parms) => pool.query(text, parms)
};