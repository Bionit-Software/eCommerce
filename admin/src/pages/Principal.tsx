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

const Principal: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [photosRemoved, setPhotosRemoved] = useState<string[]>([]);
    const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
    const [files, setFiles] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [hayFotos, setHayFotos] = useState(false);
    const [editMode, setEditMode] = useState(false);
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

    const handleFileChange = (event: any) => {
        const files = event.target.files;
        // Limitar la cantidad de fotos adicionales a agregar (máximo 5)
        if (files.length + photos.length <= 4) {
            setAdditionalPhotos([...additionalPhotos, ...files]);
            const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
            setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
            setLocalSliderFormData((prevFormData) => ({
                ...prevFormData,
                photos: [...prevFormData.photos, ...newPhotos],
            }));
        } else {
            setAdditionalPhotos([])
            toast.error('Solo se pueden agregar un máximo de 4 fotos.');
        }
    };

    const handleEditMode = () => {
        setEditMode(true);

    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlider = async () => {
            try {
                setLoading(true);
                const response = await axios.get(constants.API_URL + 'paginas/principal/slider/all');
                const data = response.data;
                console.log('data', data);
                setPhotos(data.urls.split(','));
                setLocalSliderFormData({
                    photos: data.urls.split(','),
                });
                if (response.data.status === 200) {
                    setHayFotos(true);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching slider:', error);
                setLoading(false);
            }
        }
        fetchSlider();
    }, []);


    useEffect(() => {
        if (instanceRef) {
            console.log('slider', instanceRef);
            instanceRef.current?.update();
        }
    }, [photos, instanceRef]);

    if (loading) {
        return <Loader />;
    }
    console.log('photos', photos);
    const handleSave = async () => {
        if (
            files.length !== 0
        ) {
            try {
                setLoading(true);
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                }

                const response = await axios.post(constants.API_URL + 'paginas/principal/slider/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Se ha agregado el slider correctamente');
                setLoading(false);
                window.location.reload();
            } catch (error) {
                toast.error('Error al agregar el slider' + 'error: ' + error);
            }
        } else {
            toast.error('Por favor, complete todos los campos');
        }

    };

    const handleSaveEdit = async () => {
        if (
            localSliderFormData.photos.length !== 0
        ) {
            try {
                console.log('photosRemoved', photosRemoved);
                console.log('additionalPhotos', additionalPhotos);
                console.log('files', files);
                setLoading(true);
                const formData = new FormData();
                formData.append('photosRemoved', photosRemoved.join(','));
                for (let i = 0; i < additionalPhotos.length; i++) {
                    formData.append('files', additionalPhotos[i]);
                }


                const response = await axios.put(constants.API_URL + 'paginas/principal/slider/update', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Se ha editado el slider correctamente');
                setLoading(false);
                window.location.reload();
            } catch (error) {
                setLoading(false);
                toast.error('Error al editar el slider' + 'error: ' + error);
            }
        } else {
            toast.error('Por favor, complete todos los campos');
        }

    };

    const removeExistingPhoto = (photoUrl: any, idx: number) => {
        console.log('photoUrl', photoUrl);
        const newPhotos = photos.filter((photo, index) => index !== idx);
        setPhotosRemoved([...photosRemoved, photoUrl])
        setPhotos(newPhotos);
        setLocalSliderFormData((prevFormData) => ({
            ...prevFormData,
            photos: newPhotos,
        }));
    };

    const removeNewPhoto = (idx: number) => {
        const newPhotos = photos.filter((photo, index) => index !== idx);
        const newFiles = files.filter((file, index) => index !== idx);
        setPhotos(newPhotos);
        setFiles(newFiles);
        setLocalSliderFormData((prevFormData) => ({
            ...prevFormData,
            photos: newPhotos,
        }));
    };

    return (
        <>
            {loading ? <Loader /> : null}
            <Breadcrumb pageName="Principal" />

            <div className="grid grid-cols-1">
                <div className="flex flex-col">
                    {/* <!-- Textarea Fields --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        {editMode === false ? (
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
                                            {hayFotos ? (
                                                <button
                                                    className="flex justify-center rounded w-6/12 border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                                    type="submit"
                                                    onClick={() => handleEditMode()}
                                                >
                                                    Editar
                                                </button>
                                            ) : (
                                                <button
                                                    className="flex justify-center rounded w-6/12 bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                                    type="submit"
                                                    onClick={() => setPhotos([])}
                                                >
                                                    Eliminar Todas
                                                </button>
                                            )
                                            }
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
                                            <p className="mt-1.5">SVG, PNG, JPG, Webp</p>
                                            <p>(max, 1900 X 350px)</p>
                                        </div>
                                    </div>
                                )}
                                {!hayFotos ? (
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
                                ) : null}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5.5 p-6.5">
                                {photos.length > 0 ? (
                                    <div className="navigation-wrapper ">
                                        <div ref={sliderRef} className="keen-slider h-125 w-full">
                                            {photos?.map((file, idx) => (
                                                <div key={idx} className="keen-slider__slide">
                                                    <img
                                                        src={file}
                                                        alt="imagen"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button className="rounded-full bg-meta-1 text-white leading-none p-2 absolute top-0 right-0 cursor-pointer" onClick={() => {
                                                        if (idx < photos.length) {
                                                            removeExistingPhoto(file, idx);
                                                        } else {
                                                            removeNewPhoto(idx - photos.length);
                                                        }
                                                    }}>
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            ></path>
                                                        </svg>
                                                    </button>
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
                                ) : null}

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
                                {photos.length < 4 ? (
                                    <div
                                        id="FileUpload"
                                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex items-center justify-center space-y-3">
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
                                            <p className="mt-1.5">SVG, PNG, JPG</p>
                                            <p>(max, 800 X 800px)</p>
                                        </div>
                                    </div>
                                ) : null}
                                <div className='flex w-full gap-4.5'>
                                    <button
                                        className="flex justify-center rounded w-6/12 border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        type="submit"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancelar
                                    </button>
                                    {photos.length > 0 && (photosRemoved.length > 0 || additionalPhotos.length > 0) ? (
                                        <button
                                            className="flex justify-center rounded w-6/12 bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                            type="submit"
                                            onClick={() => handleSaveEdit()}
                                        >
                                            Guardar
                                        </button>

                                    ) : (
                                        <button
                                            disabled
                                            className="disabled flex justify-center rounded w-6/12 bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 hover:cursor-not-allowed"
                                            type="submit"
                                        >
                                            No hay cambios
                                        </button>
                                    )}

                                </div>
                            </div>
                        )}
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


export default Principal