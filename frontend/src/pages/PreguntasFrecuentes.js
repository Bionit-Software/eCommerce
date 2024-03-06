import axios from 'axios'
import React, { useEffect, useState } from 'react'
import constantes from '../constantes'
import { useNavigate } from 'react-router-dom'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function PreguntasFrecuentes() {
    const [contenido, setContenido] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(constantes.API_URL + 'paginas/preguntas-frecuentes');
                console.log(res)
                if (res.data.status === 200) {
                    setContenido(res.data.data);
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
                    <h1 className='text-2xl font-bold text-center mb-4'>Preguntas Frecuentes</h1>
                    <div>
                        {
                            contenido.map((item, index) => (
                                <div key={index} className='mb-4'>
                                    <h2 className='text-xl font-bold'>{item.pregunta_frecuente}</h2>
                                    {item.items.map((item, index) => (
                                        <Accordion key={index}>
                                            <AccordionSummary
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                {item.titulo}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <p>{item.contenido}</p>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}

                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default PreguntasFrecuentes