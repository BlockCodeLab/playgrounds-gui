import { resolve, dirname } from 'node:path';
import { readEditors } from './read-editors' with { type: 'macro' };

const editors = readEditors();

export default function () {
  // 读取本地编辑器信息
  const locals = window.electron?.getLocalEditors() ?? [];
  return Promise.all(
    [].concat(
      Object.values(locals).map(async (editor) => {
        const { default: info } = await import(editor.info);
        info.id = editor.id;
        info.image = resolve(dirname(editor.info), info.image);
        return info;
      }),
      editors.map(async (id) => {
        const { default: info } = await import(`${id}/info`);
        info.id = id;
        return info;
      }),
    ),
  );
}
