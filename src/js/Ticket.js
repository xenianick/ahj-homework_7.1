import getCurrentDate from './getCurrentDate.js';

export default class Ticket {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.status = false;
    this.created = getCurrentDate();
    this.id = null;
  }
}
