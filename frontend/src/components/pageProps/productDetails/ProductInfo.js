import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useLocation, useNavigate } from "react-router-dom";

const ProductInfo = ({ productInfo }) => {
  console.log(productInfo)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.orebiReducer.products);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  console.log(id)
  console.log(products)
  // console.log(products.filter((item) => item._id === id) ? "esta la id" + id : "no esta la id" + id)
  const foundItem = products.find(item => Number(item._id) === Number(id));
  console.log(foundItem ? "Esta la id " + id : "No esta la id " + id);
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.nombre}</h2>

      <p className="text-xl font-semibold">${productInfo.precio}</p>
      <p className="text-base text-gray-600">{productInfo.descripcion}</p>
      <p className="font-normal text-sm">
        <span className="text-base font-medium">Marca:</span> {productInfo.idMarca}
        <span className="text-base font-medium"> Categoria:</span> {productInfo.idCategoria}
      </p>
      {foundItem ? (
        <button
          onClick={() => navigate("/carrito")}
          className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
        >
          Ver carrito
        </button>
      ) : (
        productInfo.stock !== 0 ? (
          <button
            onClick={() =>
              dispatch(
                addToCart({
                  _id: productInfo.id || id,
                  name: productInfo.nombre,
                  quantity: 1,
                  stock: productInfo.stock,
                  image: productInfo.url_image,
                  badge: productInfo.badge,
                  price: productInfo.precio,
                  colors: productInfo.color,
                })
              ) &&
              navigate("/carrito")

            }
            className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
          >
            Añadir al carrito
          </button>
        ) : (
          <button
            className="w-full py-4 bg-gray-400 text-white text-lg font-titleFont"
          >
            Agotado
          </button>
        )


      )}
    </div>
  );
};

export default ProductInfo;
