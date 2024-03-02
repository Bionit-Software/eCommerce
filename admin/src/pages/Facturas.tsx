import { useEffect, useState } from 'react'
import URL from '../constants'
import Breadcrumb from '../components/Breadcrumb'
import TableFacturas from '../components/TableFacturas'
function Facturas() {
    useEffect(() => {
        document.title = 'Facturas'
    }, [])

    return (
        <>
        <Breadcrumb pageName="Facturas" />
        <div className="flex flex-col gap-10">
          <TableFacturas />
        </div>
      </>
    )
}

export default Facturas