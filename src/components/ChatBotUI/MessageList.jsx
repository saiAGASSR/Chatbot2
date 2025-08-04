// MessageList.jsx
'use client';
import { TypingDots } from './TypingDots';
import { SuggestionButtons } from './SuggestionButtons';
import CarouselComponent from './CarouselComponent';
import { MessageBubble } from './MessageBubble';
import { memo, useEffect, useRef, useState } from 'react';
import Carousel from '@/blocks/Components/Carousel/Carousel';
import BrowseFilters from './BrowseFilters';
import filtersConfig from './../../../filters.json';

  const MessageList = memo(function MessageList ({ messages, isTyping, messagesEndRef, sendMessage ,messagesLength , handleSimilarContent}) {
  const renderedCount = useRef(null); 
  useEffect(()=>{
    renderedCount.current += 1;  
    console.log(" useEffect it is MessageList rendered");
    console.log("useEffect MessageList renderedCount",renderedCount.current);
  })
  const [filtersTitle,setFiltersTitle] = useState('Browse Movies')

  const [browseButtonsClicked , setBrowseButtonsClicked]  = useState(false);

  const  browseButtonsStyle = 'max-w-max	font-semibold font-sans text-sm  bg-transparent hover:bg-grey-500 text-white font-semibold hover:text-white py-2 px-4 border border-white hover:scale-[1.1] rounded-full transition duration-700 ease-in-out'

  console.log("filtersConfig");
  console.log(filtersConfig);
  console.log(filtersConfig["moviesConfig"]);
  // console.log(filtersConfig.(moviesConfig))

  let configBySelect;
  if(filtersTitle == 'Browse Movies'){
    configBySelect = filtersConfig["moviesConfig"];
  }
    if(filtersTitle == 'Browse TvSeries'){
    configBySelect = filtersConfig["tvSeriesConfig"];
  }
    if(filtersTitle == 'Browse Live'){
    configBySelect = filtersConfig["liveConfig"];
  }
  

  return (
    
    <div className="flex-1  overflow-y-scroll no-scrollbar px-4 py-3 space-y-2  max-w-full max-h-[calc(100dvh-100px)] h-[calc(100dvh-100px)] ">
        {console.log("it is MessageList rendered")}
        {console.log("it is MessageList rendered and messagesLength",messagesLength)}
        {console.log(" MessageList renderedCount In Return",renderedCount.current)} 
        {messages.map((msg, index) => (
          <div key={index} className={`flex-1 flex-col  space-y-2 ${msg.from === 'user' ? 'items-end' : 'items-start'} `}>
            
            {/* Message Bubble */}
            {msg.text && <MessageBubble from={msg.from} text={msg.text}  lastMessage={(messagesLength-1) === index}/>}

            {/* Carousel Response */}
            {msg.carousel_results && 
              <CarouselComponent items={msg.carousel_results} handleSimilarContent={handleSimilarContent} />
              // <Carousel 
              //   items={msg.carousel_results}
              //   baseWidth={300}
              //   autoplay={true}
              //   autoplayDelay={3000}
              //   pauseOnHover={true}
              //   loop={true}
              //   round={false}

              //   />
            }

            {msg.carousel_results && (
              <div className='flex  gap-2'>
                <button className={browseButtonsStyle} onClick={()=> 
                    {setFiltersTitle('Browse Movies') 
                      setBrowseButtonsClicked(true)

                    } }>
                      Browse Movies
                      </button>
                <button className={browseButtonsStyle} onClick={()=> {
                  setFiltersTitle('Browse TvSeries') 
                  setBrowseButtonsClicked(true)

                  }}>
                    Browse TVSeries
                    </button>
                <button className={browseButtonsStyle} onClick={()=>{ 
                  setFiltersTitle('Browse Live') 
                  setBrowseButtonsClicked(true)
                  } }>
                  Browse Live
                    </button>

              </div>
              
            )}

            {/* Suggestions */}
            {msg.suggestions && <SuggestionButtons suggestions={msg.suggestions} istyping={isTyping} sendMessage={sendMessage} />}

            {msg.carousel_results && browseButtonsClicked && <BrowseFilters title={filtersTitle} data={configBySelect} setBrowseButtonsClicked={setBrowseButtonsClicked} sendMessage={sendMessage}/>}
          </div>
        ))}

          {/* Typing Animation */}
          {isTyping && <TypingDots />}



          {/* Always scroll to the bottom */}
          <div ref={messagesEndRef} />
    </div>
  );
})

export default MessageList;