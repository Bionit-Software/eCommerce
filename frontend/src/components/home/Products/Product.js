import React from "react";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const Product = (props) => {
  const navigate = useNavigate();
  const productItem = props;
  const handleProductDetails = () => {
    navigate(`/producto/${encodeURIComponent(props.nombre)}?id=${props.id}`, {
      state: {
        item: productItem,
      },
    });
  };
  return (
    <div className="w-full relative group" onClick={handleProductDetails}>
      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
        <div>
          <Image className="w-full h-full" imgSrc={props?.url_image?.split(',')[0]} />
        </div>
        <div className="absolute top-6 left-8">
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">
            {props.nombre}
          </h2>
          <p className="text-[#767676] text-[14px]">${props.precio}</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.color}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
