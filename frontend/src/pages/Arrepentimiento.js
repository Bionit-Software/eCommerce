import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/pageProps/Breadcrumbs";
import axios from "axios";
import constantes from "../constantes";
import ReCAPTCHA from "react-google-recaptcha";

const Arrepentimiento = () => {
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState("");
    useEffect(() => {
        setPrevLocation(location?.state?.data);
    }, [location]);
    const recaptcha = useRef();
    const [nombre, setnombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [mensaje, setmensaje] = useState("");
    const [motivo, setMotivo] = useState("No me gustó el producto");
    const [pedido, setPedido] = useState("");

    // ========== Error mensaje Start here ============
    const [errnombre, setErrnombre] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errmensaje, setErrMensaje] = useState("");
    const [errTelefono, setErrTelefono] = useState("");
    const [errMotivo, setErrMotivo] = useState("");
    const [errPedido, setErrPedido] = useState("");
    // ========== Error mensaje End here ==============
    const [successMsg, setSuccessMsg] = useState("");
    const [errCaptcha, setErrCaptcha] = useState("");
    const handleName = (e) => {
        setnombre(e.target.value);
        setErrnombre("");
    };
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrEmail("");
    };
    const handlemensaje = (e) => {
        setmensaje(e.target.value);
        setErrMensaje("");
    };

    // ================= Email Validation start here =============
    const EmailValidation = (email) => {
        // Verificar si el valor de correo electrónico es null o undefined
        if (email == null || email === undefined) {
            return false;
        }

        // Expresión regular para validar direcciones de correo electrónico
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Validar el correo electrónico con la expresión regular
        return emailRegex.test(email);
    };
    // ================= Email Validation End here ===============

    const handlePost = async (e) => {
        e.preventDefault();
        const captchaValue = recaptcha.current.getValue()
        if (!captchaValue) {
            setErrCaptcha("Por favor, verifica que no eres un robot");
            return
        } else {
            if (motivo !== "") {
                setErrMotivo("Selecciona un motivo");
            }
            if (!pedido) {
                setErrPedido("Ingresa tu número de pedido acá");
            }
            if (!telefono) {
                setErrTelefono("Ingresa tu teléfono acá");
            }
            if (!nombre) {
                setErrnombre("Ingresa tu nombre acá");
            }
            if (!email) {
                setErrEmail("Ingresa tu email acá");
            } else {
                if (!EmailValidation(email)) {
                    setErrEmail("Ingresa un email válido");
                }
            }
            if (!mensaje) {
                setErrMensaje("Ingresa tu mensaje acá");
            }
            if (nombre && email && EmailValidation(email) && mensaje && telefono && motivo && pedido) {
                const res = await axios.post(constantes.API_URL + 'paginas/arrepentimiento/create', {
                    nombre,
                    email,
                    telefono,
                    motivo,
                    mensaje,
                    pedido
                });
                if (res.status === 201) {
                    setSuccessMsg(
                        `Gracias por tu mensaje ${nombre}, te responderemos lo más pronto posible.`
                    )
                } else {
                    setSuccessMsg(
                        `Hubo un error al enviar tu mensaje, por favor intenta de nuevo`
                    )
                }
            }
        }
    };

    return (
        <div className="max-w-container mx-auto px-4">
            <Breadcrumbs title="arrepentimientoo" prevLocation={prevLocation} />
            {successMsg ? (
                <p className="pb-20 w-96 font-medium text-green-500">{successMsg}</p>
            ) : (
                <form className="pb-20">
                    <h1 className="font-titleFont font-semibold text-3xl">
                        Rellena el formulario
                    </h1>
                    <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Nombre
                            </p>
                            <input
                                onChange={handleName}
                                value={nombre}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                type="text"
                                placeholder="Ingresa tu nombre acá"
                            />
                            {errnombre && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errnombre}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Email
                            </p>
                            <input
                                onChange={handleEmail}
                                value={email}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                type="email"
                                placeholder="Ingresa tu email acá"
                            />
                            {errEmail && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errEmail}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Teléfono
                            </p>
                            <input
                                onChange={(e) => setTelefono(e.target.value)}
                                value={telefono}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                type="number"
                                placeholder="Ingresa tu teléfono acá"
                            />
                            {errTelefono && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errTelefono}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Motivo de arrepentimiento
                            </p>
                            <select
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                onChange={(e) => setMotivo(e.target.value)}
                            >
                                <option selected value="No me gustó el producto">No me gustó el producto</option>
                                <option value="Me equivoqué de producto">Me equivoqué de producto</option>
                                <option value="No me gustó el producto">No me gustó el producto</option>
                                <option value="Otros">Otros</option>
                            </select>
                            {errMotivo && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errMotivo}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Número de pedido
                            </p>
                            <input
                                onChange={(e) => setPedido(e.target.value)}
                                value={pedido}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                type="number"
                                placeholder="Ingresa tu número de pedido acá"
                            />
                            {errPedido && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errPedido}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-base font-titleFont font-semibold px-2">
                                Mensajes
                            </p>
                            <textarea
                                onChange={handlemensaje}
                                value={mensaje}
                                cols="30"
                                rows="3"
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
                                type="text"
                                placeholder="Ingresa tu mensaje acá"
                            ></textarea>
                            {errmensaje && (
                                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                    <span className="text-sm italic font-bold">!</span>
                                    {errmensaje}
                                </p>
                            )}
                        </div>
                        <ReCAPTCHA sitekey="6LelLo8pAAAAAMS9ubGSjM9Q6I3y65G-7U7ga4l5" ref={recaptcha} />
                        {errCaptcha && (
                            <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                                <span className="text-sm italic font-bold">!</span>
                                {errCaptcha}
                            </p>
                        )}
                        <button
                            onClick={handlePost}
                            className="w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Arrepentimiento;
