export const surfTypes: Array<{numberOfSearchs: number, userAgent: string}> = [
    {
        numberOfSearchs: 20,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Mobile Safari/537.36 EdgA/97.0.1072.78'
    },
    {
        numberOfSearchs: 30,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29'
    }
]

export type PageRequest = {
    url: string;
    userAgent: string;
}

export const baseUrl = 'https://www.bing.com/search?q=';