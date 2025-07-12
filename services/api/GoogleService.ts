import axiosClient from "@/utils/axiosClient";


export const login = async (code: string) => {
    try {
        const temp = await axiosClient.post(`/bg-ref/login-email`, { code });
        return temp.data;
    } catch (e) {
        console.log(e)
        throw e;
    }
}