import { useCallback } from 'react';
import { Lunar } from 'lunar-javascript';
import { useTranslation } from 'react-i18next';
import { FIVE_ELEMENTS_COLORS } from '../constants';

// Types
export interface BirthDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface BaziResult {
  year: [string, string];
  month: [string, string];
  day: [string, string];
  hour: [string, string];
  solarDate: string;
  lunarDate: string;
  fiveElements: {
    year: [string, string];
    month: [string, string];
    day: [string, string];
    hour: [string, string];
  };
}

export interface FiveElementStat {
  element: string;
  count: number;
  percentage: number;
}

// Constants
export const CHINESE_HOURS = [
  { branch: '子', label: '子时 23:00-00:59', value: 23 },
  { branch: '丑', label: '丑时 01:00-02:59', value: 1 },
  { branch: '寅', label: '寅时 03:00-04:59', value: 3 },
  { branch: '卯', label: '卯时 05:00-06:59', value: 5 },
  { branch: '辰', label: '辰时 07:00-08:59', value: 7 },
  { branch: '巳', label: '巳时 09:00-10:59', value: 9 },
  { branch: '午', label: '午时 11:00-12:59', value: 11 },
  { branch: '未', label: '未时 13:00-14:59', value: 13 },
  { branch: '申', label: '申时 15:00-16:59', value: 15 },
  { branch: '酉', label: '酉时 17:00-18:59', value: 17 },
  { branch: '戌', label: '戌时 19:00-20:59', value: 19 },
  { branch: '亥', label: '亥时 21:00-22:59', value: 21 }
] as const;

export const FIVE_ELEMENTS_MAP = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
} as const;

export const FIVE_ELEMENTS_EN = {
  '金': 'Metal',
  '木': 'Wood',
  '水': 'Water',
  '火': 'Fire',
  '土': 'Earth'
};

const IDEAL_RATIO = 0.2; // 20%

// Utilities
export function getHourLabel(hour: number, t: any, i18n: any) {
  // hour: 0-23
  const match = CHINESE_HOURS.find(h => {
    if (h.value === 23) return hour >= 23 || hour < 1;
    if (h.value === 1) return hour >= 1 && hour < 3;
    if (h.value === 3) return hour >= 3 && hour < 5;
    if (h.value === 5) return hour >= 5 && hour < 7;
    if (h.value === 7) return hour >= 7 && hour < 9;
    if (h.value === 9) return hour >= 9 && hour < 11;
    if (h.value === 11) return hour >= 11 && hour < 13;
    if (h.value === 13) return hour >= 13 && hour < 15;
    if (h.value === 15) return hour >= 15 && hour < 17;
    if (h.value === 17) return hour >= 17 && hour < 19;
    if (h.value === 19) return hour >= 19 && hour < 21;
    if (h.value === 21) return hour >= 21 && hour < 23;
    return false;
  });
  if (!match) return hour;
  if (i18n.language === 'zh') return match.label;
  const hourMapEn: Record<string, string> = {
    '子': 'Zi (23:00-00:59)',
    '丑': 'Chou (01:00-02:59)',
    '寅': 'Yin (03:00-04:59)',
    '卯': 'Mao (05:00-06:59)',
    '辰': 'Chen (07:00-08:59)',
    '巳': 'Si (09:00-10:59)',
    '午': 'Wu (11:00-12:59)',
    '未': 'Wei (13:00-14:59)',
    '申': 'Shen (15:00-16:59)',
    '酉': 'You (17:00-18:59)',
    '戌': 'Xu (19:00-20:59)',
    '亥': 'Hai (21:00-22:59)'
  };
  return hourMapEn[match.branch] || match.label;
}

export const calculateFiveElementsStats = (bazi: BaziResult): FiveElementStat[] => {
  const stats = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };

  // 统计所有柱中的五行
  Object.values(bazi.fiveElements).forEach(pillar => {
    pillar.forEach(element => {
      // @ts-ignore
      stats[element]++;
    });
  });

  // 计算百分比
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  return Object.entries(stats).map(([element, count]) => ({
    element,
    count,
    percentage: total === 0 ? 0 : Math.round((count / total) * 100)
  }));
};

export const calculateImbalance = (stats: FiveElementStat[]) => {
  // 计算每个五行与理想比例的偏差
  const deviations = stats.map(({ element, percentage }) => {
    const deviation = percentage / 100 - IDEAL_RATIO; // 不取绝对值，保留正负
    const deviationAbs = Math.abs(deviation);
    return {
      element,
      deviation,
      deviationPercentage: Math.round(deviation * 100),
      status: deviationAbs <= 0.05 ? 'Balanced' :
        deviation > 0 ? (deviationAbs <= 0.1 ? 'Slightly High' : 'Excessive') :
          deviationAbs <= 0.1 ? 'Slightly Low' : 'Insufficient'
    };
  });

  // 计算总体失衡度
  const totalImbalance = deviations.reduce((sum, { deviation }) => sum + Math.abs(deviation), 0) / 5;
  const overallStatus = totalImbalance <= 0.05 ? 'Balanced' :
    totalImbalance <= 0.1 ? 'Slightly High' : 'Excessive';

  return {
    deviations,
    totalImbalance,
    overallStatus
  };
};

export function useBazi() {
  const { t, i18n } = useTranslation();

  const calculate = useCallback((date: Date, type: 'natal' | 'current' = 'natal'): BaziResult => {
    const lunar = Lunar.fromDate(date);

    // 获取八字
    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const timeGanZhi = lunar.getTimeInGanZhi();
    const hour = date.getHours();

    // 格式化日期显示
    // For simplicity here we might depend on existing formatting logic or reconstruct it
    const solarDateStr = `${t('Year')}: ${date.getFullYear()}, ${t('Month')}: ${date.getMonth() + 1}, ${t('Day')}: ${date.getDate()}, ${t('Hour')}: ${getHourLabel(hour, t, i18n)}`;
    const lunarDateStr = `${t('Lunar')} ${t('Year')}: ${lunar.getYearInChinese()}, ${t('Month')}: ${lunar.getMonthInChinese()}, ${t('Day')}: ${lunar.getDayInChinese()}`;

    // 计算五行
    const fiveElements = {
      // @ts-ignore
      year: [FIVE_ELEMENTS_MAP[yearGanZhi[0]], FIVE_ELEMENTS_MAP[yearGanZhi[1]]] as [string, string],
      // @ts-ignore
      month: [FIVE_ELEMENTS_MAP[monthGanZhi[0]], FIVE_ELEMENTS_MAP[monthGanZhi[1]]] as [string, string],
      // @ts-ignore
      day: [FIVE_ELEMENTS_MAP[dayGanZhi[0]], FIVE_ELEMENTS_MAP[dayGanZhi[1]]] as [string, string],
      // @ts-ignore
      hour: [FIVE_ELEMENTS_MAP[timeGanZhi[0]], FIVE_ELEMENTS_MAP[timeGanZhi[1]]] as [string, string]
    };

    return {
      year: [yearGanZhi[0], yearGanZhi[1]], // This might need type adjustment if strict tuples needed
      month: [monthGanZhi[0], monthGanZhi[1]],
      day: [dayGanZhi[0], dayGanZhi[1]],
      hour: [timeGanZhi[0], timeGanZhi[1]],
      solarDate: solarDateStr,
      lunarDate: lunarDateStr,
      fiveElements
    } as BaziResult; // Casting for simplicity in refactor
  }, [t, i18n]);

  return {
    calculateHelper: calculate,
    calculateFiveElementsStats,
    calculateImbalance
  };
}
