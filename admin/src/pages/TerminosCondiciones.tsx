import React, { useRef, useEffect, useState } from "react";
import SunEditor from 'suneditor-react';
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';
import es from 'suneditor/src/lang/es';
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import constants from "../constants";
import toast from "react-hot-toast";

function TerminosCondiciones() {
  const editor = useRef<SunEditorCore>();
  const [content, setContent] = useState<string>(''); // Estado para almacenar el contenido del editor
  const [saveContent, setSaveContent] = useState<string>(''); // Estado para almacenar el contenido guardado
  // La función getSunEditorInstance será llamada con la instancia del editor cuando esté lista
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    // Cuando el componente se monta, establece el contenido del editor si es necesario (por ejemplo, al cargar desde la base de datos)
    const getInitialContent = async () => {
      try {
        const res = await axios.get(constants.API_URL + 'paginas/terminos-condiciones');
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
    console.log('consulta')
  }, [saveContent]);

  const handleSave = async () => {
    // Obtén el contenido HTML actual del editor
    try {
      const content = editor.current?.getContents(true);
      if (content) {
        // Guarda el contenido en la base de datos
        const res = await axios.put(constants.API_URL + 'paginas/terminos-condiciones/update', { contenido: content })
        if (res.data.status === 200) {
          toast.success(res.data.message);
          setSaveContent(content);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      toast.error('Error al obtener el contenido del editor');
    }

    // console.log(editor.current?.getContents(true));
    // setSaveContent(editor.current?.getContents(true) || '');
  };

  return (
    <div>
      <div className="md:flex md:justify-between mb-4">
        <Breadcrumb pageName="Terminos y Condiciones" />
        <button
          className="rounded bg-primary px-6 font-medium text-gray hover:shadow-1 h-10"
          onClick={handleSave}
        >
          Guardar
        </button>
      </div>
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        lang={es}
        setOptions={{
          height: "200",
          buttonList: [
            ['undo', 'redo',
              'font', 'fontSize', 'formatBlock',
              'paragraphStyle', 'blockquote',
              'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
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
      {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> Muestra el contenido guardado */}
    </div>
  );
}

export default TerminosCondiciones;