import { useEffect, useCallback } from 'preact/hooks';
import { batch, useSignal } from '@preact/signals';
import { classNames, getAutoDisplayPanel, setAutoDisplayPanel } from '@blockcode/utils';
import { Keys } from '@blockcode/core';

import { Text, MenuSection, MenuItem } from '@blockcode/core';
import styles from './menu-bar.module.css';

import checkIcon from './icons/icon-check.svg';

export function ViewMenu({ ExtendedMenu }) {
  const autoDisplayPanel = useSignal(true);

  useEffect(() => {
    autoDisplayPanel.value = getAutoDisplayPanel() ?? true;
  }, []);

  const handleAutoDisplayPanel = useCallback(() => {
    autoDisplayPanel.value = !autoDisplayPanel.value;
    setAutoDisplayPanel(autoDisplayPanel.value);
  }, []);

  return (
    <>
      <MenuSection>
        <MenuItem
          className={styles.menuItem}
          hotkey={[Keys.CONTROL, Keys.D1]}
          // onClick={}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: false,
            })}
            src={checkIcon}
          />
          <Text
            id="gui.menubar.view.log"
            defaultMessage="Log panel"
          />
        </MenuItem>

        <MenuItem
          className={styles.menuItem}
          hotkey={[Keys.CONTROL, Keys.D2]}
          // onClick={}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: false,
            })}
            src={checkIcon}
          />
          <Text
            id="gui.menubar.view.serial"
            defaultMessage="Serial panel"
          />
        </MenuItem>

        <MenuItem
          disabled
          className={styles.menuItem}
          hotkey={[Keys.CONTROL, Keys.D3]}
          // onClick={}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: false,
            })}
            src={checkIcon}
          />
          <Text
            id="gui.menubar.view.files"
            defaultMessage="Files panel"
          />
        </MenuItem>
      </MenuSection>

      {ExtendedMenu && <ExtendedMenu itemClassName={styles.menuItem} />}

      <MenuSection>
        <MenuItem
          className={classNames(styles.menuItem, styles.blankCheckItem)}
          label={
            autoDisplayPanel.value ? (
              <Text
                id="gui.menubar.view.closeAutoDisplayPanel"
                defaultMessage="Turn off auto display panel"
              />
            ) : (
              <Text
                id="gui.menubar.view.openAutoDisplayPanel"
                defaultMessage="Turn on auto display panel"
              />
            )
          }
          onClick={handleAutoDisplayPanel}
        />
      </MenuSection>
    </>
  );
}
