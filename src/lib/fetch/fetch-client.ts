import { RequestOptions, TypeSearchParams } from './fetch-types'
import { type ApiError, ErrorCode, type Result } from '@/src/lib'

export class FetchClient {
	private baseUrl: string
	public headers?: Record<string, string>
	public params?: TypeSearchParams
	public options?: RequestOptions

	public constructor(init: {
		baseUrl: string
		headers?: Record<string, string>
		params?: TypeSearchParams
		options?: RequestOptions
	}) {
		this.baseUrl = init.baseUrl
		this.headers = init.headers
		this.params = init.params
		this.options = init.options
	}

	private createSearchParams(params: TypeSearchParams) {
		const searchParams = new URLSearchParams()

		for (const key in { ...this.params, ...params }) {
			if (Object.prototype.hasOwnProperty.call(params, key)) {
				const value = params[key]

				if (Array.isArray(value)) {
					value.forEach(currentValue => {
						if (currentValue) {
							searchParams.append(key, currentValue.toString())
						}
					})
				} else if (value) {
					searchParams.set(key, value.toString())
				}
			}
		}

		return `?${searchParams.toString()}`
	}

	private async request<T>(
		endpoint: string,
		method: RequestInit['method'],
		options: RequestOptions = {}
	): Promise<Result<T, ApiError>> {
		let url = `${this.baseUrl}/${endpoint}`

		if (options.params) {
			url += this.createSearchParams(options.params)
		}

		const config: RequestInit = {
			...options,
			...(!!this.options && { ...this.options }),
			method,
			headers: {
				...(!!options?.headers && options.headers),
				...this.headers
			}
		}

		try {
			const response: Response = await fetch(url, config)

			const body = response.headers
				.get('Content-Type')
				?.includes('application/json')
				? await response.json()
				: await response.text()

			if (!response.ok) {
				const error: ApiError = {
					code: this.mapStatusToCode(response.status),
					message:
						(body as { message?: string })?.message ||
						response.statusText,
					status: response.status
				}
				return { ok: false, error }
			}

			return { ok: true, data: body as T }
		} catch (e) {
			const error: ApiError = {
				code: ErrorCode.NETWORK,
				message: e instanceof Error ? e.message : 'Network error',
				status: 0
			}
			return { ok: false, error }
		}
	}

	private mapStatusToCode(status: number): ErrorCode {
		if (status === 401) return ErrorCode.AUTH
		if (status === 403) return ErrorCode.FORBIDDEN
		if (status === 404) return ErrorCode.NOT_FOUND
		if (status === 400) return ErrorCode.BAD_REQUEST
		if (status >= 500) return ErrorCode.SERVER
		return ErrorCode.BAD_REQUEST
	}

	public get<T>(
		endpoint: string,
		options: Omit<RequestOptions, 'body'> = {}
	) {
		return this.request<T>(endpoint, 'GET', options)
	}

	public post<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: RequestOptions = {}
	) {
		return this.request<T>(endpoint, 'POST', {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {})
			},
			...(!!body && { body: JSON.stringify(body) })
		})
	}

	public put<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: RequestOptions = {}
	) {
		return this.request<T>(endpoint, 'PUT', {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {})
			},
			...(!!body && { body: JSON.stringify(body) })
		})
	}

	public delete<T>(
		endpoint: string,
		options: Omit<RequestOptions, 'body'> = {}
	) {
		return this.request<T>(endpoint, 'DELETE', options)
	}

	public patch<T>(
		endpoint: string,
		body?: Record<string, any>,
		options: RequestOptions = {}
	) {
		return this.request<T>(endpoint, 'PATCH', {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {})
			},
			...(!!body && { body: JSON.stringify(body) })
		})
	}
}
