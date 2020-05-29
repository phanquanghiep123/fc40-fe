import { format, startOfDay, addHours, addMinutes } from 'date-fns';

import { subtractNumbers } from 'utils/numberUtils';

/**
 *
 * @param {*} hours : number
 * @param {*} minutes : number
 * @param {*} formatDisplay : string
 * @param {*} awareOfUnicodeTokens: bool
 */
export const formatTimes = (
  hours = 0,
  minutes = 0,
  formatHours = 'HH:mm',
  formatDate = 'dd/MM/YYYY HH:mm',
) => {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth(); // +1
  const year = today.getFullYear();

  const dateInfo = addMinutes(
    addHours(new Date(year, month, date), hours),
    minutes,
  );

  return {
    hour: format(dateInfo, formatHours),
    date: format(dateInfo, formatDate, { awareOfUnicodeTokens: true }),
  };
};

export const getDatetimeNow = () => new Date();

/**
 * @param {times: string | number} 12:15, 12.5
 *
 * @description split to get hours and minutes
 * 12:15 => {hours: 12, minutes: 15}
 * 12.5 => {hours: 12, minutes: 30}
 */
export const splitTimes = times => {
  if (typeof times === 'number') {
    const time = parseInt(times, 10);
    const delta = subtractNumbers(times, time);

    return {
      hours: time,
      minutes: delta * 60,
    };
  }

  const sp = `${times}`.split(':');
  return {
    hours: parseInt(sp[0], 10),
    minutes: parseInt(sp[1], 10),
  };
};

export const dateStringAndTimeString2Date = (dateString, timeString) => {
  const timeObject = splitTimes(timeString);
  return new Date(
    new Date(dateString).getTime() +
      timeObject.hours * 60 * 60 * 1000 +
      timeObject.minutes * 60 * 1000,
  );
};

/*
* @param: {date: Date | string}
* @param actionDate: Date (time when submit)
* */

export const resetCurrentTime = (date, actionDate) => {
  if (date != null) {
    let localDate;
    if (date instanceof Date) {
      localDate = date;
    } else if (typeof date === 'string') {
      localDate = new Date(date);
    }
    return addMinutes(
      addHours(
        new Date(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
        ),
        actionDate.getHours(),
      ),
      actionDate.getMinutes(),
    );
  }
  return null;
};

export const getToday = (notISOS = false) => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth(); // January is 0!

  if (notISOS) {
    mm += 1;
  }

  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  if (notISOS) {
    return `${yyyy}${mm}${dd}`;
  }

  return new Date(yyyy, mm, dd).toISOString();
};

export function normalizeNonISODateString(string) {
  if (typeof string !== 'string') return string;

  if (string.includes('Z')) {
    return string;
  }

  return `${string}Z`;
}

export function toMidnightISOString(date) {
  if (typeof date === 'string') return startOfDay(new Date(date)).toISOString();
  return startOfDay(date).toISOString();
}
