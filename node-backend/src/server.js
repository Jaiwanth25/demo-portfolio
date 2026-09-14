const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { get, all, run, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'swathi_portfolio_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware for admin routes
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.redirect('/admin');
}

// -------------------------------------------------------------
// PUBLIC PORTFOLIO ROUTE
// -------------------------------------------------------------
app.get('/', async (req, res) => {
  try {
    let profile = await get('SELECT * FROM profile WHERE id = 1');
    if (!profile) {
      profile = {
        name: 'Swathi',
        title: 'CS Student | Full-Stack Developer',
        bio: 'I am a first-year Computer Science Engineering student interested in programming, web development and building useful digital projects.',
        email: 'pswathi232022@gmail.com',
        github: 'https://github.com/ihtaws-08/project'
      };
    }
    const skills = await all('SELECT * FROM skills ORDER BY id ASC');
    const projects = await all('SELECT * FROM projects ORDER BY id DESC');

    res.render('portfolio', { profile, skills, projects });
  } catch (err) {
    console.error('Error loading portfolio:', err);
    res.status(500).send('Internal Server Error loading portfolio.');
  }
});

// -------------------------------------------------------------
// ADMIN LOGIN
// -------------------------------------------------------------
app.get('/admin', (req, res) => {
  if (req.session && req.session.admin) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

app.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await get('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password]);

    if (user) {
      req.session.admin = { id: user.id, username: user.username };
      return res.redirect('/dashboard');
    }

    res.render('login', { error: 'Invalid username or password. Please try again.' });
  } catch (err) {
    console.error('Error during login:', err);
    res.render('login', { error: 'An error occurred during authentication.' });
  }
});

// -------------------------------------------------------------
// ADMIN DASHBOARD
// -------------------------------------------------------------
app.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const profile = await get('SELECT * FROM profile WHERE id = 1');
    const skills = await all('SELECT * FROM skills ORDER BY id ASC');
    const projects = await all('SELECT * FROM projects ORDER BY id DESC');
    const message = req.query.msg || null;
    const error = req.query.err || null;

    res.render('dashboard', { profile, skills, projects, message, error });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Error loading admin dashboard.');
  }
});

// -------------------------------------------------------------
// CMS ACTIONS
// -------------------------------------------------------------
app.post('/update-profile', requireAdmin, async (req, res) => {
  try {
    const { name, title, bio, email, github } = req.body;
    await run(`
      UPDATE profile
      SET name = ?, title = ?, bio = ?, email = ?, github = ?
      WHERE id = 1
    `, [name, title, bio, email, github]);

    res.redirect('/dashboard?msg=Profile+updated+successfully');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.redirect('/dashboard?err=Failed+to+update+profile');
  }
});

app.post('/add-skill', requireAdmin, async (req, res) => {
  try {
    const skill = (req.body.skill || '').trim();
    if (skill) {
      await run('INSERT INTO skills (name) VALUES (?)', [skill]);
    }
    res.redirect('/dashboard?msg=Skill+added+successfully');
  } catch (err) {
    console.error('Error adding skill:', err);
    res.redirect('/dashboard?err=Failed+to+add+skill');
  }
});

app.all(['/delete-skill/:id', '/delete-skill'], requireAdmin, async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (id) {
      await run('DELETE FROM skills WHERE id = ?', [id]);
    }
    res.redirect('/dashboard?msg=Skill+removed+successfully');
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.redirect('/dashboard?err=Failed+to+delete+skill');
  }
});

app.post('/add-project', requireAdmin, async (req, res) => {
  try {
    const { title, description, technologies, github } = req.body;
    if (title && title.trim()) {
      await run(`
        INSERT INTO projects (title, description, technologies, github)
        VALUES (?, ?, ?, ?)
      `, [title.trim(), description.trim(), technologies.trim(), github.trim()]);
    }
    res.redirect('/dashboard?msg=Project+added+successfully');
  } catch (err) {
    console.error('Error adding project:', err);
    res.redirect('/dashboard?err=Failed+to+add+project');
  }
});

app.all(['/delete-project/:id', '/delete-project'], requireAdmin, async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (id) {
      await run('DELETE FROM projects WHERE id = ?', [id]);
    }
    res.redirect('/dashboard?msg=Project+removed+successfully');
  } catch (err) {
    console.error('Error deleting project:', err);
    res.redirect('/dashboard?err=Failed+to+delete+project');
  }
});

app.post('/change-password', requireAdmin, async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const adminUser = await get('SELECT * FROM admin WHERE username = ?', ['swathi']);

    if (!adminUser || adminUser.password !== current_password) {
      return res.redirect('/dashboard?err=Current+password+is+incorrect#password');
    }

    if (new_password !== confirm_password) {
      return res.redirect('/dashboard?err=New+passwords+do+not+match#password');
    }

    if (!new_password || !new_password.trim()) {
      return res.redirect('/dashboard?err=Password+cannot+be+empty#password');
    }

    await run('UPDATE admin SET password = ? WHERE username = ?', [new_password.trim(), 'swathi']);
    res.redirect('/dashboard?msg=Password+changed+successfully#password');
  } catch (err) {
    console.error('Error changing password:', err);
    res.redirect('/dashboard?err=Failed+to+change+password#password');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------
app.get('/api/portfolio', async (req, res) => {
  try {
    const profile = await get('SELECT * FROM profile WHERE id = 1');
    const skills = await all('SELECT * FROM skills ORDER BY id ASC');
    const projects = await all('SELECT * FROM projects ORDER BY id DESC');
    res.json({ profile, skills, projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const profile = await get('SELECT * FROM profile WHERE id = 1');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await all('SELECT * FROM skills ORDER BY id ASC');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await all('SELECT * FROM projects ORDER BY id DESC');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Portfolio Live at:   http://localhost:${PORT}`);
    console.log(` Admin Portal at:     http://localhost:${PORT}/admin`);
    console.log(` REST API at:         http://localhost:${PORT}/api/portfolio`);
    console.log(`=================================================`);
  });
}

start();
