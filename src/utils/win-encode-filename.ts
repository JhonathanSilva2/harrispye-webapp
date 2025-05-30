import iconv from "iconv-lite";

export function toWindowsFilename(str: string) {
	return str
		.normalize("NFC") // Normalize Unicode (preserve encoding)
		.replace(/[<>:"/\\|?*\x00-\x1F]/g, "") // Remove invalid characters
		.replace(/\s+/g, " ") // Collapse multiple spaces
		.replace(/\.$/, "") // Remove trailing dot
		.trim();
}

export function toWindowsEncodedFilename(str: string): string {
	const sanitized = toWindowsFilename(str);
	return iconv.encode(sanitized, "win1252").toString();
}
