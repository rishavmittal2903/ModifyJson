var flatenObj={};
for(var key in finalObj)
  {
    flatenTheStructure(finalObj[key],flatenObj,"","")
  }
  function flatenTheStructure(jsonData,flatenObj,parentKey,path)
  {
  
    for(var key in jsonData)
    {
      if(jsonData[key].constructor===Object&&!Array.isArray(jsonData[key]))
      {
        if(!flatenObj.hasOwnProperty(key))
        {
         
          if(jsonData[key].hasOwnProperty("format"))
          {
            flatenObj[key]={}; 
            flatenObj[key]=flatenTheStructure(jsonData[key],flatenObj[key],parentKey,path);
          }
         else
         {
         let parent=path;
          path+="_"+key;
          flatenTheStructure(jsonData[key],flatenObj,parentKey,path);
          path=parent;
       
         }
        }
       else
       {
         let parent=path;
         path+="_"+key;
        path=path.substring(1)
        flatenObj[path]={};
        flatenObj[path]=flatenTheStructure(jsonData[key],flatenObj[path],parentKey,path);
        path=parent;
       }
      }
      else if(key==="format")
      {
        flatenObj.format=jsonData[key];
      }
      else if(key==="require")
      {
        flatenObj.require=jsonData[key];
      }
      else if(key==="value")
      {
        flatenObj.value=jsonData[key];
      }
      else if(key==="label")
      {
        flatenObj.label=jsonData[key];
      }
      else if(key==="minLength")
      {
        flatenObj.minLength=jsonData[key];
      }
      else if(key==="maxLength")
      {
        flatenObj.maxLength=jsonData[key];
      }
    }
    return flatenObj;
  }