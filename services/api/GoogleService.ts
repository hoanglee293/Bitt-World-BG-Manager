import axiosClient from "@/utils/axiosClient";

export const login = async (code: string) => {
    try {
        const response = await axiosClient.post(`/bg-ref/login-email`, { code });
        return {
            status: 200,
            token: response.data.token,
            data: response.data
        };
    } catch (error: any) {
        return {
            status: error.response?.status || 500,
            message: error.response?.data?.message || 'Login failed',
            data: error.response?.data
        };
    }
}