/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// helper functions ----------

function logResult(result) {
	console.log(result);
}

function logError(error) {
	console.log('Looks like there was a problem:', error);
}

function validateResponse(response) {
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return response;
}

function logHeader (response) {
	console.log(response.headers.get('content-length'));
} 


function showImage(responseAsBlob) {
	const container = document.getElementById('img-container');
	const imgElem = document.createElement('img');
	container.appendChild(imgElem);
	const imgUrl = URL.createObjectURL(responseAsBlob);
	imgElem.src = imgUrl;
}

function showText(responseAsText) {
	const textParagraph = document.querySelector('#message');
	textParagraph.textContent = responseAsText
}

function readResponseAsJson(response) {
	return response.json()
}

function readResponseAsBlob(response) {
	return response.blob();
}

function readResponseAsText(response) {
	return response.text()
}

// Fetch JSON ----------
function fetchJSON() {
	fetch('examples/animals.json')
		.then(validateResponse)
		.then(readResponseAsJson)
		.then(logResult)
		.catch(logError)
}
const jsonButton = document.getElementById('json-btn');
jsonButton.addEventListener('click', fetchJSON);


// Fetch Image ----------
function fetchImage() {
	fetch('examples/fetching.jpg')
		.then(validateResponse)
		.then(readResponseAsBlob)
		.then(showImage)
		.catch(logError)
}
const imgButton = document.getElementById('img-btn');
imgButton.addEventListener('click', fetchImage);


// Fetch text ----------
function fetchText() {
	fetch('examples/words.txt')
		.then(validateResponse)
		.then(readResponseAsText)
		.then(showText)
		.catch(logError)
}
const textButton = document.getElementById('text-btn');
textButton.addEventListener('click', fetchText);


// HEAD request ----------
function headRequest() {
	fetch('examples/words.txt', {
		method: 'HEAD'
	})
		.then(validateResponse)
		// .then(readResponseAsText)
		.then(logHeader)
		.catch(logError);
}
const headButton = document.getElementById('head-btn');
headButton.addEventListener('click', headRequest);


// POST request ----------
/* NOTE: Never send unencrypted user credentials in production! */
function postRequest() {
	const form = document.querySelector('#msg-form')
	const formData = new FormData(form);
	const messageHeader = new Headers({"Content-Type": "application/json", 'Y-CUSTOM': 'hello world'})
	console.log(formData)
	fetch('http://localhost:5000/', {
	  method: 'POST',
	  headers: messageHeader,
	  body: JSON.stringify({ lab: 'fetch', status: 'fun' }),
	//   mode: 'no-cors'
	})
	  .then(validateResponse)
	  .then(readResponseAsText)
	  .then(showText)
	  .catch(logError);
  }
  
const postButton = document.getElementById('post-btn');
postButton.addEventListener('click', postRequest);
