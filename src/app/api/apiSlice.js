import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-api-fax3.onrender.com/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) // custom like (shout: true)

    let result = await baseQuery(args, api, extraOptions) 

    // Handling of other Status Codes
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // sends new refresh token for new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        
        if (refreshResult?.data) {

            // stores the new token
            api.dispatch(setCredentials({ ...refreshResult.data}))

            // retries the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})
