import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import moment from "moment";
import momentPTBR from "moment/src/locale/es";

// https://github.com/DeveloperMDCM
const MessageModal = forwardRef(
  ({ onSearch, onClose, messages, scrollToMessage, modalOpen }, ref) => {
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [matchingMessages, setMatchingMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
// console.log(panel);
function prepareLocale(locale) {
  for (const key in locale) {
    if (locale.hasOwnProperty(key)) {
      locale[key.substring(1)] = locale[key];
    }
  }
  return locale;
}

moment.updateLocale("es", prepareLocale(momentPTBR));
    //  console.log(onClick);
    const handleSearch = (e) => {
      if (searchText !== "") {
        onSearch(searchText);
        const matchingIndices = messages.reduce((acc, msg, index) => {
          if (msg.message.toLowerCase().includes(searchText.toLowerCase())) {
            acc.push(index);
          }

          return acc;
        }, []);

        setMatchingMessages(matchingIndices);
        // setCurrentMessageIndex(0);
        // setCurrentMessageIndex(matchingIndices.length > 0 ? matchingIndices[0] : 0);
      }
    };
    const bottomClose = () =>{ 
      modalOpen(0)
    }

    const handleNavigateNext = () => {
      if (currentMessageIndex < matchingMessages.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
        scrollToMessage(matchingMessages[currentMessageIndex + 1]);
      }
    };

    const handleNavigatePrevious = () => {
      if (currentMessageIndex > 0) {
        setCurrentMessageIndex(currentMessageIndex - 1);
        scrollToMessage(matchingMessages[currentMessageIndex - 1]);
        setCurrentMessageIndex(0);
        // if(currentMessageIndex > 1) {
        //     scrollTo(0,window.scrollY-100)
        // }
        // if(currentMessageIndex === 1) {
        //     scrollTo(0,window.scrollY-100)
        // }
      }
    };

    const scrollToMessageInChat = (index) => {
      setCurrentMessageIndex(index);
      scrollToMessage(index);
      setIsModalOpen(false);
    };

    useImperativeHandle(ref, () => ({
      openModal() {
        setIsModalOpen(true);
        setMatchingMessages([]);
        setSearchText("");
        setCurrentMessageIndex(0);
      },
      closeModal() {
        setIsModalOpen(false);
      },
    }));

    return (
      <>
        {isModalOpen && (
          <div className="relative z-[1] ">
            <div className=" fixed top-0  right-0 select-none  transition-all bg-[#111b21]   w-full md:w-1/2 lg:w-1/4 xl:w-1/5 border-l-2 border-l-[#2f3b43] ">
              <div className="  h-screen overflow-y-auto mt-32   rounded shadow-lg  ">
                <div className=" w-full md:w-1/2 lg:w-1/4  xl:w-1/5 text-left fixed top-0 right-0  border-l-2 border-l-[#2f3b43] bg-[#111b21]">
                  <div className="flex items-center   bg-[#202c33]">
                    <button
                      className=" cursor-pointer  p-4 flex text-white"
                      onClick={() => {
                        setIsModalOpen(false);
                        bottomClose()
                      }}
                    >
                      <span className="relative  text-2xl">×</span>
                    </button>
                    <p className="text-sm mx-5 xl:mx-4 text-white  whitespace-nowrap   ">
                      Buscar mensajes
                    </p>
                    {matchingMessages.length > 0 && (
                      <div className="flex justify-center   gap-1">
                        <button
                          onClick={handleNavigatePrevious}
                          className={` p-1 ${
                            currentMessageIndex === 0
                              ? "bg-black"
                              : "bg-gray-600"
                          }  text-white rounded-full `}
                          disabled={currentMessageIndex === 0}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                           className="icon icon-tabler icon-tabler-chevron-up"
                            width="20"
                            height="20"
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
                            <path d="M6 15l6 -6l6 6"></path>
                          </svg>
                        </button>
                        <button
                          onClick={handleNavigateNext}
                          className={`p-1 ${
                            currentMessageIndex === matchingMessages.length - 1
                              ? "bg-black"
                              : "bg-gray-600"
                          } text-3xl text-white rounded-full`}
                          disabled={
                            currentMessageIndex === matchingMessages.length - 1
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                           className="icon icon-tabler icon-tabler-chevron-down"
                            width="20"
                            height="20"
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
                            <path d="M6 9l6 6l6 -6"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mb-4 mx-3  ">
                    <div action="" className="">
                      <input
                        type="text"
                        placeholder="Mensaje a buscar ..."
                        defaultValue={searchText}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                          // console.log(e.target.value.length > 0);
                          if (e.target.value.length > 0) {
                            handleSearch();
                          } else {
                            setMatchingMessages([]);
                          }
                        }}
                        className="focus:outline-none   bg-[#2a3942] focus:right-1 p-2 flex  w-full  rounded-lg mt-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="matching-messages ">
                  <p className="text-sm font-medium   text-white text-center">
                    {matchingMessages.length > 0
                      ? "Mensajes encontrados"
                      : "Sin resultados"}
                    : {matchingMessages.length}
                  </p>
                  <div className="mx-2">
                    {matchingMessages.map((messageIndex) => (
                      <div
                        key={messageIndex}
                        className={` hover:bg-[#202c33] overflow-hidden rounded flex w-full   my-1.5 p-1.5 cursor-pointer text-blue-500 
     
                       ${
                         matchingMessages[currentMessageIndex] === messageIndex
                           ? "bg-[#202c33] text-white mr-auto"
                           : "bg-[#005c4b] text-white "
                       }
                       
                       `}
                        onClick={() => scrollToMessageInChat(messageIndex)}
                      >
                        <div className="flex flex-col text-left">
                          <div className="flex gap-2">
                          <span className=" text-xs mt-2 whitespace-nowrap">
                            {moment(messages[messageIndex].created_at).startOf('day').fromNow()}
                          </span>
                          <span className=" text-xs mt-2 whitespace-nowrap">
                            {moment(messages[messageIndex].created_at).format("LL")}
                          </span>
                          </div>

                          <div>
                            <span
                              className={`${
                                matchingMessages[currentMessageIndex] ===
                                messageIndex
                                  ? "text-green-500"
                                  : "text-orange-300"
                              } font-bold`}
                            >
                              {" "}
                              {messages[messageIndex].user}{" "}
                            </span>
                            <span className={`truncate overflow-hidden`}>
                              {messages[messageIndex].message}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center items-center ">
                          <span className="mx-2 truncate overflow-hidden">
                            {/* {messages[messageIndex].message} */}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default MessageModal;
