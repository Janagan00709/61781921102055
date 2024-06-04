import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, Container, Grid, Typography } from '@material-ui/core';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('Phone');
    const [n, setN] = useState(10);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('price');
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        fetchProducts();
    }, [category, n, page, sort, order]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/categories/${category}/products`, {
                params: { n, page, sort, order },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4">Top Products</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        select
                    >
                        <MenuItem value="Phone">Phone</MenuItem>
                        <MenuItem value="Computer">Computer</MenuItem>
                        {/* Add other categories */}
                    </TextField>
                    <TextField
                        label="Number of Products"
                        value={n}
                        onChange={(e) => setN(e.target.value)}
                        type="number"
                    />
                    <TextField
                        label="Sort By"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        select
                    >
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        {/* Add other sort options */}
                    </TextField>
                    <TextField
                        label="Order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        select
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </TextField>
                    <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
                        Previous
                    </Button>
                    <Button onClick={() => setPage(page + 1)}>Next</Button>
                </Grid>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography>Price: ${product.price}</Typography>
                        <Typography>Rating: {product.rating}</Typography>
                        {/* Add more product details */}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;
