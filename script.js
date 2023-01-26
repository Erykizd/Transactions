var langCheckbox = document.getElementById("langCheckbox");
var html = document.getElementsByTagName("html")[0];
langCheckbox.addEventListener("click", translateAll);
var pl = true;

var dictFile = "dict.json";
var dictLink = "https://api.npoint.io/8808b25240be58c6a8de";
var dictProm = getData(dictLink);
var dict;
dictProm.then((val)=>{dict = val;}, (error)=>{alert(error)});

function translateAll()
{
	if (dict != undefined)
	{
		let elems = document.getElementsByTagName("*");
		let flds = "";
		let sw = false;
		let plTxt = dict[0];
		let engTxt = dict[1];
		
		for(let i = 0;i< elems.length; i++)
		{
			if (elems[i].tagName == "BODY")
			{
				sw = true;
			}
			
			if((elems[i].children.length == 0) && sw && (elems[i].innerText != ""))
			{
				flds += elems[i].innerText + "\n";				
				for (let j = 0; j < plTxt.length; j++)
				{
					if (langCheckbox.checked) //if english
					{
						if(plTxt[j] == elems[i].innerText)
						{
							elems[i].innerText = engTxt[j];
							break;
						}
						pl = false;
						html.lang = "en";
					}
					else //if polish
					{
						if(engTxt[j] == elems[i].innerText)
						{
							elems[i].innerText = plTxt[j];
							break;
						}
						pl = true;
						html.lang = "pl";
					}
				}
			}
		}
	}
}

async function getData(inputStr) 
{
  let obj = await fetch(inputStr);
  let str = await obj.text();
  let obj2 = await JSON.parse(str);
  
  return obj2;
}

function hashAdler32(str)
{
  let A = 1;
  let B = 0;

  for (let i=0; i<str.length; i++)
  {
      A += str.charCodeAt(i);
      B += A;
  }

  A = A % 65521;
  B = B % 65521;

  let C = B * 65536 + A
  let hash = C.toString(16)
  return hash;
}