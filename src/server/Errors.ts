export const errors = {
  QL0000: 'Unknown Error',
  QL0001: 'Invalid name or password',
  QL0002: 'token expired',
  QL0003: 'user not found',
  QL0004: 'database error',
  QL0005: 'invalid image minetype',
  QL0006: 'Failed to write file',
  QL0007: 'Already exists',
};

const createError = <T = { [key: string]: any }>(
  code: keyof typeof errors,
  props?: T,
) => <{
  success: boolean,
  code: string;
  message: string;
} & T>({
  code,
  message: errors[code],
  ...{ success: false, ...props },
});

export default createError;
