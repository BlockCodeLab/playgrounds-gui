import { useCallback } from 'preact/hooks';
import { useComputed } from '@preact/signals';
import { keyMirror, classNames } from '@blockcode/utils';
import { useAppContext, setAppState, setAlert, logger, Box, Button, Text } from '@blockcode/core';
import { LogsPanel } from './logs-panel';
import { SerialPanel } from './serial-panel';

import styles from './panel-box.module.css';
import logsIcon from './icons/icon-logs.svg';
import serialIcon from './icons/icon-serial.svg';
import filesIcon from './icons/icon-files.svg';
import copyIcon from './icons/icon-copy.svg';
import cleanIcon from './icons/icon-clean.svg';

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
      buttons={[
        panelId === PanelBoxes.Logs && {
          icon: copyIcon,
          label: (
            <Text
              id="gui.panelBox.logsCopy"
              defaultMessage="Copy"
            />
          ),
          async onClick() {
            let logs = logger.logs.join('\r\n');
            try {
              logs = logs.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
              await navigator.clipboard.writeText(logs);
              setAlert(
                {
                  type: 'success',
                  message: (
                    <Text
                      id="gui.alert.logsCopied"
                      defaultMessage="Logs copied to clipboard"
                    />
                  ),
                },
                2000,
              );
            } catch (err) {
              setAlert(
                {
                  type: 'warn',
                  message: (
                    <Text
                      id="gui.alert.logsCopyFailed"
                      defaultMessage="Failed to copy logs to clipboard"
                    />
                  ),
                },
                2000,
              );
            }
          },
        },
        panelId === PanelBoxes.Serial && {
          icon: cleanIcon,
          label: (
            <Text
              id="gui.panelBox.serialClean"
              defaultMessage="Clean"
            />
          ),
          onClick() {
            setAppState('terminalCache', null);
          },
        },
        // panelId === PanelBoxes.Files && {},
      ].filter(Boolean)}
      onClose={onClose}
    >
      {panelId === PanelBoxes.Logs && <LogsPanel />}
      {panelId === PanelBoxes.Serial && <SerialPanel />}
    </Box>
  );
}
