import React, { useEffect, useState } from "react";
import { Link, redirect, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import URL from "../../constantes";
// import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
const StepOne = ({ products }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreApellido: "",
    email: "",
    telefono: "",
    provincia: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "",
  });

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,

    });
  }

  const handleSubmit = async (formData, products) => {
    const data = {
      formData,
      products
    }
    if (formData.nombreApellido === "" || formData.email === "" || formData.telefono === "" || formData.provincia === "" || formData.ciudad === "" || formData.direccion === "" || formData.codigoPostal === "") {
      alert("Por favor complete todos los campos")
      return
    } else {
      setLoading(true);
      const res = await axios.post(URL.API_URL + "mercadopago/create", data,
        {
          timeout: 60000 // Establece el tiempo de espera en milisegundos (15 segundos en este ejemplo)
        }
      )
      if (res.status === 201) {
        setLoading(false);
        window.location.href = res.data
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {loading && <div className="w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex items-center justify-center"> <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div></div>}
      <h1 className="text-2xl font-semibold">Datos de Envío</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="nombreApellido">Nombre y Apellido</label>
        <input
          type="text"
          id="nombreApellido"
          className="border border-gray-300 p-2"
          placeholder="Nombre y Apellido"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="border border-gray-300 p-2"
          placeholder="Email"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="number"
          id="telefono"
          className="border border-gray-300 p-2"
          placeholder="Teléfono sin guiones ni espacios"
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="provincia">Provincia</label>
          <input
            type="text"
            id="provincia"
            className="border border-gray-300 p-2"
            placeholder="Provincia"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            className="border border-gray-300 p-2"
            placeholder="Ciudad"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            className="border border-gray-300 p-2"
            placeholder="Dirección"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="codigoPostal">Código Postal</label>
          <input
            type="text"
            id="codigoPostal"
            className="border border-gray-300 p-2"
            placeholder="Código Postal"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="md:flex md:justify-between">
        <Link to="/carrito">
          <button className="w-52 h-10 bg-primeColor text-white text-lg mt-4 hover:bg-black duration-300 rounded-lg">
            Volver al Carrito
          </button>
        </Link>
        <button
          onClick={() => handleSubmit(formData, products)}
          className="w-auto px-4 h-10 md:h-auto bg-blue-500 text-white text-lg mt-4 hover:bg-black duration-300 rounded-lg drop-shadow-md"
        >
          Comprar por Mercadopago
        </button>

      </div>
    </div>
  );
}

const Detalles = ({ products, totalAmt }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-semibold justify-between flex">
        <p>Detalles de la compra</p>
        <p className="text-lg font-semibold">Productos: {products.length}</p>
        <p className="text-lg font-semibold">Total: ${totalAmt}</p>
      </h1>
      <div className="flex flex-col gap-4 ">
        {products.slice(0, showAll ? products.length : 5).map((product, index) => (
          <div key={product._id} className="flex justify-start gap-4 ">
            <img
              src={product.image}
              alt={product.image}
              className="w-20 h-20 object-cover"
            />
            <div className="flex flex-col gap">
              <p>{product.name}</p>
              <p>${Number(product.price * product.quantity).toFixed(2)}</p>
              <p>Cantidad: {product.quantity}</p>
            </div>
          </div>
        ))}
        {products.length > 5 && (
          <button onClick={() => setShowAll(!showAll)} className="text-blue-500">
            {showAll ? "Mostrar menos" : "Mostrar más"}
          </button>
        )}
      </div>
    </div>
  );
};

const Payment = () => {
  const location = useLocation();
  const [products] = useState(location.state?.products);
  const [totalAmt] = useState(location.state?.totalAmt);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Rellená tus datos" prevLocation={"carrito"} />
      <div className="pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StepOne products={products} />
          <Detalles products={products} totalAmt={totalAmt} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
