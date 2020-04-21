export default async function createRequest(instance, method) {
  const params = new URLSearchParams();
  let url = 'https://ahj-homework-7-1-7-2.herokuapp.com/tickets';
  const request = new Promise((resolve) => {
    Object.entries(instance).forEach(([key, value]) => {
      params.append(key, value);
    });
    if (method === 'GET' && instance === '') {
      url = 'https://ahj-homework-7-1-7-2.herokuapp.com/tickets';
    }
    if (method === 'GET' && instance !== '') {
      url = `https://ahj-homework-7-1-7-2.herokuapp.com/tickets/:${params}`;
    }
    if (method === 'DELETE') {
      url = `https://ahj-homework-7-1-7-2.herokuapp.com/tickets/:${params}`;
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
