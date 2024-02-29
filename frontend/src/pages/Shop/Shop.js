import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [categoria, setCategoria] = useState(undefined);
  const [precio, setPrecio] = useState([]);
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const updateCategoria = (filteredCategoria) => {
    setCategoria(filteredCategoria);
  };

  const updatePrecio = (filteredPrecio) => {
    setPrecio(filteredPrecio);
  }
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Productos" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full lg:flex pb-20 gap-10">
        <div className="mdl:w-[20%] lgl:w-[25%] mdl:inline-flex h-full">
          <ShopSideNav updateCategoria={updateCategoria} updatePrecio={updatePrecio} />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          {/* <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} /> */}
          <Pagination itemsPerPage={itemsPerPage} categoria={categoria} precio={precio} />
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
