import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

export const db = mysql.createPool({
  ...env.db,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  dateStrings: false,
});
