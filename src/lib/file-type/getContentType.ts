import { fileTypeFromBuffer } from "file-type";

export async function getContentType(buffer: Buffer): Promise<string | null> {
	const result = await fileTypeFromBuffer(buffer);
	return result ? result.mime : null;
}
