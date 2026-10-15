export enum HttpCodeEnum {
  ZERO = 0,
  TWO_HUNDRED = 200,
  FOUR_HUNDRED = 400,
  FOUR_HUNDRED_ONE = 401,
  FOUR_HUNDRED_THREE = 403,
  FOUR_HUNDRED_FOUR = 404,
  FOUR_HUNDRED_NINE = 409,
  FIVE_HUNDRED = 500,
}

export enum KeyErrorMessage {
  DEFAULT = 'default',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not-found',
  CONFLICT = 'conflict',
  TOKEN_EXPIRED = 'token-expired',
  EXPIRED_INACTIVITY = 'expired-inactivity',
  SESSION_MAX_TIME = 'session-max-time',
  BAD_REQUEST = 'bad-request',
  MAX_BLOCKS = 'max-blocks',
  NOT_FOUND_CLIENT = 'not-found-client',
}
