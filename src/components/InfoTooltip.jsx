import React from "react";
import { useNavigate } from "react-router-dom";
import PopupWithForm from "./PopupWithForm";
import error from '../image/Error.svg';
import goodinput from '../image/Goodinput.svg'

function InfoTooltip(props) {
  const navigate = useNavigate()

  const onClose = () => {
    props.onClose();
    navigate("/sign-in");
  }

  return (
    <PopupWithForm isOpen={props.isOpen} onClose={onClose} >
      <img src={props.user ? goodinput : error} alt="" className="log-in__image" />
      <h2 className="log-in__paragraph">{props.user ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h2>
    </PopupWithForm>
  )
}

export default InfoTooltip;