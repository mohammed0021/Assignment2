const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', price: 3500, category: 'Electronics', description: 'High performance laptop' },
  { id: 2, name: 'Mouse', price: 50, category: 'Electronics', description: 'Wireless mouse' },
  { id: 3, name: 'Notebook', price: 8, category: 'Stationery', description: '100 pages notebook' }
];
let nextId = 4;

// ----- WEB FUNCTIONALITIES -----

// Functionality 1: View all products
app.get('/', (req, res) => {
  res.render('index', { products });
});

// Functionality 2: Add a new product (form + submit)
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { name, price, category, description } = req.body;
  const product = { id: nextId++, name, price: parseFloat(price), category, description };
  products.push(product);
  res.redirect('/');
});

// Functionality 3: View product details by ID
app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.render('product', { product });
});

// ----- RESTful WEB SERVICES (TWO functionalities as REST APIs) -----

// Functionality 4: RESTful - Get all products (GET /api/products)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Functionality 5: RESTful - Add a product (POST /api/products)
app.post('/api/products', (req, res) => {
  const { name, price, category, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  const product = {
    id: nextId++,
    name,
    price: parseFloat(price),
    category: category || 'Uncategorized',
    description: description || ''
  };
  products.push(product);
  res.status(201).json(product);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
