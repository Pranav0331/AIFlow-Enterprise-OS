import rawConfig from "../../i18n.config.json";

export type LanguageDirection = "ltr" | "rtl";

export type LanguageConfig = {
  code: string;
  label: string;
  detect: string[];
  dir: LanguageDirection;
};

const config = rawConfig as {
  fallbackLng: string;
  languages: LanguageConfig[];
};

/** 兜底语言 code。所有 locale 文件必须拥有同一份 key 集合。 */
export const fallbackLng = config.fallbackLng;

/** 模板支持的所有语言 code，传给 i18next.supportedLngs。 */
export const supportedLngs = config.languages.map((l) => l.code);

/**
 * 语言切换器使用的下拉选项。value 是语言 code，label 是 manifest 里的展示名。
 * 唯一来源是 i18n.config.json，业务代码不要再写第二份语言列表。
 */
export const languageOptions = config.languages.map(({ code, label }) => ({
  value: code,
  label,
}));

const dirMap = new Map(config.languages.map((l) => [l.code, l.dir]));
const aliasMap = new Map(
  config.languages.flatMap((l) =>
    l.detect.map((alias) => [alias.toLowerCase(), l.code] as const),
  ),
);

/**
 * 把浏览器/cookie/htmlTag 给的语言串归一化到 manifest 中的 supported code。
 * 命中规则：精确匹配优先，其次按 detect alias 做前缀匹配（zh -> zh-CN）。
 * 未命中返回 null，由调用方决定是否落到 fallbackLng。
 */
export function normalizeLanguage(value?: string | null): string | null {
  if (!value) return null;
  const lowered = value.trim().toLowerCase();
  if (!lowered) return null;
  if (supportedLngs.includes(lowered)) return lowered;
  for (const [alias, code] of aliasMap) {
    if (lowered === alias || lowered.startsWith(`${alias}-`)) return code;
  }
  return null;
}

/**
 * 根据语言取得 html dir 属性值。未识别语言返回 fallback 的方向。
 * 用于初始化和 languageChanged 时同步 documentElement.dir。
 */
export function getLanguageDirection(value?: string | null): LanguageDirection {
  return dirMap.get(normalizeLanguage(value) ?? fallbackLng) ?? "ltr";
}
