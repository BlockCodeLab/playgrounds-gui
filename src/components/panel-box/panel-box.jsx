import { useCallback } from 'preact/hooks';
import { useComputed } from '@preact/signals';
import { keyMirror, classNames } from '@blockcode/utils';
import { useAppContext, Box, Button, Text } from '@blockcode/core';
import { LogsPanel } from './logs-panel';
import { SerialPanel } from './serial-panel';

import styles from './panel-box.module.css';
import logsIcon from './icons/icon-logs.svg';
import serialIcon from './icons/icon-serial.svg';
import filesIcon from './icons/icon-files.svg';

export const PanelBoxes = keyMirror({
  Logs: null,
  Serial: null,
  Files: null,
});

export function PanelBox({ panelId, onPanelChange, onClose }) {
  const { menuItems } = useAppContext();

  const viewMenu = useComputed(() => menuItems.value?.find((item) => item.id === 'view'));

  return (
    <Box
      header={
        <>
          <Button
            className={classNames(styles.button, {
              [styles.buttonActived]: panelId === PanelBoxes.Logs,
            })}
            onClick={useCallback(() => onPanelChange(PanelBoxes.Logs), [])}
          >
            <img
              className={styles.icon}
              src={logsIcon}
            />
            <Text
              id="gui.panelBox.logs"
              defaultMessage="Logs"
            />
          </Button>

          <Button
            className={classNames(styles.button, {
              [styles.buttonActived]: panelId === PanelBoxes.Serial,
            })}
            onClick={useCallback(() => onPanelChange(PanelBoxes.Serial), [])}
          >
            <img
              className={styles.icon}
              src={serialIcon}
            />
            <Text
              id="gui.panelBox.serial"
              defaultMessage="Serial"
            />
          </Button>

          {viewMenu.value?.options?.disabledFiles !== true && (
            <Button
              disabled
              className={classNames(styles.button, {
                [styles.buttonActived]: panelId === PanelBoxes.Files,
              })}
              onClick={useCallback(() => onPanelChange(PanelBoxes.Files), [])}
            >
              <img
                className={styles.icon}
                src={filesIcon}
              />
              <Text
                id="gui.panelBox.files"
                defaultMessage="Files"
              />
            </Button>
          )}
        </>
      }
      onClose={onClose}
    >
      {panelId === PanelBoxes.Logs && <LogsPanel />}
      {panelId === PanelBoxes.Serial && <SerialPanel />}
    </Box>
  );
}
