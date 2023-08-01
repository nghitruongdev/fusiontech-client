import { HttpError } from '@refinedev/core'
import { AxiosError } from 'axios'

export type AppError = Partial<HttpError> &
  Partial<AxiosError> & {
    name?: string
    message?: string
    detail?: string
    cause?: Error
    statusCode?: number
  }

//   {
//     "config": {
//         "transitional": {
//             "silentJSONParsing": true,
//             "forcedJSONParsing": true,
//             "clarifyTimeoutError": false
//         },
//         "transformRequest": [
//             null
//         ],
//         "transformResponse": [
//             null
//         ],
//         "timeout": 0,
//         "xsrfCookieName": "XSRF-TOKEN",
//         "xsrfHeaderName": "X-XSRF-TOKEN",
//         "maxContentLength": -1,
//         "maxBodyLength": -1,
//         "headers": {
//             "Accept": "application/json, text/plain, */*",
//             "Content-Type": "application/json"
//         },
//         "method": "patch",
//         "url": "http://localhost:8080/api/brands/10",
//         "data": "{\"name\":\"Olaf\"}"
//     },
//     "status": 409
// }

// {
//     "type": "about:blank",
//     "title": "Conflict",
//     "status": 409,
//     "detail": "Unique index or primary key violation: PUBLIC.UK_IP0B4PX41B62Q51P62XW3EGQK_INDEX_3 ON PUBLIC.BRAND(NAME NULLS FIRST) VALUES ( /* 20 */ 'Olaf' ) - [23505]",
//     "instance": "/api/brands/10"
// }
