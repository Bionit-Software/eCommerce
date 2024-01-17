import axios from 'axios';
import Breadcrumb from '../components/Breadcrumb';
import { useEffect, useState } from 'react';
import TableProductos from '../components/TableProductos';

const TablesProducto = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/productos/all');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error or display a user-friendly message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Tablas" />
      <div className="flex flex-col gap-10">
        <TableProductos products={products} />
      </div>
    </>
  );
};

export default TablesProducto;