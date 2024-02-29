import axios from "axios";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Loader from "../common/Loader";
import { Modal } from "@mui/material";
import toast from "react-hot-toast";
import Breadcrumb from "./Breadcrumb";

const TableCategorias = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [open, setOpen] = useState(false); // Estado para el modal [true, false
  const [openCreate, setOpenCreate] = useState(false); // Estado para el modal [true, false
  const [openModalEliminar, setOpenModalEliminar] = useState(false); // Estado para el modal [true, false
  const [idEliminar, setIdEliminar] = useState(0); // Estado para el id de la categoria a eliminar
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState({
    id: 0,
    Nombre: "",
  });



  const fetchCategorias = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(constants.API_URL + `categorias/pages/${page}?searchTerm=${searchTerm}`);
      setCategorias(response.data.categorias);
      console.log(response.data.categorias);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const numeroPaginas = await axios.get(constants.API_URL + 'categorias/totalPages');
      setTotalPages(numeroPaginas.data);
      console.log('Total pages:', numeroPaginas.data);
      await fetchCategorias(currentPage);
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

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value); // Actualiza el término de búsqueda
    setCurrentPage(1);
  };

  const hadleOpenModal = (categoria: any) => {
    if (open === false) {
      setOpen(true);
      setCategoria(categoria);
    } else {
      setOpen(false);
      setCategoria({
        id: 0,
        Nombre: "",
      });
    }
  }

  const handleOpenModalCreate = (e: any) => {
    e.preventDefault();
    if (openCreate === false) {
      setOpenCreate(true);
    } else {
      setCategoria({
        id: 0,
        Nombre: "",
      });
      setOpenCreate(false);
    }
  }


  const handleCreate = (e: any, categoria: any) => {
    e.preventDefault();
    if (categoria.Nombre !== '' && categoria.Nombre !== '') {
      axios.post(constants.API_URL + 'categorias/create', categoria)
        .then((response) => {
          if (response.data.status === 200) {
            toast.success(response.data.message);
            setOpenCreate(false);
            fetchData();
          } else {
            setOpenCreate(false);
            toast.error(response.data.message);
          }
        })
    } else {
      toast.error('El campo nombre no puede estar vacío');
    }
  }

  const handleEdit = (e: any, categoria: any) => {
    e.preventDefault();
    axios.put(constants.API_URL + 'categorias/edit/' + categoria.ID, categoria)
      .then((response) => {
        if (response.data.status === 200) {
          toast.success(response.data.message);
          setOpen(false);
          fetchData();
        } else {
          setOpen(false);
          toast.error(response.data.message);
        }
      })
  }

  return (
    // <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <>
      <div className="flex gap-10 justify-between">
        <Breadcrumb pageName="Categorias" />
        <div className="flex justify-end">
          <button
            className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4"
            onClick={() => setOpenCreate(true)}
          >
            Agregar categoría
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
                value={categoria.Nombre}
                onChange={(e) => setCategoria({ ...categoria, Nombre: e.target.value })}
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
                onClick={(e) => handleCreate(e, categoria)}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
                value={categoria.Nombre}
                onChange={(e) => setCategoria({ ...categoria, Nombre: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="dark:bg-stroke rounded-md py-2 px-4 mr-2 hover:bg-[#E9EAEC] dark:hover:bg-stroke bg-[#F4F5F7]"
                onClick={() => hadleOpenModal(categoria)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4 hover:bg-[#E9EAEC] dark:hover:bg-stroke"
                onClick={(e) => handleEdit(e, categoria)}
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
            Eliminar categoría
          </h2>
          <p className="text-black dark:text-white">
            ¿Estás seguro de que quieres eliminar esta categoría?
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
                axios.delete(constants.API_URL + 'categorias/' + idEliminar)
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
                Nombre
                <input
                  type="text"
                  placeholder="Buscar"
                  className="w-1/2 rounded-md border border-stroke dark:border-strokedark ml-4 p-1"
                  value={searchTerm} // Vincula el valor del campo de búsqueda al estado searchTerm
                  onChange={handleSearch} // Maneja los cambios en el campo de búsqueda
                />
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categorias === undefined && (
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
                        Sin categorias
                      </h5>
                      <p className="text-sm">Tenés que agregar categorias</p>
                    </div>
                  </div>
                </td>
              </tr>
            )
            }
            {categorias !== undefined && categorias.map((categoria: any) => (
              <tr key={categoria.id} className="border-b border-[#eee] dark:border-strokedark">
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
                        {categoria.Nombre}
                      </h5>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 flex justify-center">
                  <button
                    className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4 mr-2"
                    onClick={() => hadleOpenModal(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4"
                    onClick={() => hadleOpenModalEliminar(categoria.ID)}
                  >
                    Eliminar
                  </button>
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

export default TableCategorias;
