import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropTarget from '../components/DropTarget';
import Breadcrumb from '../components/Breadcrumb';
import SidebarComponents from '../components/SidebarComponents';
import Slots from '../components/Slots';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { KeenSliderOptions } from 'keen-slider';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ProductosFormData, RootState, SliderFormData } from '../types/Types';

const Paginas: React.FC = () => {
  const dispatch = useDispatch();
  const sliderFormData = useSelector((state: RootState) => state.sliderForm);
  const [localSliderFormData, setLocalSliderFormData] = useState<SliderFormData>({
    photos: [],
    // Otros campos según sea necesario
  });

  const [localProductosFormData, setLocalProductosFormData] = useState<ProductosFormData>({
    // Campos según sea necesario
  });
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slidesPerView: 1, // Configuración para la vista inicial, podrías ajustar según tus necesidades
    mode: 'free-snap',
    spacing: 15,
    centered: true,
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      '(min-width: 768px)': {
        slidesPerView: 2,
      },
      '(min-width: 1200px)': {
        slidesPerView: 3,
      },
    },
  } as KeenSliderOptions);
  const [slotsContent, setSlotsContent] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const addNewPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setLocalSliderFormData((prevFormData) => ({
        ...prevFormData,
        photos: [...prevFormData.photos, ...newPhotos],
      }));
    }
  };

  useEffect(() => {
    if (slider) {
      console.log('slider', slider);
      slider.current?.update();
    }
  }, [photos, slider]);
  const handleForms = (type: string) => {
    switch (type) {
      case 'SLIDER':
        return (
          <>
            <div className='navigation-wrapper'>

              <div ref={sliderRef} className="keen-slider">
                {!slider && (
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      onChange={addNewPhoto}
                      multiple
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        {/* Icono de carga */}
                      </span>
                      <p>
                        <span className="text-primary">Click para Subir</span>
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                )}
                {photos.map((photo, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img src={photo} alt={`Slide ${index}`} />
                  </div>
                ))}
                {loaded && slider.current && (
                  <>
                    <Arrow
                      left
                      onClick={(e: any) =>
                        e.stopPropagation() || slider.current?.prev()
                      }
                      disabled={currentSlide === 0}
                    />

                    <Arrow
                      onClick={(e: any) =>
                        e.stopPropagation() || slider.current?.next()
                      }
                      disabled={
                        currentSlide ===
                        slider.current.track.details.slides.length - 1
                      }
                    />
                  </>
                )}
                {/* Botón para añadir más fotos */}
                <div
                  id="FileUpload"
                  className="keen-slider__slide mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={addNewPhoto}
                    multiple
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      {/* Icono de carga */}
                    </span>
                    <p>
                      <span className="text-primary">Click para Subir</span>
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>
                {loaded && slider.current && (
                  <div className="flex padding-top-10 justify-center">
                    {[
                      ...Array(slider.current.track.details.slides.length).keys(),
                    ].map((idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            slider.current?.moveToIdx(idx)
                          }}
                          className={"dot" + (currentSlide === idx ? " active" : "")}
                        ></button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className='w-full flex justify-center'>
              <button className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                onClick={() => {
                  handleModalClose();
                  if (localSliderFormData) {
                    dispatch({
                      type: 'UPDATE_SLIDER_FORM',
                      payload: localSliderFormData,
                    });
                  }
                  console.log(sliderFormData);
                }
                }>
                Guardar
              </button>
            </div>
          </>
        );
      case 'BANNER':
        return (
          <>
            <h1>Banner</h1>
            <p>Este es un banner</p>
          </>
        );
      case 'PRODUCTS':
        return (
          <>
            <h1>Products</h1>
            <p>Este es un products</p>
          </>
        );
      case 'ITEM':
        return (
          <>
            <h1>Item</h1>
            <p>Este es un item</p>
          </>
        );
      default:
        return (
          <>
            <h1>Default</h1>
            <p>Este es un default</p>
          </>
        );
    }
  }

  const handleDrop = (type: string) => {
    setSelectedComponent(type);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (selectedComponent) {
      setSlotsContent((prevContent) => [...prevContent, selectedComponent]);
      setSelectedComponent(null);
    }
  };

  const handleModalClose = () => {
    handleCancel();
    setIsModalOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Breadcrumb pageName="Crear pagina" />
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <DndProvider backend={HTML5Backend}>
          <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 md:col-span-8">
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <DropTarget onDrop={handleDrop} onCancel={handleCancel}>
                <Slots />
              </DropTarget>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-6'>
                  <DropTarget onDrop={handleDrop} onCancel={handleCancel}>
                    <Slots />
                  </DropTarget>
                </div>
                <div className='col-span-6'>
                  <DropTarget onDrop={handleDrop} onCancel={handleCancel}>
                    <Slots />
                  </DropTarget>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark md:col-span-4">
            <SidebarComponents />
          </div>
          <Modal
            open={isModalOpen}
            onClose={() => { }} // No agregar al slot si se cierra por el botón de cerrar
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            closeAfterTransition
          >
            <Box sx={style} className='bg-white dark:bg-boxdark rounded-lg'>
              <h3>Rellenar datos para {selectedComponent}</h3>
              {handleForms(selectedComponent || '')}
            </Box>
          </Modal>
        </DndProvider>
      </div>
    </>
  );
};

export default Paginas;

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