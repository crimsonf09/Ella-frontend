// background.js
chrome.cookies.get({ url: 'http://localhost:3000', name: 'token' }, (cookie) => {
  if (cookie) {
    console.log('Cookie value:', cookie.value);
  } else {
    console.log('No cookie found');
  }
});
