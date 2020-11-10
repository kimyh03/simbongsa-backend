import { UnauthorizedException } from '@nestjs/common';

export default (itemA: any, itemB: any) => {
  if (itemA !== itemB) {
    throw new UnauthorizedException();
  } else {
    return null;
  }
};
