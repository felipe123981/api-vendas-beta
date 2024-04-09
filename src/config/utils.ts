export function getFileExtension(filename: string): string | undefined {
  const match = /[.]/.exec(filename);
  if (match) {
    const extension = /[^.]+$/.exec(filename)?.[0];
    return extension;
  } else {
    return undefined;
  }
}
