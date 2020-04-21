import createNewElement from './createNewElement.js';
import restoreSavedTicketsTo from './restoreSavedTicketsTo.js';
import createPopup from './createPopup.js';
import Ticket from './Ticket.js';
import createTicketCard from './createTicketCard.js';
import createRequest from './createRequest.js';

const bodyEl = document.querySelector('body');

const mainContainer = createNewElement('div', 'main-container');
const headerContainer = createNewElement('div', 'header-container');
const addTicketBtn = createNewElement('div', 'add-ticket-btn', '<p>Добавить тикет</p>');
headerContainer.appendChild(addTicketBtn);
const ticketsContainer = createNewElement('div', 'tickets-container');
mainContainer.appendChild(headerContainer);
mainContainer.appendChild(ticketsContainer);
bodyEl.insertBefore(mainContainer, bodyEl.firstChild);

// получаем данные о сохраненных тикетах и отображаем их на странице
restoreSavedTicketsTo(ticketsContainer);

// по клику на кнопку добавления тикета создаем и вставляем попап
addTicketBtn.addEventListener('click', () => {
  const popupElements = createPopup('Добавить тикет');
  const [popup, addingForm, nameInput, descriptionInput, resetBtn] = popupElements;
  // по клику на сабмит создаем новый тикет и отправляем его на сервер
  addingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTicket = new Ticket(nameInput.value, descriptionInput.value);
    async function addTicketToPage() {
      const ticketId = await createRequest(newTicket, 'POST');
      // по получению ответа создаем html и добавляем его на страницу
      newTicket.id = ticketId;
      const newTicketCard = createTicketCard(newTicket);
      ticketsContainer.appendChild(newTicketCard);
      addingForm.reset();
      popup.remove();
    }
    addTicketToPage();
  });
  resetBtn.addEventListener('click', () => {
    popup.remove();
  });
});
