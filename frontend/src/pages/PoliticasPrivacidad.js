import axios from 'axios'
import React, { useEffect, useState } from 'react'
import constantes from '../constantes'
import { useNavigate } from 'react-router-dom'
function PoliticasPrivacidad() {
    const [contenido, setContenido] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(constantes.API_URL + 'paginas/politicas-privacidad');
                if (res.data.status === 200) {
                    setContenido(res.data.data.contenido);
                }
                if (res.data.status === 500) {
                    navigate('/')
                }
            } catch (error) {
                navigate('/')
            }
        }
        fetchData()
    }, [navigate])
    return (
        <>
            <div className='flex justify-center'>
                <div className="w-full md:w-3/4 lg:w-1/2 p-4">
                    <div dangerouslySetInnerHTML={{ __html: contenido }}></div>
                </div>
            </div>
        </>
    )
}

export default PoliticasPrivacidad