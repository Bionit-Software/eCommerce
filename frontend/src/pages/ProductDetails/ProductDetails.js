import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import axios from "axios";
import URL from "../../constantes";
import Slider from "react-slick";
const ProductDetails = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [image, setImage] = useState(0);
  console.log(productInfo);
  useEffect(() => {
    const fetchItems = async () => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("id");
      if (location.state?.item) {
        setProductInfo(location.state?.item);
        console.log(location.state?.item);
        console.log(location.state?.item?.url_image?.split(','));
        setImagenes(location.state?.item?.imagenes?.split(','));
      } else {
        if (id) {
          const res = await axios.get(URL.API_URL + "productos/findOneById/" + id);
          setProductInfo(res.data[0]);
          const imgs = res.data[0].imagenes;
          console.log(res.data[0])
          const array = imgs.split(',');
          console.log(array)
          setImagenes(array);
        }
      }
      setPrevLocation(location.pathname);
    }
    fetchItems();
  }, [location]);
  console.log(imagenes);
  const [dotActive, setDotActive] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (prev, next) => {
      setDotActive(next);
    },
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "0",
          right: "0",
          margin: "auto",
          width: "fit-content",
          display: "flex", // Mostrar los puntos en una fila horizontal
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: "0", padding: "0", listStyleType: "none", display: "flex", flexDirection: "row" }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: i === dotActive ? "#CCCCCC" : "#999999", // Gris claro para punto activo, Gris oscuro para otros puntos
          margin: "0 5px",
          cursor: "pointer",
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 576,
        settings: {
          dots: true,
          appendDots: (dots) => (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "0",
                right: "0",
                margin: "auto",
                width: "fit-content",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ul style={{ margin: "0", padding: "0", listStyleType: "none", display: "flex", flexDirection: "row" }}>
                {dots}
              </ul>
            </div>
          ),
        },
      },
    ],
  };
  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4 mb-16">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={productInfo.nombre} />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-5 h-auto bg-gray-100 p-5 justify-center">
          {imagenes.length > 1 ?
            <div className="hidden h-full w-36 lg:col-span-1 mx-auto lg:block lg:flex-col">
              {imagenes?.map((img, index) => (
                <img
                  key={index}
                  className="w-full h-28 object-fit cursor-pointer hover:opacity-80"
                  src={img}
                  alt={img}
                  onClick={() => setImage(index)}
                />
              ))}
            </div>
            : null}
          <div className="hidden h-full lg:col-span-2 lg:block">
            <img
              className="w-full h-[450px] object-cover"
              src={productInfo?.url_image?.split(',')[image] || productInfo?.imagenes?.split(',')[image]}
              alt={productInfo?.url_image?.split(',')[image] || productInfo?.imagenes?.split(',')[image]}
            />
          </div>
          <div className="block h-full lg:hidden">
            <div className="w-full bg-white">
              <Slider {...settings}>
                {imagenes?.map((img, index) => (
                  <div className="w-full h-[350px] justify-center text-center">
                    <img
                      className="w-full h-full object-cover"
                      src={img}
                      alt={img}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-2 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
