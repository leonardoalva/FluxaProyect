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

export const updateProductStock = async (productId, newStock) => {
    try {
        // PRIMERO: Obtener el producto actual
        const getResponse = await fetch(`${BASE_URL}/${productId}`);
        
        if (!getResponse.ok) {
            throw new Error('Error al obtener producto');
        }
        
        const currentProduct = await getResponse.json();
        
        // SEGUNDO: Actualizar solo el stock pero mantener otros campos
        const updatedProduct = {
            ...currentProduct,
            stock: newStock
        };
        
        // TERCERO: Enviar actualización con PUT
        const response = await fetch(`${BASE_URL}/${productId}`, {
            method: 'PUT', // Cambiado a PUT
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar stock');
        }

        const updatedProductData = await response.json();
        return updatedProductData;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}