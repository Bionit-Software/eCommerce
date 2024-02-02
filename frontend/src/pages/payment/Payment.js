import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import URL from "../../constantes";
// import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
const StepOne = ({ products }) => {
  const [preferenceId, setPreferenceId] = useState(null);
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
    console.log(formData)
  }

  const handleSubmit = async (formData, products) => {
    const data = {
      formData,
      products
    }
    const res = await axios.post(URL.API_URL + "mercadopago/create", data,
    {
      timeout: 60000 // Establece el tiempo de espera en milisegundos (15 segundos en este ejemplo)
    }
    )
    setPreferenceId(res.data.id)
    console.log(res)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
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
      <div className="flex justify-between">
        <Link to="/carrito">
          <button className="w-52 h-10 bg-primeColor text-white text-lg mt-4 hover:bg-black duration-300">
            Volver al Carrito
          </button>
        </Link>
        <button
          onClick={() => handleSubmit(formData, products)}
          className="w-52 h-10 bg-blue-500 text-white text-lg mt-4 hover:bg-black duration-300"
        >
          Comprar
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
              <p>${product.price * product.quantity}</p>
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
  console.log(products)

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
