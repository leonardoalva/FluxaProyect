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

export const deleteProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Error al eliminar el producto');
    }

    return await response.json();
};

// Small helper to retry fetches (handles transient network errors)
const fetchWithRetries = async (url, options = {}, retries = 2, backoff = 500) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        return response;
    } catch (err) {
        if (retries > 0) {
            await new Promise((res) => setTimeout(res, backoff));
            return fetchWithRetries(url, options, retries - 1, backoff * 2);
        }
        // Re-throw the original error after exhausting retries

        throw err;
    }
};

export const getProduct = async (id) => {
    const response = await fetchWithRetries(`${BASE_URL}/${id}`);
    return await response.json();
};

export const descontarStock = async (id, cantidad) => { const producto = await getProduct(id); const nuevoStock = (producto.stock ?? 0) - cantidad; return updateProduct(id, { stock: nuevoStock }); };

export const updateProduct = async (id, payload) => {
    const response = await fetchWithRetries(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    return await response.json();
};
