import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.nombre}</h2>
      
      <p className="text-xl font-semibold">${productInfo.precio}</p>
      <p className="text-base text-gray-600">{productInfo.descripcion}</p>
      <p className="font-normal text-sm">
        <span className="text-base font-medium">Marca:</span> {productInfo.idMarca}
        <span className="text-base font-medium"> Categoria:</span> {productInfo.idCategoria}
      </p>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.nombre,
              quantity: 1,
              stock: productInfo.stock,
              image: productInfo.url_image,
              badge: productInfo.badge,
              price: productInfo.precio,
              colors: productInfo.color,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductInfo;
