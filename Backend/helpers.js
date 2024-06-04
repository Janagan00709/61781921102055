const axios = require('axios');

const TEST_SERVER_BASE_URL = 'http://20.244.56.144/test';
const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    throw new Error('AUTH_TOKEN is not defined in the environment variables');
}

const fetchProductsFromCompany = async (company, category, minPrice, maxPrice, limit) => {
    try {
        const response = await axios.get(`${TEST_SERVER_BASE_URL}/companies/${company}/categories/${category}/products`, {
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
            params: {
                minPrice,
                maxPrice,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching products from ${company}:`, error.response ? error.response.data : error.message);
        throw new Error(`Failed to fetch products from ${company}`);
    }
};

module.exports = { fetchProductsFromCompany };
