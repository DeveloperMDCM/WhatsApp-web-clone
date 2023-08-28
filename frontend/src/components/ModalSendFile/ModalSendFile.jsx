import { useState } from "react";
const ModalSendFile = ({ UploadFile,  OpenModal, CloseModal, setFile} ) => {
    const [selectedFiles, setSelectedFile] = useState(null); // Nuevo estado para archivos adjuntos

    // const handleInputChange = e => {
    //     const nuevoValor = e.target.value;
    //     setValorA(nuevoValor);
    //     actualizarValorB(nuevoValor); // Actualiza el valor en ComponenteB
    //   };

  return (
    <div>
    {/* Modal para seleccionar un archivo */}
    {OpenModal && (
      <div className="file-modal max-w-[200px] rounded-3xl gap-1 shadow-md">
        <div className="flex items-start w-full ">
          <label
            htmlFor="dropzone-file1"
            className="flex text-white items-center justify-start w-full  p-1  rounded-lg cursor-pointer  hover:bg-bray-800   hover:bg-[#182229] "
          >
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon text-[#7f66ff] icon-tabler icon-tabler-file-filled"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5z"
                  strokeWidth="0"
                  fill="currentColor"
                ></path>
                <path
                  d="M19 7h-4l-.001 -4.001z"
                  strokeWidth="0"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <input
              id="dropzone-file1"
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                UploadFile(e.target.files[0]); // Subir el archivo al servidor
              }}
              className="hidden"
            />
            <span className="mx-2">Documento</span>
          </label>
        </div>
        <div className="flex items-start w-full">
          <label
            htmlFor="dropzone-file2"
            className="flex text-white items-center justify-start w-full  rounded-lg cursor-pointer p-1  hover:bg-bray-800     hover:bg-[#182229] "
          >
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon text-[#007bfc] icon-tabler icon-tabler-photo-filled"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z"
                  strokeWidth="0"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <input id="dropzone-file2" type="file" className="hidden" />
            <span className="mx-2">Fotos y Videos</span>
          </label>
        </div>
        <button
          className={`absolute -bottom-[36px] -left-[7px] flex justify-center items-center text-2xl font-bold text-transparent ${
            OpenModal ? "bg-[#3742487b] rounded-full w-[30px]" : ""
          }`}
          onClick={CloseModal}
        >
          X
        </button>
      </div>
    )}

  
  </div>
  );
};

export default ModalSendFile;
