import React from "react";
import PopupWithForm from './PopupWithForm';

const PopupDelete = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.deleteCard();
  }

  return (
    <PopupWithForm isOpen={props.isOpen} title='Вы уверены?' name='delete' onClose={props.onClose} onSubmit={handleSubmit}>
            <button type="submit" className="popup__form-save popup__form-save-delete" value="Да">Да</button>
    </PopupWithForm>
  ); 
}

export default PopupDelete;