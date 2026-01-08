import { useCallback } from 'preact/hooks';
import { batch } from '@preact/signals';
import {
  isElectron,
  isMac,
  putProject,
  openProjectFromComputer,
  saveProjectToComputer,
  sleepMs,
} from '@blockcode/utils';
import { useProjectContext, setAlert, openUserStorage, setFile, setModified, ModifyTypes, Keys } from '@blockcode/core';
import { loadedExtensions } from '@blockcode/blocks';

import { Text, MenuSection, MenuItem } from '@blockcode/core';
import styles from './menu-bar.module.css';

const savingAlert = (autoClose = false) =>
  setAlert(
    {
      message: (
        <Text
          id="gui.alert.saving"
          defaultMessage="Saving project..."
        />
      ),
    },
    autoClose,
  );

const savedAlert = (id, isComputer = false) =>
  setAlert(
    {
      id,
      message: isComputer ? (
        <Text
          id="gui.alert.savedComputer"
          defaultMessage="Saved to your computer."
        />
      ) : (
        <Text
          id="gui.alert.saved"
          defaultMessage="Saved to local storage."
        />
      ),
    },
    2000,
  );

const saveErrorAlert = (id, abort = false) =>
  setAlert(
    {
      id,
      mode: 'warn',
      message: abort ? (
        <Text
          id="gui.alert.saveAbortError"
          defaultMessage="Abort saving."
        />
      ) : (
        <Text
          id="gui.alert.saveError"
          defaultMessage="Failed save."
        />
      ),
    },
    abort ? 1000 : 2000,
  );

export function FileMenu({ onNew, onOpen, onSave, onThumb, ExtendedMenu }) {
  const { meta, key, name, files, assets } = useProjectContext();

  const getProjectData = useCallback(async () => {
    await sleepMs(0);

    // 过滤删除的监控
    for (let index in meta.value.monitors) {
      const monitor = meta.value.monitors[index];
      if (monitor.deleting) {
        meta.value.monitors.splice(index, 1);
      }
    }

    // 获取所有使用的扩展
    const extensions = [];

    const filteredFiles = files.value.map((file) => {
      extensions.push(file.extensions);
      return Object.fromEntries(
        // 排除不保存的数据
        Object.entries(file).filter(([key, value]) => {
          if (['xmlDom', 'script', 'extensions'].includes(key)) return false;
          if (!meta.value.manualCoding && key === 'content') return false;
          return true;
        }),
      );
    });

    if (meta.value.manualCoding) {
      console.log(extensions, loadedExtensions);
      extensions.push(Array.from(loadedExtensions.keys()));
    }
    console.log(extensions);

    // 移除扩展附件，因为每次重载扩展会自动加载
    const filteredAssets = assets.value?.filter((asset) => !asset.uri);

    const data = await onSave(filteredFiles, filteredAssets, meta.value);

    data.meta = Object.assign(data.meta ?? {}, {
      editor: meta.value.editor,
      version: meta.value.version,
      monitors: meta.value.monitors,
      extensions: Array.from(new Set(extensions.flat())).filter(Boolean),
      manualCoding: meta.value.manualCoding,
      compactBlock: meta.value.compactBlock,
      users: meta.value.users,
    });

    data.name = name.value;
    return data;
  }, [onSave]);

  // 保存到浏览器 IndexedDB
  // [TODO] 保存到服务器，获取 ID
  const handleSave = useCallback(async () => {
    const id = savingAlert();

    const data = await getProjectData();
    data.key = key.value;
    const newKey = await putProject(data, onThumb);

    batch(() => {
      // 保存成功后如果本地 Key 不一致则更新
      if (data.key !== newKey) {
        setFile({ key: newKey });
      }

      setModified(ModifyTypes.Saved);
    });

    savedAlert(id);
  }, [getProjectData]);

  // 保存项目到计算机本地文件夹
  const handleSaveToComputer = useCallback(async () => {
    const id = savingAlert(isElectron ? 1000 : false);

    const data = await getProjectData();
    const result = await saveProjectToComputer(data);

    if (isElectron) return;

    if (result.success) {
      savedAlert(id, true);
    } else if (result.error === 'AbortError') {
      saveErrorAlert(id, true);
    } else {
      saveErrorAlert(id);
    }
  }, [getProjectData]);

  // 从计算机打开项目
  // [TODO] 从服务器获取项目
  const handleOpenFromComputer = useCallback(async () => {
    const data = await openProjectFromComputer();
    await onOpen(data);
  }, [onOpen]);

  return (
    <>
      <MenuSection>
        <MenuItem
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.file.newProject"
              defaultMessage="New"
            />
          }
          hotkey={[isMac ? Keys.COMMAND : Keys.CONTROL, Keys.N]}
          onClick={onNew}
        />
      </MenuSection>

      <MenuSection>
        <MenuItem
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.file.openProject"
              defaultMessage="Open"
            />
          }
          hotkey={[isMac ? Keys.COMMAND : Keys.CONTROL, Keys.O]}
          onClick={openUserStorage}
        />

        <MenuItem
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.file.saveProject"
              defaultMessage="Save"
            />
          }
          hotkey={[isMac ? Keys.COMMAND : Keys.CONTROL, Keys.S]}
          onClick={handleSave}
        />
      </MenuSection>

      <MenuSection>
        <MenuItem
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.file.uploadProject"
              defaultMessage="Load from your computer"
            />
          }
          onClick={handleOpenFromComputer}
        />

        <MenuItem
          className={styles.menuItem}
          label={
            <Text
              id="gui.menubar.file.downloadProject"
              defaultMessage="save to your computer"
            />
          }
          onClick={handleSaveToComputer}
        />
      </MenuSection>

      {ExtendedMenu && (
        <ExtendedMenu
          className={styles.menu}
          itemClassName={styles.menuItem}
          onOpen={onOpen}
          onSave={getProjectData}
        />
      )}
    </>
  );
}
