const urlParams = new URLSearchParams(window.location.search);
const errorMessage = urlParams.get('error');
    
document.getElementById('forgotEmail').style.display = 'flex';
// for Forgot password Email
if (errorMessage) {
    document.getElementById('forgotEmail').textContent = decodeURIComponent(errorMessage);
    document.getElementById('email').style.border = '2px solid red';
    document.getElementById('email').addEventListener('mouseover', () => {
        document.getElementById('email').style.border = '1px solid grey';
        document.getElementById('forgotEmail').style.display = 'none';
    });
}
