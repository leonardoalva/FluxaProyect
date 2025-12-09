const BASE_URL = 'https://6909e3d91a446bb9cc20771b.mockapi.io/products';

export const getProducts = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Error al obtener productos');
    }
    return await response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error('Error al crear el producto');
    }

    return await response.json();
};
