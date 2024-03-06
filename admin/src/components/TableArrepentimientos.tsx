import axios from "axios";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Loader from "../common/Loader";
import { Select } from "@mui/material";
import SelectInput from "@mui/material/Select/SelectInput";

const TableArrepentimiento = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [arrepentimientos, setArrepentimientos] = useState([]);
  const navigate = useNavigate();
  const [createdOrder, setCreatedOrder] = useState("DESC");
  const [estadoOrder, setEstadoOrder] = useState("sin responder");

  const handleCreated = () => {
    let newCreatedOrder;
    if (createdOrder === "ASC") {
      newCreatedOrder = "DESC";
    } else {
      newCreatedOrder = "ASC";
    }
    setCreatedOrder(newCreatedOrder);
    fetcharrepentimientos(currentPage, estadoOrder, createdOrder);
  }

  const handleStock = (e: any) => {
    setCurrentPage(1);
    setEstadoOrder(e.target.value); // Actualizar estado del orden de stock
    fetcharrepentimientos(currentPage, e.target.value, createdOrder);
  };

  const fetcharrepentimientos = async (page: number, estadoOrder: string, createdOrder: string) => {

    try {
      setLoading(true);
      const response = await axios.get(constants.API_URL + `paginas/arrepentimiento/pages/${page}?estadoOrder=${estadoOrder}&createdOrder=${createdOrder}`);
      setArrepentimientos(response.data.data);
      console.log(response.data)
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or display a user-friendly message
    }
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const numeroPaginas = await axios.get(constants.API_URL + 'paginas/arrepentimiento/totalPages');
      setTotalPages(numeroPaginas.data);
      await fetcharrepentimientos(currentPage, estadoOrder, createdOrder);
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
  }, [currentPage]);

  const parsearFecha = (fecha: string) => {
    const fechaParseada = new Date(fecha);
    return fechaParseada.toLocaleDateString();
  }
  // const handleDelete = (id: number) => {
  //   console.log(id);
  //   axios.delete(constants.API_URL + 'productos/' + id)
  //     .then((response) => {
  //       console.log(response);
  //       // arrepentimientos.filter((arrepentimiento: any) => arrepentimiento.ID !== id);
  //       fetchData();
  //     })
  // }

  return (
    // <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <>
      {loading ? <Loader /> : null}
      <div className="max-h-115 md:max-h-125 lg:max-h-180 overflow-y-auto overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nombre
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Email
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center flex gap-1">
                Estado
                <select value={estadoOrder} onChange={(e) => handleStock(e)}>
                  <option value="sin responder">Sin responder</option>
                  <option value="todos">Todos</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="en proceso">En proceso</option>
                </select>
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
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    )
                    }

                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {arrepentimientos === undefined && (
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
                        Sin mensajes
                      </h5>
                    </div>
                  </div>
                </td>
              </tr>
            )
            }
            {arrepentimientos !== undefined && arrepentimientos.map((arrepentimiento: any) => (
              <tr key={arrepentimiento.id} className="border-b border-[#eee] dark:border-strokedark">
                <td className="py-5 px-4 pl-9">
                  <div>
                    <h5 className="font-medium text-black dark:text-white truncate w-50">
                      {arrepentimiento.nombre}
                    </h5>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white text-center">
                    {arrepentimiento.email}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">
                    {arrepentimiento.estado}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">
                    {parsearFecha(arrepentimiento.createdAt)}
                  </p>
                </td>
                <td className="py-5 px-4">
                  <div className="flex items-center space-x-3.5 justify-center">
                    <button
                      onClick={() => navigate('/arrepentimiento/view/' + arrepentimiento.id, { state: { arrepentimiento } })}
                      className="hover:text-primary"
                    >
                      <svg

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
                      <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V10M20.6067 8.26229L15.5499 11.6335C14.2669 12.4888 13.6254 12.9165 12.932 13.0827C12.3192 13.2295 11.6804 13.2295 11.0677 13.0827C10.3743 12.9165 9.73279 12.4888 8.44975 11.6335L3.14746 8.09863M14 21L16.025 20.595C16.2015 20.5597 16.2898 20.542 16.3721 20.5097C16.4452 20.4811 16.5147 20.4439 16.579 20.399C16.6516 20.3484 16.7152 20.2848 16.8426 20.1574L21 16C21.5523 15.4477 21.5523 14.5523 21 14C20.4477 13.4477 19.5523 13.4477 19 14L14.8426 18.1574C14.7152 18.2848 14.6516 18.3484 14.601 18.421C14.5561 18.4853 14.5189 18.5548 14.4903 18.6279C14.458 18.7102 14.4403 18.7985 14.405 18.975L14 21Z" 
                        stroke-width="1" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        className="fill-current" 
                        stroke="#fff"/>
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

export default TableArrepentimiento;
