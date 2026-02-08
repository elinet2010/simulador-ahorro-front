import { getAllProducts } from '@/data/products';
import ProductsClient from '@/components/products/ProductsClient/ProductsClient';
import './products.css';

// SSR (Server-Side Rendering)
// La página se renderiza en el servidor en cada solicitud
// Esto garantiza que los datos siempre estén actualizados
export default async function ProductsPage() {
	// Cargar productos en el servidor en cada request
	// Con SSR, esta función se ejecuta en el servidor para cada solicitud
	const products = getAllProducts();

	return <ProductsClient products={products} />;
}
