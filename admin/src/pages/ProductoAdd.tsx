import React, { useEffect, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import constants from '../constants';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { ProductosFormData, RootState, SliderFormData } from '../types/Types';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

function ProductoAdd() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(0);
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState(0);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [files, setFiles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  // const filesArray = Array.from(files);
  // const sliderFormData = useSelector((state: RootState) => state.sliderForm);
  const [localSliderFormData, setLocalSliderFormData] = useState<SliderFormData>({
    photos: [],
    // Otros campos según sea necesario
  });
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })
  const addNewPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length <= 4) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setLocalSliderFormData((prevFormData) => ({
        ...prevFormData,
        photos: [...prevFormData.photos, ...newPhotos],
      }));
      setFiles(files);
    } else {
      toast.error('No puede subir más de 4 imágenes');
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCategorias = await axios.get(constants.API_URL + 'categorias/all');
        setCategorias(responseCategorias.data);
        const responseMarcas = await axios.get(constants.API_URL + 'marcas/all');
        setMarcas(responseMarcas.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error or display a user-friendly message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (instanceRef) {
      console.log('slider', instanceRef);
      instanceRef.current?.update();
    }
  }, [photos, instanceRef]);

  const handleCategoriaChange = (event: any, value: any) => {
    setCategoria(value.ID);
  }
  const handleMarcaChange = (event: any, value: any) => {
    setMarca(value.ID);
  }
  const handleNombreChange = (event: any) => {
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
  if (loading) {
    return <Loader />;
  }
  const handleSave = async () => {
    if (
      nombre !== undefined &&
      descripcion !== undefined &&
      precio !== 0 &&
      stock !== 0 &&
      categoria !== 0 &&
      marca !== 0 &&
      files.length !== 0
    ) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('stock', stock);
        formData.append('idCategoria', categoria);
        formData.append('idMarca', marca);
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }

        const response = await axios.post(constants.API_URL + 'productos/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Producto agregado con éxito');
        navigate('/tablas/productos');
      } catch (error) {
        toast.error('Error al agregar el producto'+ 'error: ' + error);
        // console.error('Error durante la carga del archivo:', error);
        // Manejar el error de manera apropiada (por ejemplo, mostrar un mensaje de error al usuario)
      }
    } else {
      toast.error('Por favor, complete todos los campos');
    }

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
              {photos.length > 0 ? (
                <>
                  <div className="navigation-wrapper ">
                    <div ref={sliderRef} className="keen-slider h-125 w-full">
                      {photos.map((file, idx) => (
                        <div key={idx} className="keen-slider__slide">
                          <img
                            src={file}
                            alt="imagen"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    {loaded && instanceRef.current && (
                      <>
                        <Arrow
                          left
                          onClick={(e: any) =>
                            e.stopPropagation() || instanceRef.current?.prev()
                          }
                          disabled={currentSlide === 0}
                        />

                        <Arrow
                          onClick={(e: any) =>
                            e.stopPropagation() || instanceRef.current?.next()
                          }
                          disabled={
                            currentSlide ===
                            instanceRef.current.track.details.slides.length - 1
                          }
                        />
                      </>
                    )}
                  </div>
                  {loaded && instanceRef.current && (
                    <div className="dots">
                      {[
                        ...Array(instanceRef.current.track.details.slides.length).keys(),
                      ].map((idx) => {
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              instanceRef.current?.moveToIdx(idx)
                            }}
                            className={"dot" + (currentSlide === idx ? " active" : "")}
                          ></button>
                        )
                      })}
                    </div>
                  )}
                  <div className="flex w-full gap-4.5">
                    <button
                      className="flex justify-center rounded w-6/12 bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                      onClick={() => setPhotos([])}
                    >
                      Eliminar Todas
                    </button>
                  </div>
                </>
              ) : (
                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={addNewPhoto}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-primary">Click para Subir</span>
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>
              )}
              <FormControl fullWidth>
                <Autocomplete
                  options={categorias}
                  getOptionLabel={(categoria) => categoria.Nombre}
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
                  getOptionLabel={(marca) => marca.Nombre}
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

function Arrow(props: {
  disabled: boolean
  left?: boolean
  onClick: (e: any) => void
}) {
  const disabled = props.disabled ? " arrow--disabled" : ""
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${props.left ? "arrow--left" : "arrow--right"
        } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  )
}

export default ProductoAdd