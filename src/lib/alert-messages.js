import { addAlertConfig, Text, Spinner } from '@blockcode/core';

// 添加消息模版
//

// 导入
addAlertConfig('importing', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.importing"
      defaultMessage="Importing..."
    />
  ),
});

// 导出失败
addAlertConfig('importError', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.importError"
      defaultMessage="Failed import."
    />
  ),
});

// 导出
addAlertConfig('exporting', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.exporting"
      defaultMessage="Exporting..."
    />
  ),
});

// 导出完成
addAlertConfig('exportCompleted', {
  icon: null,
  message: (
    <Text
      id="gui.alert.exportCompleted"
      defaultMessage="Export completed."
    />
  ),
});

// 导出取消
addAlertConfig('exportAbortError', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.exportAbortError"
      defaultMessage="Abort exporting."
    />
  ),
});

// 导出失败
addAlertConfig('exportError', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.exportError"
      defaultMessage="Failed export."
    />
  ),
});

// 下载中
addAlertConfig('downloading', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.downloading"
      defaultMessage="Downloading...{progress}%"
    />
  ),
});

// 下载完成
addAlertConfig('downloadCompleted', {
  icon: null,
  message: (
    <Text
      id="gui.alert.downloadCompleted"
      defaultMessage="Download completed."
    />
  ),
});

// 下载失败
addAlertConfig('downloadError', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.downloadError"
      defaultMessage="Download failed."
    />
  ),
});

// 正在连接
addAlertConfig('connecting', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.connecting"
      defaultMessage="Connecting..."
    />
  ),
});

// 已经连接
addAlertConfig('connected', {
  icon: null,
  message: (
    <Text
      id="gui.alert.connected"
      defaultMessage="Connected."
    />
  ),
});

// 连接取消
addAlertConfig('connectionCancel', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.connectionCancel"
      defaultMessage="Connection cancel."
    />
  ),
});

// 设备未响应
addAlertConfig('connectionBusy', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.connectionBusy"
      defaultMessage="Device not respond."
    />
  ),
});

// 连接失败
addAlertConfig('connectionError', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.connectionError"
      defaultMessage="Connection error or connection was lost."
    />
  ),
});

// 清除固件
addAlertConfig('erasing', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.erasing"
      defaultMessage="Erasing..."
    />
  ),
});

// 还原固件
addAlertConfig('restoring', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.restoring"
      defaultMessage="Firmware restoring...{progress}%"
    />
  ),
});

// 恢复固件
addAlertConfig('recovering', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.recovering"
      defaultMessage="Recovering..."
    />
  ),
});

// 还原完成
addAlertConfig('restoreCompleted', {
  icon: null,
  message: (
    <Text
      id="gui.alert.restoreCompleted"
      defaultMessage="Firmware resotre completed! Now press RESET key"
    />
  ),
});

// 编译
addAlertConfig('compiling', {
  icon: <Spinner level="success" />,
  message: (
    <Text
      id="gui.alert.compiling"
      defaultMessage="Compiling..."
    />
  ),
});

// 编译成功
addAlertConfig('compileCompleted', {
  icon: null,
  message: (
    <Text
      id="gui.alert.compileCompleted"
      defaultMessage="Compilation completed."
    />
  ),
});

// 编译失败
addAlertConfig('compileError', {
  icon: null,
  mode: 'warn',
  message: (
    <Text
      id="gui.alert.compileError"
      defaultMessage="Compilation error."
    />
  ),
});

addAlertConfig('reseting', {
  icon: null,
  message: (
    <Text
      id="gui.alert.reseting"
      defaultMessage="Reseting..."
    />
  ),
});
