import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import axios from "axios";
import constantes from "../../../../constantes";
const Categorias = ({ handleFilterChangeCategoria }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(constantes.API_URL + "categorias/all");
        setCategorias(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  
  const [showBrands, setShowBrands] = useState(true);

  const handleCategoryChange = (selectedCategory) => {
    handleFilterChangeCategoria(selectedCategory);
    setSelectedCategory(selectedCategory);
  };

  return (
    <div>
      <div
        onClick={() => setShowBrands(!showBrands)}
        className="cursor-pointer"
      >
        <NavTitle title="Categorias" icons={true} />
      </div>
      {showBrands && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {categorias.map((item) => (
              <li
                key={item.ID}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 cursor-pointer duration-300"
                onClick={() => handleCategoryChange(item.ID)}
              >
                {item.Nombre}
                {selectedCategory === item.ID && (
                  // simbolito de x para quitar la categoria seleccionada animado con motion framer
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    onHoverStart={{ scale: 1.2 }}
                    className="text-[#767676] text-lg cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Detiene la propagación del evento
                      handleCategoryChange(undefined);
                    }}
                  >
                    {String.fromCharCode(10005)}
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Categorias;
