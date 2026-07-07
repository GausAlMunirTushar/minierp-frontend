import { useMutation } from '@tanstack/react-query'

import { AxiosAPI } from '@/apis/configs'
import { authLogin } from '@/apis/endpoints/auth_apis'
import type { LoginPayload, LoginResponse } from '@/apis/types/auth_type'
import type { ApiResponse } from '@/apis/types/common_type'

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) =>
      AxiosAPI.post<ApiResponse<LoginResponse>>(authLogin, payload).then((res) => res.data),
  })
