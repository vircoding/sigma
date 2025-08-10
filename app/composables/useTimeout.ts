import { useTimer as timerHook } from 'vue-timer-hook';

export default function (timeout: number) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + timeout);

  const timer = timerHook(time.getTime(), false);

  return {
    ...timer,
    stopTime: time.getTime(),
    restart() {
      const time = new Date();
      time.setSeconds(time.getSeconds() + timeout);
      this.stopTime = time.getTime();
      timer.restart(time.getTime(), true);
    },
  };
}
