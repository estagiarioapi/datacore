import * as crypto from 'crypto';

export async function randomStringBiased(value: string) {
  const size = 16;
  const buffer = Buffer.from(value.concat(Date.now().toString()));
  const hash = crypto.getRandomValues(buffer);
  const partition = Math.floor(((hash.at(0) % size) * 4) / size);
  return await crypto.subtle.digest('SHA-256', hash).then((digest) => {
    const code = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(32).padStart(2, partition.toString()))
      .join('')
      .slice(partition * size, partition * size + size);

    return code;
  });
}
