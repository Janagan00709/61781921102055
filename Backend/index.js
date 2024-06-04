require('dotenv').config();
const express = require('express');
const { fetchProductsFromCompany } = require('./helpers');
const app = express();
const PORT = 3000;

app.use(express.json());

// Generate a unique identifier for products
const generateProductId = (product, company) => {
    return `${company}-${product.id}`;
};

// GET /categories/:category/products
app.get('/categories/:category/products', async (req, res) => {
    const { category } = req.params;
    const { n = 10, page = 1, sort = 'price', order = 'asc', minPrice = 0, maxPrice = 10000 } = req.query;
    const companies = ["ANTTEULPT", "SAPT", "THYN", "AZO"];
    
    try {
        const allProductsPromises = companies.map(company => 
            fetchProductsFromCompany(company, category, minPrice, maxPrice, n)
        );

        const allProductsArrays = await Promise.all(allProductsPromises);
        const allProducts = allProductsArrays.flat().map(product => ({
            ...product,
            id: generateProductId(product, product.company),
        }));

        // Sort products
        allProducts.sort((a, b) => {
            if (order === 'asc') {
                return a[sort] > b[sort] ? 1 : -1;
            } else {
                return a[sort] < b[sort] ? 1 : -1;
            }
        });

        // Pagination
        const startIndex = (page - 1) * n;
        const paginatedProducts = allProducts.slice(startIndex, startIndex + n);

        res.json(paginatedProducts);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching products.', details: error.message });
    }
});

// GET /categories/:category/products/:productId
app.get('/categories/:category/products/:productId', async (req, res) => {
    const { category, productId } = req.params;
    const [company, id] = productId.split('-');

    try {
        const products = await fetchProductsFromCompany(company, category, 0, 10000, 100);
        const product = products.find(p => generateProductId(p, company) === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the product.', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
