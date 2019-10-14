// API_HOST has to be set in config.js

// General-purpose functions

function archiveObject(type, id) {
	if(type === 'p')
		return archivePlasmid(id);
	else if(type === 'm')
		return archiveMicroorganism(id);
	else if(type === 'g')
		return archiveGeneric(id);
	else
		return false;
}

// Plasmid endpoint

function getPlasmid(id) {
	return request('GET', `${API_HOST}/plasmid/${id}`);
}

function postPlasmid(plasmidString) {
	return request('POST', `${API_HOST}/plasmid`, {'data': plasmidString});
}

function archivePlasmid(id) {
	return request('DELETE', `${API_HOST}/plasmid/${id}`);
}

// Microorganism endpoint

function getMicroorganism(id) {
	return request('GET', `${API_HOST}/organism/${id}`);
}

function postMicroorganism(organismString) {
	return request('POST', `${API_HOST}/organism`, {'data': organismString});
}

function archiveMicroorganism(id) {
	return request('DELETE', `${API_HOST}/organism/${id}`);
}

// Genericobject endpoint

function getGeneric(id) {
	return request('GET', `${API_HOST}/generic/${id}`);
}

function postGeneric(objectString) {
	return request('POST', `${API_HOST}/generic`, {'data': objectString});
}

function archiveGeneric(id) {
	return request('DELETE', `${API_HOST}/generic/${id}`);
}

// Storage endpoint

function putStorage(loc, id, host) {
	return request('PUT', `${API_HOST}/storage/${loc}`, {'entry': id, host});
}

function getStorageLocations(id) {
	return request('GET', `${API_HOST}/storage/id/${id}`);
}

function deleteStorageLocation(loc) {
	return request('DELETE', `${API_HOST}/storage/${loc}`);
}

// Print endpoint

function putPrinterConfig(url, authKey, name = '', location = '') {
	return request('PUT', `${API_HOST}/print`, {url, authKey, name, location});
}

function postPrint(id, type, host = '', copies = 1) {
	return request('POST', `${API_HOST}/print/${type}/${id}`, {host, copies});
}

// Search endpoint

function getSearch(query, mode = 'any') {
	return request('GET', `${API_HOST}/search/${mode}?query=${query}`);
}

// Authentication

function authenticate(token) {
	return new Promise((resolve, reject) => {
		request('POST', `${API_HOST}/auth`, {token}).then(response => {
			if(response.type === 'sessionToken') {
				localStorage.setItem('sessionToken', response.sessionToken);
				resolve('Auth ok');
			}
			else {
				reject('Authentication failed');
			}
		}).catch(error => reject(error));
	});
}

function debugCall(method, url, data = {}) {
	request(method, url, data)
		.then(data => console.log(data))
		.catch(error => console.error(error));
}

function request(method, url, data = {}) {
	const sessionToken = localStorage.getItem('sessionToken');
	const formData = new FormData();
	formData.append('sessionToken', sessionToken);
	for (const prop in data) {
		formData.append(prop, data[prop]);
	}

	// Encode session token into URL for GET requests
	if(method === 'GET') {
		url = url.match(/\?[^\?]+$/) ? url + '&sessionToken=' + sessionToken : url + '?sessionToken=' + sessionToken;
	}

	return fetch(url, {
		method, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, cors, *same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		body: method === 'GET' ? null : formData,
	}).then(response => response.json());
}