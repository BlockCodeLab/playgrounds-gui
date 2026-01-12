import { useCallback, useEffect } from 'preact/hooks';
import { batch, useSignal, useComputed } from '@preact/signals';
import { isMac, MathUtils, setCompactBlock, getCompactBlock, getBlockSize, setBlockSize } from '@blockcode/utils';
import { useAppContext, useProjectContext, Keys, setAppState, setMeta } from '@blockcode/core';
import { BlocksDefaultOptions } from '@blockcode/blocks';

import { Text, MenuSection, MenuItem } from '@blockcode/core';
import styles from './menu-bar.module.css';

const startScale = BlocksDefaultOptions.zoom.startScale;
const maxScale = MathUtils.round(startScale + 0.2, 1);
const minScale = MathUtils.round(startScale - 0.2, 1);

export function EditMenu({ enableCoding, enableBlockStyle, onUndo, onRedo, onEnableUndo, onEnableRedo, ExtendedMenu }) {
  const { appState } = useAppContext();

  const { meta, key, fileId, modified } = useProjectContext();

  const disabledUndo = useSignal(true);

  const disabledRedo = useSignal(true);

  const isCompactBlock = useComputed(() => meta.value.compactBlock ?? getCompactBlock());

  const blockSize = useComputed(() => appState.value?.blockSize ?? getBlockSize() ?? startScale);

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

  const handleActualBlock = useCallback(() => {
    setAppState('blockSize', startScale);
    setBlockSize(blockSize.value);
  }, []);

  const handleLargerBlock = useCallback(() => {
    if (blockSize.value < maxScale) {
      const newSize = MathUtils.round(blockSize.value + 0.1, 1);
      setAppState('blockSize', newSize);
      setBlockSize(newSize);
    }
  }, []);

  const handleSmallerBlock = useCallback(() => {
    if (blockSize.value > minScale) {
      const newSize = MathUtils.round(blockSize.value - 0.1, 1);
      setAppState('blockSize', newSize);
      setBlockSize(newSize);
    }
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

      {enableBlockStyle && (
        <MenuSection>
          <MenuItem
            disabled={blockSize.value === startScale}
            className={styles.menuItem}
            label={
              <Text
                id="gui.menubar.edit.blockActual"
                defaultMessage="Actual Size Blocks"
              />
            }
            onClick={handleActualBlock}
          />
          <MenuItem
            disabled={blockSize.value >= maxScale}
            className={styles.menuItem}
            label={
              <Text
                id="gui.menubar.edit.blockLarger"
                defaultMessage="Larger Size Blocks"
              />
            }
            onClick={handleLargerBlock}
          />
          <MenuItem
            disabled={blockSize.value <= minScale}
            className={styles.menuItem}
            label={
              <Text
                id="gui.menubar.edit.blockSmaller"
                defaultMessage="Smaller Size Blocks"
              />
            }
            onClick={handleSmallerBlock}
          />
        </MenuSection>
      )}

      {(enableCoding || enableBlockStyle) && (
        <MenuSection>
          {enableBlockStyle && (
            <MenuItem
              className={styles.menuItem}
              label={
                isCompactBlock.value !== false ? (
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

      {ExtendedMenu && (
        <ExtendedMenu
          className={styles.menu}
          itemClassName={styles.menuItem}
        />
      )}
    </>
  );
}
