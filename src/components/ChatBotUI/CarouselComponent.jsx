'use client';
import { useRef ,useState } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import decideContentPath from '../../../genericFunctions/getContentPath';
import { FaBookmark, FaPlusCircle, FaRegBookmark,FaMagic ,FaPlus  } from 'react-icons/fa';
import { MdDone } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';





export default function CarouselComponent({ items , handleSimilarContent }) {
  const deviceId = localStorage.getItem('deviceId')
  const projectId = localStorage.getItem('projectId')
  const [activeIndex, setActiveIndex] = useState(0);


  console.log("deviceId from the localStorage",deviceId);
  console.log("deviceId from the localStorage",deviceId);
  console.log("deviceId from the localStorage Type",typeof deviceId);

  const initialwatchListItems = []; 
  const contentIds = items.map(item=>{
      let obj = {};
      obj[item.contentid] = false
      initialwatchListItems.push(obj)
    
  });
  const [watchlistItems, setWatchlistItems] = useState(initialwatchListItems);


  console.log("content ids array ", watchlistItems);
   
  const handleAddToWatchlist =(item)=>{

    setWatchlistItems(prev=>{
      const newItems = [...prev];
      const updated = newItems.map(i=>{
        if(i.contentid === item.contentid){
          return i[item.contentid] = !i.contentid ;
        }
        else return i;
      })
      return updated;
    })

  }


  

  
  
  let sliderRef = useRef(null);
  const play = () => {
  sliderRef.current.slickPlay();
  };
  const pause = () => {
  sliderRef.current.slickPause();
  };
  const settings = {
    
  dots: false,
  infinite: items.length > 1,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay : true,
  autoplaySpeed: 2000,
  responsive: [
    {
    breakpoint: 2000,
    settings: {
      slidesToShow: 2,
    },
    },
    {
    breakpoint: 640,
    settings: {
      slidesToShow: 1,
    },
    },
  ],
  };

  return (
  <div className="w-full px-2.5 mt-4 mb-4 ">  
    <Slider {...settings}>
    {items.map((item, idx) => (
      <a href={decideContentPath(item , projectId , deviceId)} target='_blank' rel="noopener noreferrer" key={idx}>
      <div  className="px-2 ">
      <div className="relative  rounded-xl shadow-md overflow-hidden h-full border border-gray-950 transition-transform duration-300 hover:scale-104 group">
        {console.log("console item content name " , item.contentname , "img url ", item.imgurl,"  final content path " ,decideContentPath(item , projectId , deviceId) , "contentpath",item.contentPath)}
        <img
        src={item.imgurl}
        alt={item.contentname}
        className="w-full h-full object-contain"
        />
    
      <div className="absolute bottom-2.4 right-2 flex gap-2 z-10 ">
        <Tooltip title={'Add To WatchList'} >
        
        <button onClick={(e) => {
         e.preventDefault();
         handleAddToWatchlist(item)
        }
        } className=" p-1 rounded-full shadow">
          {watchlistItems[item.contentid] ? (
              <MdDone  className="text-white w-6 h-6" />
            ) : (
              <FaPlus  className="text-white w-6 h-6 hover:text-yellow-400" />
            )}        
        </button>
        </Tooltip>

        <Tooltip title={'Show similar to this'} >

        <button onClick={(e) => {
         e.preventDefault();
         handleSimilarContent(item.contentid)
        }
        } className=" p-1 rounded-full shadow">
            <FaMagic  className="text-white w-6 h-6 hover:text-yellow-400"/>
        </button>
        </Tooltip >



      </div>

        <div className="p-2">
        <h3 className="text-sm text-white font-medium font-sans">{item.contentname}</h3>
        </div>
      </div>
      </div>
      </a>
    ))}
    </Slider>
  </div>
  );
}
