import { balloons, textBalloons, setUserConfig, getUserConfig } from '@blockcode/utils';

const Colors = [
  // yellow
  '#FFEC37EE',
  // red
  '#F89640EE',
  //blue
  '#3BC0F0EE',
  // green
  '#B0CB47EE',
  // purple
  '#CF85B8EE',
  // lemon
  '#DBF505EE',
  // blue
  '#1754D8EE',
  // orange
  '#FA4616EE',
  // lime
  '#06D718EE',
  // magenta,
  '#FF008DEE',
];

export function eegg() {
  // 触发时间
  const startTime = new Date('2026-2-16 18:00:00 GMT+0800').getTime();
  const endTime = new Date('2026-2-23 23:59:59 GMT+0800').getTime();
  const time = new Date().getTime();
  if (time < startTime || time > endTime) return;

  // 重复触发过滤
  const eeggTriggered = getUserConfig('EeggTriggered') || false;
  if (eeggTriggered) return;
  setUserConfig('EeggTriggered', true);

  // 彩蛋效果
  balloons();
  textBalloons(
    ['Happy', 'Chinese', 'New', 'Year!'].map((text) => {
      const colorIndex = Math.floor(Math.random() * Colors.length);
      return {
        fontSize: 140,
        text: text.toUpperCase(),
        color: Colors[colorIndex],
      };
    }),
  );
}
