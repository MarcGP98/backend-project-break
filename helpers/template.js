function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getProductCards(products, { basePath = '/products' } = {}) {
  let html = '<h1 class="page-title">Productos</h1>';

  if (!products || products.length === 0) {
    html += `<p class="muted">No hay productos todavía.</p>`;
    return html;
  }

  html += `<div class="grid">`;

  for (let p of products) {
    html += `
      <article class="card">
        <div class="card-img-wrap">
          <img class="card-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />
        </div>
        <h2 class="card-title">${escapeHtml(p.name)}</h2>
        <a class="btn" href="${basePath}/${p._id}">Ver</a>
      </article>
    `;
  }

  html += `</div>`;
  return html;
}

function getProductDetail(product, { isDashboard = false } = {}) {
  const buttons = isDashboard
    ? `
      <div class="actions">
        <a class="btn" href="/dashboard/${product._id}/edit">Editar</a>

        <form action="/dashboard/${product._id}/delete?_method=DELETE" method="POST">
          <button class="btn danger" type="submit">Borrar</button>
        </form>
      </div>
    `
    : '';

  return `
    <div class="detail-wrap">
      <article class="detail-card">
        <h1 class="detail-title">${escapeHtml(product.name)}</h1>
        <img class="detail-img" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />
        <p class="detail-desc">${escapeHtml(product.description)}</p>

        <div class="detail-meta">
          <p><strong>${Number(product.price).toFixed(2)}€</strong></p>
          <p>Categoría: ${escapeHtml(product.category)}</p>
          <p>Talla: ${escapeHtml(product.size)}</p>
        </div>

        ${buttons}
      </article>
    </div>
  `;
}

function getProductForm({
  title,
  action,
  method = 'POST',
  product = {},
  categories = [],
  sizes = [],
  submitText = 'Guardar',
  cancelHref = '/dashboard'
}) {
  const name = escapeHtml(product.name);
  const description = escapeHtml(product.description);
  const image = escapeHtml(product.image);
  const price = product.price !== undefined ? escapeHtml(product.price) : '';

  let categoryOptions = `<option value="">— Selecciona —</option>`;
  for (let c of categories) {
    const selected = product.category === c ? 'selected' : '';
    categoryOptions += `<option value="${escapeHtml(c)}" ${selected}>${escapeHtml(c)}</option>`;
  }

  let sizeOptions = `<option value="">— Selecciona —</option>`;
  for (let s of sizes) {
    const selected = product.size === s ? 'selected' : '';
    sizeOptions += `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(s)}</option>`;
  }

  //HTML forms solo GET/POST
  const finalAction = method === 'POST' ? action : `${action}?_method=${method}`;

  return `
    <h1 class="page-title">${escapeHtml(title)}</h1>

    <div class="form-wrap">
      <form class="form-card" action="${finalAction}" method="POST">
        <label>Nombre:</label>
        <input name="name" value="${name}" required />

        <label>Descripción:</label>
        <textarea name="description" rows="4" required>${description}</textarea>

        <label>Precio:</label>
        <input name="price" type="number" min="0" step="0.01" value="${price}" required />

        <label>Imagen (URL):</label>
        <input name="image" value="${image}" required />

        <label>Categoría:</label>
        <select name="category" required>
          ${categoryOptions}
        </select>

        <label>Talla:</label>
        <select name="size" required>
          ${sizeOptions}
        </select>

        <button class="btn" type="submit">${escapeHtml(submitText)}</button>
        <a class="btn ghost" href="${escapeHtml(cancelHref)}">Cancelar</a>
      </form>
    </div>
  `;
}

function getMessageBox(message, type = 'info') {
  if (!message) return '';
  const t = type === 'error' ? 'msg error' : 'msg';
  return `<div class="${t}">${escapeHtml(message)}</div>`;
}

module.exports = {
  getProductCards,
  getProductDetail,
  getProductForm,
  getMessageBox
};