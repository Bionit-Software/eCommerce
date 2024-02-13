import Breadcrumb from '../components/Breadcrumb';
import TableProductos from '../components/TableProductos';
const TablesProducto = () => {

  return (
    <>
      <Breadcrumb pageName="Productos" />
      <div className="flex flex-col gap-10">
        <TableProductos />
      </div>
    </>
  );
};

export default TablesProducto;