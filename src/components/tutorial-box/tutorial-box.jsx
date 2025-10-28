import { useRef, useEffect, useCallback } from 'preact/hooks';
import { batch, useComputed, useSignal } from '@preact/signals';
import { classNames } from '@blockcode/utils';
import { useAppContext, Text, Button } from '@blockcode/core';
import styles from './tutorial-box.module.css';

import tutorialsIcon from '../menu-bar/icons/icon-tutorials.svg';
import shrinkIcon from './icons/icon-shrink.svg';
import expandIcon from './icons/icon-expand.svg';
import closeIcon from './icons/icon-close.svg';
import arrowIcon from './icons/icon-arrow.svg';

export function TutorialBox({ tutorialId, onOpenTutorial, onBack, onClose }) {
  const ref = useRef();

  const { tutorials } = useAppContext();

  const pages = useSignal(null);

  const pageIndex = useSignal(-1);

  const expanded = useSignal(true);

  const data = useComputed(() => pages.value?.[pageIndex.value]);

  const handleNextPage = useCallback(() => {
    pageIndex.value = (pageIndex.value + 1) % pages.value.length;
  }, []);

  const handlePrevPage = useCallback(() => {
    pageIndex.value = (pageIndex.value - 1) % pages.value.length;
  }, []);

  useEffect(() => {
    const lesson = tutorials.value.lessons[tutorialId];
    if (!lesson) {
      onClose();
      return;
    }
    batch(() => {
      pages.value = [].concat(
        lesson.pages,
        lesson.next
          ? {
              next: lesson.next
                .filter((id) => tutorials.value.lessons[id])
                .map((id) => ({
                  id,
                  title: tutorials.value.lessons[id].title,
                  image: tutorials.value.lessons[id].image,
                })),
            }
          : [],
      );
      pageIndex.value = 0;
    });
  }, [tutorialId]);

  useEffect(() => {
    if (ref.current) {
      const tutorialBox = ref.current.parentElement;
      let posX;
      let posY;

      const drag = (e) => {
        const x = posX - e.clientX;
        const y = posY - e.clientY;
        posX = e.clientX;
        posY = e.clientY;
        tutorialBox.style.top = `${tutorialBox.offsetTop - y}px`;
        tutorialBox.style.left = `${tutorialBox.offsetLeft - x}px`;
      };

      const endDrag = () => {
        document.removeEventListener('pointerup', endDrag);
        document.removeEventListener('pointermove', drag);
      };

      ref.current.addEventListener('pointerdown', (e) => {
        posX = e.clientX;
        posY = e.clientY;
        document.addEventListener('pointerup', endDrag);
        document.addEventListener('pointermove', drag);
      });
    }
  }, [ref]);

  return (
    <div className={styles.tutorialBoxWrapper}>
      <div
        ref={ref}
        className={styles.tutorialCard}
      >
        <div className={styles.cardHeader}>
          <div
            className={styles.headerButton}
            onClick={onBack}
          >
            <img
              className={styles.buttonIcon}
              src={tutorialsIcon}
            />
            <Text
              id="gui.menubar.tutorials"
              defaultMessage="Tutorials"
            />
          </div>
          <div className={styles.stepList}>
            {pages.value?.map((_, i) => (
              <div
                key={i}
                className={classNames(styles.stepPip, {
                  [styles.actived]: i === pageIndex.value,
                })}
                onClick={() => (pageIndex.value = i)}
              ></div>
            ))}
          </div>
          <div className={styles.headerButtonGroup}>
            <div
              className={styles.headerButton}
              onClick={useCallback(() => (expanded.value = !expanded.value), [])}
            >
              {expanded.value ? (
                <>
                  <img
                    className={styles.buttonIcon}
                    src={shrinkIcon}
                  />
                  <Text
                    id="gui.tutorials.shrink"
                    defaultMessage="Shrink"
                  />
                </>
              ) : (
                <>
                  <img
                    className={styles.buttonIcon}
                    src={expandIcon}
                  />
                  <Text
                    id="gui.tutorials.expand"
                    defaultMessage="Expand"
                  />
                </>
              )}
            </div>
            <div
              className={styles.headerButton}
              onClick={onClose}
            >
              <img
                className={styles.buttonIcon}
                src={closeIcon}
              />
              <Text
                id="gui.tutorials.close"
                defaultMessage="Close"
              />
            </div>
          </div>
        </div>

        {expanded.value && data.value && (
          <div className={styles.cardBody}>
            {(data.value.title || data.value.next) && (
              <div className={styles.title}>
                {data.value.title || (
                  <Text
                    id="gui.tutorials.moreTry"
                    defaultMessage="More things to try!"
                  />
                )}
              </div>
            )}
            {data.value.image && (
              <img
                className={styles.image}
                src={data.value.image}
              />
            )}
            {data.value.text && <div className={styles.text}>{data.value.text}</div>}
            {data.value.next && (
              <>
                <div className={styles.more}>
                  {data.value.next.map((item) => (
                    <div
                      key={item.id}
                      className={styles.moreItem}
                      onClick={() => onOpenTutorial(item.id)}
                    >
                      <img
                        className={styles.moreItemImage}
                        src={item.image}
                      />
                      <div className={styles.moreItemName}>{item.title}</div>
                    </div>
                  ))}
                </div>
                <Button
                  className={styles.seeMoreButton}
                  onClick={onBack}
                >
                  <Text
                    id="gui.tutorials.seeMore"
                    defaultMessage="See more"
                  />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {expanded.value && pageIndex.value > 0 && (
        <>
          <div className={styles.leftPage}></div>
          <div
            className={styles.leftButton}
            onClick={handlePrevPage}
          >
            <img src={arrowIcon} />
          </div>
        </>
      )}

      {expanded.value && pages.value && pageIndex.value < pages.value.length - 1 && (
        <>
          <div className={styles.rightPage}></div>
          <div
            className={styles.rightButton}
            onClick={handleNextPage}
          >
            <img src={arrowIcon} />
          </div>
        </>
      )}
    </div>
  );
}
