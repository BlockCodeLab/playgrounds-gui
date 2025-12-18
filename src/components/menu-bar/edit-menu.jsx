import { useCallback, useEffect } from 'preact/hooks';
import { batch, useSignal, useComputed } from '@preact/signals';
import { isMac, setCompactBlock, getCompactBlock } from '@blockcode/utils';
import { useProjectContext, Keys, setMeta } from '@blockcode/core';

import { Text, MenuSection, MenuItem } from '@blockcode/core';
import styles from './menu-bar.module.css';

export function EditMenu({
  enableCoding,
  enableCompactBlock,
  onUndo,
  onRedo,
  onEnableUndo,
  onEnableRedo,
  ExtendedMenu,
}) {
  const { meta, key, fileId, modified } = useProjectContext();

  const disabledUndo = useSignal(true);

  const disabledRedo = useSignal(true);

  const isCompactBlock = useComputed(() => meta.value.compactBlock ?? getCompactBlock());

  useEffect(() => {
    batch(() => {
      disabledUndo.value = !onEnableUndo();
      disabledRedo.value = !onEnableRedo();
    });
  }, [key.value, fileId.value, modified.value]);

  const handleManualCoding = useCallback(() => {
    setMeta('manualCoding', !meta.value.manualCoding);
  }, []);

  const handleCompactBlock = useCallback(() => {
    const newCompactBlock = !isCompactBlock.value;
    setMeta('compactBlock', newCompactBlock);
    setCompactBlock(newCompactBlock);
  }, []);

  return (
    <>
      <MenuSection>
        <MenuItem
          disabled={disabledUndo.value}
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.edit.undo"
              defaultMessage="Undo"
            />
          }
          hotkey={[isMac ? Keys.COMMAND : Keys.CONTROL, Keys.Z]}
          onClick={onUndo}
        />

        <MenuItem
          disabled={disabledRedo.value}
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.edit.redo"
              defaultMessage="Redo"
            />
          }
          hotkey={isMac ? [Keys.SHIFT, Keys.COMMAND, Keys.Z] : [Keys.CONTROL, Keys.Y]}
          onClick={onRedo}
        />
      </MenuSection>

      {(enableCoding || enableCompactBlock) && (
        <MenuSection>
          {enableCompactBlock && (
            <MenuItem
              className={styles.menuItem}
              label={
                isCompactBlock.value ? (
                  <Text
                    id="gui.menubar.edit.closeCompactBlock"
                    defaultMessage="Turn off Compact Block"
                  />
                ) : (
                  <Text
                    id="gui.menubar.edit.openCompactBlock"
                    defaultMessage="Turn on Compact Block"
                  />
                )
              }
              onClick={handleCompactBlock}
            />
          )}

          {enableCoding && (
            <MenuItem
              className={styles.menuItem}
              label={
                meta.value.manualCoding ? (
                  <Text
                    id="gui.menubar.edit.closeManualCoding"
                    defaultMessage="Turn off Coding Mode"
                  />
                ) : (
                  <Text
                    id="gui.menubar.edit.openManualCoding"
                    defaultMessage="Turn on Coding Mode"
                  />
                )
              }
              onClick={handleManualCoding}
            />
          )}
        </MenuSection>
      )}

      {ExtendedMenu && <ExtendedMenu itemClassName={styles.menuItem} />}
    </>
  );
}
