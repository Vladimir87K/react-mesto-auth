import React from "react";

const PopupWithForm = (props) => {
  return (
    <div className={`popup popup-${props.name} ${props.isOpen && 'popup_opened'}`} >
      <div className="popup__container">
        <button onClick={props.onClose} className="popup__container-btn  btn-cursor" type="button" aria-label="закрытие окна" />
        <h2 className="popup__title">{props.title}</h2>
        <form onSubmit={props.onSubmit} name="userData" className="popup-information popup-profil-form" noValidate>
          {props.children}
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;