





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


// for the LOG IN and SIGN UP
const loginButton = document.querySelector('#logIn');
const closeBtn = document.getElementById('closeBtn');
const loginForm = document.getElementById('loginForm');

loginButton.addEventListener('click', () => {
    loginForm.style.display = 'flex'; 
});

closeBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
});




