import styles from './header.module.sass';

import { NavLink } from 'react-router-dom'; 

const Header = () => {

  function isActiveNavLink(isActive) {
    return `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`;
  }

  return (
    <header className={styles.body}>

      <img className={styles.logo} src='./logo.png' alt='error' />

      <nav className={styles.navBar}>
        <NavLink to='/' className={({isActive}) => isActiveNavLink(isActive)}>XML генератор</NavLink>
        <NavLink to='/changes' className={({isActive}) => isActiveNavLink(isActive)}>Сверка таблиц</NavLink>
      </nav>
      
    </header>
  );
};

export default Header;
