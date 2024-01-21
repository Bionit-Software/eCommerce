import axios from 'axios';
import Breadcrumb from '../components/Breadcrumb';
import { useEffect, useState } from 'react';
import TableProductos from '../components/TableProductos';
import constants from '../constants';
const TablesProducto = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(constants.API_URL + 'productos/all');
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
      <Breadcrumb pageName="Productos" />
      <div className="flex flex-col gap-10">
        <TableProductos products={products} />
      </div>
    </>
  );
};

export default TablesProducto;