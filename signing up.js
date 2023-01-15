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

document.getElementById("langLabel").addEventListener("mouseout", ()=>{checkPassword(); 
									validateEmail(); validateUserName(); validateConfPassword()});
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
		let pswd = document.getElementsByName("password")[0].value;
		let Lmax = document.getElementsByName("password")[0].maxLength;
		let nrOfSigns = pswd.length;
		let sign = '.';
		
		nrOfSmallLetters = 0;
		nrOfBigLetters = 0;
		nrOfDigits = 0;
		nrOfSpecialSigns = -1;

		let pswdStrength = 0;
		
		for (let i=0; i<=nrOfSigns; i++)
		{
			sign = pswd.charAt(i);
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
			pswdStrength = nrOfSigns * Math.log(n) / Math.log(2) / (8*Lmax);
		}
		else
		{
			pswdStrength = 0;
		}
				
		let r = document.querySelector(':root');
		let rs = getComputedStyle(r);
		
		//changing progressbar color depending on password strength
		if(pswdStrength < 0.25)
		{
					r.style.setProperty("--progColor", "red");
		}
		else if(pswdStrength < 0.5)
		{
					r.style.setProperty("--progColor", "orange");
		}
		else if(pswdStrength < 0.75)
		{
					r.style.setProperty("--progColor", "yellow");
		}
		else
		{
					r.style.setProperty("--progColor", "green");
		}
		
		let strengthText = "";
		if(pl)
		{
			strengthText = "Siła hasła = ";
		}
		else
		{
			strengthText = "Strength of password = ";
		}
		
		document.getElementById("info").innerHTML = strengthText + Math.round(pswdStrength*10000)/100 + " %"; 
		document.getElementsByName("progBar")[0].value = pswdStrength;
}


function validateConfPassword()
{
	let txt1 = "Hasła nie są zgodne";
	if(!pl)
	{
		txt1 = "Passwords are different";
	}
	
	if(psw.value != confPsw.value) 
	{
		confPsw.setCustomValidity(txt1);
	} 
	else 
	{
		confPsw.setCustomValidity('');
	}
}


function validateEmail()
{
	let txt1 = "Emaile nie są zgodne";
	let txt2 = "Email zajęty przez innego użytkownika";
	if (!pl)
	{
		txt1 = "Emails are different";
		txt2 = "Email used by other user";
	}	
	
	if(email.value != confEmail.value) 
	{
		confEmail.setCustomValidity(txt1);
	} 
	else if(isEmailAssigned(email.value))
	{
		confEmail.setCustomValidity(txt2);
	}
	else 
	{
		confEmail.setCustomValidity("");
	}
}


function validateUserName()
{
	let nrOfBigLettersInName = 0;
	let nrOfSmallLettersInName = 0;
	let nrOfLettersInName = 0;
	let nrOfDigitsInName = 0;
	let	nrOfIntiveSignsInName = 0; // - _ [ ] \ /
	let intiveSigns = "-_[]\/".split("");
	let nrOfNotAllowedSignsInName = 0;
	let sign = '.';
	
	for (let i = 0; i <= userName.value.length; i++)
	{
		sign = userName.value.charAt(i);
		if ((/[a-z]/).test(sign))
		{
			nrOfSmallLettersInName++;
		}
		else if ((/[A-Z]/).test(sign))
		{
			nrOfBigLettersInName++;
		}
		else if ((/[0-9]/).test(sign))
		{
			nrOfDigitsInName++;
		}
		else if (hasStringCharsSuchAs(sign, intiveSigns))
		{
			nrOfIntiveSignsInName++;
		}
		else if(sign != "")
		{
			nrOfNotAllowedSignsInName++;
		}
	}
	
	nrOfLettersInName = nrOfBigLettersInName + nrOfSmallLettersInName;

	let txt1, txt2, txt3a, txt3b, txt3c, txt4, txt5, txt6;
	if(pl)
	{
		txt1 = "Użytkownik o tej nazwie już istnieje";
		txt2 = "Wypełnij to pole";
		txt3a = "Nazwa użytkownika za krótka (zawiera ";
		txt3b = ", a powinna zawierać conajmniej ";
		txt3c = " znaków)";
		txt4 = "Nazwa użytkownika zawiera niedozwolone znaki";
		txt5 = "Nazwa użytkownika nie zawiera cyfr";
		txt6 = "Nazwa użytkownika zawiera za mało liter (wymagane conajmniej 5 liter)";
	}
	else
	{
		txt1 = "A user with this name already exists";
		txt2 = "Please fill in this field";
		txt3a = "Username too short (contains ";
		txt3b = " and should contain at least ";
		txt3c = " characters)";
		txt4 = "Username contains illegal characters";
		txt5 = "Username does not contain numbers";
		txt6 = "Username contains too few letters (at least 5 letters required)";
	}
	
	if(localStorage.getItem(userName.value) != null) 
	{
		userName.setCustomValidity(txt1);
	} 
	else if (userName.value == "")
	{
		userName.setCustomValidity(txt2);
	}
	else if(userName.value.length < userName.minLength)
	{
		userName.setCustomValidity(txt3a + userName.value.length + txt3b + userName.minLength + txt3c);
	}
	else if (nrOfNotAllowedSignsInName > 0)
	{
		userName.setCustomValidity(txt4);
	}
	else if (nrOfDigitsInName < 1)
	{
		userName.setCustomValidity(txt5);
	}
	else if (nrOfLettersInName < 5)
	{
		userName.setCustomValidity(txt6);
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


function hasStringCharsSuchAs(str, chars)
{
	for(let i = 0; i < chars.length; i++)
    {
    	if(str.includes(chars[i]))
        {
        	return true;
        }
    }
    return false;
}
