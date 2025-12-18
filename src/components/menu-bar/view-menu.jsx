import { useEffect, useCallback } from 'preact/hooks';
import { useComputed, useSignal } from '@preact/signals';
import { classNames, getAutoDisplayPanel, setAutoDisplayPanel } from '@blockcode/utils';
import { useAppContext, useProjectContext, setAppState, Keys, Text, MenuSection, MenuItem } from '@blockcode/core';
import { PanelBoxes } from '../panel-box/panel-box';

import styles from './menu-bar.module.css';
import checkIcon from './icons/icon-check.svg';

export function ViewMenu({ enableFiles, ExtendedMenu }) {
  const { appState } = useAppContext();

  const { meta } = useProjectContext();

  const autoDisplayPanel = useSignal(getAutoDisplayPanel(meta.value.editor));

  const panelBoxId = useComputed(() => appState.value?.panelBoxId);

  const changeView = useCallback(
    (view) => () => {
      if (view === panelBoxId.value) {
        view = null;
      }
      setAppState('panelBoxId', view);
    },
    [],
  );

  const handleAutoDisplayPanel = useCallback(() => {
    autoDisplayPanel.value = !autoDisplayPanel.value;
    setAutoDisplayPanel(meta.value.editor, autoDisplayPanel.value);
  }, []);

  return (
    <>
      <MenuSection>
        <MenuItem
          className={styles.menuItem}
          hotkey={[Keys.CONTROL, Keys.D1]}
          onClick={changeView(PanelBoxes.Logs)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: panelBoxId.value === PanelBoxes.Logs,
            })}
            src={checkIcon}
          />
          <Text
            id="gui.menubar.view.log"
            defaultMessage="Log Panel"
          />
        </MenuItem>

        <MenuItem
          className={styles.menuItem}
          hotkey={[Keys.CONTROL, Keys.D2]}
          onClick={changeView(PanelBoxes.Serial)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: panelBoxId.value === PanelBoxes.Serial,
            })}
            src={checkIcon}
          />
          <Text
            id="gui.menubar.view.serial"
            defaultMessage="Serial Panel"
          />
        </MenuItem>

        {enableFiles && (
          <MenuItem
            disabled
            className={styles.menuItem}
            hotkey={[Keys.CONTROL, Keys.D3]}
            onClick={changeView(PanelBoxes.Files)}
          >
            <img
              className={classNames(styles.checkIcon, {
                [styles.checked]: panelBoxId.value === PanelBoxes.Files,
              })}
              src={checkIcon}
            />
            <Text
              id="gui.menubar.view.files"
              defaultMessage="Files Panel"
            />
          </MenuItem>
        )}
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
