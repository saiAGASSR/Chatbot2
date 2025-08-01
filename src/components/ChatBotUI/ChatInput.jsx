'use client';
import { SendHorizonal, Mic } from 'lucide-react';
import { useRef, useState, useEffect, memo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa"; 
import SelectLabels from './DropDownLanguages';
import * as React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SpeechPopUp  from './SpeechPopUp';
import { motion, AnimatePresence } from 'framer-motion';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import EmojiPicker from 'emoji-picker-react';
import { useMemo } from 'react';



const ChatInput = memo(function ChatInput({sendMessage, isTyping, userInputFocus,voiceInput  }) {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-IN');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const renderedCount = useRef(null); 
  const [input, setInput] = useState('');
  const [showVoices,setShowVoices] = useState(voiceInput === 'on')
  useEffect(()=>{
    renderedCount.current += 1;  
    console.log("it is ChatInput rendered");
    console.log("ChatInput renderedCount",renderedCount.current);
  })
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      setInput('')
      sendMessage(input);
    }

  };
const handleSwicthChange=()=>{
    setShowVoices(!showVoices)
}


  useEffect(() => {
  return () => {
    // Cleanup on component unmount
    if (mediaRecorderRef.current) {
      // Stop media recorder if it's still running
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Stop all audio tracks
      mediaRecorderRef.current.stream?.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
}, []);


  const handleReactMicClick = useMemo(()=>{ return () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support speech recognition.');
      return;
    }
    console.log(listening,"Listening value in handleReactMicClick outside if case");


    if (listening) {
      // Stop listening manually
      console.log(listening,"Listening value in handleReactMicClick  inside If condition");

      SpeechRecognition.stopListening();

      // Auto send once listening is stopped (optional — handled below by 'listening' change)
    } else {
      console.log(listening,"Listening value in handleReactMicClick inside else case");
      resetTranscript();
      setInput(''); // Clear input when starting new speech
      SpeechRecognition.startListening({ continuous: false, language: selectedLanguageCode });
    }
} },[listening])

useEffect(() => {
  console.log(listening,"Listening value in useEffect before trim");
  console.log(listening,"Listening value changed and this is the present value");

 if (!listening && transcript.trim()) {
  console.log(listening,"Listening value in useEffect after trim");
  
  setTimeout(() => {
    console.log(listening,"Listening value in useEffect after trim inside setTimeout");

    sendMessage(transcript);  
    resetTranscript();
  }, 500);
}

}, [listening]);





  const handleGoogleMicClick = async () => {
    console.log("Google button is clicked  and recording value is ",recording);
    


  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
    });



    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    if (recording) {
      console.log("Google button is clicked  and recording value is  inside recording if its true ",recording);
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();
      setRecording(false);
      mediaRecorderRef.current.stop();
      return;
    }

    // AudioContext and silence detection setup
    const audioContext = new (window.AudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    let silenceStart = null;
    const SILENCE_THRESHOLD = 0.01; // volume threshold
    const SILENCE_DURATION = 1250; // 3 seconds

    const checkSilence = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const sample = (dataArray[i] - 128) / 128;
        sum += sample * sample;
      }
      const volume = Math.sqrt(sum / dataArray.length);

      if (volume < SILENCE_THRESHOLD) {
        if (silenceStart === null) {
          silenceStart = Date.now();
        } else if (Date.now() - silenceStart > SILENCE_DURATION) {
            console.log("Google button is clicked  and recording value is Scielence is detected ",recording);
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
          audioContext.close();
          setRecording(false);
          mediaRecorderRef.current.stop();
        }
      } else {
        silenceStart = null; // reset on voice
      }

      if (mediaRecorder.state !== 'inactive') {
        requestAnimationFrame(checkSilence);
      }
    };

    requestAnimationFrame(checkSilence);

    mediaRecorder.ondataavailable = (e) => {
      console.log("Google data available from voice ?");
      
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(track => track.stop());
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const buffer = await blob.arrayBuffer();
      const audioBase64 = btoa(
        new Uint8Array(buffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const response = await fetch(
        `https://alphaapi.myreco.in/speech_to_text`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({

              audio_text : audioBase64,
              language_code : selectedLanguageCode
            
          })
        }
      );
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText);
        }
      const result = await response.json();
      const transcription = result.results?.map(r => r.alternatives[0].transcript).join('\n') || '';
      if (transcription.trim()) {
        sendMessage(transcription);
      } else {
        alert('No speech detected.');
      }
    };
    setRecording(true);
    mediaRecorder.start();
  } catch (err) {
    console.error('Mic error:', err);
    alert('Microphone access failed.');
  }
};





