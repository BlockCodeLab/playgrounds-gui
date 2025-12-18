import { useCallback, useEffect, useErrorBoundary } from 'preact/hooks';
import { batch, useComputed, useSignal, useSignalEffect } from '@preact/signals';
import { isElectron, classNames, keyMirror, openProjectFromURL, getAutoDisplayPanel } from '@blockcode/utils';
import {
  useAppContext,
  useLocalesContext,
  useProjectContext,
  translate,
  maybeTranslate,
  showSplash,
  hideSplash,
  openPromptModal,
  closePromptModal,
  openLayout,
  closeLayout,
  openTab,
  openProject,
  closeProject,
  setAlert,
  delAlert,
  setAppState,
} from '@blockcode/core';
import { mergeMenus } from '../menu-bar/merge-menus';

import { Text } from '@blockcode/core';
import { Alerts } from '../alerts/alerts';
import { ConnectionModal } from '../connection-modal/connection-modal';
import { Home } from '../home/home';
import { MenuBar } from '../menu-bar/menu-bar';
import { Pane } from '../pane/pane';
import { PromptModal } from '../prompt-modal/prompt-modal';
import { InputsPromptModal } from '../prompt-modal/inputs-prompt-modal';
import { Splash } from '../splash/splash';
import { Tabs, TabLabel, TabPanel } from '../tabs/tabs';
import { TutorialBox } from '../tutorial-box/tutorial-box';
import { TutorialLibrary } from '../tutorial-library/tutorial-library';
import { UserStorage } from '../user-storage/user-storage';
import { PanelBox } from '../panel-box/panel-box';
import styles from './layout.module.css';

import getEditors from '../../lib/get-editors';

const DeviceType = keyMirror({
  Bluetooth: null,
  SerialPort: null,
});

