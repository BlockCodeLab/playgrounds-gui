import { classNames } from '@blockcode/utils';
import { Text } from '@blockcode/core';
import styles from './menu-bar.module.css';

import tutorialsIcon from './icons/icon-tutorials.svg';

export function TutorialsButton({ onClick }) {
  return (
    <>
      <div className={styles.divider} />
      <div
        className={classNames(styles.menuBarItem, styles.menuLabel, styles.hoverable)}
        onClick={onClick}
      >
        <img
          className={styles.tutorialsIcon}
          src={tutorialsIcon}
        />
        <Text
          id="gui.menubar.tutorials"
          defaultMessage="Tutorials"
        />
      </div>
    </>
  );
}
