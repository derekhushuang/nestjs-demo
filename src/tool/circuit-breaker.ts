import { Policy, SamplingBreaker } from 'cockatiel';
import { Logger } from '@nestjs/common';
import { CircuitBreakerPolicy } from 'cockatiel/dist/CircuitBreakerPolicy';
import { isServerSideError } from './common.tool';

export interface CircuitBreakerOptions {
  halfOpenAfter?: number;
  threshold?: number;
  duration?: number;
  minimumRps?: number;
  onBreak?: (data) => void;
  onReset?: (data) => void;
  onHalfOpen?: (data) => void;
  onStateChange?: (data) => void;
  onSuccess?: (data) => void;
  onFailure?: (data) => void;
}

const breakerInstances = {};
const defaultHalfOpenAfter = 10 * 1000;
const defaultThreshold = 0.3;
const defaultDuration = 10 * 1000;
const defaultMinimunRps = 1;

export const createAxiosBreaker = (
  name: string,
  options?: CircuitBreakerOptions,
): CircuitBreakerPolicy => {
  if (breakerInstances[name]) {
    return breakerInstances[name];
  }

  const samplingBreakerOption = {
    threshold: options?.threshold || defaultThreshold,
    duration: options?.duration || defaultDuration,
    minimumRps: options?.minimumRps || defaultMinimunRps,
  };

  const defaultBreakFunc: (reason) => void = (reason): void =>
    Logger.error(`Circuit breaker ${name} is open because of the error: ${reason.error?.message}`);

  const axiosBreaker = Policy.handleWhen((err) => isServerSideError(err)).circuitBreaker(
    options?.halfOpenAfter || defaultHalfOpenAfter,
    new SamplingBreaker(samplingBreakerOption),
  );
  axiosBreaker.onBreak(options?.onBreak || defaultBreakFunc);

  options?.onReset && axiosBreaker.onReset(options?.onReset);
  options?.onHalfOpen && axiosBreaker.onHalfOpen(options?.onHalfOpen);
  options?.onStateChange && axiosBreaker.onStateChange(options?.onStateChange);
  options?.onSuccess && axiosBreaker.onSuccess(options?.onSuccess);
  options?.onFailure && axiosBreaker.onFailure(options?.onFailure);

  breakerInstances[name] = axiosBreaker;
  return axiosBreaker;
};
