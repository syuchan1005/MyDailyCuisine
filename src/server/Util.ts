import { createHash, randomBytes } from 'crypto';
import { promisify } from 'util';
import { createWriteStream, promises as fs } from 'fs';
import { normalize } from 'path';
import { Result } from '@common/GQLTypes';
import createError from './Errors';

const pRandomBytes = promisify(randomBytes);

type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
};

export { hash, verify } from 'argon2';

export const generateRandomToken = async () => createHash('sha1')
  .update(await pRandomBytes(256))
  .digest('hex');

export const mkdirpIfNotExists = async (path) => {
  let stat;
  try {
    stat = await fs.stat(path);
  } catch (e) {
    await fs.mkdir(path, {
      recursive: true,
    });
    return;
  }
  if (!stat.isDirectory()) {
    throw new Error(`${path} is file exists`);
  }
};

export const writeUpload = async (upload: File | Promise<Upload>, path: string, options?: {
  filterMineType?: string | string[];
  fileTransform?: (stream: NodeJS.ReadableStream) => NodeJS.ReadableStream;
}): Promise<[() => Promise<void>, Result]> => {
  const remove = () => fs.unlink(path);
  // @ts-ignore
  const { mimetype, createReadStream } = await upload;
  if (options?.filterMineType) {
    if (
      (Array.isArray(options.filterMineType) && !options.filterMineType.includes(mimetype))
      || options.filterMineType !== mimetype
    ) return [remove, createError('QL0005')];
  }

  let stream = createReadStream();
  if (options?.fileTransform) stream = options.fileTransform(stream);

  try {
    await mkdirpIfNotExists(normalize(`${path}/../`));
    await new Promise((resolve, reject) => {
      const w = createWriteStream(path, { flags: 'w' });
      stream.pipe(w);
      w.on('close', resolve);
      w.on('error', reject);
    });
  } catch (e) {
    return [remove, createError('QL0006')];
  }

  return [remove, { success: true }];
};

export const asyncMap = async <T, E>(
  arr: Array<E>,
  transform: (e: E, index: number, arr: Array<E>) => Promise<T>,
  reversed = false,
): Promise<T[]> => {
  const result = [];
  if (reversed) {
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      // eslint-disable-next-line no-await-in-loop
      result[i] = await transform(arr[i], i, arr);
    }
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      result[i] = await transform(arr[i], i, arr);
    }
  }
  return result;
};

export const asyncCancelMap = async <T, E>(
  arr: Array<E>,
  transform: (e: E, index: number, arr: Array<E>, cancelled: () => void) => Promise<T>,
  reversed = false,
): Promise<[T[], boolean]> => {
  let cancel = false;
  const cancelled = () => { cancel = true; };
  const result = [];
  if (reversed) {
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      if (cancel) break;
      // eslint-disable-next-line no-await-in-loop
      result[i] = await transform(arr[i], i, arr, cancelled);
    }
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      if (cancel) break;
      // eslint-disable-next-line no-await-in-loop
      result[i] = await transform(arr[i], i, arr, cancelled);
    }
  }
  return [result, cancel];
};
