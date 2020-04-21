const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

function getId() {
  const id = (+new Date()).toString(16);
  return id;
}

app.use(koaBody({
  urlencoded: true,
}));

const tickets = [];

app.use(async (ctx, next) => {
  if (ctx.request.method === 'POST') {
    const ticket = ctx.request.body;
    const id = getId();
    ticket.id = id;
    tickets.push(ticket);
    ctx.response.body = ticket.id;
  }
  if (ctx.request.method === 'PUT') {
    const ticketEdit = ctx.request.body;
    const ticket = tickets.find((item) => item.id === ticketEdit.id);
    ticket.name = ticketEdit.name;
    ticket.description = ticketEdit.description;
    ctx.response.body = [ticket.name, ticket.description];
  }
  if (ctx.request.method === 'PATCH') {
    const ticketEdit = ctx.request.body;
    const ticket = tickets.find((item) => item.id === ticketEdit.id);
    ticket.status = ticketEdit.status;
    ctx.response.body = ticket.status;
  }
  if (ctx.request.method === 'DELETE') {
    let id = ctx.request.url.match(/id=.+$/);
    id = id[0].substring(3);
    const index = tickets.findIndex((item) => item.id === id);
    tickets.splice(index, 1);
    ctx.response.body = 'deleted';
  }
  if (ctx.request.method === 'GET' && ctx.request.url === '/tickets') {
    ctx.response.body = tickets;
  }
  if (ctx.request.method === 'GET' && /id=.+$/.test(ctx.request.url)) {
    let id = ctx.request.url.match(/id=.+$/);
    id = id[0].substring(3);
    const ticket = tickets.find((item) => item.id === id);
    ctx.response.body = ticket.description;
  }
  const origin = ctx.request.get('Origin');
  if (!origin) {
    await next();
    return;
  }
  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      await next();
      return;
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);
