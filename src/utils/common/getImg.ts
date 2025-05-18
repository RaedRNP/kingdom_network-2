const BASE_URL = await import.meta.env.STRAPI_URL;

export default function getProductoImg(url: string | null | undefined) {
  if (url == null || url == undefined) return "/no-image.png";
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;

  return `${BASE_URL}${url}`;
}
