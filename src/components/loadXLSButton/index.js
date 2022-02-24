// Зависимости
import XLS from 'xlsx';
import { observer } from 'mobx-react-lite';

// Стили
import './loadXLSButton.module.sass';

// Хранилище
import Store from './../../store';

const LoadXLSButton = observer((props) => {
  const { changes } = props;

  function filePicked(event) {
    if (event.target.files && event.target.files[0]){
      let reader = new FileReader();
      const xlsFile = event.target.files[0]; // Получаем файл
      reader.onload = readerEvent => parseXLS(readerEvent); // Получаем массив с деталями
      reader.readAsBinaryString(xlsFile);
    }
  };

  function parseXLS(event) {
    const workbook = XLS.read(event.target.result, {type: 'binary'});
    let partsObjects = null;
    workbook.SheetNames.forEach( sheetName => partsObjects = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]) );
    checkChanges(Store.allDetails, partsObjects, changes);
  };

  function checkChanges(oldTable, newTable, changes) {
    if (oldTable.length === 0) return Store.setAllDetails = newTable;
    makeNewTableWithСhanges(oldTable, newTable, changes);
  };

  function makeNewTableWithСhanges(oldTable, newTable, changes) {
    try {
      const OLD_VENDOR_CODE_NAME = getCurrentName(oldTable, changes.vendorCode);
      const NEW_VENDOR_CODE_NAME = getCurrentName(newTable, changes.vendorCode);
      const OLD_PRICE_NAME = getCurrentName(oldTable, changes.price);
      const NEW_PRICE_NAME = getCurrentName(newTable, changes.price);
      const OLD_COUNT_NAME = getCurrentName(oldTable, changes.count);
      const NEW_COUNT_NAME = getCurrentName(newTable, changes.count);
      const OLD_OEM_NAME = getCurrentName(oldTable, changes.oem);
      const NEW_OEM_NAME = getCurrentName(newTable, changes.oem);
      Store.setCountFilter = { 
        name: NEW_COUNT_NAME,
        filter: Store.filters.count.filter 
      };

      // Возвращает новую таблицу со ВСЕМИ строками и изменениями
      let isChanged = false;
      oldTable.map( function(oldRow) {
        return newTable.map( function(newRow) {
          const IS_EQUAL_VENDOR_CODES = (oldRow[OLD_VENDOR_CODE_NAME] === newRow[NEW_VENDOR_CODE_NAME]);
          const IS_EQUAL_OEM = (oldRow[OLD_OEM_NAME] === newRow[NEW_OEM_NAME]);
          if (IS_EQUAL_VENDOR_CODES && IS_EQUAL_OEM) {
            const IS_CHANGED = (
              oldRow[OLD_PRICE_NAME] !== newRow[NEW_PRICE_NAME] || 
              oldRow[OLD_COUNT_NAME] !== newRow[NEW_COUNT_NAME]
            );

            if (IS_CHANGED) {
              isChanged = true;

              if (oldRow[OLD_PRICE_NAME] !== newRow[NEW_PRICE_NAME]) {
                newRow[NEW_PRICE_NAME] = applyChanges(oldRow[OLD_PRICE_NAME], newRow[NEW_PRICE_NAME]);
              }

              if (oldRow[OLD_COUNT_NAME] !== newRow[NEW_COUNT_NAME]) {
                newRow[NEW_COUNT_NAME] = applyChanges(oldRow[OLD_COUNT_NAME], newRow[NEW_COUNT_NAME]);
              }
            }
            return newRow;
          }
          return oldRow;
        });
      });

      isChanged ? alert('Изменения найдены.') : alert('Изменений не найдено.');

      return Store.setAllDetails = newTable;
    } catch (error) {
      console.log(error);
    }
  }

  function getCurrentName(currentTable, possibleNames) {
    const COLUMN_NAMES = Object.keys(currentTable[0]);

    let currentColumnName = COLUMN_NAMES.filter(columnName => possibleNames.includes(columnName))[0];
    if (!currentColumnName) {
      console.group('Ошибка при поиске названия столбца в таблице.');
      console.error('Не найдено известное программе название в новой таблице.'); 
      console.log(`Названия столбцов в таблице: ${COLUMN_NAMES}`);
      console.log(`Названия столбцов известные программе: ${possibleNames}`);
      console.groupEnd();
      return null;
    }
    return currentColumnName;
  }

  // Применяем изменения для нужных ячеек с ЧИСЛАМИ
  function applyChanges(oldCell, newCell) {
    const CURRENT_OLD_CELL = getNumberWithoutSymbols(oldCell);
    const BACKGROUND_COLOR = changeStyles(newCell, CURRENT_OLD_CELL); 
    if (Number(newCell) === CURRENT_OLD_CELL) {
      return newCell;
    }
    // <div>10 -> 9 (-1)</div>
    return <div className={BACKGROUND_COLOR}>{`${CURRENT_OLD_CELL} -> ${newCell} (${newCell-CURRENT_OLD_CELL})`}</div>;
  };

  function getNumberWithoutSymbols(cell) {
    if (cell && cell.props) {
      // Если есть пропс - значит значение менялось.
      // '100 -> 1000 (2)' => '1000 (2)' => 1000
      return Number(cell.props.children.split(' -> ')[1].split(' ')[0]);
    }
    return Number(cell);
  }

  return (
    <label className='button-by-ZicH'>
      Загрузить
      <input 
        accept='.xls, .xlsx,' 
        type='file' 
        className='hidden' 
        onChange={(event) => filePicked(event)} />
    </label>
  );
});

export default LoadXLSButton;

function changeStyles(number1, number2) {
  return number1 > number2 ? 'green' : 'red';
};
