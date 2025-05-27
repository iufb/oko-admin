import { customFetch } from "../"







export const rLogin = (data: { phone_number: string, password: string }): Promise<{ access: string, refresh: string } | undefined> => {
    return customFetch({ method: "POST", path: 'login/', data })
}
export const rCheckToken = () => {
    return customFetch({ method: "GET", path: 'check-token', withAuth: true })
}
export const rRefreshToken = async (refresh: string): Promise<{ access: string } | undefined> => {
    console.log(refresh)
    const url = `${process.env.VITE_BACKENDURL}/api/v1/token/refresh/`
    try {
        const response = await fetch(url, {
            method: "POST", body: JSON.stringify({ refresh }), headers: {
                'Content-type': 'application/json'
            }
        })
        if (!response.ok) {
            throw {
                message: "Error on refresh token!!!!",
                status: response.status,
                url: response.url,
            }
        }
        const data = await response.json()
        console.log(data)
        return data
    } catch (e) {
        console.log(e)
    }
}
