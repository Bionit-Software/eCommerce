import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../constants";
import axios from "axios";
import constantes from "../../../constantes";
const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [resultados, setResultados] = useState([]);
  const temporizadorRef = useRef(null);
  const consultasPreviasRef = useRef({});
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });

  }, [show, ref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const realizarConsulta = async (query) => {
    console.log(resultados)
    // Aquí deberías realizar la llamada al backend con la query
    if (query === '') {
      setResultados([]);
      return;
    }
    if (consultasPreviasRef.current[query]) {
      console.log('Consulta previa:', query);
      console.log(consultasPreviasRef.current[query]);
      setResultados(consultasPreviasRef.current[query]);
    } else {
      // Aquí deberías realizar la llamada al backend con la query
      console.log('Consulta al backend con la query:', query);

      // Simulación de resultados (reemplaza con tu lógica real)
      const resultadosSimulados = await axios.get(constantes.API_URL + `productos/search/${query}`)

      // Almacenar los resultados en las consultas previas
      consultasPreviasRef.current[query] = resultadosSimulados.data;
      setResultados(resultadosSimulados.data);
      console.log(resultadosSimulados.data)
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current);
    }

    temporizadorRef.current = setTimeout(() => {
      realizarConsulta(e.target.value);
    }, 600);

  };

  // useEffect(() => {
  //   const filtered = paginationItems.filter((item) =>
  //     item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredProducts(filtered);
  // }, [searchQuery]);

  return (
    <div className="w-full bg-[#F5F5F3] relative ">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-primeColor w-auto text-[#767676] h-auto p-4 pb-6"
              >
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Accessories
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Furniture
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Electronics
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Clothes
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400  hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Bags
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400  hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Home appliances
                </li>
              </motion.ul>
            )}
          </div> */}
          <div></div>
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Buscar productos"
            />
            <FaSearch className="w-5 h-5" />
            {resultados && (
              <div
                className={`w-full mx-auto h-auto bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                {resultados.map((item) => (
                  <div
                    onClick={() => {
                      navigate(`/producto/${encodeURIComponent(item.nombre)}?id=${item.id}`, { state: { item } });
                      setResultados([]);
                    }}
                    className="w-full h-20 flex items-center gap-2 px-6 hover:bg-[#F5F5F3] hover:cursor-pointer"
                  >
                    <img
                      className="w-12 h-12 object-cover"
                      src={item.imagenes.split(',')[0]}
                      alt="product"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-[#767676] text-sm font-normal">
                        {item.nombre}
                      </h2>
                      <p className="text-[#767676] text-sm font-normal">
                        ${item.precio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div></div>
          {/* <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                <Link to="/signin">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Iniciar Sesión
                  </li>
                </Link>
                <Link onClick={() => setShowUser(false)} to="/signup">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Registrarse
                  </li>
                </Link>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Perfil
                </li>
              </motion.ul>
            )}
            <Link to="/carrito">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div> */}
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
