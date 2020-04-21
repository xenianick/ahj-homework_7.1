import createRequest from './createRequest.js';
import createTicketCard from './createTicketCard.js';

export default function restoreSavedTicketsTo(ticketsContainer) {
  async function getSavedTasks() {
    let ticketsArray = await createRequest('', 'GET');
    ticketsArray = JSON.parse(ticketsArray);
    if (ticketsArray.length > 0) {
      ticketsArray.forEach((ticket) => {
        const ticketCard = createTicketCard(ticket);
        ticketsContainer.appendChild(ticketCard);
      });
    }
  }
  getSavedTasks();
}
