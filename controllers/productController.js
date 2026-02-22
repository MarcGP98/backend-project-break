const Product = require('../models/Product');
const { validCategories, validSizes } = require('../models/Product');
const baseHtml = require('../helpers/baseHtml');
const getNavBar = require('../helpers/getNavBar');
const { getProductCards, getProductDetail, getProductForm, getMessageBox } = require('../helpers/template');

function parseProductBody(body) {
  return {
    name: body.name?.trim(),
    description: body.description?.trim(),
    image: body.image?.trim(),
    category: body.category?.trim(),
    size: body.size?.trim(),
    price: body.price !== undefined ? Number(body.price) : undefined
  };
}

function validateProduct(data) {
  if (!data.name || data.name.length < 2) return 'El nombre es obligatorio (mínimo 2 caracteres).';
  if (!data.description || data.description.length < 2) return 'La descripción es obligatoria.';
  if (!data.image) return 'La imagen (URL) es obligatoria.';
  if (!data.category || !validCategories.includes(data.category)) return 'Categoría inválida.';
  if (!data.size || !validSizes.includes(data.size)) return 'Talla inválida.';
  if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price < 0) return 'Precio inválido.';
  return '';
}

// GET /products?category=Camisetas
exports.showProducts = async (req, res) => {
  try {
    const category = req.query.category ? String(req.query.category) : '';
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });

    const navHtml = getNavBar({
      currentCategory: category,
      isDashboard: false,
      isLoggedIn: Boolean(req.session?.user?.isAdmin)
    });

    const bodyHtml = getProductCards(products, { basePath: '/products' });

    res.send(baseHtml({ title: 'Productos', navHtml, bodyHtml }));
  } catch (err) {
    res.status(500).send('Error cargando productos.');
  }
};

// GET /products/:productId
exports.showProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).send('Producto no encontrado.');

    const navHtml = getNavBar({
      currentCategory: '',
      isDashboard: false,
      isLoggedIn: Boolean(req.session?.user?.isAdmin)
    });

    const bodyHtml = getProductDetail(product, { isDashboard: false });

    res.send(baseHtml({ title: product.name, navHtml, bodyHtml }));
  } catch (err) {
    res.status(500).send('Error cargando el producto.');
  }
};

// GET /dashboard
exports.showDashboard = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const navHtml = getNavBar({
      currentCategory: '',
      isDashboard: true,
      isLoggedIn: true
    });

    const bodyHtml = getProductCards(products, { basePath: '/dashboard' });

    res.send(baseHtml({ title: 'Dashboard', navHtml, bodyHtml }));
  } catch (err) {
    res.status(500).send('Error cargando dashboard.');
  }
};

// GET /dashboard/new
exports.showNewProduct = async (req, res) => {
  const navHtml = getNavBar({ isDashboard: true, isLoggedIn: true });

  const bodyHtml = getProductForm({
    title: 'Crear Producto',
    action: '/dashboard',
    method: 'POST',
    product: {},
    categories: validCategories,
    sizes: validSizes,
    submitText: 'Crear',
    cancelHref: '/dashboard'
  });

  res.send(baseHtml({ title: 'Crear producto', navHtml, bodyHtml }));
};

// POST /dashboard
exports.createProduct = async (req, res) => {
  try {
    const data = parseProductBody(req.body);
    const error = validateProduct(data);
    if (error) {
      const navHtml = getNavBar({ isDashboard: true, isLoggedIn: true });
      const bodyHtml =
        getMessageBox(error, 'error') +
        getProductForm({
          title: 'Crear Producto',
          action: '/dashboard',
          method: 'POST',
          product: data,
          categories: validCategories,
          sizes: validSizes,
          submitText: 'Crear',
          cancelHref: '/dashboard'
        });

      return res.status(400).send(baseHtml({ title: 'Error', navHtml, bodyHtml }));
    }

    const created = await Product.create(data);
    return res.redirect(`/dashboard/${created._id}`);
  } catch (err) {
    return res.status(500).send('Error creando producto.');
  }
};

// GET /dashboard/:productId
exports.showDashboardProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).send('Producto no encontrado.');

    const navHtml = getNavBar({ isDashboard: true, isLoggedIn: true });
    const bodyHtml = getProductDetail(product, { isDashboard: true });

    res.send(baseHtml({ title: `Dashboard - ${product.name}`, navHtml, bodyHtml }));
  } catch (err) {
    res.status(500).send('Error cargando producto del dashboard.');
  }
};

// GET /dashboard/:productId/edit
exports.showEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).send('Producto no encontrado.');

    const navHtml = getNavBar({ isDashboard: true, isLoggedIn: true });

    const bodyHtml = getProductForm({
      title: 'Editar Producto',
      action: `/dashboard/${product._id}`,
      method: 'PUT',
      product,
      categories: validCategories,
      sizes: validSizes,
      submitText: 'Guardar',
      cancelHref: `/dashboard/${product._id}`
    });

    res.send(baseHtml({ title: 'Editar producto', navHtml, bodyHtml }));
  } catch (err) {
    res.status(500).send('Error cargando formulario de edición.');
  }
};

// PUT /dashboard/:productId
exports.updateProduct = async (req, res) => {
  try {
    const data = parseProductBody(req.body);
    const error = validateProduct(data);
    if (error) {
      const navHtml = getNavBar({ isDashboard: true, isLoggedIn: true });
      const bodyHtml =
        getMessageBox(error, 'error') +
        getProductForm({
          title: 'Editar Producto',
          action: `/dashboard/${req.params.productId}`,
          method: 'PUT',
          product: { _id: req.params.productId, ...data },
          categories: validCategories,
          sizes: validSizes,
          submitText: 'Guardar',
          cancelHref: `/dashboard/${req.params.productId}`
        });

      return res.status(400).send(baseHtml({ title: 'Error', navHtml, bodyHtml }));
    }

    const updated = await Product.findByIdAndUpdate(req.params.productId, data, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).send('Producto no encontrado.');
    return res.redirect(`/dashboard/${updated._id}`);
  } catch (err) {
    res.status(500).send('Error actualizando producto.');
  }
};

// DELETE /dashboard/:productId/delete
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error eliminando producto.');
  }
};