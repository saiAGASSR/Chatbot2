import React from 'react';

const QuickPrompts = ({itemss , changeSelection}) => {
  // const items = [
  //   "Action", "Thriller", "Sci-Fi", "Adventure",
  //   "Comedy", "Horror", "Fantasy", "Crime", 
  //   "Drama", "Romance", "Mystery", "Documentary"
  // ];
  const items = [];
  itemss.map(item=>{
    items.push(item.value)
  })
  const selectedBgColor = 'bg-gradient-to-br from-white via-blue-50 to-blue-100 '


  const selectedItems = itemss.filter(item=>item.selected);
  const selectedItemsArrey = [];
  selectedItems.forEach(element => {
    selectedItemsArrey.push(element.value)
  });
  console.log("selectedItems",selectedItemsArrey);
  
  

  // Split items into rows of 4
  const rows = [];
  for (let i = 0; i < items.length; i += 4) {
    rows.push(items.slice(i, i + 4));
  }

  return (
    <div className=" text-white p-4 w-full h-full">
      {/* <p className="font-semibold mb-4 text-lg">Quick Prompts</p> */}

      <div className="overflow-x-auto  overflow-y-auto no-scroll">
        <div className="space-y-3 w-fit">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-3">
              {row.map((item, index) => (
                <button
                  key={index}
                  className={`bg-transparent border border-gray-500 rounded-lg px-4 py-2 ${ selectedItemsArrey.includes(item) ? 'text-black' : 'text-white'}  hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap ${ selectedItemsArrey.includes(item) && selectedBgColor}`}
                  style={{ minWidth: 'fit-content' }}
                  onClick={()=>{changeSelection(item)}}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickPrompts;