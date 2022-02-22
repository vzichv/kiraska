// Стили
import './changeTable.sass';

// Зависимости
import { useState } from 'react';

// Хранилище
import Store from './../../store';

const ChangeTable = () => {
  // Состояние с текстом кнопки
  const [buttonValue, setButtonValue] = useState('Все');

  // Меняем значение на противположное
  const changeTable = () => {
    Store.updateFull(!Store.full);
    Store.full ? setButtonValue('Все') : setButtonValue('Изменённые');
  }

  return <input className='button-by-ZicH' type='button' value={buttonValue} onClick={ () => changeTable() } />;
};

export default ChangeTable;
