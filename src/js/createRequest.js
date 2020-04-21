export default async function createRequest(instance, method) {
  const params = new URLSearchParams();
  let url = 'http://localhost:7070/tickets';
  const request = new Promise((resolve) => {
    Object.entries(instance).forEach(([key, value]) => {
      params.append(key, value);
    });
    if (method === 'GET' || method === 'DELETE') {
      url = `http://localhost:7070/tickets/:${params}`;
    }
    if (method === 'GET' && instance === '') {
      url = 'http://localhost:7070/tickets';
    }
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      }
    });
    if (method === 'GET' || method === 'DELETE') {
      xhr.send();
    } else {
      xhr.send(params);
    }
  });
  const response = await request;
  return response;
}