export function Layout() {
  // 捕获内部错误
  //
  const [error] = useErrorBoundary();

  // 多语言翻译
  //
  const { language } = useLocalesContext();

  // 应用布局
  //
  const app = useAppContext();

  // 设置语言
  useEffect(() => {
    document.title = translate('gui.name', 'BlockCode Playgrounds');
    if (BETA) {
      document.title += ' [BETA]';
    }
  }, [language.value]);

  // 边栏
  const docks = useComputed(() => {
    const result = {};
    app.docks.value?.forEach((dock) => {
      if (dock.expand === 'bottom') {
        result.paneLabel = dock.label;
        result.PaneContent = dock.Content;
      } else if (dock.expand === 'left') {
        result.LeftDockContent = dock.Content;
      } else {
        result.RightDockContent = dock.Content;
      }
    });
    return result;
  });
  const { LeftDockContent, RightDockContent, PaneContent } = docks.value;

  // 根据侧边栏和底边栏调整标签页样式
  const tabPanelClass = classNames({
    [styles.tabPanelNoLeft]: !LeftDockContent,
    [styles.tabPanelNoRight]: !RightDockContent,
    [styles.tabPanelNoBottom]: !PaneContent,
  });

  // Electron 蓝牙/串口扫描
  //
  const foundDevices = useSignal(null);
  useEffect(() => {
    if (isElectron) {
      window.electron.serial.onScan((devices) => {
        foundDevices.value = devices && {
          devices,
          type: DeviceType.SerialPort,
        };
      });
      window.electron.bluetooth.onScan((devices) => {
        foundDevices.value = devices && {
          devices,
          type: DeviceType.Bluetooth,
        };
      });
    }
  }, []);

  const handleConnectionSearch = () => {};

  const handleConnectionClose = useCallback(() => {
    if (isElectron) {
      if (foundDevices.value.type === DeviceType.SerialPort) {
        window.electron.serial.cancel();
      }
      if (foundDevices.value.type === DeviceType.Bluetooth) {
        window.electron.bluetooth.cancel();
      }
      foundDevices.value = null;
    }
  }, []);

  const handleConnectionConnect = useCallback((portId) => {
    if (isElectron) {
      if (foundDevices.value.type === DeviceType.SerialPort) {
        window.electron.serial.connect(portId);
      }
      if (foundDevices.value.type === DeviceType.Bluetooth) {
        window.electron.bluetooth.connect(portId);
      }
    }
  }, []);

  // 获取所有编辑器的名称
  //
  const editorsInfos = useSignal({});
  useSignalEffect(async () => {
    let result = await getEditors();
    result = result.map((editor) => [
      editor.id,
      {
        name: editor.name,
        version: editor.version,
      },
    ]);
    editorsInfos.value = Object.fromEntries(result);
  });

  // 关闭项目和布局
  const closeProjectAndLayout = useCallback(() => {
    batch(() => {
      // 如果有硬件连接，断开
      app.appState.value?.device?.disconnect();
      setAppState('device', null);
      closeProject();
      closeLayout();
    });
  }, []);

  // 打开项目
  const openProjectWithSplash = useCallback((data) => {
    batch(() => {
      showSplash();
      openProject(
        Object.assign(JSON.parse(JSON.stringify(data)), {
          fileId: data.fileId ?? data.files?.[0]?.id,
        }),
      );
      openTab(0);
    });
  }, []);

  // 教程显示
  //
  const tutorialLibraryVisible = useSignal(false);
  const tutorialId = useSignal(null);

  const handleOpenTutorialLibrary = useCallback(() => {
    batch(() => {
      tutorialId.value = null;
      tutorialLibraryVisible.value = true;
    });
  }, []);

  const handleOpenTutorial = useCallback((id) => {
    const lesson = app.tutorials.value.lessons[id];
    batch(async () => {
      if (lesson.project) {
        setAlert('importing', { id });
        const example = await openProjectFromURL(lesson.project);
        delAlert(id);
        openProjectWithSplash(example);
      }
      tutorialId.value = id;
      tutorialLibraryVisible.value = false;
    });
  }, []);

  // 项目管理
  //
  const { meta, key, modified } = useProjectContext();

  // 首页显示
  // 当前项目没有元数据显示
  const homeVisible = useComputed(() => !meta.value);

  // 返回首页
  const handleBackHome = useCallback(() => {
    // 检查项目是否保存
    if (modified.value) {
      openPromptModal({
        title: (
          <Text
            id="gui.library.projects.notSaved"
            defaultMessage="Not saved"
          />
        ),
        label: (
          <Text
            id="gui.library.projects.close"
            defaultMessage="Close current project?"
          />
        ),
        onSubmit: closeProjectAndLayout,
      });
    } else {
      closeProjectAndLayout();
    }
  }, []);

  // 打开新的项目并检查编辑器
  const openProjectViaEditor = useCallback((projData, editorId) => {
    if (editorId !== projData.meta.editor) {
      openPromptModal({
        label: (
          <Text
            id="gui.library.projects.errorEditor"
            defaultMessage='This project is not currently editor creation, please switch to "{editor}" and open it.'
            editor={maybeTranslate(editorsInfos.value[projData.meta.editor]?.name)}
          />
        ),
        redStyle: true,
      });
      return;
    }

    // 避免重复打开同一文件
    if (key.value === projData.key) return;

    // 检查项目是否保存
    if (modified.value) {
      openPromptModal({
        title: (
          <Text
            id="gui.library.projects.notSaved"
            defaultMessage="Not saved"
          />
        ),
        label: (
          <Text
            id="gui.library.projects.replace"
            defaultMessage="Replace contents of the current project?"
          />
        ),
        onSubmit: () => openProjectWithSplash(projData),
      });
    } else {
      openProjectWithSplash(projData);
    }
  }, []);

  // 打开编辑器事件
  const handleOpenEditor = useCallback(async (editorId, projData) => {
    batch(() => {
      closeProjectAndLayout();
      showSplash();
    });

    // 载入本地编辑器
    let moduleName = editorId;
    const localEditors = window.electron?.getLocalEditors();
    if (localEditors?.[editorId]?.main) {
      moduleName = localEditors[editorId].main;
    }

    let editor;
    try {
      editor = (await import(moduleName)).default;
    } catch (err) {
      if (DEBUG) {
        console.error(err);
      }

      openPromptModal({
        label: (
          <Text
            id="gui.library.projects.notFoundEditor"
            defaultMessage='Not Found the "{editor}" Editor.'
            editor={editorId}
          />
        ),
        redStyle: true,
      });
      hideSplash();
      return;
    }

    const meta = {
      editor: editorId,
      version: editorsInfos.value[editorId]?.version,
    };

    if (!projData) {
      projData = JSON.parse(JSON.stringify(await editor.onNew()));
    }

    if (!projData.meta) {
      projData.meta = meta;
    }
    if (!projData.meta.editor) {
      projData.meta.editor = editorId;
      projData.meta.version = meta.version;
    }

    const layout = {
      menuItems: mergeMenus(editor, meta, openProjectViaEditor),
      tabs: editor.tabs,
      docks: editor.docks,
      tutorials: window.electron?.getLocalTutorials(editorId, language.value) ?? editor.tutorials, // 优先本地离线教程
    };

    batch(() => {
      openLayout(layout);
      openProjectViaEditor(projData, editorId);
    });
  }, []);

  // 打开项目事件
  const handleOpenProject = useCallback((projData) => {
    if (meta.value?.editor !== projData.meta.editor) {
      closeProjectAndLayout();
      handleOpenEditor(projData.meta.editor, projData);
      return;
    }
    openProjectViaEditor(projData, meta.value.editor);
  }, []);

  // 自动显示日志面板
  useEffect(() => {
    if (meta.value?.editor) {
      const autoDisplay = getAutoDisplayPanel(meta.value.editor);
      if (autoDisplay) {
        setAppState('panelBoxId', 'Logs');
      }
    } else {
      setAppState('panelBoxId', null);
    }
  }, [meta.value?.editor]);

  return (
    <>
      {(app.splashVisible.value || error) && <Splash error={error} />}

      <Alerts items={app.alerts.value} />

      <MenuBar
        className={styles.menuBarPosition}
        showHomeButton={!homeVisible.value}
        onRequestHome={handleBackHome}
        onOpenTutorialLibrary={handleOpenTutorialLibrary}
      />

      <div className={styles.bodyWrapper}>
        <div className={styles.workspaceWrapper}>
          {LeftDockContent && (
            <div className={styles.sidebarWrapper}>
              <LeftDockContent />
            </div>
          )}

          <div className={styles.editorWrapper}>
            <Tabs
              id={styles.tabsWrapper}
              className={styles.tabsWrapper}
            >
              {app.tabs.value?.map(({ Content: TabContent, ...tab }, index) => (
                <>
                  <TabLabel
                    key={index}
                    name={index}
                    disabled={tab.disabled}
                    checked={index === app.tabIndex.value}
                    onSelect={() => openTab(index)}
                  >
                    <img src={tab.icon} />
                    {tab.label}
                  </TabLabel>
                  <TabPanel
                    key={index}
                    name={index}
                    className={tabPanelClass}
                  >
                    {(index === 0 || app.tabIndex.value === index) && TabContent && <TabContent />}
                  </TabPanel>
                </>
              ))}
            </Tabs>

            {PaneContent && (
              <Pane
                id={styles.paneWrapper}
                className={styles.paneWrapper}
                title={docks.value.paneLabel}
                right={!RightDockContent}
                left={!LeftDockContent}
              >
                <PaneContent />
              </Pane>
            )}
          </div>

          {RightDockContent && (
            <div className={styles.sidebarWrapper}>
              <RightDockContent />
            </div>
          )}
        </div>
      </div>

      {app.appState.value?.panelBoxId && (
        <PanelBox
          panelId={app.appState.value.panelBoxId}
          onPanelChange={useCallback((id) => setAppState('panelBoxId', id), [])}
          onClose={useCallback(() => setAppState('panelBoxId', null), [])}
        />
      )}

      {foundDevices.value && (
        <ConnectionModal
          title={meta.value.deviceName}
          icon={meta.value.deviceIcon}
          devices={foundDevices.value.devices}
          onClose={handleConnectionClose}
          onConnect={handleConnectionConnect}
        />
      )}

      {tutorialId.value && (
        <TutorialBox
          tutorialId={tutorialId.value}
          onOpenTutorial={handleOpenTutorial}
          onBack={handleOpenTutorialLibrary}
          onClose={() => (tutorialId.value = null)}
        />
      )}

      {tutorialLibraryVisible.value && (
        <TutorialLibrary
          onOpenTutorial={handleOpenTutorial}
          onClose={useCallback(() => (tutorialLibraryVisible.value = false), [])}
        />
      )}

      {homeVisible.value && (
        <Home
          onOpenEditor={handleOpenEditor}
          onOpenProject={handleOpenProject}
        />
      )}

      {app.userStorageVisible.value && <UserStorage onOpenProject={handleOpenProject} />}

      {app.prompt.value &&
        (app.prompt.value.inputItems ? (
          <InputsPromptModal
            title={app.prompt.value.title}
            content={app.prompt.value.content}
            inputItems={app.prompt.value.inputItems}
            onClose={closePromptModal}
            onSubmit={app.prompt.value.onSubmit}
          />
        ) : (
          <PromptModal
            title={app.prompt.value.title}
            label={app.prompt.value.label}
            content={app.prompt.value.content}
            redStyle={app.prompt.value.redStyle}
            onClose={closePromptModal}
            onSubmit={app.prompt.value.onSubmit}
          >
            {app.prompt.value.body}
          </PromptModal>
        ))}
    </>
  );
}
