





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
});

closeBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
});

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
  let messages = [];  
  // for phone number
  const phoneNumberInput = document.getElementById('phoneNumber');
  const phoneNumber = phoneNumberInput.value;

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
  } else {
    phoneNumberInput.style.border = ''; 
  }

  /*
  //for password matching
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  if (password.length < 6) {
    messages.push('Password must be at least 6 characters');
    passwordInput.style.border = '2px solid red';
  }
  else if (password !== confirmPassword) {
    messages.push('Passwords do not match');
    passwordInput.style.border = '2px solid red';
    confirmPasswordInput.style.border = '2px solid red';
  } else {
    passwordInput.style.border = '';
    confirmPasswordInput.style.border = '';
  }
  */
  if (messages.length > 0) {
    e.preventDefault();  // Prevent form submission
    errorElement.innerText = messages.join(', ');  // Display error messages
  }
});
