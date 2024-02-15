import React, { useEffect, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import constants from '../constants';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

function ProductoEdit() {
    const location = useLocation();
    const product = location.state && location.state.product;
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(product ? product.idCategoria : 0);
    const [marcas, setMarcas] = useState([]);
    const [marca, setMarca] = useState(product ? product.idMarca : null);
    const [nombre, setNombre] = useState(product ? product.nombre : '');
    const [descripcion, setDescripcion] = useState(product ? product.descripcion : '');
    const [precio, setPrecio] = useState(product ? product.precio : 0);
    const [stock, setStock] = useState(product ? product.stock : 0);
    const [existingPhotos, setExistingPhotos] = useState<string[]>(product ? product.imagenes.split(',') : []);
    const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
    const [photosRemoved, setPhotosRemoved] = useState<string[]>([]);
    const allPhotos = [...existingPhotos, ...additionalPhotos.map(file => URL.createObjectURL(file))];
    console.log(existingPhotos)
    const handleFileChange = (event: any) => {
        const files = event.target.files;
        // Limitar la cantidad de fotos adicionales a agregar (máximo 5)
        if (files.length + existingPhotos.length <= 4) {
            setAdditionalPhotos([...additionalPhotos, ...files]);
        } else {
            setAdditionalPhotos([])
            toast.error('Solo se pueden agregar un máximo de 4 fotos.');
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseCategorias = await axios.get(constants.API_URL + 'categorias/all');
                setCategorias(responseCategorias.data);
                if (product && product.idCategoria) {
                    const categoriaEncontrada = responseCategorias.data.find(categoria => categoria.ID === product.idCategoria);
                    console.log(categoriaEncontrada)
                    setCategoria(categoriaEncontrada);
                }
                const responseMarcas = await axios.get(constants.API_URL + 'marcas/all');
                setMarcas(responseMarcas.data);
                if (product && product.idMarca) {
                    const marcaEncontrada = responseMarcas.data.find(marca => marca.ID === product.idMarca);
                    console.log(marcaEncontrada)
                    setMarca(marcaEncontrada);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle the error or display a user-friendly message
            } finally {
                setLoading(false);
            }
        };
        // Buscar la marca correspondiente a idMarcaPorParametro
        fetchData();
    }, [product]);


    const handleCategoriaChange = (event: any, value: any) => {
        setCategoria(value);
    }
    const handleMarcaChange = (event: any, value: any) => {
        setMarca(value);
    }
    const handleNombreChange = (event: any) => {
        console.log(event.target.value);
        setNombre(event.target.value);
    }
    const handleDescripcionChange = (event: any) => {
        setDescripcion(event.target.value);
    }
    const handlePrecioChange = (event: any) => {
        setPrecio(event.target.value);
    }
    const handleStockChange = (event: any) => {
        setStock(event.target.value);
    }
    const handleSave = async () => {
        if (
            nombre !== undefined &&
            descripcion !== undefined &&
            precio !== 0 &&
            stock !== 0 &&
            categoria.ID !== null &&
            marca.ID !== null &&
            allPhotos.length !== 0
        ) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('nombre', nombre);
                formData.append('descripcion', descripcion);
                formData.append('precio', precio);
                formData.append('stock', stock);
                formData.append('idCategoria', categoria.ID);
                formData.append('idMarca', marca.ID);
                formData.append('photosRemoved', photosRemoved.join(','));
                for (let i = 0; i < additionalPhotos.length; i++) {
                    formData.append('files', additionalPhotos[i]);
                }

                const response = await axios.put(constants.API_URL + 'productos/edit/' + product.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response);
                toast.success('Producto editado exitosamente');
                navigate('/tablas/productos');
            } catch (error) {
                console.error('Error durante la carga del archivo:', error);
                // Manejar el error de manera apropiada (por ejemplo, mostrar un mensaje de error al usuario)
            }
            setLoading(false);
        } else {
            toast.error('Por favor, complete todos los campos');
        }
    };
    const removeExistingPhoto = (photoUrl: string, photoIndex: number) => {
        const updatedPhotos = existingPhotos.filter((_, index) => index !== photoIndex);
        setPhotosRemoved([...photosRemoved, photoUrl])
        setExistingPhotos(updatedPhotos);
    };

    const removeNewPhoto = (index: number) => {
        const updatedPhotos = [...additionalPhotos];
        updatedPhotos.splice(index, 1);
        setAdditionalPhotos(updatedPhotos);
    };

    return (
        <>
            {loading ? <Loader /> : null}
            <Breadcrumb pageName="Añadir Producto" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    {/* <!-- Input Fields --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Producto
                            </h3>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5">
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={nombre}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    onChange={(e) => handleNombreChange(e)}
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    onChange={(e) => handleDescripcionChange(e)}
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={precio}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    onChange={(e) => handlePrecioChange(e)}
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={stock}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    onChange={(e) => handleStockChange(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-9">
                    {/* <!-- Textarea Fields --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-col gap-5.5 p-6.5">
                            {allPhotos.map((photoUrl, index) => (
                                <div key={`photo-${index}`}>
                                    <img src={photoUrl} alt={`Foto ${index}`} />
                                    <button onClick={() => {
                                        if (index < existingPhotos.length) {
                                            removeExistingPhoto(photoUrl, index);
                                        } else {
                                            removeNewPhoto(index - existingPhotos.length);
                                        }
                                    }}>Eliminar</button>
                                </div>
                            ))}
                            {allPhotos.length === 4 ? null :
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </div>
                            }

                            <FormControl fullWidth>
                                <Autocomplete
                                    value={categoria}
                                    options={categorias}
                                    getOptionLabel={(categoria) => (categoria && categoria.Nombre) || ''}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Categoria"
                                        />
                                    )}
                                    isOptionEqualToValue={(option: any, value: any) => option?.Nombre === value?.Nombre}
                                    onChange={(event, value) => handleCategoriaChange(event, value)}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <Autocomplete
                                    options={marcas}
                                    value={marca}
                                    getOptionLabel={(marca) => (marca && marca.Nombre) || ''}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Marca"
                                        />
                                    )}
                                    isOptionEqualToValue={(option: any, value: any) => option?.Nombre === value?.Nombre}
                                    onChange={(event, value) => handleMarcaChange(event, value)}
                                />
                            </FormControl>
                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="submit"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                    type="submit"
                                    onClick={() => handleSave()}
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductoEdit