const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../portfolio.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT,
      title TEXT,
      bio TEXT,
      email TEXT,
      github TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      technologies TEXT,
      github TEXT
    )
  `);

  const adminCount = await get('SELECT COUNT(*) as count FROM admin');
  if (adminCount.count === 0) {
    await run('INSERT INTO admin (username, password) VALUES (?, ?)', ['swathi', '1234']);
    console.log('Default admin initialized (username: swathi / password: 1234)');
  }

  const profileCount = await get('SELECT COUNT(*) as count FROM profile');
  if (profileCount.count === 0) {
    await run(`
      INSERT INTO profile (id, name, title, bio, email, github)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      1,
      'Swathi',
      'CS Student | Full-Stack Developer',
      'I am a first-year Computer Science Engineering student interested in programming, web development and building useful digital projects.',
      'pswathi232022@gmail.com',
      'https://github.com/ihtaws-08/project'
    ]);
    console.log('Default profile initialized.');
  }

  const skillCount = await get('SELECT COUNT(*) as count FROM skills');
  if (skillCount.count === 0) {
    const defaultSkills = ['Python', 'SQL', 'HTML/CSS', 'MySQL', 'Git/GitHub', 'Node.js', 'Java'];
    for (const skill of defaultSkills) {
      await run('INSERT INTO skills (name) VALUES (?)', [skill]);
    }
    console.log('Default skills initialized.');
  }

  const projectCount = await get('SELECT COUNT(*) as count FROM projects');
  if (projectCount.count === 0) {
    await run(`
      INSERT INTO projects (title, description, technologies, github)
      VALUES (?, ?, ?, ?)
    `, [
      'Personal Portfolio CMS',
      'A full-stack portfolio management platform with live admin controls, responsive UI, and secure database persistence.',
      'Node.js, Express, SQLite, EJS, CSS3',
      'https://github.com/ihtaws-08/project'
    ]);
    await run(`
      INSERT INTO projects (title, description, technologies, github)
      VALUES (?, ?, ?, ?)
    `, [
      'Student Management System',
      'A console and web-based database application for managing student academic records and course enrollment.',
      'Python, MySQL, SQL',
      'https://github.com/ihtaws-08/project'
    ]);
    console.log('Default projects initialized.');
  }
}

module.exports = { db, run, get, all, initDb };
