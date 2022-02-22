// Зависимости
import { observer } from 'mobx-react-lite';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

// Стили
import styles from './changes.module.sass';

// Хранилище
import Store from './../store';

// Компоненты
import LoadXLSButton from './../components/loadXLSButton';
import TableWithDetails from './../components/objectsTable';
import ChangeTable from './../components/changeTable';
import Filters from './../components/filters/filters';

const changes = {
  price: ['Цена', 'Ценник', 'Стоимость', 'Цена МП'],
  count: ['Кол-во', 'Количество', 'Кол-во в наличии', 'Остаток'],
  vendorCode: ['Артикул', 'Артикул ОЕМ']
};

const Changes = observer(() => {

  return (
    <section className={styles.body}>
      
      <div className={styles.buttons}> 
        <LoadXLSButton changes={changes} />
        <ChangeTable /> 
        <ReactHTMLTableToExcel 
          className='button-by-ZicH'
          table='changes-table'
          filename='testing'
          sheet='Sheet'
          buttonText='Скачать'
        />
      </div>

      { !Store.full ? <Filters /> : <></> }
      
      <TableWithDetails 
        allDetails={Store.allDetails} 
        detailsWithOnlyChanges={Store.detailsWithOnlyChanges} 
        fullInfo={Store.full} 
      />

    </section>
  );
});

export default Changes;
