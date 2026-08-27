import mammoth from "mammoth";
import { getStorage } from "@/lib/storage";
import { hardenExternalLinks, sanitizeHtml } from "./sanitize-html";
import type { Converter } from "./types";

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/bmp": "bmp",
};

/**
 * .docx -> HTML bằng mammoth: giữ heading, đậm/nghiêng, danh sách, bảng, ảnh.
 *
 * Ảnh trong docx mặc định được mammoth nhúng base64 thẳng vào HTML. Một file Word
 * nhiều ảnh sẽ phình gấp ~1.33 lần và nhét hết vào một row Postgres. Nên tách ảnh
 * ra storage và chỉ giữ URL trong HTML.
 */
export const convertDocx: Converter = async (buffer, meta) => {
  const storage = getStorage();
  let imageIndex = 0;

  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => h2:fresh",
        "p[style-name='Quote'] => blockquote:fresh",
      ],
      convertImage: mammoth.images.imgElement(async (image) => {
        const contentType = image.contentType ?? "image/png";
        const ext = MIME_TO_EXT[contentType] ?? "bin";
        const name = `img-${imageIndex++}.${ext}`;
        const key = `${meta.attachmentId}/${name}`;

        const imageBuffer = Buffer.from(await image.read("base64"), "base64");
        await storage.put(key, imageBuffer, contentType);

        return { src: `/api/attachments/${meta.attachmentId}/asset/${name}` };
      }),
    },
  );

  const { value: rawText } = await mammoth.extractRawText({ buffer });
  const html = hardenExternalLinks(sanitizeHtml(result.value));

  return { html, text: rawText };
};
