import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axios from "axios";
import URL from "../../../constantes";
import PaginationShop from "../../Pagination";
function Items({ currentItems }) {

  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item.id} className="w-full">
            <Product
              id={item.id}
              url_image={item.imagenes}
              imagenes={item.imagenes}
              nombre={item.nombre}
              precio={item.precio}
              stock={item.stock}
              descripcion={item.descripcion}
              color={item.color}
              badge={item.badge}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, categoria, precio }) => {

  console.log(categoria + "categoria")
  console.log(precio + "precio")
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchProducts = async (page, categoria, precio) => {
    try {
      setLoading(true);
      const response = await axios.get(URL.API_URL + `productos/tienda/pages/${page}?categoria=${categoria}&precioDesde=${precio?.priceOne}&precioHasta=${precio?.priceTwo}`)
      setItems(response.data.productos);
      console.log(response.data.productos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const numeroPaginas = await axios.get(URL.API_URL + 'productos/totalPages');
        console.log(numeroPaginas.data)
        setTotalPages(numeroPaginas.data);
        await fetchProducts(currentPage, categoria, precio);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, categoria, precio]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={items} />
      </div>
      <div className="justify-center mdl:justify-between items-center mt-5">
        <PaginationShop
          totalPages={totalPages}
          currentPage={currentPage}
          changePage={setCurrentPage}
        />
      </div>

    </div>
  );
};

export default Pagination;
