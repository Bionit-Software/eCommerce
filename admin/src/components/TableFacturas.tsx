import axios from "axios";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Modal } from "@mui/material";

const TableFacturas = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [facturas, setFacturas] = useState([])
  const [modalData, setModalData] = useState([{}] as any);
  const [open, setOpen] = useState(false);
  const parsearFecha = (fecha: string) => {
    const fechaParseada = new Date(fecha);
    return fechaParseada.toLocaleDateString();
  }

  useEffect(() => {
    const fetchData = async () => {
      const numeroPaginas = await axios.get(constants.API_URL + 'mercadopago/facturas/totalPages');
      setTotalPages(numeroPaginas.data);
      const response = await fetch(constants.API_URL + `mercadopago/facturas/pages/${currentPage}`)
      const data = await response.json()
      setFacturas(data)
    }
    fetchData()
  }, [currentPage])

  const handleView = (product: any) => {
    setOpen(true)
    if (product) {
      setModalData(product)
    } else {
      console.log('No se encontró la factura')
    }
  }

  const handleModalClose = () => {
    setModalData([{}]);
    setOpen(false)
  }

  const ModalContent = () => {
    console.log(modalData)
    return (
      <div className="bg-white dark:bg-boxdark w-full md:w-1/2 lg:w-1/3 mx-auto rounded-md p-4">
        <h2 className="text-2xl font-medium text-black dark:text-white">Factura #{modalData.id_compra}</h2>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-black dark:text-white">Datos del cliente</h3>
          <div className="mt-2">
            <p className="text-black dark:text-white">Nombre: {modalData.nombreApellido}</p>
            <p className="text-black dark:text-white">Email: {modalData.email}</p>
            <p className="text-black dark:text-white">Teléfono: {modalData.telefono}</p>
            <p className="text-black dark:text-white">Provincia: {modalData.provincia}, Ciudad: {modalData.ciudad}</p>
            <p className="text-black dark:text-white">Dirección: {modalData.direccion}, Código Postal: {modalData.codigoPostal}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-black dark:text-white">Productos</h3>
          <div className="mt-2">
            {modalData.productos?.map((producto: any) => (
              <div key={producto.id} className="flex justify-between">
                <p className="text-black dark:text-white">#{producto.id} {producto.nombre}</p>
                <p className="text-black dark:text-white">{producto.precio_unitario}$ x {producto.cantidad}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-black dark:text-white">Estado</h3>
          <div className="mt-2 flex justify-between">
            <p className="text-black dark:text-white">Estado: {estado(modalData.estado)}</p>
            <p className="text-black dark:text-white">Fecha: {parsearFecha(modalData.fecha)}</p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => handleModalClose()}
          >
            Cerrar
          </button>
          <button
            className="bg-error text-white px-4 py-2 rounded-md"
            onClick={() => window.open(constants.API_URL + 'mercadopago/facturas/pdf/' + modalData.id_compra, '_blank')}
          >
            Pdf
          </button>
        </div>
      </div>
    )
  }


  const estado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <div className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">Pendiente</div>
      case 'aprobado':
        return <div className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">Aprobado</div>
      case 'rechazado':
        return <div className="inline-flex rounded-full bg-error bg-opacity-10 py-1 px-3 text-sm font-medium text-error">Rechazado</div>
      default:
        return 'Pendiente'
    }
  }
  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex justify-center items-center"
      >
        {ModalContent()}
      </Modal>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Pedido
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Nombre Apellido
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                  Estado
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                  Creado
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {facturas === undefined && (
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
              {facturas !== undefined && facturas?.map((product: any) => (
                <tr key={product.id} className="border-b border-[#eee] dark:border-strokedark">
                  <td className="py-5 px-4 pl-9 xl:pl-11">
                    <p className="text-black dark:text-white">
                      #{product.id_compra}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white">
                      {product.nombreApellido}
                    </p>
                    {product.email}
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white text-center">
                      {estado(product.estado)}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white text-center">
                      {parsearFecha(product.fecha)}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center space-x-3.5 justify-center">
                      <button
                        className="hover:text-primary"
                        onClick={() => handleView(product)}
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
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
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
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        changePage={setCurrentPage}
      />
    </>
  );
};

export default TableFacturas;
