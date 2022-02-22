import styles from './filters.module.sass';

import Store from './../../store';

const Filters = () => {

  function enterChangeCount(event) {
    if (event.key === 'Enter') {
      const filter = { columnNumber: Store.filters.count.name, filter: Number(event.target.value) };
      Store.setCountFilter = filter; 
    }
  }

  function onBlurChangeCount(event) {
    if (event.target.value.length > 0) {
      const filter = { columnNumber: Store.filters.count.name, filter: Number(event.target.value) };
      Store.setCountFilter = filter;
    }
  }

  return (
    <section className={styles.body}>
      <h3 className={styles.header}>Фильтр</h3>

      <div className={styles.filters}>
        <label className={styles.label}>
          <span className={styles.text}>Количество</span>
          <input className={styles.field} 
            type='number' 
            onKeyUp={ (event) => enterChangeCount(event) } 
            onBlur={ (event) => onBlurChangeCount(event) } 
            autoComplete='off'
            spellCheck='false'
          />
        </label>
      </div>
    </section>
  );
};

export default Filters;
