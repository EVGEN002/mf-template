const returnRepoSrc = (code: string | null) => {
  const MODE = process.env.MODE;
  let src: string;

  if (MODE === 'production') {
    src = `/apimap/repo/${code}`;
  } else if (MODE === 'local') {
    src = `/sakhagis/apimap/repo/${code}`;
  } else if (MODE === 'development') {
    src = `https://yakit.pro/sakhagis/apimap/repo/${code}`;
  } else {
    src = '';
  }

  return src;
};

export default returnRepoSrc;
