export const validateProducts = (product, fileRequired=true) =>    {
    const errors = {};

    if (!product.name.trim()) {
        errors.name = "El nombre es obligatorio";
    }

    if (!product.price || product.price <= 0) {
        errors.price = "El precio debe ser un número positivo";
    }

    if (!product.description.trim()) {  
        errors.description = "La descripción es obligatoria";
    }

    if (!product.category.trim()) {
        errors.category = "La categoría es obligatoria";
    }

    if (fileRequired && !product.file) {
        errors.file = "El archivo es obligatorio";
    }

    // Stock validation: must be a number >= 0 (allow empty as 0)
    if (product.stock !== undefined) {
        const stockNum = Number(product.stock);
        if (Number.isNaN(stockNum) || stockNum < 0) {
            errors.stock = "El stock debe ser 0 o un número positivo";
        }
    }

    return errors;

}