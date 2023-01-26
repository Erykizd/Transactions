var pieCanvas = document.getElementsByTagName("canvas")[0];
var barsCanvas = document.getElementsByTagName("canvas")[1];
var table = document.getElementsByTagName("table")[0];
var logOutBtn = document.getElementById("logOutBtn");
var emoticons = ["💰", "🛍️", "🤑", "💳"];
var pie;
var bars;
langCheckbox.addEventListener("click", afterLoadedData);

logOutBtn.addEventListener("click", logOut);

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
	addFilters();
	translateAll();
}


function drawPie(pieData)
{	
	  pie = new Chart("pie", 
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
			],
		  }]
		},
		options: 
		{
			title: 
			{
				display: true,
				text: 'Procentowy udział typów transakcji',
				fontSize: 22,
				fontColor: 'black'
			},
			legend:
			{
				labels:
					{
							fontSize: 14,
							fontColor: 'black'
					}
			}
		}
	  });
	  
		if (langCheckbox.checked) //if english
		{
			pie.options.title.text = "Percentage of the transaction";	
		}
	  
}


function drawBars(barsData)
{	
	let backgroundColors = [];
	for(let i = 0; i < barsData.balance.length; i++)
	{
		if(barsData.balance[i] > 0)
		{
			backgroundColors[i] = 'green';
		}
		else
		{
			backgroundColors[i] = 'red';	
		}
	}
	
	  bars = new Chart("bars", 
	  {
		type: 'bar',
		data: 
		{
		  labels: barsData.dates,
		  datasets: 
		  [{
			label: 'Saldo',
			data: barsData.balance,
			backgroundColor: backgroundColors
		  }]
		},
		options: 
		{
			title: 
			{
				display: true,
				text: 'Wykres salda konta na koniec dnia',
				fontSize: 22,
				fontColor: 'black'
			},
			legend:
			{
				labels:
					{
							fontSize: 14,
							fontColor: 'black'
					}
			}
		}
	  });
	  
		if (langCheckbox.checked) //if english
		{
			bars.options.title.text = "Account balance chart at the end of the day";	
		}	  
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
	}
	
	for(let i = 0; i < y.length; i++)
	{
		sum += y[i];
	}
	
	for(let i = 0; i < y.length; i++)
	{
		y[i] = Math.round(10000*y[i]/sum)/100;
		if(document.getElementById("typeSelector").children.length > 0)
		{
			labels[i] = document.getElementById("typeSelector").children[i+1].value
		}
		else
		{
			labels[i] = dataIn.transacationTypes[i+1] +" [%]";
		}
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

function setLoggedInSuer()
{
	if(localStorage.getItem("loggedUserName") != null)
	{
	document.getElementById("loggedInfo").innerHTML = 
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
		cell.innerHTML = beggining + "<div>" + description 
						+ "</div>" + "</br> <div class = 'afterDescription' "
						+ 'href = "#' + row.id + '">'
						+ type + "</div>" + ending;
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

function clearTable()
{
	for (let i = table.rows.length-1; i > 0; i--)
	{
		table.deleteRow(i);
	}
}

function filterTableByType()
{
	let selector = table.rows[0].cells[1].children[1];
	let searchType = selector.value;
	document.getElementById("descriptionSearcher").value = "";
	clearTable();
	fillTransTable(data);
	translateAll();
	
	let typeInRow = table.rows[1].cells[2].firstChild.children[2].innerText;
	
	for (let i = table.rows.length-1; i > 0; i--)
	{
		typeInRow = table.rows[i].cells[2].firstChild.children[2].innerText;
		if(typeInRow != searchType)
		{
			table.deleteRow(i);
		}
	}
}

function filterTableByDescription()
{
	let searchDescription = document.getElementById("descriptionSearcher").value;
	table.rows[0].cells[1].children[1].selectedIndex=0;
	clearTable();
	fillTransTable(data);
	translateAll();
	let descriptionInRow = table.rows[1].cells[2].firstChild.children[0].innerText;
	
	for (let i = table.rows.length-1; i > 0; i--)
	{
		descriptionInRow = table.rows[i].cells[2].firstChild.children[0].innerText;
		if(!descriptionInRow.toUpperCase().includes(searchDescription.toUpperCase()))
		{
			table.deleteRow(i);
		}
	}
}

function addFilters()
{
	//adding options for type selector
	let selector = table.rows[0].cells[1].children[1];
	selector.addEventListener("change", ()=>
	{
		if(selector.value != "*")
		filterTableByType();
		else
		{
			clearTable();
			fillTransTable(data);
		}
	});
	
	let opt = document.createElement('option');
	opt.innerText = "*";
	
	document.getElementById("typeSelector").innerHTML = "";
	selector.appendChild(opt);
	
	for (let i = 1; i <= 4; i++)
	{
		let opt = document.createElement('option');
		opt.innerText = data.transacationTypes[i];
		selector.appendChild(opt);
	}
	
	//connecting description searching field with function
	document.getElementById("descriptionSearcher").addEventListener("keyup", ()=>{filterTableByDescription()});
}
