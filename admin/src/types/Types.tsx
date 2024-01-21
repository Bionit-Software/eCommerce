export interface SliderFormData {
    photos: string[];
    // Otros campos del formulario del Slider
  }
  
  export interface ProductosFormData {
    // Campos del formulario de productos
    // Por ejemplo: name, price, description, etc.
  }

  export interface RootState {
    sliderForm: SliderFormData;
    productosForm: ProductosFormData;
    // Otros estados si los tienes
  }