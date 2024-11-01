// for the TIME, DATE and DAY
let timeAndDate = document.querySelector('#dateTime .dateTime');

async function getDateTime(url) {
  const response = await fetch(url);
  const body = await response.json();
  let {datetime} = body;
  let splitting = datetime.split(/[+.:T]/);  
  let [date, time, minute] = [splitting[0], splitting[1], splitting[2]];
  let [year, month, day] = date.split("-");
  let pinoydate = ` ${day}/${month}/${year} `;
  return [pinoydate, time, minute ];
}
async function day(url) {
  const response = await fetch(url);
  const body = await response.json();
  let {dayOfWeek} = body;
  return {dayOfWeek};
}


function updateDateTime() {
  getDateTime("https://worldtimeapi.org/api/timezone/Asia/Manila").then(([ pinoydate, time, minute ]) => {
    if ( parseInt(time) <= 11 && parseInt(minute) < 60) {
      timeAndDate.textContent = ` - ${pinoydate} ${time}:${minute}AM `;
    } else {
      timeAndDate.textContent = ` - ${pinoydate} ${time}:${minute}PM `;
    }
    timeAndDate.classList.add("dateTime");
  });
  day("https://timeapi.io/api/time/current/zone?timeZone=Asia%2FManila").then(({dayOfWeek}) => {
    let day = document.getElementById('day');
    day.textContent = `${dayOfWeek}`;
    day.classList.add("dateTime");
  });
}

updateDateTime();

//we should set this to a MINUTE so that we will not be banned in the free links
setInterval(updateDateTime, 60000);


// for the LOG IN and SIGN UP FORM
const loginButton = document.querySelector('#logIn'); // homepage UserButton
const closeBtn = document.getElementById('closeBtn'); // close button for login
const loginForm = document.getElementById('loginForm'); // login and Signupform
const signUpButton = document.querySelector('.signUpHomepage'); // singup button in LoginForm
const signUpForm = document.getElementById('signUp-content'); // signup form
const login = document.querySelector('.logIn-content'); // login form
const backBtn = document.getElementById('backBtn');
const backBtn2 = document.getElementById('backBtn2'); // for Verify form
const loginFormInput = document.querySelector('form[action="/login"]');
const signUpFormInput = document.querySelector('form[action="/signup"]');
const verify = document.getElementById('verificationForm'); // verification form
const signUpVerify = document.getElementById('verification'); // button register form

signUpVerify.addEventListener('click', () => { 
  signUpForm.style.display = 'none';
  verify.style.display = 'flex';
  window.history.pushState({}, '', '/home/verifyId123');
});

loginButton.addEventListener('click', () => {
  loginForm.style.display = 'flex'; 
  document.body.classList.add('no-scroll');
  window.history.pushState({}, '', '/home/loginId313');
});
closeBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  loginFormInput.reset();
  document.body.classList.remove('no-scroll');
  window.history.pushState({}, '', '/home'); 
});


signUpButton.addEventListener('click', () => { 
  login.style.display = 'none';
  signUpForm.style.display = 'flex';
  loginFormInput.reset();
  window.history.pushState({}, '', '/home/signUpId6969');
});

backBtn.addEventListener('click', () => {
  login.style.display = 'flex';
  signUpForm.style.display = 'none';
  signUpFormInput.reset();
  window.history.pushState({}, '', '/home/loginId313');
});
backBtn2.addEventListener('click', () => { 
  verify.style.display = 'none';
  signUpForm.style.display = 'flex';
  window.history.pushState({}, '', '/home/signUpId6969');
});

if (window.location.pathname === '/home/loginId313') {
  login.style.display = 'flex';
  signUpForm.style.display = 'none';
  loginForm.style.display = 'flex'; 
}

if (window.location.pathname === '/home/signUpId6969') {
  login.style.display = 'none';
  signUpForm.style.display = 'flex';
  loginForm.style.display = 'flex';
}

if (window.location.pathname === '/home/verifyId123') { 
  verify.style.display = 'flex';
  signUpForm.style.display = 'none';
  login.style.display = 'none';
  loginForm.style.display = 'flex';
}

if (window.location.pathname === '/home/loginId313' || window.location.pathname === '/home/signUpId6969') { 
  document.body.classList.add('no-scroll');
} else {
  document.body.classList.remove('no-scroll');
};

//Login and Sign Up Form validation

const registerForm = document.getElementById('registerForm');
const errorElement = document.getElementById('error');

