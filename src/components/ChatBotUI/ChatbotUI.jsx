'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import { SuggestionButtons } from './SuggestionButtons';
import { responseObject } from './responseObject';
import ChatHeader from './ChatHeader';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@mui/material/Avatar';
import bot_movie_results from './carouselsData';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { SpeechPopUp } from './SpeechPopUp';
import { carousel_results } from '../../../genericFunctions/testCarousels';
import { ParticlesBackground } from './ParticlesBackground';
import movieSuggestions from '../../../genericFunctions/suggestions';



export default function ChatbotUI({voiceInput , jwt}) {
  const [userId,setUserId] = useState(15)
  const [sessionId, setSessionId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [clearChat,setClearChat]= useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot',
      text: (
      <>
        <div>
          <div className='flex row'>
            
          
          <span className="font-bold text-base">
            Hi Master ,  I am Reco bot 

           
          </span>
          <p className='ml-2'>&#129502;</p>
          </div>
          <span className="text-sm text-white ">
            I can help you find movies, TV series, and live channels based on your preferences or searches.
          </span>
        </div>
      </>
    ),
    // suggestions:movieSuggestions,
    // carousel_results : carousel_results
    
  }
  ]);


  const messagesLength = messages.length;
  

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const userInputFocus = useRef(null)
  const response = responseObject;

  const fetchBotResponse = async (userInput , initialUrl = false) => {
    let body;
    console.log("session id in fetchBotResponse initialUrl",sessionId);
    

    if(initialUrl){
      body = {
        userid: `${userId}`,
        session_id: sessionId,
      };
      console.log("body if initial url ",body)
    } else{
      body = {
        userid: `${userId}`,
        session_id: sessionId,
        user_message: userInput,
      };
      console.log("body if not initial url ",body)
    }
    const url = initialUrl ? 'https://alphaapi.myreco.in/generate_suggestions' : 'https://alphaapi.myreco.in/chat'
    // const url = initialUrl ? 'http://192.168.141.143:8000/generate_suggestions' : 'http://192.168.141.143:8000/chat'
  
    try {
        const response = await axios.post(
          url,
          body,
          {
            headers : {
              'Authorization' : `Bearer ${jwt}`,
              'X-MYRECO-Project-ID' : projectId,
              'X-MYRECO-API-Key' : apiKey
            },
            // withCredentials: true,
          }
        );
      
        if(response.data.status_code == 429) {
          return {
            Bot_Response: response.data.message,
            carousel_results : [],
            Search_Suggestions:[],
          }
        }

        console.log("response",response.data);
        console.log("response",response.data.length);
        

        if(Object.keys(response.data).length === 0){
          return {
            Bot_Response: "Empty Response from Bot",
            carousel_results:[],
            Search_Suggestions : []
          }
        }

      return response.data;  // Return the parsed JSON response
    } catch (error) {
      console.error("Error in chat request:", error);
      if(error.code === 'ECONNABORTED'){
        console.error("Timeout error:", error.message);
      }
      if(error.code === 'tokenExpired'){
        console.error("token expired", error.message);
      }

      return {
        Bot_Response: "Sorry, something went wrong.",
        Carousel_Results: [],
        Search_Suggestions: [],
      };
    }
  };
  
  
  const sendMessage = useMemo(()=>{
    return async (messageText) => {
    // console.log("checking sendMessage Cache using useMemo - input value is ",input);
    console.log("checking sendMessage Cache using useMemo - messageText value is ",messageText);


    // Add user message
    const newMessage = { from: 'user', text: messageText };
    setMessages((prev) => [...prev, newMessage]);

    // Set bot typing animation
    setIsTyping(true);

    // Fetch bot reply (assuming this fetches the bot response)
    const botReply = await fetchBotResponse(messageText);
    console.log("response from bot ",botReply);
    console.log("type of response from bot",typeof response);
    
    

    setIsTyping(false);

    // Check if we have suggestions in the previous message and remove them
    setMessages((prev) => {
      const updated = [...prev];


      // Add the new bot message with carousel and suggestions (if any)
      return [...updated, { from: 'bot', carousel_results: botReply.Carousel_Results, text: botReply.Bot_Response, suggestions: botReply.Search_Suggestions }];
    });


  }
    
  },[sessionId])
  // const  sendMessage = async (messageText) => {
  //   if (!messageText) {
  //     console.log("send message is empty so setting it input ",input);
  //     console.log("checking sendMessage Cache using useMemo - input value is ",input);
      
  //     messageText == input;
  //   }

  //   // Add user message
  //   const newMessage = { from: 'user', text: messageText };
  //   setMessages((prev) => [...prev, newMessage]);
  //   setInput(''); // Clear the input field

  //   // Set bot typing animation
  //   setIsTyping(true);

  //   // Fetch bot reply (assuming this fetches the bot response)
  //   const botReply = await fetchBotResponse(messageText);

  //   setIsTyping(false);

  //   // Check if we have suggestions in the previous message and remove them
  //   setMessages((prev) => {
  //     const updated = [...prev];


  //     // Add the new bot message with carousel and suggestions (if any)
  //     return [...updated, { from: 'bot', carousel_results: botReply.Carousel_Results, text: botReply.Bot_Response, suggestions: botReply.Search_Suggestions }];
  //   });


  // };
  useEffect(() => {
      setMessages((prevMessages)=>{
        const restart = [...prevMessages];
        restart.splice(1,restart.length)

        return restart;
      })
      setClearChat(false)
  }, [clearChat]);

  useEffect(() => {
    // Ensure sessionId is set only on the client side
    if (typeof window !== 'undefined') {
      const existingSessionId = sessionStorage.getItem('sessionId');
      const storedUserId = localStorage.getItem('userId');
      const storedProjectId = localStorage.getItem('apiKey');projectId
      const storedapiKey = localStorage.getItem('projectId');
      setUserId(storedUserId);
      setProjectId(storedapiKey);
      setApiKey(storedProjectId);
      if (!existingSessionId) {

        
        const newSessionId = uuidv4();
        sessionStorage.setItem('sessionId', newSessionId);
        setSessionId(newSessionId);
      } else {
        setSessionId(existingSessionId);
      }
    }
  }, []);
  

  useEffect(() => {
    const fetchInitialBotMessage = async () => {
      if (!sessionId) return; // Prevent request if session ID is not available yet
      const botReply = await fetchBotResponse(`My user id is ${userId}` , true);
      console.log('initialBotReply',botReply);
      

      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          carousel_results: botReply.Carousel_Results,
          text: botReply.Bot_Response,
          suggestions: botReply.Search_Suggestions
        }
      ]);
    };

    fetchInitialBotMessage();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <>
    {  console.log('sessionId everytime component is rendered initial url',sessionId)}
      {/* Floating button */}
      {/* {      console.log("checking sendMessage Cache using useMemo - input value is inside render present ",input)} */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 5 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.5 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-xl hover:from-blue-700 hover:to-indigo-700 z-50 "
          >
            💬
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="xl:w-1/2  w-full h-full   rounded-xl shadow-lg flex flex-col "
            >
            
            
            {/* Header */}
            <ChatHeader setIsOpen={setIsOpen} setClearChat={setClearChat} />


            {/* Messages */}
            <MessageList
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
              sendMessage={sendMessage}
              messagesLength={messagesLength}
            />

            {/* Input */}
            <ChatInput
              sendMessage={sendMessage}
              isTyping={isTyping}
              userInputFocus={userInputFocus}
              voiceInput={voiceInput}
            />



            {/* {showSpeechPopUp && <SpeechPopUp /> } */}
            {/* {true && <SpeechPopUp /> } */}

            </motion.div>


        )}
      </AnimatePresence>
    </>
  );
}
