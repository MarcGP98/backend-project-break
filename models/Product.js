const mongoose = require('mongoose');

const validCategories = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    description: { type: String, required: true, trim: true, minlength: 2, maxlength: 300 },
    image: { type: String, required: true, trim: true },
    category: { type: String, enum: validCategories, required: true },
    size: { type: String, enum: validSizes, required: true },
    price: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
module.exports.validCategories = validCategories;
module.exports.validSizes = validSizes;