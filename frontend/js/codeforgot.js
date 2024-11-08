const urlParams = new URLSearchParams(window.location.search);
const errorMessage = urlParams.get('error');


document.getElementById('forgotCode').style.display = 'flex';

if (errorMessage) {
      // for Forgot password Code
  document.getElementById('forgotCode').textContent = decodeURIComponent(errorMessage);
  document.getElementById('code').style.border = '2px solid red';
  document.getElementById('code').addEventListener('mouseover', () => {
    document.getElementById('code').style.border = '1px solid grey';
    document.getElementById('forgotCode').style.display = 'none';
  });
}


