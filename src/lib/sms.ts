// GSM-7 default alphabet (subset sufficient for detection)
const GSM7 = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà".split(
    "",
  ),
);
const GSM7_EXT = new Set("^{}\\[~]|€".split(""));

export interface SmsMetrics {
  count: number;
  limit: number;
  parts: number;
  isUnicode: boolean;
  remaining: number;
}

export function analyzeSms(text: string): SmsMetrics {
  let isUnicode = false;
  let count = 0;
  for (const ch of text) {
    if (GSM7.has(ch)) count += 1;
    else if (GSM7_EXT.has(ch)) count += 2;
    else {
      isUnicode = true;
      count = [...text].length;
      break;
    }
  }
  if (!isUnicode) {
    // recount accurately with extensions
    count = 0;
    for (const ch of text) {
      if (GSM7_EXT.has(ch)) count += 2;
      else count += 1;
    }
  }
  const singleLimit = isUnicode ? 70 : 160;
  const multiLimit = isUnicode ? 67 : 153;
  let parts = 1;
  let limit = singleLimit;
  if (count > singleLimit) {
    parts = Math.ceil(count / multiLimit);
    limit = multiLimit * parts;
  }
  return { count, limit, parts, isUnicode, remaining: Math.max(0, limit - count) };
}

export function extractParams(body: string): string[] {
  const re = /\[##([^#\]]+)##\]/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) set.add(m[1].trim());
  return [...set];
}

export function substituteParams(body: string, values: Record<string, string>): string {
  return body.replace(/\[##([^#\]]+)##\]/g, (_, k) => values[k.trim()] ?? `[##${k}##]`);
}
