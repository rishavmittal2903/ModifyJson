var finalObj={}

function replaceSpecialCharacter(value)
{
  return value.replace("#","").replace("/","");
}
function getProperties()
{
return {
  format: "",
  minLength: "",
  maxLength: "",
  require: false,
  value: "",
  UICONTROL: ""
}
}
function getUIControlAsPerFormat(format,testFormat)
{
switch(format)
{
  case "string":{testFormat.UICONTROL= "textbox";break;}
  case "integer":{testFormat.UICONTROL= "number";break; }
  case "boolean":{testFormat.UICONTROL= "radio";break; }
  case "date-time":{testFormat.UICONTROL= "datepicker";break; }
  default:{testFormat.UICONTROL= "textbox"}
}
}
var requireFields=[];

function mapLabelKey(labelKey,testFormat)
{
   testFormat.label="getLabel("+labelKey+",locale)";
}
function mapRequireField(testFormat,flag)
{
  testFormat.require=flag; 
}
function mapMaxOrMinLength(type,testFormat,data,flag,parentKey,finalObj)
{
  if(type==="maxLength")
  {
    testFormat.maxLength=data;
  }
  else
  {
    testFormat.minLength=data;
  }
  mapRequireField(testFormat,flag);
  mapLabelKey(parentKey,testFormat);
  finalObj=testFormat
}
function mapFormatAndObjectValue(testFormat,data,flag,parentKey,finalObj,path)
{
        testFormat.format=data;
        testFormat.value=path.substring(1);
        mapRequireField(testFormat,flag);
        mapLabelKey(parentKey,testFormat);
        getUIControlAsPerFormat(data,testFormat);
        return testFormat;
}
getFinalJsonWithoutArray(data["properties"],finalObj,requireFields,false,"","");
function getFinalJsonWithoutArray(jsonData,finalObj,requireFields,flag,parentKey,path)
{
  
  var testFormat=getProperties();

  for(var key in jsonData)
  {
    if(key==="properties")
    {
      finalObj=getFinalJsonWithoutArray(jsonData[key],finalObj,requireFields,flag,parentKey,path);
    }
    else if(key ==='enum')
    {
      testFormat.value=jsonData[key];
      mapRequireField(testFormat,flag);
      finalObj=testFormat
    }
    else if(Array.isArray(jsonData[key]) && key==="required")
    {
      requireFields=jsonData[key];
    }
     else if(jsonData[key].constructor===Object && key!=="required" && key!=="items")
    {
      
      flag=requireFields.indexOf(key)>=0?true:false;
     
      if(!finalObj.hasOwnProperty(key))
      {
        finalObj[key]={};
        parentKey=key;
      }
      let parentPath=path;
      path+="."+key;
      finalObj[key]=getFinalJsonWithoutArray(jsonData[key],finalObj[key],requireFields,flag,parentKey,path);
      path=parentPath;
    }
    else
    {
      if(key==="$ref")
      {
        finalObj=getFinalJsonWithoutArray(data[replaceSpecialCharacter(jsonData[key])],finalObj,requireFields,flag,parentKey,path);
      }
     
      else if(key ==="type" && jsonData[key]==="array")
      {
        let parentPath=path;
        path+="[i]";
        finalObj=getFinalJsonWithoutArray(jsonData["items"],finalObj,requireFields,flag,parentKey,path);
        finalObj.type="array";
        path=parentPath;
      }
      else if(key ==="maxLength")
      {
        mapMaxOrMinLength(key,testFormat,jsonData[key],flag,parentKey,finalObj);
      }
      else if(key ==="minLength")
      {
        mapMaxOrMinLength(key,testFormat,jsonData[key],flag,parentKey,finalObj);
      }
      else if(key ==="format")
      {
        finalObj=mapFormatAndObjectValue(testFormat,jsonData[key],flag,parentKey,finalObj,path);
      }
     else if(key ==="type" && jsonData[key]!=="object")
     {
      finalObj=  mapFormatAndObjectValue(testFormat,jsonData[key],flag,parentKey,finalObj,path);
     }
      
    }
  }
  return finalObj;
}
