import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";
import Categorias from "./shopBy/Brand";

const ShopSideNav = ({ updateCategoria, updatePrecio }) => {
  const handleFilterChangeCategoria = (filteredCategoria) => {
    // Llama a la función de actualización pasada como prop desde Shop
    updateCategoria(filteredCategoria);
  };

  const handleFilterChangePrecio = (filteredPrecio) => {
    // Llama a la función de actualización pasada como prop desde Shop
    updatePrecio(filteredPrecio);
  };

  return (
    <div className="w-full flex justify-start md:flex-col gap-6">
      <Categorias handleFilterChangeCategoria={handleFilterChangeCategoria} />
      {/* <Price handleFilterChangePrecio={handleFilterChangePrecio} /> */}
    </div>
  );
};

export default ShopSideNav;
