import autosize from 'autosize';
import createNewElement from './createNewElement.js';

export default function createPopup(name) {
  const bodyEl = document.querySelector('body');

  const ticketAddingPopup = createNewElement('div', 'ticket-adding-popup');
  const ticketAddingHeader = createNewElement('div', 'ticket-adding-header', `<p>${name}</p>`);
  const ticketAddingForm = createNewElement('form', 'ticket-adding-form');
  ticketAddingForm.name = 'ticketForm';

  const ticketNameHeader = createNewElement('div', 'ticket-name-header', '<p>Краткое описание</p>');
  const ticketNameInput = createNewElement('textarea', 'ticket-name-field');
  ticketNameInput.required = true;
  autosize(ticketNameInput);
  ticketAddingForm.appendChild(ticketNameHeader);
  ticketAddingForm.appendChild(ticketNameInput);

  const ticketDescriptionHeader = createNewElement('div', 'ticket-description-header', '<p>Полное описание</p>');
  const ticketDescriptionInput = createNewElement('textarea', 'ticket-description-field');
  ticketDescriptionInput.required = true;
  autosize(ticketDescriptionInput);
  ticketAddingForm.appendChild(ticketDescriptionHeader);
  ticketAddingForm.appendChild(ticketDescriptionInput);

  const ticketSaveBtn = createNewElement('button', 'ticket-save-btn btn', 'Ок');
  const ticketResetBtn = createNewElement('button', 'ticket-reset-btn btn', 'Отмена');
  ticketResetBtn.type = 'reset';
  ticketAddingForm.appendChild(ticketSaveBtn);
  ticketAddingForm.appendChild(ticketResetBtn);

  ticketAddingPopup.appendChild(ticketAddingHeader);
  ticketAddingPopup.appendChild(ticketAddingForm);

  bodyEl.insertBefore(ticketAddingPopup, bodyEl.lastChild);

  return [
    ticketAddingPopup, ticketAddingForm, ticketNameInput, ticketDescriptionInput, ticketResetBtn,
  ];
}
