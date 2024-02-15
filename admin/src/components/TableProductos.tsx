import axios from "axios";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Loader from "../common/Loader";

const TableProductos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const navigate = useNavigate();
  const [createdOrder, setCreatedOrder] = useState("DESC");
  const [stockOrder, setStockOrder] = useState("neutral");

  const handleCreated = () => {
    let newCreatedOrder;
    if (createdOrder === "ASC") {
      newCreatedOrder = "DESC";
    } else if (createdOrder === "DESC") {
      newCreatedOrder = "neutral"; // Cambiar a estado neutral
    } else {
      newCreatedOrder = "ASC";
    }
    setCreatedOrder(newCreatedOrder);
    fetchProducts(currentPage, newCreatedOrder, createdOrder);
  }

  const handleStock = () => {
    let newStockOrder;
    if (stockOrder === "ASC") {
      newStockOrder = "DESC";
    } else if (stockOrder === "DESC") {
      newStockOrder = "neutral"; // Cambiar a estado neutral
    } else {
      newStockOrder = "ASC";
    }
    setStockOrder(newStockOrder); // Actualizar estado del orden de stock
    fetchProducts(currentPage, newStockOrder, createdOrder);
  };

  const fetchProducts = async (page: number, stockOrder: string, createdOrder: string) => {

    try {
      setLoading(true);
      const response = await axios.get(constants.API_URL + `productos/pages/${page}?searchTerm=${searchTerm}&stockOrder=${stockOrder}&createdOrder=${createdOrder}`);
      setProducts(response.data.productos);
      console.log(response.data.productos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or display a user-friendly message
    }
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const numeroPaginas = await axios.get(constants.API_URL + 'productos/totalPages');
      setTotalPages(numeroPaginas.data);
      await fetchProducts(currentPage, stockOrder, createdOrder);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or display a user-friendly message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    // fetchData();
    const timer = setTimeout(() => {
      fetchData();
    }, 500); // Espera 500 ms después de que searchTerm cambie antes de ejecutar fetchData

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const parsearFecha = (fecha: string) => {
    const fechaParseada = new Date(fecha);
    return fechaParseada.toLocaleDateString();
  }
  const handleDelete = (id: number) => {
    console.log(id);
    axios.delete(constants.API_URL + 'productos/' + id)
      .then((response) => {
        console.log(response);
        // products.filter((product: any) => product.ID !== id);
        fetchData();
      })
  }

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value); // Actualiza el término de búsqueda
    setCurrentPage(1);
  };

  const urlImage = (images) => {
    const urls = images.split(',');
    return urls[0];
  }

  return (
    // <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <>
    {loading ? <Loader /> : null}
      <div className="max-h-115 md:max-h-125 lg:max-h-180 overflow-y-auto overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Producto
                <input
                  type="text"
                  placeholder="Buscar"
                  className="w-1/2 rounded-md border border-stroke dark:border-strokedark ml-4 p-1"
                  value={searchTerm} // Vincula el valor del campo de búsqueda al estado searchTerm
                  onChange={handleSearch} // Maneja los cambios en el campo de búsqueda
                />
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Precio
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                <button
                  className="flex items-center justify-center"
                  onClick={handleStock}
                >
                  Stock
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {stockOrder === "ASC" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    ) : stockOrder === "DESC" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4h16M4 12h16M4 20h16"
                      />
                    )}
                  </svg>
                </button>
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Categoria
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Marca
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                <button
                  className="flex items-center justify-center"
                  onClick={handleCreated}
                >
                  Fecha
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {createdOrder === "ASC" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    ) : createdOrder === "DESC" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4h16M4 12h16M4 20h16"
                      />
                    )}
                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products === undefined && (
              <tr className="border-b border-[#eee] dark:border-strokedark">
                <td className="py-5 px-4 pl-9 xl:pl-11">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 mr-3">
                      <img
                        className="rounded-full"
                        src="https://images.unsplash.com/photo-1611095770685-5a4d1e0a5f9e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5JTIwc2hvcHBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        Sin productos
                      </h5>
                      <p className="text-sm">Tenés que agregar productos</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">$0.00</p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">Fecha</p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">
                    <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                      Paid
                    </span>
                  </p>
                </td>
              </tr>
            )
            }
            {products !== undefined && products.map((product: any) => (
              <tr key={product.ID} className="border-b border-[#eee] dark:border-strokedark">
                <td className="py-5 px-4 pl-9 xl:pl-11">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-3 ">
                      <img
                        src={urlImage(product.imagenes)}
                        alt=""
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white truncate w-50">
                        {product.nombre}
                      </h5>
                      <p className="text-sm truncate w-50">
                        {product.descripcion}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white text-center">
                    {product.precio}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white text-center">
                    {product.stock}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white text-center">
                    {product.idCategoria}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white text-center">
                    {product.idMarca}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white text-center">
                    {parsearFecha(product.createdAt)}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <div className="flex items-center space-x-3.5 justify-center">
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(product.ID)}
                      className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate('/tablas/productos/edit', { state: { product } })}
                      className="hover:text-primary"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                          fill=""
                        />
                        <path
                          d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        changePage={setCurrentPage}
      />
    </>
  );
};

export default TableProductos;
