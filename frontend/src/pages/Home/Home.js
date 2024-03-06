import React, { useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner";
import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
import URL from "../../constantes"
const Home = () => {
  const [productos, setProductos] = useState([]);
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(URL.API_URL + "productos/first-twelve");
        const data = await response.json();
        setProductos(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    const getSlides = async () => {
      try {
        const response = await fetch(URL.API_URL + "paginas/principal/slider/all");
        const data = await response.json();
        setSlides(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
    getSlides();
  }, []);

  return (
    <div className="w-full mx-auto">
      <Banner slides={slides}/>
      {/* <BannerBottom /> */}
      <div className="max-w-container mx-auto px-4">
        {/* <Sale /> */}
        <NewArrivals productos={productos}/>
        {/* <BestSellers /> */}
        {/* <YearProduct /> */}
        {/* <SpecialOffers /> */}
      </div>
    </div>
  );
};

export default Home;
