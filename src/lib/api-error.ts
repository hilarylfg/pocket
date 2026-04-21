export enum ErrorCode {
	VALIDATION = 'VALIDATION', // 422
	AUTH = 'AUTH', // 401
	NOT_FOUND = 'NOT_FOUND', // 404
	FORBIDDEN = 'FORBIDDEN', // 403
	SERVER = 'SERVER', // 500
	NETWORK = 'NETWORK', // 502/503
	BAD_REQUEST = 'BAD_REQUEST' // 400
}

export interface ApiError {
	code: ErrorCode
	message: string
	details?: Record<string, string[]>
	status: number
}