// useEffect(() => {
//   if (!isTyping) userInputFocus.current.focus();
// }, [isTyping]);


 return (
    <AnimatePresence >
      <motion.div 
            className=" bottom-0 w-full  rounded-xl px-3 py-2 flex flex-col items-center gap-2  bg-transparent ">
              {console.log("it is ChatInput rendered")}
              {console.log("input value in rendered chatInput",input)}
              {console.log(" ChatInput renderedCount",renderedCount.current)} 

          <div  className='w-full rounded-2xl bg-amber-50 flex flex-col font-sans font-semibold bg-gradient-to-br from-white via-blue-50 to-blue-100 '>
                
           
              {/* {Text area div 1} */}
              <div className='w-full rounded-2xl flex-1 '>


                      {/* Input Text Area */}
                        <motion.textarea
                          whileTap={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.01 }}
                          rows={1}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={isTyping ? 'Bot is typing...' : 'Type your message here to get started'}
                          className="w-full resize-none  text-black  px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none  fo disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isTyping || listening || recording}
                          ref={userInputFocus}
                        />


              </div>


            {/* {second div 2} */}

            <div className='flex-1 flex  w-full mb-3 '>

                <div className='flex w-[93%]' >
                    <div>

                      <Tooltip title={showVoices?'Hide Voice Options' : 'Show Voice Options'} >
                        <Switch
                            checked={showVoices}
                            sx={{
                                  ".MuiSwitch-thumb": {
                                    backgroundColor: "#FF9528"
                                  },
                                  ".MuiSwitch-track": {
                                    backgroundColor: "#FF4823"
                                  },
                                  "&.Mui-checked": {
                                    ".MuiSwitch-thumb": {
                                      backgroundColor: "#FF4823"
                                    },
                                    ".MuiSwitch-track": {
                                      backgroundColor: "#FF4823"}}}}
                            onChange={handleSwicthChange}
                          />
                    </Tooltip>

                    </div>
                    


                            {showVoices && 
                      
                      <div className='flex-1 flex items-center ml-10 '>

                            {/* React Speech Recognition Mic Button */}
                            <div  className = "w-[10%]">
                                <motion.button
                                  whileTap={{ scale: 3 }}
                                  transition={{ duration: 0.2 }}
                                  whileHover={{ scale: 1.5 }}
                                  onClick={handleReactMicClick}
                                  aria-label="Start mic input using React Speech Recognition"
                                  className="text-gray-500 hover:text-blue-600"
                                  disabled={ recording || isTyping}
                                >
                                  {listening ? (
                                    <Mic className="w-5 animate-pulse" color="red" />
                                  ) : (
                                    <Mic className="w-5" />
                                  )}
                                </motion.button>

                            </div>










                      </div> }

                    

                </div>


              

             <div className='flex-1   flex  justify-center  '>

                     {/* <div>
                       <EmojiPicker 
                       className='bg-transparent'
                       style={{backgroundColor: 'transparent'}}
                       onEmojiClick={(e)=>{
                        console.log("input with emoji", input )
                        console.log("input with emoji", input + e.emoji)
                        setInput(prev=>{
                          return prev + e.emoji
                        })                        
                       }} />
                     </div> */}
              
                {/* Send Button */}
                <div className='flex mr-4 '>
                                   <motion.button
                    whileTap={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={()=>{
                      console.log("send button is clicked");
                      
                      setInput('');
                      sendMessage(input);
                    }
                    }
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    className={` rounded-full  transition ${
                      !input.trim() || isTyping
                        ? 'bg-red-700 text-white cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <SendHorizonal color='white' className=" w-10 h-6 animate-pulse " />
                  </motion.button>

                </div>


             </div>

           </div>


          </div>

          {(listening || recording )  && <SpeechPopUp handleReactMicClick={handleReactMicClick} /> }
          
    </motion.div>
  </AnimatePresence>


);
})

export default ChatInput;
