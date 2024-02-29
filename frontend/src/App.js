import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { logoLight } from "./assets/images";
import Exito from "./pages/Mercadopago/Exito";
import Error from "./pages/Mercadopago/Error";

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
      <FloatingWhatsApp
        phoneNumber="542994559600"
        accountName="TiendaDeAutor"
        avatar={logoLight}
        chatMessage="Hola, ¿en qué podemos ayudarte?"
        statusMessage="En línea"
        allowClickAway
        showPopup
        size="60px"
        backgroundColor="#25d366"
        position={{ bottom: '20px', right: '20px' }}
      />
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />}></Route>
        <Route path="/tienda" element={<Shop />}></Route>
        <Route path="/nosotros" element={<About />}></Route>
        <Route path="/contacto" element={<Contact />}></Route>
        {/* <Route path="/journal" element={<Journal />}></Route> */}
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/ofertas" element={<Offer />}></Route>
        <Route path="/producto/:_id" element={<ProductDetails />}></Route>
        <Route path="/carrito" element={<Cart />}></Route>
        <Route path="/parcela-pago" element={<Payment />}></Route>
        <Route path="/exito" element={<Exito />}></Route>
        <Route path="/error" element={<Error />}></Route>
      </Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
