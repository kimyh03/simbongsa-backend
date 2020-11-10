import { NotFoundException } from '@nestjs/common';

export default (item: any) => {
  if (!item) {
    throw new NotFoundException();
  } else {
    return null;
  }
};
