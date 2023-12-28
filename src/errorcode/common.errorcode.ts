/**
 * The Common Error Code
 */
export class CommonErrorCode {
  static AXIOS_ERROR = {
    code: '10000',
    msg: '',
  };
  static UNEXPECTED_AXIOS_ERROR = {
    code: '10001',
    msg: 'Unexpected Error occurred',
  };

  static CIRCUIT_BREAKER_ERROR = {
    code: '10002',
    msg: 'CircuitBreaker is Open and does not permit further calls',
  };
}
