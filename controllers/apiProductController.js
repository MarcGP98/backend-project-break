const Product = require('../models/Product');
const { validCategories, validSizes } = require('../models/Product');

function parseBody(body) {
  return {
    name: body.name?.trim(),
    description: body.description?.trim(),
    image: body.image?.trim(),
    category: body.category?.trim(),
    size: body.size?.trim(),
    price: body.price !== undefined ? Number(body.price) : undefined
  };
}

function validate(data) {
  if (!data.name) return 'name es obligatorio';
  if (!data.description) return 'description es obligatorio';
  if (!data.image) return 'image es obligatorio';
  if (!data.category || !validCategories.includes(data.category)) return 'category inválida';
  if (!data.size || !validSizes.includes(data.size)) return 'size inválida';
  if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price < 0) return 'price inválido';
  return '';
}

// GET /api/products?category=...
exports.getAll = async (req, res) => {
  try {
    const category = req.query.category ? String(req.query.category) : '';
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'No encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
};

// POST /api/products
exports.create = async (req, res) => {
  try {
    const data = parseBody(req.body);
    const error = validate(data);
    if (error) return res.status(400).json({ error });

    const created = await Product.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Error creando producto' });
  }
};

// PUT /api/products/:id
exports.update = async (req, res) => {
  try {
    const data = parseBody(req.body);
    const error = validate(data);
    if (error) return res.status(400).json({ error });

    const updated = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};

// DELETE /api/products/:id
exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};