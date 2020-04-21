/* eslint-disable no-param-reassign */
import createNewElement from './createNewElement.js';
import createPopup from './createPopup.js';
import loadingIcon from './loadingIcon.js';
import createRequest from './createRequest.js';
import confirmDeletion from './confirmDeletion.js';

export default function createTicketCard(ticket) {
  const ticketCard = createNewElement('div', 'ticket-card');
  const ticketCardBody = createNewElement('div', 'ticket-card-body');

  const ticketCheckBox = createNewElement('div', 'ticket-checkbox');
  const ticketStatusCheck = createNewElement('div', 'ticket-status-check', '&#10004;');
  function parseBoolean(value) { return value === 'true'; }
  ticket.status = parseBoolean(ticket.status);
  if (ticket.status === false) {
    ticketStatusCheck.classList.add('disabled');
  }
  ticketCheckBox.appendChild(ticketStatusCheck);

  const ticketName = createNewElement('div', 'ticket-name', `<p>${ticket.name}</p>`);
  const ticketDate = createNewElement('div', 'ticket-date', `<p>${ticket.created}</p>`);
  const ticketCardActions = createNewElement('div', 'ticket-card-actions-container');
  const ticketEditBtn = createNewElement('div', 'ticket-edit-btn', '&#9998;');
  const ticketRemoveBtn = createNewElement('div', 'ticket-remove-btn', '&#10006;');
  const ticketDescription = createNewElement('div', 'ticket-description disabled');
  let isDescriptionShowed = false;
  const loadingIconContainer = createNewElement('div', 'loading-icon-container', loadingIcon);

  ticketCardActions.appendChild(ticketEditBtn);
  ticketCardActions.appendChild(ticketRemoveBtn);

  ticketCardBody.appendChild(ticketCheckBox);
  ticketCardBody.appendChild(ticketName);
  ticketCardBody.appendChild(ticketDate);
  ticketCardBody.appendChild(ticketCardActions);
  ticketCard.appendChild(ticketCardBody);
  ticketCard.appendChild(ticketDescription);

  const noTargetBtns = [ticketEditBtn, ticketRemoveBtn, ticketCheckBox, ticketStatusCheck];

  // навешиваем обработчики на кнопки
  // клик на карточку загружает описание тикета с сервера и открывает его
  // закрывает по повторному клику
  ticketCard.addEventListener('click', (event) => {
    const isNotClickedBtns = noTargetBtns.every((item) => event.target !== item);
    async function loadTicketDescription() {
      const ticketDescriptionText = await createRequest({ id: ticket.id }, 'GET');
      setTimeout(() => {
        loadingIconContainer.remove();
        ticketDescription.innerHTML = `<p>${ticketDescriptionText}</p>`;
      }, 500);
    }
    if (isNotClickedBtns) {
      if (isDescriptionShowed) {
        ticketDescription.classList.add('disabled');
        isDescriptionShowed = false;
      } else {
        ticketDescription.classList.remove('disabled');
        isDescriptionShowed = true;
        if (ticketDescription.innerHTML === '') {
          ticketDescription.appendChild(loadingIconContainer);
          loadTicketDescription();
        }
      }
    }
  });
  // клик на чекбокс меняет статус и сохраняет его на сервере
  ticketCheckBox.addEventListener('click', () => {
    if (ticket.status === true) {
      ticket.status = false;
    } else {
      ticket.status = true;
    }
    async function changeTicketStatus() {
      let ticketStatus = await createRequest({ id: ticket.id, status: ticket.status }, 'PATCH');
      ticketStatus = parseBoolean(ticketStatus);
      if (ticketStatus === true) {
        ticketStatusCheck.classList.remove('disabled');
      } else {
        ticketStatusCheck.classList.add('disabled');
      }
    }
    changeTicketStatus();
  });
  // по кнопке редактировать создаем и добавляем попап на страницу
  ticketEditBtn.addEventListener('click', () => {
    const popupElements = createPopup('Изменить тикет');
    const [popup, addingForm, nameInput, descriptionInput, resetBtn] = popupElements;
    nameInput.value = ticket.name;
    descriptionInput.value = ticket.description;
    // по кнопке сабмита меняем данные тикета, заменяем даные на сервере и на странице
    addingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      ticket.name = nameInput.value;
      ticket.description = descriptionInput.value;
      async function editTicketCard() {
        let ticketText = await createRequest(ticket, 'PUT');
        ticketText = JSON.parse(ticketText);
        const [name, description] = ticketText;
        ticketName.innerHTML = `<p>${name}</p>`;
        ticketDescription.innerHTML = `<p>${description}</p>`;
        popup.remove();
      }
      editTicketCard();
    });
    resetBtn.addEventListener('click', () => {
      popup.remove();
    });
  });
  // функция, которая передается в попап подтверждения удаления
  // (вызывается после клика на Ок в попапе)
  async function deleteTicket() {
    const isDeleted = await createRequest({ id: ticket.id }, 'DELETE');
    if (isDeleted === 'deleted') {
      ticketCard.remove();
    }
  }
  // по кнопке удалить вызываем попап для подтверждения удаления
  ticketRemoveBtn.addEventListener('click', () => {
    confirmDeletion(deleteTicket);
  });
  return ticketCard;
}
