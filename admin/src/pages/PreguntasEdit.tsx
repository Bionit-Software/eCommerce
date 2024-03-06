import React, { useEffect, useState } from 'react';
import { Input, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import constants from '../constants';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

function PreguntasEdit() {
    const [loading, setLoading] = useState(false);
    const [pregunta, setPregunta] = useState<any>();
    // const [editMode, setEditMode] = useState(false);
    const [editModePregunta, setEditModePregunta] = useState(false);
    const [editedPregunta, setEditedPregunta] = useState('');
    const [createMode, setCreateMode] = useState(false);
    const [tituloCreate, setTituloCreate] = useState('');
    const [contenidoCreate, setContenidoCreate] = useState('');
    const [editModeMap, setEditModeMap] = useState<{ [key: number]: boolean }>({});
    const [openModalEliminar, setOpenModalEliminar] = useState(false); // Estado para el modal [true, false
    const [idEliminar, setIdEliminar] = useState(0); // Estado para el id a eliminar
    const [indexAsociado, setIndexAsociado] = useState(null); // Estado para el id a eliminar
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        if (location) {
            setPregunta(location.state && location.state.pregunta);
        } else {
            navigate('/paginas/preguntas-frecuentes');
        }
        setLoading(false);
    }, [navigate, location]);

    const handleEditToggle = (index: number) => {
        // Cambia el estado editMode de la pregunta específica
        setEditModeMap(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handleSave = async (e: any, index: any) => {
        e.preventDefault();
        if (!pregunta.items[index].titulo || !pregunta.items[index].contenido) {
            toast.error('Por favor, rellena todos los campos');
            return;
        }
        try {
            const response = await axios.put(constants.API_URL + 'paginas/preguntas-frecuentes/item/update', pregunta.items[index]);
            toast.success('Pregunta actualizada');
            setEditModeMap(prevState => ({
                ...prevState,
                [index]: false
            }));
            navigate('/paginas/preguntas-frecuentes');
        } catch (error) {
            console.error('Error updating pregunta:', error);
            toast.error('Error al actualizar la pregunta');
        }
    };

    const handleContentChange = (index: number, e: any) => {
        const updatedItems = [...pregunta.items];
        updatedItems[index] = { ...updatedItems[index], contenido: e.target.value };
        setPregunta({ ...pregunta, items: updatedItems });
    };

    const handleSaveCreate = async (e: any) => {
        e.preventDefault();
        if (!tituloCreate || !contenidoCreate) {
            toast.error('Por favor, rellena todos los campos');
            return;
        }
        try {
            const response = await axios.post(constants.API_URL + 'paginas/preguntas-frecuentes/item/create', {
                idPadre: pregunta.id,
                titulo: tituloCreate,
                contenido: contenidoCreate
            });
            console.log(response.data)
            toast.success('Pregunta creada');
            setCreateMode(false);
            setTituloCreate('');
            setContenidoCreate('');
            setPregunta({ ...pregunta, items: [...pregunta.items, { titulo: tituloCreate, contenido: contenidoCreate, id: response.data.id }] });
            navigate('/paginas/preguntas-frecuentes');
        } catch (error) {
            console.error('Error creating pregunta:', error);
            setCreateMode(false);
            setTituloCreate('');
            setContenidoCreate('');
            toast.error('Error al crear la pregunta');
        }
    }

    const handleSaveEditPregunta = async () => {
        if (!editedPregunta) {
            toast.error('Por favor, rellena todos los campos');
            return;
        }
        try {
            const response = await axios.put(constants.API_URL + 'paginas/preguntas-frecuentes/update', { id: pregunta.id, titulo: editedPregunta });
            if (response.data.status === 200) {
                toast.success(response.data.message);
                setPregunta({ ...pregunta, pregunta_frecuente: editedPregunta });
                setEditModePregunta(false);
            } else {
                toast.error('Error al actualizar la pregunta');
            }
            navigate('/paginas/preguntas-frecuentes');
            setEditModePregunta(false);
        } catch (error) {
            console.error('Error updating pregunta:', error);
            toast.error('Error al actualizar la pregunta');
        }
    }

    const handleEditPregunta = () => {
        setEditedPregunta(pregunta.pregunta_frecuente);
        setEditModePregunta(true);
    }

    const handleDelete = async () => {
        try {
            const response = await axios.delete(constants.API_URL + 'paginas/preguntas-frecuentes/item/delete/' + pregunta.items[indexAsociado].id);
            toast.success('Pregunta eliminada');
            setPregunta({ ...pregunta, items: [...pregunta.items.slice(0, indexAsociado), ...pregunta.items.slice(indexAsociado + 1)] });
            setOpenModalEliminar(false);
            navigate('/paginas/preguntas-frecuentes');
        } catch (error) {
            console.error('Error deleting pregunta:', error);
            toast.error('Error al eliminar la pregunta');
        }
    }

    const hadleOpenModalEliminar = (id: number, index: any) => {
        if (openModalEliminar === false) {
            setOpenModalEliminar(true);
            setIdEliminar(id);
            setIndexAsociado(index);
        } else {
            setOpenModalEliminar(false);
            setIdEliminar(0);
            setIndexAsociado(null);
        }
    }

    (indexAsociado)

    return (
        <>
            <Modal
                open={openModalEliminar}
                onClose={() => setOpenModalEliminar(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark w-96 mx-auto mt-20 p-5">
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-5">
                        Eliminar pregunta
                    </h2>
                    <p className="text-black dark:text-white">
                        ¿Estás seguro de que quieres eliminar esta pregunta?
                    </p>
                    <div className="flex justify-between mt-5">
                        <button
                            className="dark:bg-stroke rounded-md py-2 px-4 mr-2 hover:bg-[#E9EAEC] dark:hover:bg-stroke bg-[#F4F5F7]"
                            onClick={() => hadleOpenModalEliminar(0, 0)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-[#F4F5F7] dark:bg-stroke rounded-md py-2 px-4 hover:bg-[#E9EAEC] dark:hover:bg-stroke"
                            onClick={() => handleDelete()}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
            {loading && <Loader />}
            {/* <Breadcrumb pageName={pregunta?.pregunta_frecuente} /> */}
            {!editModePregunta ? (
                <div className="flex gap-2 mb-4">
                    <h1 className="text-2xl align-middle font-bold text-black dark:text-white">{pregunta?.pregunta_frecuente}</h1>
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark cursor-pointer"
                        onClick={() => handleEditPregunta()}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8787 3.70705C17.0503 2.53547 18.9498 2.53548 20.1213 3.70705L20.2929 3.87862C21.4645 5.05019 21.4645 6.94969 20.2929 8.12126L18.5556 9.85857L8.70713 19.7071C8.57897 19.8352 8.41839 19.9261 8.24256 19.9701L4.24256 20.9701C3.90178 21.0553 3.54129 20.9554 3.29291 20.7071C3.04453 20.4587 2.94468 20.0982 3.02988 19.7574L4.02988 15.7574C4.07384 15.5816 4.16476 15.421 4.29291 15.2928L14.1989 5.38685L15.8787 3.70705ZM18.7071 5.12126C18.3166 4.73074 17.6834 4.73074 17.2929 5.12126L16.3068 6.10738L17.8622 7.72357L18.8787 6.70705C19.2692 6.31653 19.2692 5.68336 18.8787 5.29283L18.7071 5.12126ZM16.4477 9.13804L14.8923 7.52185L5.90299 16.5112L5.37439 18.6256L7.48877 18.097L16.4477 9.13804Z" fill="#3C50E0" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex gap-2 mb-4">
                    <Input
                        className="font-medium text-black dark:text-white"
                        value={editedPregunta}
                        type="text"
                        placeholder="Título"
                        required
                        fullWidth
                        autoFocus
                        inputProps={{ 'aria-label': 'description' }}
                        onChange={(e) => setEditedPregunta(e.target.value)}
                    />
                    <div className='flex gap-5'>
                        <button
                            className="text-primary dark:text-primary-dark"
                            onClick={() => setEditModePregunta(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className='text-primary dark:text-primary-dark'
                            onClick={() => handleSaveEditPregunta()}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 gap-9">
                <div className="flex flex-col gap-9 justify-center">
                    {!createMode ? (
                        <button
                            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                            onClick={() => setCreateMode(true)}
                        >
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 12H18M12 6V18" stroke="#3C50E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <p>
                                    <span className="text-primary">Click para añadir nueva pregunta</span>
                                </p>
                            </div>
                        </button>
                    ) : (
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                <Input
                                    className="font-medium text-black dark:text-white"
                                    value={tituloCreate}
                                    type="text"
                                    placeholder="Título"
                                    required
                                    fullWidth
                                    autoFocus
                                    inputProps={{ 'aria-label': 'description' }}
                                    onChange={(e) => setTituloCreate(e.target.value)}
                                />
                                <div className='flex gap-5'>
                                    <button
                                        className="text-primary dark:text-primary-dark"
                                        onClick={() => setCreateMode(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className='text-primary dark:text-primary-dark'
                                        onClick={(e) => handleSaveCreate(e)}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5.5 p-6.5">
                                <div>
                                    <TextField
                                        className='w-full'
                                        id="outlined-multiline-static"
                                        label="Contenido"
                                        multiline
                                        rows={4}
                                        value={contenidoCreate}
                                        variant="outlined"
                                        onChange={(e) => setContenidoCreate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {pregunta ? (
                        pregunta?.items?.map((item: any, index: number) => {
                            // Aquí va la línea para determinar si la pregunta está en modo de edición o no
                            const editMode = editModeMap[index] || false;

                            return (
                                <div key={item?.id} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        {editMode ? (
                                            <Input
                                                className="font-medium text-black dark:text-white"
                                                value={item.titulo}
                                                type="text"
                                                placeholder="Título"
                                                required
                                                fullWidth
                                                autoFocus
                                                inputProps={{ 'aria-label': 'description' }}
                                                onChange={(e) => setPregunta({ ...pregunta, items: [...pregunta.items.slice(0, index), { ...item, titulo: e.target.value }, ...pregunta.items.slice(index + 1)] })}
                                                disabled={!editMode} // Deshabilita la edición cuando no está en modo de edición
                                            />
                                        ) : (
                                            <h3 className="font-medium text-black dark:text-white">
                                                {item?.titulo}
                                            </h3>
                                        )}
                                        <div className='flex gap-5'>
                                            <button
                                                className="text-primary dark:text-primary-dark"
                                                onClick={() => handleEditToggle(index)} // Pasa el índice de la pregunta al manejador
                                            >
                                                {editMode ? 'Cancelar' : 'Editar'}
                                            </button>
                                            <button
                                                className="text-primary dark:text-primary-dark"
                                                onClick={() => hadleOpenModalEliminar(item.id, index)} // Pasa el índice de la pregunta al manejador
                                            >
                                                Eliminar
                                            </button>
                                            {editMode && (
                                                <button
                                                    className='text-primary dark:text-primary-dark'
                                                    onClick={(e) => handleSave(e, index)}
                                                >
                                                    Guardar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <div>
                                            {editMode ? (
                                                <TextField
                                                    className='w-full'
                                                    id="outlined-multiline-static"
                                                    label="Contenido"
                                                    multiline
                                                    rows={4}
                                                    value={item.contenido}
                                                    variant="outlined"
                                                    onChange={(e) => handleContentChange(index, e)}
                                                />
                                            ) : (
                                                <label className="mb-3 block text-black dark:text-white">
                                                    {item?.contenido}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : null}
                </div>
            </div>
        </>
    );
}
export default PreguntasEdit;
