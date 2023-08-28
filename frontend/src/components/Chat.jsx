// https://github.com/DeveloperMDCM
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Toaster, toast } from "sonner";
import ChatSearchButton from "./ChatSearchButton";
import MessageModal from "./MessageModal ";
import clienteAxios from "../config/axios";
import ModalImage from "./ModalImage";
import SpinnerLoading from "./SpinnerLoading/SpinnerLoading";
import Header from "./Header";
import ModalSendFile from "./ModalSendFile/ModalSendFile";
import NavigateUpDown from "./NavigateUpDown";
import socket from "../config/socket";
export default function Chat({ username, UsersOnline }) {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [widhtChat, setWidhtChat] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(-1);
  const [highlightedMessageIndices, setHighlightedMessageIndices] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para archivos adjuntos
  const [uploadedFileName, setUploadedFileName] = useState(""); // Nuevo estado para el nombre del archivo subido
  const [newMessageText, setNewMessageText] = useState("");
  const modalRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false); // Estado para controlar la apertura del modal
  const [loading, setLoading] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
 
  const handleSearch = (searchText) => {
    const matchingIndices = messages.reduce((acc, msg, index) => {
      if (msg.message.toLowerCase().includes(searchText.toLowerCase())) {
        acc.push(index);
      }
      return acc;
    }, []);

    if (matchingIndices.length > 0) {
      setSelectedMessageIndex(matchingIndices[0]);
      setHighlightedMessageIndices(matchingIndices);

      if (messageContainerRef.current) {
        messageContainerRef.current.children[matchingIndices[0]].scrollIntoView(
          {
            behavior: "smooth",
            block: "start",
          }
        );
      }
    }
  };
  const openImageModal = (image, msg) => {
    setSelectedImage(image);
    setSelectedText(msg);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedText(null);
  };

  const scrollToMessage = (index) => {
    if (messageContainerRef.current) {
      messageContainerRef.current.children[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navigateMessages = (step) => {
    if (highlightedMessageIndices.length > 0) {
      const currentIndex =
        highlightedMessageIndices.indexOf(selectedMessageIndex);
      const nextIndex = currentIndex + step;

      if (nextIndex >= 0 && nextIndex < highlightedMessageIndices.length) {
        setSelectedMessageIndex(highlightedMessageIndices[nextIndex]);

        if (messageContainerRef.current) {
          messageContainerRef.current.children[
            highlightedMessageIndices[nextIndex]
          ].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
  };
  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const { data } = await clienteAxios.get("/messages");
      setMessages(data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Escucha el evento de nuevos mensajes desde el servidor
    socket.on("messageReceived", (newMessage) => {
      // playMessageSound(); Sonido al enviar mensaje
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessagesCount((prevCount) => prevCount + 1);
      
    });

    // Escucha el evento de mensajes editados desde el servidor
    socket.on("messageUpdated", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    // Desconectar los eventos al desmontar el componente
    return () => {
      socket.off("messageReceived");
      socket.off("messageUpdated");
    };
  }, []);

  const handleSendMessage = async () => {
    if (newMessageText.trim() !== "" || message.trim() !== "" || selectedFile) {
      const messageToSend = {
        username: username,
        message: newMessageText || message,
        edited: false,
        file_url: uploadedFileName, // Adjunta el archivo al mensaje
      };
      socket.emit("sendMessage", messageToSend);
      setNewMessageText("");
      setMessage("");
      setSelectedFile(null);
      setUploadedFileName("");
    
        
      
    } else {
      toast.error("Escriba algo");
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsFileModalOpen(false);
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await clienteAxios.post("/upload", formData);
      setUploadedFileName(data.filename);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileModalOpen = () => {
    setIsFileModalOpen(true);
  };

  const handleFileModalClose = () => {
    setIsFileModalOpen(false);
  };

  const handleEditMessage = (messageId, newText, username, image) => {
    socket.emit("editMessage", { messageId, newText, username, image });

    return true;
  };

  const handleStartEditing = (messageId, text) => {
    setEditingMessageId(messageId);
    setNewMessageText(text);
  };

  const handleCancelEditing = () => {
    setEditingMessageId(null);
    
  };

  function isAtBottom() {
    const scrollTop = window.scrollY;  // Posición vertical del scroll
    const windowHeight = window.innerHeight;  // Altura de la ventana del navegador
    const documentHeight = document.documentElement.scrollHeight;  // Altura total del contenido
    setNewMessagesCount(0)
    // Comprueba si la posición vertical del scroll más la altura de la ventana es igual o mayor que la altura total del contenido
    return scrollTop + windowHeight >= documentHeight;
  }

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }, [])


  const toggleVisibility = () => {
    if (
      window.scrollY <
      document.body.scrollHeight - window.innerHeight - 300
    ) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setNewMessagesCount(0)
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Actualozar valores
  const updateFile = (newImage) => {
    setSelectedFile(newImage);
  };
  const clearIndices = (reset) => {
    setHighlightedMessageIndices(reset);
  };
  const openCloseModalMessages = (full) => {
    setWidhtChat(full);
  };

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <div className="h-screen flex flex-col " id="contenido">
        {/* Modal para subir archivos  */}
        <ModalSendFile
          OpenModal={isFileModalOpen}
          setFile={updateFile}
          CloseModal={handleFileModalClose}
          UploadFile={handleFileUpload}
        />
        <div
          className={` ${
            widhtChat === 1
              ? "xl:w-[80%] lg:w-[75%] md:w-[50%] tansition-all"
              : " transition-all"
          }  bg-[#202c33] fixed top-0 z-[1] left-0 w-full p-2  flex items-center justify-between`}
        >
          {/* <!-- Texto en la parte superior (fixed) --> */}
          <Header username={username} UsersOnline={UsersOnline} />

          <div className="flex">
            {widhtChat === 0 && (
              <div
                onClick={() => {
                  setWidhtChat(1);
                }}
              >
                <ChatSearchButton
                  onSearch={handleSearch}
                  messages={messages}
                  modalRef={modalRef}
                />
              </div>
            )}

            {highlightedMessageIndices.length > 0 && widhtChat === 0 && (
              <NavigateUpDown
                Navigate={navigateMessages}
                clearIndices={clearIndices}
              />
            )}
          </div>
        </div>
        <div
          className={`flex  bg-chat ${
            widhtChat === 1
              ? "xl:w-[80%] lg:w-[75%] md:w-[50%] tansition-all"
              : "w-full transition-all"
          }`}
        >
          {loading ? (
            <SpinnerLoading />
          ) : (
            <div
              className="flex-1  overflow-hidden mt-16 mb-16 "
              ref={messageContainerRef}
            >
              {/* <!-- Contenido que puede hacer scroll --> */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`break-all  m-10 mr-10 ml-10 ${
                    message.file_url &&
                    message.message &&
                    message.message.length > 20
                      ? " w-[300px] flex"
                      : ""
                  }  my-3 p-2   text-sm rounded-md ${
                    highlightedMessageIndices.includes(index)
                      ? " bg-[#43b3d5]  font-bold "
                      : ""
                  }  
              ${
                message.user === username
                  ? "bg-[#005c4b] text-white sm:ml-auto table"
                  : "bg-[#202c33] table text-white mr-auto "
              }
            
              
              `}
                >
                  {editingMessageId === message.id && (
                    <div className="flex">
                      <button
                        onClick={() => {
                          handleEditMessage(
                            message.id,
                            newMessageText,
                            message.user,
                            message.file_url
                          );

                          handleCancelEditing();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon  icon-tabler icon-tabler-device-floppy"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
                          <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                          <path d="M14 4l0 4l-6 0l0 -4"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          handleCancelEditing();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon  icon-tabler icon-tabler-pencil-off"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                          <path d="M13.5 6.5l4 4"></path>
                          <path d="M3 3l18 18"></path>
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={newMessageText}
                        className="focus:outline-none rounded-md bg-[#2a3942]  focus:right-1 w-full p-2 text-white"
                        onChange={(e) => setNewMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEditMessage(
                              message.id,
                              newMessageText,
                              message.user,
                              message.file_url
                            );
                            handleCancelEditing();
                          }
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={`flex justify-between  ${
                      message.user === username
                        ? "text-yellow-500"
                        : " text-blue-500"
                    } `}
                  >
                    {/* {message.user === username ? "Yo" : message.user  }  */}
                    {message.user === username ? (
                      <>
                        <div>
                          <span className="font-bold">
                            {message.user === username ? "Yo" : message.user}
                          </span>
                        </div>
                        <div>
                          <button
                            className=" cursor-pointer hover:text-gray-900"
                            onClick={(e) => {
                              handleStartEditing(message.id, message.message);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-chevron-down text-white"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              ></path>
                              <path d="M6 9l6 6l6 -6"></path>
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      message.user
                    )}
                  </div>
                  <div>
                    {message.file_url && (
                      <div className="message-file">
                        {message.file_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <img
                            className={`cursor-pointer rounded-md `}
                            width={300}
                            onClick={() =>
                              openImageModal(message.file_url, message.message)
                            }
                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                              message.file_url
                            }`}
                            alt="Adjunto"
                          />
                        ) : message.file_url.match(/\.(mp4|webm)$/) ? (
                          <div className="video-container">
                            <video muted width={400} className="" controls>
                              <source
                                src={`${
                                  import.meta.env.VITE_BACKEND_URL
                                }/uploads/${message.file_url}`}
                                type="video/mp4"
                              />
                              Tu navegador no soporta el formato de video.
                            </video>
                          </div>
                        ) : message.file_url.match(
                            /\.(mp3|ogg|wav|m4a|acc)$/
                          ) ? (
                          <div className="audio-container">
                            <audio className="audio-player " controls>
                              <source
                                src={`${
                                  import.meta.env.VITE_BACKEND_URL
                                }/uploads/${message.file_url}`}
                                type="audio/mpeg"
                              />
                              Tu navegador no soporta el elemento de audio.
                            </audio>
                          </div>
                        ) : (
                          <a
                            href={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/uploads/${message.file_url}`}
                            target="_blank"
                            download
                            rel="noopener noreferrer"
                          >
                            <div className="flex gap-1 items-center hover:text-bold hover:text-blue-400">
                              <span>{message.file_url}</span>
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-file-download"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  ></path>
                                  <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                  <path d="M12 17v-6"></path>
                                  <path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path>
                                </svg>
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    <div className="flex ">
                      <div className="flex justify-between items-center">
                        <span className="mx-2 ">
                          {message.edited ? (
                            <>
                              <>
                                <span className="">{message.message}</span>
                              </>
                              <span className="font-bold break-words  text-green-500 text-[0.7rem] whitespace-nowrap">
                                {" "}
                                Editado
                              </span>
                            </>
                          ) : (
                            message.message
                          )}
                        </span>

                        <span className=" text-[0.6rem] mt-2 text-right whitespace-nowrap">
                          {moment(message.created_at).format("LT")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {selectedImage && (
                <ModalImage
                  image={selectedImage}
                  msg={selectedText}
                  onClose={closeImageModal}
                />
              )}
            </div>
          )}
        </div>
        <div>
          <div className=" ">
            {/* <!-- Texto en la parte inferior (fixed) --> */}
            <div className=" relative ">
              <div
                className={`  ${
                  widhtChat === 1
                    ? "xl:w-[80%] lg:w-[75%] md:w-[50%] w-full tansition-all"
                    : " transition-all"
                }  fixed left-0 bottom-0  w-full flex justify-center items-center p-1 bg-[#202c33] overflow-y-auto`}
              >
                <div className=" ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-mood-smile"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#7b8b95"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                    <path d="M9 10l.01 0"></path>
                    <path d="M15 10l.01 0"></path>
                    <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
                  </svg>
                </div>
                <button
                  onClick={handleFileModalOpen}
                  className={`text-[#8696a0] font-bold text-3xl mb-1 ml-2   
                  ${isFileModalOpen ? "rotate " : ""}`}
                >
                  +
                </button>
                <input
                  name="message"
                  type="text"
                  placeholder={"Escribe un mensaje aqui"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                      setTimeout(() => {
                        window.scrollTo(0, document.body.scrollHeight)
                      }, 300);
                    }
                  }}
                  className={`focus:outline-none bg-[#2a3942]     focus:right-1 w-full lg:w-full p-2 rounded-lg mx-2 text-white resize-none`}
                  value={message}
                  onChange={(e) => 
                    {
                      
                      setMessage(e.target.value)
                    }
                  }
                  autoFocus
                />
                <button
                  className="p-3 cursor-pointer"
                  onClick={handleSendMessage}
                >
                  <svg
                    className="icon icon-tabler icon-tabler-send"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#fff"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 14l11 -11"></path>
                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <MessageModal
          onSearch={handleSearch}
          ref={modalRef}
          messages={messages}
          scrollToMessage={scrollToMessage}
          modalOpen={openCloseModalMessages}
        />
      </div>

      <div className={`scroll-to-bottom  ${isVisible  ? "visible" : ""}`}>
        <button  className=" rounded-full p-2 " onClick={() => {
          setNewMessagesCount(0)
          scrollToBottom()}}>
          <span className="font-bold">{newMessagesCount}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-chevron-down"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M6 9l6 6l6 -6"></path>
          </svg>
        </button>
      </div>
    </>
  );
}
