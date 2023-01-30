import axios, { AxiosResponse, RawAxiosRequestConfig } from 'axios';

interface FastifyError {
  statusCode: number;
  error: string;
  message: string;
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/`,
});

export async function makeRequest<Response = any, Params = any>(
  url: string,
  options?: RawAxiosRequestConfig<Params>
) {
  try {
    const res: AxiosResponse<Response, Params> = await api(url, options);
    return res.data;
  } catch (err) {
    if (!axios.isAxiosError(err) || !err.response?.data) {
      // DELETE: remove console warn on production mode.
      console.warn(err);
      return Promise.reject(new Error('Internal service error'));
    }
    return Promise.reject(
      new Error((err.response.data as FastifyError).message)
    );
  }
}
