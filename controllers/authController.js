const baseHtml = require('../helpers/baseHtml');
const getNavBar = require('../helpers/getNavBar');
const { getMessageBox } = require('../helpers/template');

function loginForm(msg = '') {
  return `
    <h1 class="page-title">Login</h1>
    ${getMessageBox(msg, msg ? 'error' : 'info')}

    <div class="form-wrap">
      <form class="form-card" action="/login" method="POST">
        <label>Email:</label>
        <input name="email" type="email" required />

        <label>Contraseña:</label>
        <input name="password" type="password" required />

        <button class="btn" type="submit">Login</button>
        <a class="btn ghost" href="/products">Atrás</a>
      </form>
    </div>
  `;
}

exports.showLogin = (req, res) => {
  const msg = req.query.msg ? String(req.query.msg) : '';
  const navHtml = getNavBar({ isDashboard: false, isLoggedIn: false });
  const bodyHtml = loginForm(msg);

  res.send(baseHtml({ title: 'Login', navHtml, bodyHtml }));
};

exports.doLogin = (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!adminEmail || !adminPassword) {
    const navHtml = getNavBar({ isDashboard: false, isLoggedIn: false });
    const bodyHtml = loginForm('Faltan variables ADMIN_EMAIL / ADMIN_PASSWORD en .env');
    return res.status(500).send(baseHtml({ title: 'Error', navHtml, bodyHtml }));
  }

  if (email === adminEmail && password === adminPassword) {
    req.session.user = { email, isAdmin: true };
    return res.redirect('/dashboard');
  }

  const msg = encodeURIComponent('Credenciales incorrectas');
  return res.redirect(`/login?msg=${msg}`);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/products');
  });
};