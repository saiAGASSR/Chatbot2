const { useState, useRef } = require("react")

const BrowseFilters = ({title , data ,setBrowseButtonsClicked ,sendMessage })=>{
    const [selectedType , setSelectedType] = useState('language');


    const selectedBgColor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100 '
    const values = data;

            
                           

    const [options,setOptions] = useState(values);
    const languageOptions = options.filter(item=> item.type == 'language');
    const selectedLanguageOptions = options.filter(item=> (item.type == 'language' && item.selected));


    console.log("selectedGenreOptions",selectedLanguageOptions);
    
    const genreOptions = options.filter(item=> item.type == 'genre');
    const selectedGenreOptions = options.filter(item=> (item.type == 'genre' && item.selected));


    console.log("selectedGenreOptions",selectedGenreOptions);
    
    console.log("options",options);


    
    const handleSubmit = ()=>{

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
    finalQuery = contentType + " " + selectedLanguages +  " " + selectedGenres

    console.log("finalQuery",finalQuery);
    sendMessage(finalQuery)
    setBrowseButtonsClicked(false);

    }


    
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

    const filterBySelectedType = selectedType == 'language' ? languageOptions : genreOptions ;

    


    return(
        <div className="absolute bottom-0 flex flex-col bg-yellow   bg-gray-500 w-full z-[50] left-0  rounded-t-xl">
                <div className="mt-4 ml-5">

                    <h1 className="text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white">{title}</h1>
                    
                </div>
             
                <div className="mt-4 ml-5 flex gap-3">
                    <button className={`text-xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white ${selectedType == 'language' ? 'text-green-700' : 'text-white'}`} onClick={()=>setSelectedType('language')}>Language</button>
                    <button className={`text-xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white ${selectedType == 'genre' ? 'text-green-700' :'text-white'}`} onClick={()=>setSelectedType('genre')}>Genre</button>
                </div>

                <div className="mt-4 ml-5 flex gap-5">

                    {filterBySelectedType.map(item=>{
                        return (
                        <button className={`max-w-max 	font-semibold font-sans text-sm  bg-transparent hover:bg-grey-500 ${item.selected ? 'text-black' : 'text-white'} font-semibold hover:${item.selected ? 'text-black' : 'text-white'} py-2 px-4 border border-white hover:scale-[1.1] rounded-full transition duration-700 ease-in-out  ${item.selected && selectedBgColor}`} key={item.value} onClick={()=>handleSelectedFilters(item.value)}>
                            {item.value}
                        </button>)
                    })}

                </div>

                <div>
                    <button className="mt-4 ml-5 text-xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>Submit</button>
                </div>



                

        </div>
    )

}

export default BrowseFilters;