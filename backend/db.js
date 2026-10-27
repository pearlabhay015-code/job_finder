const path = require('node:path');
const crypto = require('node:crypto');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const databaseName = process.env.DB_NAME || 'job_saathi';
if (!/^[A-Za-z0-9_]+$/.test(databaseName)) {
  throw new Error('DB_NAME may contain only letters, numbers, and underscores.');
}

const baseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true
};

let pool = null;
let initialization = null;

function createPasswordSecret(password, salt = crypto.randomBytes(16).toString('hex')) {
  return {
    salt,
    hash: crypto.scryptSync(password, salt, 64).toString('hex')
  };
}

async function initializeDatabase() {
  if (pool) return pool;
  if (initialization) return initialization;

  initialization = (async () => {
    const adminPool = mysql.createPool(baseConfig);
    try {
      await adminPool.query(
        `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
    } finally {
      await adminPool.end();
    }

    const configuredPool = mysql.createPool({ ...baseConfig, database: databaseName });
    await configuredPool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        job_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        last_date DATE NOT NULL
      )
    `);
    await configuredPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(128) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        login_count INT UNSIGNED NOT NULL DEFAULT 0,
        phone VARCHAR(30) NULL,
        address VARCHAR(500) NULL,
        state VARCHAR(100) NULL,
        district VARCHAR(100) NULL,
        pincode VARCHAR(10) NULL,
        terms_accepted_at DATETIME NULL,
        terms_version VARCHAR(50) NULL,
        privacy_policy_version VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    try {
      await configuredPool.query(
        'ALTER TABLE users ADD COLUMN login_count INT UNSIGNED NOT NULL DEFAULT 0'
      );
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error;
    }
    for (const column of [
      'phone VARCHAR(30) NULL',
      'address VARCHAR(500) NULL',
      'state VARCHAR(100) NULL',
      'district VARCHAR(100) NULL',
      'pincode VARCHAR(10) NULL',
      'terms_accepted_at DATETIME NULL',
      'terms_version VARCHAR(50) NULL',
      'privacy_policy_version VARCHAR(50) NULL'
    ]) {
      try {
        await configuredPool.query(`ALTER TABLE users ADD COLUMN ${column}`);
      } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') throw error;
      }
    }
    await configuredPool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(128) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await configuredPool.query(`
      CREATE TABLE IF NOT EXISTS admin_invites (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_admin_invites_email (email),
        INDEX idx_admin_invites_expiry (expires_at)
      )
    `);
    await configuredPool.query('ALTER TABLE admin_users MODIFY id INT UNSIGNED NOT NULL AUTO_INCREMENT');

    const configuredUsername = process.env.CMS_ADMIN_USERNAME || 'admin';
    const configuredEmail = String(process.env.CMS_ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
    const [adminRows] = await configuredPool.execute('SELECT id FROM admin_users WHERE id = 1 LIMIT 1');
    if (!adminRows.length) {
      const secret = createPasswordSecret(process.env.CMS_ADMIN_PASSWORD || 'change-me');
      await configuredPool.execute(
        `INSERT INTO admin_users (id, username, email, password_hash, password_salt)
         VALUES (1, ?, ?, ?, ?)`,
        [configuredUsername, configuredEmail, secret.hash, secret.salt]
      );
    } else {
      await configuredPool.execute(
        'UPDATE admin_users SET username = ?, email = ? WHERE id = 1',
        [configuredUsername, configuredEmail]
      );
    }
    pool = configuredPool;
    return pool;
  })();

  try {
    return await initialization;
  } catch (error) {
    pool = null;
    throw error;
  } finally {
    initialization = null;
  }
}

async function query(sql, parameters = []) {
  const activePool = await initializeDatabase();
  const [rows] = await activePool.execute(sql, parameters);
  return rows;
}

async function listJobs({ q = '', location = '' } = {}) {
  const where = [];
  const parameters = [];
  const search = String(q || '').trim().toLowerCase();
  const locationFilter = String(location || '').trim().toLowerCase();

  if (search) {
    const like = `%${search}%`;
    where.push('(LOWER(title) LIKE ? OR LOWER(organization) LIKE ? OR LOWER(location) LIKE ? OR LOWER(state) LIKE ? OR LOWER(district) LIKE ?)');
    parameters.push(like, like, like, like, like);
  }

  if (locationFilter && locationFilter !== 'all') {
    const like = `%${locationFilter}%`;
    where.push('(LOWER(location) LIKE ? OR LOWER(state) LIKE ? OR LOWER(district) LIKE ?)');
    parameters.push(like, like, like);
  }

  const condition = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return query(
    `SELECT job_id, title, organization, location, state, district, last_date
       FROM jobs ${condition}
      ORDER BY last_date ASC, job_id DESC`,
    parameters
  );
}

async function createJob(job) {
  const result = await query(
    `INSERT INTO jobs (title, organization, location, state, district, last_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [job.title, job.organization, job.location, job.state, job.district, job.last_date]
  );
  const rows = await query(
    `SELECT job_id, title, organization, location, state, district, last_date
       FROM jobs WHERE job_id = ?`,
    [result.insertId]
  );
  return rows[0];
}

async function updateJob(jobId, job) {
  const result = await query(
    `UPDATE jobs
        SET title = ?, organization = ?, location = ?, state = ?, district = ?, last_date = ?
      WHERE job_id = ?`,
    [job.title, job.organization, job.location, job.state, job.district, job.last_date, jobId]
  );
  if (!result.affectedRows) return null;
  const rows = await query(
    `SELECT job_id, title, organization, location, state, district, last_date
       FROM jobs WHERE job_id = ?`,
    [jobId]
  );
  return rows[0] || null;
}

async function deleteJob(jobId) {
  const result = await query('DELETE FROM jobs WHERE job_id = ?', [jobId]);
  return Boolean(result.affectedRows);
}

async function getUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const rows = await query(
    `SELECT user_id, name, email, password_hash, password_salt, login_count,
            phone, address, state, district, pincode,
            terms_accepted_at, terms_version, privacy_policy_version, created_at
       FROM users
      WHERE LOWER(email) = ?
      LIMIT 1`,
    [normalized]
  );
  return rows[0] || null;
}

async function createUserAccount({ name, email, passwordHash, passwordSalt }) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, password_salt)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, passwordSalt]
  );
  const rows = await query(
    `SELECT user_id, name, email, password_hash, password_salt, login_count,
            phone, address, state, district, pincode,
            terms_accepted_at, terms_version, privacy_policy_version, created_at
       FROM users WHERE user_id = ?`,
    [result.insertId]
  );
  return rows[0] || null;
}

async function incrementUserLoginCount(userId) {
  const result = await query(
    `UPDATE users
        SET login_count = login_count + 1,
            updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`,
    [userId]
  );
  if (!result.affectedRows) return null;
  const rows = await query(
    `SELECT user_id, name, email, password_hash, password_salt, login_count,
            phone, address, state, district, pincode,
            terms_accepted_at, terms_version, privacy_policy_version, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function claimFirstUserLogin(userId) {
  const result = await query(
    `UPDATE users
        SET login_count = 1,
            updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
        AND login_count = 0`,
    [userId]
  );
  if (!result.affectedRows) return null;
  const rows = await query(
    `SELECT user_id, name, email, password_hash, password_salt, login_count,
            phone, address, state, district, pincode,
            terms_accepted_at, terms_version, privacy_policy_version, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function updateUserProfile(userId, { phone, address, state, district, pincode }) {
  const result = await query(
    `UPDATE users
        SET phone = ?, address = ?, state = ?, district = ?, pincode = ?,
            updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`,
    [phone, address, state, district, pincode, userId]
  );
  if (!result.affectedRows) return null;
  const rows = await query(
    `SELECT user_id, name, email, password_hash, password_salt, login_count,
            phone, address, state, district, pincode,
            terms_accepted_at, terms_version, privacy_policy_version, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function acceptUserConsent(userId, { termsVersion = 'v1', privacyPolicyVersion = 'v1' } = {}) {
  const result = await query(
    `UPDATE users
        SET terms_accepted_at = CURRENT_TIMESTAMP,
            terms_version = ?,
            privacy_policy_version = ?,
            updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`,
    [termsVersion, privacyPolicyVersion, userId]
  );
  if (!result.affectedRows) return null;
  return getUserById(userId);
}

async function getUserById(userId) {
  const rows = await query(
    `SELECT user_id, name, email, password_hash, password_salt, login_count,
            phone, address, state, district, pincode,
            terms_accepted_at, terms_version, privacy_policy_version, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function getAdminByIdentifier(identifier) {
  const normalized = String(identifier || '').trim().toLowerCase();
  const rows = await query(
    `SELECT id, username, email, password_hash, password_salt
       FROM admin_users
      WHERE LOWER(username) = ? OR LOWER(email) = ?
      LIMIT 1`,
    [normalized, normalized]
  );
  return rows[0] || null;
}

async function updateAdminPassword(adminId, passwordHash, passwordSalt) {
  const result = await query(
    `UPDATE admin_users
        SET password_hash = ?, password_salt = ?
      WHERE id = ?`,
    [passwordHash, passwordSalt, adminId]
  );
  return Boolean(result.affectedRows);
}

async function createAdminUser({ username, email, passwordHash, passwordSalt }) {
  const result = await query(
    `INSERT INTO admin_users (username, email, password_hash, password_salt)
     VALUES (?, ?, ?, ?)`,
    [username, email, passwordHash, passwordSalt]
  );
  const rows = await query(
    `SELECT id, username, email, updated_at
       FROM admin_users WHERE id = ?`,
    [result.insertId]
  );
  return rows[0] || null;
}

async function createAdminInvite({ email, tokenHash, expiresAt }) {
  await query(
    'UPDATE admin_invites SET used_at = CURRENT_TIMESTAMP WHERE email = ? AND used_at IS NULL',
    [email]
  );
  const result = await query(
    `INSERT INTO admin_invites (email, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [email, tokenHash, expiresAt]
  );
  return result.insertId;
}

async function getActiveAdminInvite(tokenHash) {
  const rows = await query(
    `SELECT id, email, expires_at
       FROM admin_invites
      WHERE token_hash = ?
        AND used_at IS NULL
        AND expires_at > NOW()
      LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

async function deleteAdminInvite(inviteId) {
  await query('DELETE FROM admin_invites WHERE id = ?', [inviteId]);
}

async function completeAdminInvite({ tokenHash, username, passwordHash, passwordSalt }) {
  const activePool = await initializeDatabase();
  const connection = await activePool.getConnection();
  try {
    await connection.beginTransaction();
    const [inviteRows] = await connection.execute(
      `SELECT id, email
         FROM admin_invites
        WHERE token_hash = ?
          AND used_at IS NULL
          AND expires_at > NOW()
        LIMIT 1
        FOR UPDATE`,
      [tokenHash]
    );
    if (!inviteRows.length) {
      await connection.rollback();
      return { status: 'invalid' };
    }

    const invite = inviteRows[0];
    const [existingRows] = await connection.execute(
      'SELECT id FROM admin_users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [invite.email]
    );
    if (existingRows.length) {
      await connection.rollback();
      return { status: 'exists' };
    }

    const [insertResult] = await connection.execute(
      `INSERT INTO admin_users (username, email, password_hash, password_salt)
       VALUES (?, ?, ?, ?)`,
      [username, invite.email, passwordHash, passwordSalt]
    );
    await connection.execute(
      'UPDATE admin_invites SET used_at = CURRENT_TIMESTAMP WHERE id = ?',
      [invite.id]
    );
    await connection.commit();
    return {
      status: 'created',
      account: { id: insertResult.insertId, username, email: invite.email }
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  initializeDatabase,
  listJobs,
  createJob,
  updateJob,
  deleteJob,
  getUserByEmail,
  createUserAccount,
  updateUserProfile,
  acceptUserConsent,
  incrementUserLoginCount,
  claimFirstUserLogin,
  getAdminByIdentifier,
  updateAdminPassword,
  createPasswordSecret,
  createAdminUser,
  createAdminInvite,
  getActiveAdminInvite,
  deleteAdminInvite,
  completeAdminInvite
};
