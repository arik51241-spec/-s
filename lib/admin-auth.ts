export const ADMIN_IP = "91.237.40.25";

export function getClientIp(headers: Headers) {
  const raw =
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";

  return raw.replace(/^::ffff:/, "");
}

export function isAdmin(headers: Headers) {
  return getClientIp(headers) === ADMIN_IP;
}
