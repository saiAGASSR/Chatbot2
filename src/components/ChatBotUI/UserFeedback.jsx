import { ReceiptRussianRuble } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";




const UserFeedback = ()=>{
    const [showFeedBack,setShowFeedBack] = useState(false);
    const [showFeedBack1,setShowFeedBack1] = useState(true);
    const bgcolor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100'
    useEffect(()=>{
        if(showFeedBack == false) return
        setShowFeedBack1(false)
        const timerId = setTimeout(()=>{
            setShowFeedBack(false);
        },2000)

        return(()=>{
               clearTimeout(timerId)
        })

    },[showFeedBack])

    return <div className="flex flex-col   rounded-sm w-[70%] ml-[2.5%]  justify-between content-center text-white">

        
        {showFeedBack1 && <div className="flex ">
                <p className="text-white text-base leading-relaxed mr-10  ml-1" >Are These relevent for you </p>
                <button className="mr-5" onClick={()=>setShowFeedBack(true)}> <AiOutlineLike /> </button>
                <button className="mr-5" onClick={()=>setShowFeedBack(true)}> <AiOutlineDislike /> </button>
        </div>}

        {showFeedBack && 

        <div>
            <p>Thanks for your feedback</p>
        </div> }

    </div>
}

export default UserFeedback;

