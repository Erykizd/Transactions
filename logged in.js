var pieCanvas = document.getElementsByTagName("canvas")[0];
var barsCanvas = document.getElementsByTagName("canvas")[1];
var table = document.getElementsByTagName("table")[0];
var emoticons = ["🤑", "🛍️", "💰", "💳"];

document.getElementById("logOutBtn").addEventListener("click", logOut);

var linkStr = "https://api.npoint.io/38edf0c5f3eb9ac768bd";
var path = "data.json";
setLoggedInSuer();
var dataProm = getData(linkStr);
var data;
dataProm.then((val)=>{data = val; afterLoadedData()}, (error)=>{alert(error)});


function afterLoadedData()
{
	fillTransTable(data);
	let pieData = generatePieData(data);
	drawPie(pieData);
	let barsData = generateBarsData(data);
	drawBars(barsData);
}


function drawPie(pieData)
{	
	  var pie = new Chart("pie", 
	  {
		type: 'pie',
		data: 
		{
		  labels: pieData.labels,
		  datasets: 
		  [{
			label: '# of Votes',
			data: pieData.y,
			backgroundColor: 
			[
				    'green',
				    'rgb(195, 0, 0)',
					'lightgreen',
					'red'
			]
		  }]
		},
		options: 
		{
			title: 
			{
				display: true,
				text: 'Procentowy udział typów transakcji',
				fontSize: 25
			}
		}
	  });
}


function drawBars(barsData)
{	
	  var pie = new Chart("bars", 
	  {
		type: 'bar',
		data: 
		{
		  labels: barsData.dates,
		  datasets: 
		  [{
			label: '# of Votes',
			data: barsData.balance,
			backgroundColor: 
			[
				    'green',
				    'green',
				    'green',
				    'green',
				    'green'
			]
		  }]
		},
		options: 
		{
			title: 
			{
				display: true,
				text: 'Procentowy udział typów transakcji',
				fontSize: 25
			}
		}
	  });
}


function generatePieData(dataIn)
{
	let pie = {};
	let labels = [];
	let y = [0,0,0,0];
	
	let sum = 0;
	
	for(let i = 0; i < dataIn.transactions.length; i++)
	{
		switch (dataIn.transactions[i].type)
		{
			case 1:
				y[0] += 1;
				break;
			case 2:
				y[1] += 2;
				break;	
			case 3:
				y[2] += 1;
				break;	
			case 4:
				y[3] += 1;
				break;	
		}		
		sum += 1;
	}
	
	for(let i = 0; i < y.length; i++)
	{
		y[i] *= Math.round(10000/sum)/100;
		labels[i] = dataIn.transacationTypes[i+1] +" [%]";
	}
	
	pie.y = y;
	pie.labels = labels;
	return pie;
}

function generateBarsData(dataIn)
{
	let bars = {};
	let dates = [];
	let balance = [];
	
	let date, dateNext;
	
	let j = 0;
	for(let i = dataIn.transactions.length - 1; i > 0; i--)
	{
		date = dataIn.transactions[i].date;
		dateNext = dataIn.transactions[i-1].date;
		
		if(date != dateNext)
		{
			balance[j] = dataIn.transactions[i].balance;
			dates[j] = dataIn.transactions[i].date;
			j += 1;
		}
		else if(i == 1)
		{
			balance[j] = dataIn.transactions[i-1].balance;
			dates[j] = dataIn.transactions[i-1].date;
			j += 1;			
		}
	}
	
	bars.dates = dates;
	bars.balance = balance;
	
	return bars;
}


function logOut()
{
	window.open("logged out.html", "_self");
}


async function getData(inputStr) 
{
  let obj = await fetch(inputStr);
  let str = await obj.text();
  let obj2 = await JSON.parse(str);
  
  return obj2;
}


function setLoggedInSuer()
{
	if(localStorage.getItem("loggedUserName") != null)
	{
	document.getElementById("loggedInfo").innerHTML = 
						"Zalogowany/na jako: " + 
						localStorage.getItem("loggedUserName");
	}
}


function fillTransTable(dataIn)
{
	let date, type, typeNr, amount, balance, description, row, cell, after, beggining, ending;
	
	for(let i = 0; i < dataIn.transactions.length; i++)
	{
		date = dataIn.transactions[i].date;
		typeNr = dataIn.transactions[i].type;
		type = dataIn.transacationTypes[typeNr];
		description = dataIn.transactions[i].description;
		amount = dataIn.transactions[i].amount;
		balance = dataIn.transactions[i].balance;
		emoticon = emoticons[typeNr-1];
		
		row = table.insertRow();
		row.id = "tr" + (i + 1);
		
		beggining = '<a href = "#' + row.id + '">';
		ending = "</a>";
		
		cell = row.insertCell();
		cell.innerHTML = beggining + date + ending;
		cell.className = "date";
		
		cell = row.insertCell();
		cell.innerHTML = beggining + emoticon + ending;
		cell.className = "type";
		
		cell = row.insertCell();
		cell.innerHTML = "<div>" + beggining + "" + description 
						+ ending +"</br> <a class = 'afterDescription' "
						+ 'href = "#' + row.id + '">'
						+ type + "</a></div>";
		cell.className = "description";
		
		cell = row.insertCell();
		cell.innerHTML = beggining + amount + ending;
		cell.className = "amount";
		
		cell = row.insertCell();
		cell.innerHTML = beggining + balance + ending;
		cell.className = "balance";
		
		cell = row.insertCell();
		cell.innerHTML = "<a href='#'> ❌ </a>";
		cell.className = "closeRow";
		cell.hidden = true;
	}
}
