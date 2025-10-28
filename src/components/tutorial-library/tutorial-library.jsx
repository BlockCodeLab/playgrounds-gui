import { useComputed } from '@preact/signals';
import { useAppContext, Text, Library } from '@blockcode/core';

const defaultTitle = (
  <Text
    id="gui.library.tutorials.tutorial"
    defaultMessage="Choose a tutorial"
  />
);

export function TutorialLibrary({ onOpenTutorial, onClose }) {
  const { tutorials } = useAppContext();

  const data = useComputed(() => {
    const result = Object.entries(tutorials.value.lessons);
    return result.map(([id, lesson]) => ({
      title: lesson.title,
      image: lesson.image,
      tags: lesson.tags,
      onSelect: () => onOpenTutorial(id),
    }));
  });

  return (
    <Library
      featured
      items={data.value}
      title={tutorials.value.title || defaultTitle}
      filterable={tutorials.value.tags}
      tags={tutorials.value.tags}
      onClose={onClose}
    />
  );
}
