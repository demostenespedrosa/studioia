import mysql from 'mysql2/promise';

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'studioia',
  DB_PORT = 3306,
} = process.env;

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    await conn.query(`CREATE TABLE IF NOT EXISTS user_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_images_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX(user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  } finally {
    conn.release();
  }
}

initDb().catch(err => {
  console.error('Erro ao inicializar banco:', err);
});
