import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import constants from '../../constants';
import toast from 'react-hot-toast';
import SunEditor from 'suneditor-react';
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';
import es from 'suneditor/src/lang/es';
function ArrepentimientosView() {
    const location = useLocation();
    const [arrepentimiento, setArrepentimiento] = useState({});
    const [estado, setEstado] = useState('');
    const navigate = useNavigate();
    const editor = useRef<SunEditorCore>();
    const [content, setContent] = useState<string>(''); // Estado para almacenar el contenido del editor  
    const getSunEditorInstance = (sunEditor: SunEditorCore) => {
        editor.current = sunEditor;
    };



    useEffect(() => {
        // Cuando el componente se monta, establece el contenido del editor si es necesario (por ejemplo, al cargar desde la base de datos)
        const getInitialContent = async () => {
            try {
                const res = await axios.get(constants.API_URL + 'paginas/email');
                if (res.data.status === 200) {
                    editor.current?.setContents(res.data.data.contenido);
                    setContent(res.data.data.contenido);
                } else if (res.data.status === 204) {
                    editor.current?.setContents(res.data.message);
                }
                if (res.data.status === 500) {
                    toast.error(res.data.message);
                }
            } catch (error) {
                toast.error('Error al obtener el contenido inicial');
            }
        }
        getInitialContent();
    }, []);

    useEffect(() => {
        document.title = 'arrepentimiento'
        const arrepentimiento = location.state && location.state.arrepentimiento;
        const id = location.pathname.split('/').pop();
        const fetchData = async () => {
            if (!arrepentimiento) {
                const res = await axios.get(constants.API_URL + 'paginas/arrepentimiento/' + id);
                if (res.data.status === 200) {
                    console.log(res.data.data)
                    setEstado(res.data.data.estado);
                    setArrepentimiento(res.data.data);
                } else {
                    toast.error(res.data.message);
                }
            } else {
                setArrepentimiento(arrepentimiento);
                setEstado(arrepentimiento.estado);
            }
        }
        fetchData();
    }, [])

    const handleSave = async () => {
        const res = await axios.post(constants.API_URL + `paginas/arrepentimiento/email/${arrepentimiento?.id}?estado=${arrepentimiento?.estado}&from='messi'&to=${arrepentimiento?.email}`, { contenido: editor.current?.getContents(true) });
        if (res.data.status === 200) {
            toast.success(res.data.message);
            navigate(-1);
        } else {
            toast.error(res.data.message);
        }
    }

    const parsearFecha = (fecha: string) => {
        const fechaParseada = new Date(fecha);
        return fechaParseada.toLocaleDateString();
    }

    const estadoColor = (estado: string) => {
        switch (estado) {
            case 'sin responder':
                return <div className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning"> Sin responder </div>;
            case 'resuelto':
                return <div className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success"> Resuelto </div>;
            case 'en proceso':
                return <div className="inline-flex rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary"> En proceso </div>;
            default:
                return <div className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning"> Sin responder </div>;
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-9 md:grid-cols-3">
                <div className="flex flex-col gap-9 md:col-span-1">
                    {/* <!-- Input Fields --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between">
                            <h3 className="font-medium text-black dark:text-white">
                                Numero Pedido #{arrepentimiento?.numeroPedido}
                            </h3>
                            <p>
                                {estadoColor(estado)}
                                <span>
                                    {parsearFecha(arrepentimiento?.createdAt)}
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5 ">
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Nombre
                                </label>
                                <p
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    {arrepentimiento?.nombre}
                                </p>
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Email
                                </label>
                                <p
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    {arrepentimiento?.email}
                                </p>
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Teléfono
                                </label>
                                <p
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    {arrepentimiento?.telefono}
                                </p>
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Motivo
                                </label>
                                <p
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    {arrepentimiento?.motivo}
                                </p>
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Mensaje
                                </label>
                                <p
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary break-words"
                                >
                                    {arrepentimiento?.mensaje}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-9 md:col-span-2">
                    {/* <!-- Textarea Fields --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-col gap-5.5 p-6.5">
                            <div className="flex justify-between">
                                <h3 className="font-medium text-black dark:text-white">
                                    Respuesta
                                </h3>
                                <div className="flex justify-between">
                                    <select
                                        value={arrepentimiento?.estado}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        onChange={(e) => setArrepentimiento({ ...arrepentimiento, estado: e.target.value })}
                                    >
                                        <option value="sin responder">Sin responder</option>
                                        <option value="en proceso">En proceso</option>
                                        <option value="resuelto">Resuelto</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <SunEditor
                                    getSunEditorInstance={getSunEditorInstance}
                                    lang={es}
                                    setOptions={{
                                        height: "200",
                                        buttonList: [
                                            ['undo', 'redo',
                                                'font', 'fontSize', 'formatBlock',
                                                'paragraphStyle', 'blockquote',
                                                'bold', 'underline', 'italic', 'strike',
                                                'fontColor', 'hiliteColor', 'textStyle',
                                                'removeFormat',
                                                'outdent', 'indent',
                                                'align', 'horizontalRule', 'list', 'lineHeight',
                                                'table', 'link', 'image', 'video',
                                                'fullScreen', 'showBlocks',
                                                'preview', 'print']
                                        ]
                                    }}
                                />
                            </div>


                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="submit"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                    type="submit"
                                    onClick={() => handleSave()}
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ArrepentimientosView