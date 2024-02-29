import React from 'react'
import { Link } from 'react-router-dom'

function Error() {
    return (
        <>
            <div className="flex flex-col m-6 items-center h-80">
                <div className='bg-[#F5F5F3] w-full md:w-1/2 lg:w-1/3 h-full rounded-xl'>
                    <div className='bg-red-500 w-full h-10 rounded-t-xl'></div>
                    <div className="flex justify-center items-center mt-6">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Pago rechazado</h1>
                        <div className="flex justify-center items-center">
                            <svg
                                className="w-12 h-12 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-6">
                        <p className="text-base md:text-lg font-semibold text-center">
                            Tu pago ha sido rechazado, por favor intenta nuevamente.
                        </p>
                        <p className="text-base md:text-lg font-semibold text-center">
                            Si el problema persiste, contacta al soporte técnico.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <Link
                            to="/"
                            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
                        >
                            Volver a la tienda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error