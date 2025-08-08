const { useState, useRef } = require("react");
import { X } from 'lucide-react'; // for modern close icon
import QuickPrompts from './QuickPrompts';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


const BrowseFilters = ({title , data ,setBrowseButtonsClicked ,sendMessage })=>{
    const [selectedType , setSelectedType] = useState('language');
    const [showAlert,setShowAlert] = useState(false);



    const selectedBgColor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100 '
    const browseButtonsStyling = ' px-4 py-2 w-fit text-xl font-bold  tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white rounded-lg'
    const values = data;
    values.showPartners;

            
                           

    const [options,setOptions] = useState(values);


    const languageOptions = options.filter(item=> item.type == 'language');
    // const selectedLanguageOptions = options.filter(item=> (item.type == 'language' && item.selected));
    const selectedLanguageOptions = languageOptions.filter(item=> (item.selected));
    const selectedLanguageOptionsLeangth = selectedLanguageOptions.length;
    console.log("🚀 ~ BrowseFilters ~ selectedLanguageOptionsLeangth:", selectedLanguageOptionsLeangth)

    


    console.log("selectedGenreOptions",selectedLanguageOptions);
    
    const genreOptions = options.filter(item=> item.type == 'genre');
    // const selectedGenreOptions = options.filter(item=> (item.type == 'genre' && item.selected));
    const selectedGenreOptions = genreOptions.filter(item=> (item.selected));
    const selectedGenreOptionsLength = selectedGenreOptions.length;
    console.log("🚀 ~ BrowseFilters ~ selectedGenreOptionsLength:", selectedGenreOptionsLength)

    const partnerOptions = options.filter(item=> item.type == 'partner');
    const selectedPartnerOptions = partnerOptions.filter(item=>(item.selected));
    const selectedPartnerOptionsLength = selectedGenreOptions.length;
    console.log("🚀 ~ BrowseFilters ~ selectedPartnerOptionsLength:", selectedPartnerOptionsLength)




    console.log("selectedGenreOptions",selectedGenreOptions);
    
    console.log("options",options);


    
    const handleSubmit = ()=>{

    let languageLimit= selectedLanguageOptionsLeangth >= 5;
    let genresLimit= selectedGenreOptionsLength >= 5;
    let partnersLimit= selectedPartnerOptionsLength >= 5;

    if((languageLimit || genresLimit || partnersLimit ))  {
        setShowAlert(true);
        return;
    };

    let selectedLanguageArray = []; 
    selectedLanguageOptions.map(item=>{
        selectedLanguageArray.push(item.value)
    })

    const selectedLanguages = selectedLanguageArray.join(" ");

    let selectedGenreArray = []; 
    selectedGenreOptions.map(item=>{
        selectedGenreArray.push(item.value)
    })

    const selectedGenres = selectedGenreArray.join(" ");

    let selectedPartnersArray = [];
    selectedPartnerOptions.forEach(element => {

        selectedPartnersArray.push(element.value)
        
    });

    const selectedPartners = selectedPartnersArray.join(" ")
    

    let contentType;

    if(title == 'Browse Movies'){
        contentType = 'movie'
    }
    if(title == 'Browse TvSeries'){
        contentType = 'TvSeries'
    }
    if(title == 'Browse Live'){
        contentType = 'Live'
    }
    
    let finalQuery;
    finalQuery = contentType + " " + selectedLanguages +  " " + selectedGenres + " " + selectedPartners

    console.log("finalQuery",finalQuery);
    sendMessage(finalQuery)
    setBrowseButtonsClicked(false);

    }

    const items = [
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Adventure",
  "Crime",
  "Documentary",
  "Animation",
  "Family",
  "Musical",
  "War",
  "Western",
  "Biography",
  "History",
  "Sport"
];



    
    const handleSelectedFilters = (key)=>{

            setOptions((prevState)=>{
                const updating = [...prevState];
                const updated = updating.map(item=>{
                    if(item.value == key){
                        return {...item, selected : !item.selected}
                    }
                    else{
                        return item;
                    }
                })
                return updated
                
            })
    }

    let filtersBySelectedType ;
    if(selectedType == 'language'){
        filtersBySelectedType = languageOptions
    }

    if(selectedType == 'genre'){
        filtersBySelectedType = genreOptions
    }
    if(selectedType == 'partner'){
        filtersBySelectedType = partnerOptions
    }



    


    return(
        <div className="absolute bottom-0 flex flex-col    bg-gray-950 w-[99%] m-1 z-[50] left-0  gap-5">
                {   showAlert && 
                    <div className='absolute top-1 left-[30%] w-[50%]'>
                        <Alert severity="warning" onClose={() => {setShowAlert(false)}}>
                                You have selected more that 5 options plaese select 5 or less that 5
                        </Alert>
                    </div>
                }

                <div className="mt-4 ml-5 flex items-center">
                        <div className='w-full '>
                        
                            <h1 className="text-2xl font-bold leading-none tracking-tight text-white md:text-5xl lg:text-3xl dark:text-white">{title}</h1>


                        </div>

                        <div className='w-10 p-1 items-center'>
                                                <button className="text-red-500 hover:text-red-750" onClick={()=>{setBrowseButtonsClicked(false)}}>  <X className="w-5 h-5 " /></button>
                        </div>
                </div>

             
                <div className="mt-4 ml-5 flex gap-5">

                    <button className={`${browseButtonsStyling}  ${selectedType == 'language' ? 'text-green-700' : 'text-white'}`} onClick={()=>setSelectedType('language')}>Language</button>
                    <button className={`${browseButtonsStyling}  ${selectedType == 'genre' ? 'text-green-700' :'text-white'}`} onClick={()=>setSelectedType('genre')}>Genre</button>

                    {true && <button className={`${browseButtonsStyling} ${selectedType == 'partner' ? 'text-green-700' :'text-white'}`} onClick={()=>setSelectedType('partner')}>Partners</button>}


                </div>

                <div className='flex h-50 overflow-y-auto no-scrollbar'>

                
                    <QuickPrompts  itemss={filtersBySelectedType} changeSelection={handleSelectedFilters}/>



                </div>




                

                <div className="w-full  p-3 flex justify-center bg-black">
                    

                    <button className={`text-xl font-semibold w-[90%] tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white bg-gray-950 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full `} onClick={handleSubmit}>Submit</button>


                </div>




                

        </div>
    )

}

export default BrowseFilters;