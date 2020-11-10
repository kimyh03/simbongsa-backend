export default (item: any) => {
  if (item) {
    throw new Error('대상이 이미 존재합니다.');
  } else {
    return null;
  }
};
