import axios from "axios";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Loader from "../common/Loader";
import { Modal } from "@mui/material";
import toast from "react-hot-toast";
import Breadcrumb from "./Breadcrumb";
import { set } from "lodash";

const TablePreguntas = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Estado para el modal [true, false
  const [openCreate, setOpenCreate] = useState(false); // Estado para el modal [true, false]
  const [nombre, setNombre] = useState(''); // Estado para el nombre de 
  const [openModalEliminar, setOpenModalEliminar] = useState(false); // Estado para el modal [true, false
  const [idEliminar, setIdEliminar] = useState(0); // Estado para el id a eliminar
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState<any>();

  const fetchData = async () => {
    try {
      const numeroPaginas = await axios.get(constants.API_URL + 'paginas/preguntas-frecuentes');
      setPreguntas(numeroPaginas.data.data);
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
  }, []);

  const hadleOpenModalEliminar = (id: number) => {
    console.log(id)
    if (openModalEliminar === false) {
      setOpenModalEliminar(true);
      setIdEliminar(id);
    } else {
      setOpenModalEliminar(false);
      setIdEliminar(0);
    }
  }

  const handleOpenModalCreate = (e: any) => {
    e.preventDefault();
    if (openCreate === false) {
      setOpenCreate(true);
    } else {
      setNombre('');
      setOpenCreate(false);
    }
  }


  const handleCreate = async  (e: any) => {
    e.preventDefault();
    if (nombre === '') {
      toast.error('El nombre es requerido');
      return;
    } else {
      const response = await axios.post(constants.API_URL + 'paginas/preguntas-frecuentes/create', {
        titulo: nombre
      })
      if (response.data.status === 201) {
        toast.success(response.data.message);
        setOpenCreate(false);
        setNombre('');
        fetchData();
      } else if (response.data.status === 500) {
        setOpenCreate(false);
        setNombre('');
        toast.error(response.data.message);
      }
      fetchData();
    }
  }

  return (
    // <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <>
      <div className="flex gap-10 justify-between">
        <Breadcrumb pageName="Preguntas Frecuentes" />
        <div className="flex justify-end">
          <button
            className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4"
            onClick={() => setOpenCreate(true)}
          >
            Agregar Titulo
          </button>
        </div>
      </div>
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark w-96 mx-auto mt-20 p-5">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-5">
            Editar categoría
          </h2>
          <form className="flex flex-col gap-5">
            <div>
              <label htmlFor="nombre" className="text-black dark:text-white">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                className="w-full rounded-md border border-stroke dark:border-strokedark p-2"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="dark:bg-stroke rounded-md py-2 px-4 mr-2 hover:bg-[#E9EAEC] dark:hover:bg-stroke bg-[#F4F5F7]"
                onClick={(e) => handleOpenModalCreate(e)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4 hover:bg-[#E9EAEC] dark:hover:bg-stroke"
                onClick={(e) => handleCreate(e)}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        open={openModalEliminar}
        onClose={() => setOpenModalEliminar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark w-96 mx-auto mt-20 p-5">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-5">
            Eliminar pregunta
          </h2>
          <p className="text-black dark:text-white">
            ¿Estás seguro de que quieres eliminar esta pregunta?
          </p>
          <div className="flex justify-between mt-5">
            <button
              className="dark:bg-stroke rounded-md py-2 px-4 mr-2 hover:bg-[#E9EAEC] dark:hover:bg-stroke bg-[#F4F5F7]"
              onClick={() => hadleOpenModalEliminar(0)}
            >
              Cancelar
            </button>
            <button
              className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4 hover:bg-[#E9EAEC] dark:hover:bg-stroke"
              onClick={() => {
                axios.delete(constants.API_URL + 'paginas/preguntas-frecuentes/delete/' + idEliminar)
                  .then((response) => {
                    if (response.data.status === 200) {
                      toast.success(response.data.message);
                      setOpenModalEliminar(false);
                      fetchData();
                    } else if (response.data.status === 400) {
                      setOpenModalEliminar(false);
                      toast.error(response.data.message);
                    }
                    fetchData();
                  })
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
      {loading ? <Loader /> : null}
      <div className="max-h-115 md:max-h-125 lg:max-h-180 overflow-y-auto overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Titulo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {preguntas === undefined && (
              <tr className="border-b border-[#eee] dark:border-strokedark">
                <td className="py-5 px-4 pl-9 xl:pl-11">
                  <div className="flex items-center">
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        Sin preguntas
                      </h5>
                      <p className="text-sm">Tenés que agregar preguntas</p>
                    </div>
                  </div>
                </td>
              </tr>
            )
            }
            {preguntas !== undefined && preguntas.map((pregunta: any) => (
              <tr key={pregunta.id} className="border-b border-[#eee] dark:border-strokedark">
                <td className="py-5 px-4 pl-9 xl:pl-11">
                  <div className="flex items-center">
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {pregunta.pregunta_frecuente}
                      </h5>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 flex justify-center">
                  <button
                    className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4 mr-2"
                    onClick={() => navigate('/paginas/preguntas-frecuentes/edit', { state: { pregunta } })}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4"
                    onClick={() => hadleOpenModalEliminar(pregunta.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablePreguntas;
