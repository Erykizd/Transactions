var showPassword = document.getElementById("showPassword");
var rememberMe = document.getElementById("rememberMe");
var psw = document.getElementsByName("password")[0];
var confPsw = document.getElementsByName("password-repeat")[0];
var email = document.getElementsByName("email")[0];
var confEmail = document.getElementsByName("email-repeat")[0];
var userName = document.getElementsByName("userName")[0];
var form0 = document.getElementsByTagName("form")[0];
var resetBtn = document.getElementById("resetBtn");
var subBtn = document.getElementById("signupbtn");
var progBar = document.getElementsByName("progBar")[0];
var nrOfSmallLetters = 0;
var nrOfBigLetters = 0;
var nrOfDigits = 0;
var nrOfSpecialSigns = -1;

document.getElementById("logInBtn").addEventListener("click", logIn);
showPassword.addEventListener("click", hideShowPasword);

form0.addEventListener("keyup", validateEmail);
form0.addEventListener("keyup", validateUserName);
form0.addEventListener("keyup", checkPassword);
form0.addEventListener("reset", checkPassword);
form0.addEventListener("keyup", validateConfPassword);
form0.addEventListener("submit", saveUserToList);
form0.addEventListener("submit", saveFields);

fillFields();	
checkPassword();
validateEmail();
validateUserName();
validateConfPassword();	


function logIn()
{
	window.open("logging in.html", "_self");
}

function hideShowPasword()
{
	if (showPassword.checked)
	{
		document.getElementsByName("password")[0].type = "text";
		document.getElementsByName("password-repeat")[0].type = "text";
	}
	else
	{
		document.getElementsByName("password")[0].type = "password";
		document.getElementsByName("password-repeat")[0].type = "password";
	}
}


function checkPassword()
{
		let psw = document.getElementsByName("password")[0].value;
		let Lmax = document.getElementsByName("password")[0].maxLength;
		let nrOfSigns = psw.length;
		let sign = '.';
		
		nrOfSmallLetters = 0;
		nrOfBigLetters = 0;
		nrOfDigits = 0;
		nrOfSpecialSigns = -1;
		let pswStrength = 0;
		
		for (let i=0; i<=nrOfSigns; i++)
		{
			sign = psw.charAt(i);
			if ((/[a-z]/).test(sign))
			{
				nrOfSmallLetters++;
			}
			else if ((/[A-Z]/).test(sign))
			{
				nrOfBigLetters++;
			}
			else if ((/[0-9]/).test(sign))
			{
				nrOfDigits++;
			}
			else
			{
				nrOfSpecialSigns++;
			}
		}
		
		if (nrOfSigns>0)
		{
			let n = 10*Math.sign(nrOfDigits) + 
				26*Math.sign(nrOfSmallLetters) + 
				26*Math.sign(nrOfBigLetters) + 
				(256-62)*Math.sign(nrOfSpecialSigns);
			pswStrength = nrOfSigns * Math.log(n) / Math.log(2) / (8*Lmax);
		}
		else
		{
			pswStrength = 0;
		}
				
		let r = document.querySelector(':root');
		let rs = getComputedStyle(r);
		
		//changing progressbar color depending on password strength
		if(pswStrength < 0.25)
		{
					r.style.setProperty("--progColor", "red");
		}
		else if(pswStrength < 0.5)
		{
					r.style.setProperty("--progColor", "orange");
		}
		else if(pswStrength < 0.75)
		{
					r.style.setProperty("--progColor", "yellow");
		}
		else
		{
					r.style.setProperty("--progColor", "green");
		}
		
		document.getElementById("info").innerHTML = "Siła hasła = " + Math.round(pswStrength*10000)/100 + " %"; 
		document.getElementsByName("progBar")[0].value = pswStrength; 		
}


function validateConfPassword()
{
	if(psw.value != confPsw.value) 
	{
		confPsw.setCustomValidity("Hasła nie są zgodne");
	} 
	else 
	{
		confPsw.setCustomValidity('');
	}
}


function validateEmail()
{
	if(email.value != confEmail.value) 
	{
		confEmail.setCustomValidity("Emaile nie są zgodne");
	} 
	else if(isEmailAssigned(email.value))
	{
		confEmail.setCustomValidity("Email zajęty przez innego użytkownika");
	}
	else 
	{
		confEmail.setCustomValidity("");
	}
}


function validateUserName()
{
	if(localStorage.getItem(userName.value)!=null) 
	{
		userName.setCustomValidity("Użytkownik o tej nazwie już istnieje");
	} 
	else if (userName.value=="")
	{
		userName.setCustomValidity("Wypełnij to pole");
	}
	else if(userName.value.length < userName.minLength)
	{
		userName.setCustomValidity("Nazwa użytkownika za krótka (zawiera " + userName.value.length + ", a powinna zawierać conajmniej " + userName.minLength + " znaków)");
	}
	else
	{
		userName.setCustomValidity(""); //ok
	}
}


function saveUserToList()
{
	let em = email.value;
	let usnam = userName.value;
	let pass = psw.value;
	let userJsObj = {email: em, userName: usnam, psw: pass};
	let userJsonObj = JSON.stringify(userJsObj);
	
	if(usnam!="" && em!="" && pass!="")
	{	if(localStorage.getItem(usnam)==null) //if not on the list
		{
			localStorage.setItem(usnam, userJsonObj)
		}
	}
}


function saveFields()
{
	localStorage.setItem("loggedUserName", userName.value);
	
	if(rememberMe.checked)
	{
		localStorage.setItem("email", email.value);
		localStorage.setItem("confEmail", confEmail.value);
		localStorage.setItem("userName", userName.value);
		localStorage.setItem("psw", psw.value);
		localStorage.setItem("confPsw", confPsw.value);
	}
	else
	{
		localStorage.setItem("email", "");
		localStorage.setItem("confEmail", "");
		localStorage.setItem("userName", "");
		localStorage.setItem("psw", "");
		localStorage.setItem("confPsw", "");
	}
}


function fillFields()
{
	email.value = localStorage.getItem("email");
	confEmail.value = localStorage.getItem("confEmail");
	userName.value = localStorage.getItem("userName");
	psw.value = localStorage.getItem("psw");
	confPsw.value = localStorage.getItem("confPsw");
}


function isEmailAssigned(emailStr)
{
	for (let i = 0; i<localStorage.length; i++) 
	{
		if(isJsonString(localStorage.getItem(localStorage.key(i))))
		{
			if(emailStr == JSON.parse(localStorage.getItem(localStorage.key(i))).email)
			{
				return true;
			}
		}
    }

	return false;
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
