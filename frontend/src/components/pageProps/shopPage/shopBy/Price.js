import React, { useState } from "react";
import NavTitle from "./NavTitle";
import { motion } from "framer-motion";

const Price = ({ handleFilterChangePrecio }) => {
  const [selectedPrice, setSelectedPrice] = useState([]); // [1]
  const handlePriceChange = (filteredPrecio) => {
    console.log(filteredPrecio)
    handleFilterChangePrecio(filteredPrecio);
    setSelectedPrice(filteredPrecio);
  }
  const priceList = [
    {
      _id: 950,
      priceOne: 0.0,
      priceTwo: 49.99,
    },
    {
      _id: 951,
      priceOne: 50.0,
      priceTwo: 99.99,
    },
    {
      _id: 952,
      priceOne: 100.0,
      priceTwo: 199.99,
    },
    {
      _id: 953,
      priceOne: 200.0,
      priceTwo: 399.99,
    },
    {
      _id: 954,
      priceOne: 400.0,
      priceTwo: 599.99,
    },
    {
      _id: 955,
      priceOne: 600.0,
      priceTwo: 1000.0,
    },
  ];
  return (
    <div className="cursor-pointer">
      <NavTitle title="Precios" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceList.map((item) => (
            <li
              key={item._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 cursor-pointer duration-300"
              onClick={() => handlePriceChange(item)}
            >
              ${item.priceOne} - ${item.priceTwo}
              {selectedPrice?.priceTwo === item?.priceTwo && (
                // simbolito de x para quitar la categoria seleccionada animado con motion framer
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  onHoverStart={{ scale: 1.2 }}
                  className="text-[#767676] text-lg cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Detiene la propagación del evento
                    handlePriceChange(null);
                  }}
                >
                  {String.fromCharCode(10005)}
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
