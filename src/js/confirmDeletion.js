import createNewElement from './createNewElement.js';

export default function confirmDeletion(handlerDelete) {
  const bodyEl = document.querySelector('body');

  const ticketDeletePopup = createNewElement('div', 'ticket-delete-popup');
  const ticketDeleteHeader = createNewElement('div', 'ticket-delete-header', '<p>Удалить тикет</p>');
  const ticketDeleteText = createNewElement('div', 'ticket-delete-text', '<p>Вы уверены, что хотите удалить тикет?</p><p>Это дествие необратимо.</p>');

  const ticketDeleteBtnsContainer = createNewElement('div', 'ticket-delete-btns-container');
  const ticketDeleteBtn = createNewElement('button', 'ticket-delete-btn btn', 'Ок');
  ticketDeleteBtn.type = 'button';
  const ticketKeepBtn = createNewElement('button', 'ticket-keep-btn btn', 'Отмена');
  ticketKeepBtn.type = 'button';
  ticketDeleteBtnsContainer.appendChild(ticketDeleteBtn);
  ticketDeleteBtnsContainer.appendChild(ticketKeepBtn);

  ticketDeletePopup.appendChild(ticketDeleteHeader);
  ticketDeletePopup.appendChild(ticketDeleteText);
  ticketDeletePopup.appendChild(ticketDeleteBtnsContainer);
  bodyEl.insertBefore(ticketDeletePopup, bodyEl.lastChild);

  ticketDeleteBtn.addEventListener('click', () => {
    handlerDelete();
    ticketDeletePopup.remove();
  });

  ticketKeepBtn.addEventListener('click', () => {
    ticketDeletePopup.remove();
  });
}
