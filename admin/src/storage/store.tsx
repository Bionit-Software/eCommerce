// En tu store.ts o donde sea que lo tengas
import { createStore, combineReducers } from 'redux';
import { SliderFormData, ProductosFormData } from '../types/Types';

// Reducer para manejar el estado del formulario del Slider
const sliderFormReducer = (
  state: SliderFormData | null = null,
  action: { type: string; payload: SliderFormData }
) => {
  switch (action.type) {
    case 'UPDATE_SLIDER_FORM':
      return action.payload;
    default:
      return state;
  }
};

// Reducer para manejar el estado del formulario de productos
const productosFormReducer = (
  state: ProductosFormData | null = null,
  action: { type: string; payload: ProductosFormData }
) => {
  switch (action.type) {
    case 'UPDATE_PRODUCTOS_FORM':
      return action.payload;
    default:
      return state;
  }
};

// Combinar los reducers
const rootReducer = combineReducers({
  sliderForm: sliderFormReducer,
  productosForm: productosFormReducer,
  // Otros reducers...
});

// Crear el store
const store = createStore(rootReducer);

export default store;
