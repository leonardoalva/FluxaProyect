import { useState } from "react";
import { ProductFormUI } from "../ProductFormUI/ProductFormUI";
import { validateProducts } from "../../../utils/validateProducts";
import { uploadToImgbb } from "../../../services/uploadImage";
import { createProduct } from "../../../services/products";

import "./ProductFormContainer.css";

export const ProductFormContainer = ({ onCreated }) => {
  const [loading, setLoading] = useState();
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const productWithFile = { ...product, file };
    const newErrors = validateProducts(productWithFile);

    // If there are validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    // Proceed with image upload and product creation
    try {
      const imageUrl = await uploadToImgbb(file);
      const stockValue = Number(product.stock);
      const productData = {
        ...product,
        price: Number(product.price),
        stock: Number.isNaN(stockValue) ? 0 : stockValue,
        imageUrl,
      };

      await createProduct(productData);
      alert("Producto creado exitosamente");

      setProduct({name: "", price: "", description: "", category: "", stock: ""});
      setFile(null);

      if (onCreated) onCreated();



    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductFormUI className="product-form-container"
      product={product}
      errors={errors}
      onChange={handleChange}
      onFileChange={setFile}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};
