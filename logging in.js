var showPassword = document.getElementById("showPassword");
var rememberMe = document.getElementById("rememberMe");
var psw = document.getElementsByName("password")[0];
var email = document.getElementsByName("email")[0];
var userName = document.getElementsByName("userName")[0];
var form1 = document.getElementsByTagName("form")[0];
var resetBtn = document.getElementById("resetBtn");
var subBtn = document.getElementById("submitBtn");

document.getElementById("signUpBtn").addEventListener("click", signUp);
document.getElementById("showPassword").addEventListener("click", hideShowPasword);
form1.addEventListener("keyup", validateUserName);
form1.addEventListener("keyup", validatePassword);
form1.addEventListener("submit", saveFields);


fillFields();

function signUp()
{
		window.open("signing up.html", "_self");
}


function hideShowPasword()
{
	if (showPassword.checked)
	{
		document.getElementsByName("password")[0].type = "text";
	}
	else
	{
		document.getElementsByName("password")[0].type = "password";
	}
}


function saveFields()
{
	if (getUserNameforEmail(userName.value) != null)
	{
		localStorage.setItem("loggedUserName", getUserNameforEmail(userName.value));
	}
	else
	{
		localStorage.setItem("loggedUserName", userName.value);
	}
	
	if(rememberMe.checked)
	{
		localStorage.setItem("logUserName", userName.value);
		localStorage.setItem("logPsw", psw.value);
	}
	else
	{
		localStorage.setItem("logUserName", "");
		localStorage.setItem("logPsw", "");
	}
}


function fillFields()
{
	if(localStorage.getItem("logUserName")!=null)
	{
		userName.value = localStorage.getItem("logUserName");
	}
	if(localStorage.getItem("logPsw")!=null)
	{
		psw.value = localStorage.getItem("logPsw");
	}
}


function validateUserName()
{
	if((localStorage.getItem(userName.value)!=null) //if userName exists
	   || (getUserNameforEmail(userName.value)!=null)) // or if email exists 
	{
		userName.setCustomValidity("");
	}
	else if (userName.value=="") //if empty userName field
	{
		userName.setCustomValidity("Wypełnij to pole");
	}
	else // rest of cases
	{
		userName.setCustomValidity("Użytkownik o tej nazwie nie istnieje");
	}
}


function validatePassword()
{
	if((localStorage.getItem(userName.value) != null)  //if username exists
		|| (localStorage.getItem(getUserNameforEmail(userName.value)) != "")) //or if email exists
	{
		let userJsonObj = localStorage.getItem(userName.value);
		if(userJsonObj == null)
		{
			let mail = userName.value;
			let name = getUserNameforEmail(mail);
			userJsonObj = localStorage.getItem(name);
		}
		
		let userJsObj = JSON.parse(userJsonObj);
		
		if(userJsObj.psw != psw.value)
		{
			psw.setCustomValidity("Nieprawidłowe hasło");
		}
		else
		{
			psw.setCustomValidity(""); //paswword is correct
		}
	} 
	else if (userName.value=="")
	{
		psw.setCustomValidity("Wypełnij to pole");
	}
	else
	{
		psw.setCustomValidity("");
	}
}


function getUserNameforEmail(emailStr)
{
	for (let i = 0; i<localStorage.length; i++) 
	{
		if(isJsonString(localStorage.getItem(localStorage.key(i))))
		{
			if(emailStr == JSON.parse(localStorage.getItem(localStorage.key(i))).email)
			{
				return JSON.parse(localStorage.getItem(localStorage.key(i))).userName;
			}
		}
    }

	return null;
}


function isJsonString(str) 
{
    try 
	{
        JSON.parse(str);
    } 
	catch (e) 
	{
        return false;
    }
    return true;
}
