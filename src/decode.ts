import { IOBuffer } from 'iobuffer';
import { decode as decodeTIFF } from 'tiff';

export function decode(
  data: NonNullable<ConstructorParameters<typeof IOBuffer>[0]>,
) {
  const buffer = new IOBuffer(data);
  const result: { exif?: ReturnType<typeof decodeTIFF> } = {};
  buffer.setBigEndian();
  const val = buffer.readUint16();
  if (val !== 0xffd8) {
    throw new Error('SOI marker not found. Not a valid JPEG file');
  }
  const next = buffer.readUint16();
  if (next === 0xffe1) {
    buffer.skip(2);
    const header = buffer.readBytes(6);
    if (
      header[0] === 69 && // E
      header[1] === 120 && // x
      header[2] === 105 && // i
      header[3] === 102 && // f
      header[4] === 0 &&
      header[5] === 0
    ) {
      result.exif = decodeTIFF(
        new Uint8Array(
          buffer.buffer,
          buffer.byteOffset + 12,
          buffer.byteLength - 12,
        ),
        {
          pages: [0],
          ignoreImageData: true,
        },
      );
    }
  }
  return result;
}
