import { useComputed } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { classNames, isMac } from '@blockcode/utils';
import { useLocalesContext, useAppContext, setLanguage, translate, setMacosMenuBarStyled } from '@blockcode/core';

import { Menu, MenuItem, Tooltip } from '@blockcode/core';
import { MainMenu } from './main-menu';
import { MenuLabel } from './menu-label';
import { TutorialsButton } from './tutorials-button';
import { ProjectTitleInput } from './project-title-input';
import styles from './menu-bar.module.css';

import checkIcon from './icons/icon-check.svg';
import languageIcon from './icons/icon-language.svg';
import dropdownCaret from './icons/icon-dropdown-caret.svg';
import homeIcon from './icons/icon-home.svg';

export function MenuBar({ className, showHomeButton, onRequestHome, onOpenTutorialLibrary }) {
  const { language, languageNames } = useLocalesContext();

  const { barItems, menuItems, tutorials, macosMenuBarStyled } = useAppContext();

  const leftItems = useComputed(() => barItems.value?.filter((item) => item.align !== 'right'));
  const rightItems = useComputed(() => barItems.value?.filter((item) => item.align === 'right'));

  // Electron
  useEffect(() => {
    window.electron?.onChangeFullscreen((full) => setMacosMenuBarStyled(isMac && !full));
  }, []);

  return (
    <div className={classNames(styles.menuBar, className)}>
      <div
        className={classNames(styles.mainMenu, {
          [styles.electron]: macosMenuBarStyled.value,
        })}
      >
        <MainMenu id={styles.mainMenu}>
          <MenuLabel
            className={classNames(styles.menuBarItem, styles.languageLabel)}
            name="language-selector"
          >
            <img
              className={styles.languageIcon}
              src={languageIcon}
            />
            <img src={dropdownCaret} />
          </MenuLabel>
          <Menu
            className={styles.menu}
            name="language-selector"
          >
            {Array.from(languageNames.entries()).map(([lang, names]) => (
              <MenuItem
                key={lang}
                className={styles.menuItem}
                onClick={() => setLanguage(lang)}
              >
                <img
                  className={classNames(styles.checkIcon, {
                    [styles.checked]: language.value === lang,
                  })}
                  src={checkIcon}
                />
                {names.languageName}
              </MenuItem>
            ))}
          </Menu>

          {menuItems.value &&
            menuItems.value.map(({ icon, label, Menu: MenuContent }, index) => (
              <>
                <MenuLabel
                  className={styles.menuBarItem}
                  name={index}
                  key={index}
                >
                  {typeof icon === 'string' ? <img src={icon} /> : icon}
                  {label}
                </MenuLabel>
                <Menu
                  className={styles.menu}
                  name={index}
                  key={index}
                >
                  {
                    <MenuContent
                      className={styles.menu}
                      itemClassName={styles.menuItem}
                    />
                  }
                </Menu>
              </>
            ))}
        </MainMenu>

        {tutorials.value && <TutorialsButton onClick={onOpenTutorialLibrary} />}

        {showHomeButton && (
          <ProjectTitleInput
            placeholder={translate('gui.menubar.titlePlaceholder', 'Project title here')}
            defaultValue={translate('gui.project.name', 'BlockCode Project')}
          />
        )}

        {leftItems.value?.length > 0 &&
          leftItems.value.map(({ Label, ...item }) =>
            item.tooltip ? (
              <Tooltip
                placement={item.tooltipPlacement ?? 'bottom'}
                content={item.tooltip}
              >
                {Label ? (
                  <Label className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)} />
                ) : (
                  <div className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)}>
                    {item.label}
                  </div>
                )}
              </Tooltip>
            ) : Label ? (
              <Label className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)} />
            ) : (
              <div
                className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)}
                onClick={item.onClick}
              >
                {item.label}
              </div>
            ),
          )}
      </div>

      <div className={styles.rightMenu}>
        {rightItems.value?.length > 0 &&
          rightItems.value.map(({ Label, ...item }) =>
            item.tooltip ? (
              <Tooltip
                placement={item.tooltipPlacement ?? 'bottom'}
                content={item.tooltip}
              >
                {Label ? (
                  <Label className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)} />
                ) : (
                  <div className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)}>
                    {item.label}
                  </div>
                )}
              </Tooltip>
            ) : Label ? (
              <Label className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)} />
            ) : (
              <div
                className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)}
                onClick={item.onClick}
              >
                {item.label}
              </div>
            ),
          )}

        {showHomeButton && (
          <div
            className={classNames(styles.menuBarItem, styles.menuBarIcon, styles.hoverable)}
            onClick={onRequestHome}
          >
            <img src={homeIcon} />
          </div>
        )}
      </div>
    </div>
  );
}
