// API_HOST has to be set in config.js

function debugCall(method, url, data = {}) {
	request(method, url, data)
		.then(data => console.log(data))
		.catch(error => console.error(error));
}

function getPlasmid(id) {
	return request('GET', `${API_HOST}/plasmid/${id}`);
}

function postPlasmid(plasmidString) {
	return request('POST', `${API_HOST}/plasmid`, {'data': plasmidString});
}

function putStorage(loc, id, host) {
	return request('PUT', `${API_HOST}/storage/${loc}`, {'entry': id, host});
}

function getStorageLocations(id) {
	return request('GET', `${API_HOST}/storage/id/${id}`);
}

function deleteStorageLocation(loc) {
	return request('DELETE', `${API_HOST}/storage/${loc}`);
}

function putPrinterConfig(url, authKey, name = '', location = '') {
	return request('PUT', `${API_HOST}/print`);
}

function postPrint(id, host = null, copies = 1) {
	return request('POST', `${API_HOST}/print/${id}`, {host, copies});
}

function request(method, url, data = {}) {
	const formData = new FormData();
	for (const prop in data) {
		formData.append(prop, data[prop]);
	}
	return fetch(url, {
		method, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, cors, *same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		body: method === 'GET' ? null : formData,
	}).then(response => response.json());
}