import React from 'react';
import tooltip_ok from '../images/union_ok.png';
import tooltip_fail from '../images/union_fail.png'

function InfoTooltip(props) {

  const { name, isOpen, onClose } = props

  return (
    <div className={`popup popup_type_${props.name} popup_opened`}>
      <div className="popup__content popup__content-tooltip">
      <button type="button" className="popup__close-button" onClick={props.onClose}></button>
{/* Если регистрация прошла успешно: 
      <img className="popup__tooltip_ok" src={tooltip_ok}/>
        <h2 className="popup__title">Вы успешно зарегистрировались!</h2>*/}

{/* Если регистрация была неудачная */}
      <img className="popup__tooltip_fail" src={tooltip_fail}/>
        <h2 className="popup__title">Что-то пошло не так! Попробуйте еще раз.</h2>

      </div>
    </div>
  )

}
export default InfoTooltip