registerForm.addEventListener('submit', (e) => {

  // for phone number
  let messages = []; 
  const phoneNumberInput = document.getElementById('phoneNumber');
  const phoneNumber = phoneNumberInput.value;
  // for password
  const passwordInput = document.getElementById('passwordSignUp');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  // phone number validation
  if (phoneNumber.length < 11) {
    messages.push('Phone Number must be at least 11 digits');
    phoneNumberInput.style.border = '2px solid red';

  } else if (phoneNumber.length >= 12) {
    messages.push('Phone Number must be at most 11 digits');
    phoneNumberInput.style.border = '2px solid red';
  }

  else if (isNaN(phoneNumber)) {
    messages.push('Phone Number must be a number');
    phoneNumberInput.style.border = '2px solid red';
  } 
  // password validation
  else if (password.length < 6) {
    messages.push('Password must be at least 6 characters');
    passwordInput.style.border = '2px solid red';
  }
  else if (password !== confirmPassword) {
    messages.push('Passwords do not match');
    passwordInput.style.border = '2px solid red';
    confirmPasswordInput.style.border = '2px solid red';
  }
  if (messages.length > 0) {
    e.preventDefault();  // Prevent form submission
    errorElement.innerText = messages.join(', ');  // Display error messages
  } else {
    errorElement.innerText = '';
    phoneNumberInput.style.border = ''; 
    passwordInput.style.border = '';
    confirmPasswordInput.style.border = '';
    signUpForm.style.display = 'none';
    login.style.display = 'flex';
  }
});

/*

// for the TIME, DATE and DAY
let timeAndDate = document.querySelector('#dateTime .dateTime');

async function getDateTime(url) {
  const response = await fetch(url);
  const body = await response.json();
  let {datetime} = body;
  let splitting = datetime.split(/[+.:T]/);  
  let [date, time, minute] = [splitting[0], splitting[1], splitting[2]];
  let [year, month, day] = date.split("-");
  let pinoydate = ` ${day}/${month}/${year} `;
  return [pinoydate, time, minute ];
}
async function day(url) {
  const response = await fetch(url);
  const body = await response.json();
  let {dayOfWeek} = body;
  return {dayOfWeek};
}


function updateDateTime() {
  getDateTime("https://worldtimeapi.org/api/timezone/Asia/Manila").then(([ pinoydate, time, minute ]) => {
    if ( parseInt(time) <= 11 && parseInt(minute) < 60) {
      timeAndDate.textContent = ` - ${pinoydate} ${time}:${minute}AM `;
    } else {
      timeAndDate.textContent = ` - ${pinoydate} ${time}:${minute}PM `;
    }
    timeAndDate.classList.add("dateTime");
  });
  day("https://timeapi.io/api/time/current/zone?timeZone=Asia%2FManila").then(({dayOfWeek}) => {
    let day = document.getElementById('day');
    day.textContent = `${dayOfWeek}`;
    day.classList.add("dateTime");
  });
}

updateDateTime();

//we should set this to a MINUTE so that we will not be banned in the free links
setInterval(updateDateTime, 60000);


// for the LOG IN and SIGN UP FORM
const loginButton = document.querySelector('#logIn');
const closeBtn = document.getElementById('closeBtn');
const loginForm = document.getElementById('loginForm');

loginButton.addEventListener('click', () => {
    loginForm.style.display = 'flex'; 
    window.history.pushState({}, '', '/home/loginId313');
});

closeBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    window.history.pushState({}, '', '/home'); 
});

if (window.location.pathname === '/home/loginId313') {
  loginForm.style.display = 'flex'; 
}

// for SIGN UP and LOGIN
const signUpButton = document.querySelector('.signUpHomepage');
const signUpForm = document.getElementById('signUp-content');
const login = document.querySelector('.logIn-content');
const backBtn = document.getElementById('backBtn');

signUpButton.addEventListener('click', () => { 
  login.style.display = 'none';
  signUpForm.style.display = 'flex';
});


backBtn.addEventListener('click', () => {
  login.style.display = 'flex';
  signUpForm.style.display = 'none';
});


//Login and Sign Up Form validation

const registerForm = document.getElementById('registerForm');
const errorElement = document.getElementById('error');

registerForm.addEventListener('submit', (e) => {

  // for phone number
  let messages = []; 
  const phoneNumberInput = document.getElementById('phoneNumber');
  const phoneNumber = phoneNumberInput.value;
  // for password
  const passwordInput = document.getElementById('passwordSignUp');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  // phone number validation
  if (phoneNumber.length < 11) {
    messages.push('Phone Number must be at least 11 digits');
    phoneNumberInput.style.border = '2px solid red';

  } else if (phoneNumber.length >= 12) {
    messages.push('Phone Number must be at most 11 digits');
    phoneNumberInput.style.border = '2px solid red';
  }

  else if (isNaN(phoneNumber)) {
    messages.push('Phone Number must be a number');
    phoneNumberInput.style.border = '2px solid red';
  } 
  // password validation
  else if (password.length < 6) {
    messages.push('Password must be at least 6 characters');
    passwordInput.style.border = '2px solid red';
  }
  else if (password !== confirmPassword) {
    messages.push('Passwords do not match');
    passwordInput.style.border = '2px solid red';
    confirmPasswordInput.style.border = '2px solid red';
  }
  if (messages.length > 0) {
    e.preventDefault();  // Prevent form submission
    errorElement.innerText = messages.join(', ');  // Display error messages
  } else {
    errorElement.innerText = '';
    phoneNumberInput.style.border = ''; 
    passwordInput.style.border = '';
    confirmPasswordInput.style.border = '';
    signUpForm.style.display = 'none';
    login.style.display = 'flex';
  }
});

*/