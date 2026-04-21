import type { ApiError } from './api-error'

export type Result<T, E = ApiError> =
	| { ok: true; data: T }
	| { ok: false; error: E }

export const ok = <T>(data: T): Result<T, never> => ({
	ok: true,
	data
})

export const err = <E extends ApiError>(error: E): Result<never, E> => ({
	ok: false,
	error
})