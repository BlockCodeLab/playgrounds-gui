import { pathResolve } from '@blockcode/utils';
import { readEditors } from './read-editors' with { type: 'macro' };

const editors = readEditors();

export default function () {
  // 读取本地编辑器信息
  const locals = window.electron?.getLocalEditors() ?? [];
  return Promise.all(
    [].concat(
      Object.values(locals).map(async (editor) => {
        const { default: info } = await import(editor.info);
        return {
          ...info,
          id: editor.id,
          image: pathResolve(editor.basepath, info.image),
        };
      }),
      editors.map(async (id) => {
        const { default: info } = await import(`${id}/info`);
        info.id = id;
        return info;
      }),
    ),
  );
}
