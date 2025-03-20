const returnFileSrcFromPath = (path: string | null) => {
  if (!path) return '';
  const MODE = process.env.MODE;
  let src: string;
  const normalizedPath = path.replace(/\\/g, '/');

  if (MODE === 'production') {
    src = `/storage/${normalizedPath}`;
  } else if (MODE === 'local') {
    src = `/sakhagis/storage/${normalizedPath}`;
  } else if (MODE === 'development') {
    src = `https://sakhagis.ru/storage/${normalizedPath}`;
  } else {
    src = '';
  }

  return src;
};

export default returnFileSrcFromPath;
