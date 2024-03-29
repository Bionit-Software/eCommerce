import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const TablesProducto = lazy(() => import('../pages/TablesProducto'));
const ProductoAdd = lazy(() => import('../pages/ProductoAdd'));
const ProductoEdit = lazy(() => import('../pages/ProductoEdit'));
const TablesCategorias = lazy(() => import('../pages/TablesCategorias'));
const TablesMarcas = lazy(() => import('../pages/TablesMarcas'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Paginas = lazy(() => import('../pages/Paginas'));
const Facturas = lazy(() => import('../pages/Facturas'));
const Principal = lazy(() => import('../pages/Principal'));
const Footer = lazy(() => import('../pages/Footer'));
const TerminosCondiciones = lazy(() => import('../pages/TerminosCondiciones'));
const PoliticaPrivacidad = lazy(() => import('../pages/PoliticaPrivacidad'));
const TablesPreguntas = lazy(() => import('../pages/TablesPreguntas'));
const PreguntasEdit = lazy(() => import('../pages/PreguntasEdit'));
const Contactos = lazy(() => import('../pages/Contactos/Contactos'));
const ContactoView = lazy(() => import('../pages/Contactos/ContactoView'));
const Email = lazy(() => import('../pages/Email'));
const Subscripciones = lazy(() => import('../pages/Subscripciones'));
const Arrepentimientos = lazy(() => import('../pages/Arrepentimientos/Arrepentimientos'));
const ArrepentimientosView = lazy(() => import('../pages/Arrepentimientos/ArrepentimientosView'));
const coreRoutes = [
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tablas/productos',
    title: 'Tabla Productos',
    component: TablesProducto,
  },
  {
    path: '/tablas/productos/add',
    title: 'Añadir Producto',
    component: ProductoAdd,
  },
  {
    path: '/tablas/productos/edit',
    title: 'Editar Producto',
    component: ProductoEdit,
  },
  {
    path: '/tablas/categorias',
    title: 'Tabla Categoria',
    component: TablesCategorias,
  },
  {
    path: '/tablas/marcas',
    title: 'Tabla marcas',
    component: TablesMarcas,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
  {
    path: '/paginas',
    title: 'Paginas',
    component: Paginas,
  },
  {
    path: '/facturas',
    title: 'Facturas',
    component: Facturas,
  },
  {
    path: '/paginas/principal',
    title: 'Principal',
    component: Principal,
  },
  {
    path: '/paginas/footer',
    title: 'Footer',
    component: Footer,
  },
  {
    path: '/paginas/terminos-condiciones',
    title: 'Términos y Condiciones',
    component: TerminosCondiciones,
  },
  {
    path: '/paginas/politica-privacidad',
    title: 'Política de Privacidad',
    component: PoliticaPrivacidad,
  },
  {
    path: '/paginas/preguntas-frecuentes',
    title: 'Preguntas Frecuentes',
    component: TablesPreguntas,
  },
  {
    path: '/paginas/preguntas-frecuentes/edit',
    title: 'Editar Pregunta',
    component: PreguntasEdit,
  },
  {
    path: '/contactos',
    title: 'Contactos',
    component: Contactos,
  },
  {
    path: '/contacto/view/:id',
    title: 'Contacto vista',
    component: ContactoView,
  },
  {
    path: '/arrepentimientos',
    title: 'Arrepentimientos',
    component: Arrepentimientos,
  },
  {
    path: '/arrepentimiento/view/:id',
    title: 'Arrepentimientos vista',
    component: ArrepentimientosView,
  },
  {
    path: '/email',
    title: 'Personalizar Email',
    component: Email,
  },
  {
    path: '/subscripciones',
    title: 'Subscripciones',
    component: Subscripciones,
  },

];

const routes = [...coreRoutes];
export default routes;
