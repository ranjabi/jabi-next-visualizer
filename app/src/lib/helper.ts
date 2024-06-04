export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export const getFileExtension = (filename: string) => filename.split('.').pop()

export const allowedExtensions = new Set(['tsx'])

/**
 * Given ['..', '..', 'components', 'name']
 * @returns name
 */
export const trimBeginningPath = (path: string[]) => {
  let startIdx = 0
  while ((path[startIdx] === '.' || path[startIdx] === '..') && startIdx < path.length) {
      startIdx += 1
  }
  let sliced = path.slice(startIdx)
  return sliced[sliced.length - 1]
}