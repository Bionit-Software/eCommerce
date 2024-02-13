import { useEffect, useState } from 'react'
import URL from '../constants'
import Breadcrumb from '../components/Breadcrumb'
import TableFacturas from '../components/TableFacturas'
function Facturas() {
    const [facturas, setFacturas] = useState([])
    useEffect(() => {
        document.title = 'Facturas'
        const fetchData = async () => {
            const response = await fetch(URL.API_URL + 'mercadopago/facturas')
            const data = await response.json()
            console.log(data)
            setFacturas(data)
        }
        fetchData()
    }, [])

    return (
        <>
        <Breadcrumb pageName="Productos" />
        <div className="flex flex-col gap-10">
          <TableFacturas products={facturas} />
        </div>
      </>
    )
}

export default Facturas