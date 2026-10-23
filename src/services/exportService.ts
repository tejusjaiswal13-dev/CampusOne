import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
export async function exportText(
  filename: string,
  text: string,
  type = "text/plain",
) {
  if (Capacitor.isNativePlatform()) {
    await Share.share({ title: filename, text });
    return;
  }
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csv(rows: unknown[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? "");
          return (
            '"' + (/^[=+\-@]/.test(s) ? "'" + s : s).replaceAll('"', '""') + '"'
          );
        })
        .join(","),
    )
    .join("\r\n");
}
