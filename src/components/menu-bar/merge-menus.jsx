import { Text, MenuSection, MenuItem } from '@blockcode/core';
import { FileMenu } from './file-menu';
import { EditMenu } from './edit-menu';
import { ViewMenu } from './view-menu';

import fileIcon from './icons/icon-file.svg';
import editIcon from './icons/icon-edit.svg';
import viewIcon from './icons/icon-view.svg';

export function mergeMenus(editor, meta, onOpen) {
  const handleOpen = (projData) => onOpen(projData, meta.editor);

  const fileMenu = editor.menuItems?.find((item) => item.id === 'file');
  const editMenu = editor.menuItems?.find((item) => item.id === 'edit');
  const viewMenu = editor.menuItems?.find((item) => item.id === 'view');

  const handelNew = async () => {
    const projData = JSON.parse(JSON.stringify(await editor.onNew()));
    if (!projData.meta) {
      projData.meta = meta;
    }
    if (!projData.meta.editor) {
      projData.meta.editor = meta.editor;
      projData.meta.version = meta.version;
    }
    handleOpen(projData, meta.editor);
  };

  return [
    {
      icon: fileIcon,
      label: (
        <Text
          id="gui.menubar.file"
          defaultMessage="File"
        />
      ),
      Menu: () => (
        <FileMenu
          ExtendedMenu={fileMenu?.Menu}
          onNew={handelNew}
          onOpen={handleOpen}
          onSave={editor.onSave}
          onThumb={editor.onThumb}
        />
      ),
    },
    {
      icon: editIcon,
      label: (
        <Text
          id="gui.menubar.edit"
          defaultMessage="Edit"
        />
      ),
      Menu: () => (
        <EditMenu
          enableCoding={editMenu?.disabledCoding !== true}
          ExtendedMenu={editMenu?.Menu}
          onUndo={editor.onUndo}
          onRedo={editor.onRedo}
          onEnableUndo={editor.onEnableUndo}
          onEnableRedo={editor.onEnableRedo}
        />
      ),
    },
    viewMenu?.disabled !== true && {
      icon: viewIcon,
      label: (
        <Text
          id="gui.menubar.view"
          defaultMessage="View"
        />
      ),
      Menu: () => <ViewMenu ExtendedMenu={viewMenu?.Menu} />,
    },
  ]
    .concat(editor.menuItems?.filter((item) => !['file', 'edit', 'view'].includes(item.id)) ?? [])
    .filter(Boolean);
}
