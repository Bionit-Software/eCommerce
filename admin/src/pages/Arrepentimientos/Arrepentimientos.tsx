import React, { useEffect } from 'react'
import TableArrepentimientos from '../../components/TableArrepentimientos'
import Breadcrumb from '../../components/Breadcrumb'

function Arrepentimientos() {
    useEffect(() => {
        document.title = 'Arrepentimiento'
    }, [])

    return (
        <>
        <Breadcrumb pageName="Arrepentimiento" />
        <div className="flex flex-col gap-10">
          <TableArrepentimientos />
        </div>
      </>
    )
}

export default Arrepentimientos