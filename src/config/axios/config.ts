import {log} from "util";

const config: {
  base_url: string
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * api请求基础路径、正式环境
   */

  /**
   *
   base_url: (import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL).replace(/\/\//g, '/'),
   **/

  base_url : import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL,

   /**
   * 接口成功返回状态码
   */
  result_code: 200,

  /**
   * 接口请求超时时间
   */
  request_timeout: 30000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json'
}
console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('拼接结果:', import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL);
export { config }
