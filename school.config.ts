/**
 * Конфиг конкретной школы.
 *
 * Это единственное место, которое нужно менять, чтобы клонировать сайт
 * под другую школу. Тексты (название, описание, адрес) локализованы:
 * правьте здесь — никаких хардкодов в коде или messages/*.json.
 */

export type SchoolLocale = "hy" | "ru" | "en";

type LocalizedString = Record<SchoolLocale, string>;

export interface SchoolConfig {
  /** Домен сайта без протокола, для SEO/metadata */
  domain: string;
  /** Email школы — используется в footer, contact page, mailto-форме */
  email: string;
  /** Телефон в международном формате (для tel:) и локально для отображения */
  phone: {
    display: string;
    tel: string;
  };
  /** Соц. сети — оставить пустую строку, чтобы скрыть ссылку */
  social: {
    facebook: string;
    youtube: string;
  };
  /** Координаты для встроенной карты OpenStreetMap */
  map: {
    lat: number;
    lon: number;
    /** Половина видимого охвата карты по широте/долготе (градусы) */
    bboxRadius: number;
  };
  /** Логотип и hero-изображение из /public */
  assets: {
    logo: string;
    heroImage: string;
  };
  /** Локализованные строки */
  name: LocalizedString;
  shortName: LocalizedString;
  tagline: LocalizedString;
  address: LocalizedString;
  region: LocalizedString;
}

export const schoolConfig: SchoolConfig = {
  domain: "anipemzaschool.am",
  email: "anipemza2010@mail.ru",
  phone: {
    display: "+374 93 93-30-65",
    tel: "+37493933065",
  },
  social: {
    facebook: "https://www.facebook.com/anipemzayimijnakargdproc/",
    youtube: "",
  },
  map: {
    lat: 40.442141, 
    lon: 43.599868,
    bboxRadius: 0.02,
  },
  assets: {
    logo: "/logo.png",
    heroImage: "/school.jpg",
  },
  name: {
    hy: "Անիպեմզաի միջնակարգ դպրոց",
    ru: "Средняя школа Анипемза",
    en: "Anipemza Secondary School",
  },
  shortName: {
    hy: "Անիպեմզա",
    ru: "Анипемза",
    en: "Anipemza",
  },
  tagline: {
    hy: "Պաշտոնական տեղեկատվական հարթակ",
    ru: "Официальный информационный портал",
    en: "Official information portal",
  },
  address: {
    hy: "ՀՀ Շիրակի մարզ, գ. Անիպեմզա, փ․1, նրբ․1, շ․6",
    ru: "РА Ширакская область, село Анипемза, ул. 1, дом 1, корпус 6",
    en: "RA Shirak region, village Anipemza, st. 1, no. 1, building 6",
  },
  region: {
    hy: "Շիրակի մարզ",
    ru: "Ширакская область",
    en: "Shirak Region",
  },
};

export function bboxString(): string {
  const { lat, lon, bboxRadius } = schoolConfig.map;
  return [
    lon - bboxRadius,
    lat - bboxRadius / 2,
    lon + bboxRadius,
    lat + bboxRadius / 2,
  ].join(",");
}

export function mapEmbedUrl(): string {
  const { lat, lon } = schoolConfig.map;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bboxString()}&layer=mapnik&marker=${lat},${lon}`;
}
