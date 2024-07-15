import * as path from 'path';

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function envPath() {
  return path.join(
    process.cwd(),
    `.env${isProduction() ? `` : '.development'}`,
  );
}

export default function configuration() {
  return {
    ...process.env,
  };
}
