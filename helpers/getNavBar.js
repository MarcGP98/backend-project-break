function getNavBar({ currentCategory = '', isDashboard = false, isLoggedIn = false }) {
  const categories = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];

  let links = `
    <a class="nav-link ${currentCategory === '' ? 'active' : ''}" href="/products">Productos</a>
  `;

  for (let cat of categories) {
    const active = currentCategory === cat ? 'active' : '';
    links += `<a class="nav-link ${active}" href="/products?category=${encodeURIComponent(cat)}">${cat}</a>`;
  }

  if (isDashboard) {
    links += `<a class="nav-link" href="/dashboard/new">Nuevo producto</a>`;
    links += `<a class="nav-link" href="/logout">Logout</a>`;
  } else {
    links += isLoggedIn
      ? `<a class="nav-link" href="/dashboard">Dashboard</a>`
      : `<a class="nav-link" href="/login">Login</a>`;
  }

  return `
    <nav class="navbar">
      <div class="navbar-inner">
        ${links}
      </div>
    </nav>
  `;
}

module.exports = getNavBar;