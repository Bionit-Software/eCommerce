import React, { useEffect } from 'react'
import TableContactos from '../../components/TableContactos'
import Breadcrumb from '../../components/Breadcrumb'

function Contactos() {
    useEffect(() => {
        document.title = 'Contactos'
    }, [])

    return (
        <>
        <Breadcrumb pageName="Contactos" />
        <div className="flex flex-col gap-10">
          <TableContactos />
        </div>
      </>
    )
}

export default Contactos