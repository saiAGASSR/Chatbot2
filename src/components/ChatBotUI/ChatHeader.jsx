import { X } from 'lucide-react'; // for modern close icon
import Avatar from '@mui/material/Avatar';
import ReplayIcon from '@mui/icons-material/Replay';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { memo, useEffect, useRef, useState } from 'react';
import ChatBotHelp from './ChatBotHelp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { SpeechPopUp } from './SpeechPopUp';
import ChangeUserIdForm from './ChangeUserIdForm';
import { Button } from '@mui/material';


const ChatHeader = memo(function ChatHeader ({setIsOpen , setClearChat , isTest , handleUserIdChange }) {
    const [showModal, setShowModal] = useState(false);
    const deviceId = localStorage.getItem('deviceId')
    const userId = localStorage.getItem('userId')
    console.log("deviceId from the localStorage",deviceId);
    console.log("deviceId from the localStorage",userId);
    console.log("deviceId from the localStorage Type",typeof deviceId);
    const isAndroid = ['11', '7', '6', '105'].includes(deviceId);
    const renderedCount = useRef(null);
    const [showChangeUserIdForm , setShowChangeUserIdForm] = useState(false)

    useEffect(()=>{
        renderedCount.current += 1;  
        console.log("it is ChatHeader rendered in UseEffect");
        console.log("renderedCountin UseEffect ",renderedCount.current);
    })

    return (
        <div className="relative top-0 rounded-b-xl text-black p-4 flex justify-between items-center h-[10%]   bg-gradient-to-br from-white via-blue-50 to-blue-100">
           {console.log("Chat header is rendered  ")} 
           {console.log("renderedCount of chatHeader ",renderedCount.current)} 
            <div className='flex flex-row'>
                <Avatar
                    alt='bot'
                    src='https://i.ibb.co/8LT53RnN/myreco-Icon.png'
                    sx={{ width: 45, height: 40 }}
                /> 
                <div className="flex flex-col">

                    <span className="ml-2 text-2xl  md:text-xl font-semibold leading-tight ">
                        RecoBot
                    </span>

                    <span className="ml-2 text-sm  md:text-sm font leading-tight ">
                    myreco AI Assistant
                    </span>

                </div>

            </div>

            {isTest && 
                <div>
                      <Button  onClick={()=>setShowChangeUserIdForm(true)} color="error"> Change User Id</Button>
                </div> 
            }

            { showChangeUserIdForm && < ChangeUserIdForm  handleUserIdChange={handleUserIdChange} setShowUserIdForm={setShowChangeUserIdForm}/> }

            <div className='flex '>
                {/* <div className="relative group mr-5">

                    <h3 className="text-lg text--600 font-medium font-sans color-blue">{userId}</h3>

                </div> */}



                
                <div className="relative group">

                    <button
                        className="text-black hover:text-blue-600 transition mr-2"
                        onClick={() => setShowModal(true)}
                    >

                    <div className="ml-4 flex items-center">
                    <FontAwesomeIcon icon={faCircleInfo} beat className="text-black-600 text-xl" />
                   </div>     

                                   </button>
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                        Help
                    </div>
                </div>




                    <div className="relative group">
                    <button
                        className="text-black hover:text-red-600 transition mr-2"
                        onClick={() => setClearChat(true)}
                    >
                        <ReplayIcon color="error" />
                    </button>
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                        ReloadChat
                    </div>
                    </div>

                    {isAndroid ?  
                        <div className="relative group mt-1">
                            <button
                                onClick={() => {
                                window.location.href = "https://moviesandtv.myvi.in/appclose?redirectionURL=back";
                                }}
                                className="text-white hover:text-gray-200 transition"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                CloseChat
                            </div>
                        </div>

                    :   
                        <div className="relative group mt-1">

                            <button onClick={() => setIsOpen(false)} className="text-black hover:text-gray-200 transition relative" title='Close'>
                            <X className="w-5 h-5" />
                            <div className="absolute bottom-full mb-1 right-0 transform  opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                CloseChat
                            </div>
                            </button>



                        </div>
                    }



            </div>

             {/* Modal */}
            {showModal &&  <ChatBotHelp setShowModal={setShowModal} />}


        </div>
        

    );
})

export default ChatHeader;
