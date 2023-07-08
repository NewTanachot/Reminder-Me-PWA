import { BranchNameEnum } from '@/model/enum_model';

export const GetLastVariableFromPath = (url: string) => {
    return url.slice(url.lastIndexOf("/") + 1);
}

export const GetApiUrlByBranchName = () => {

    let baseUrlApi: string;

    switch (GetBranchName()) {
        case BranchNameEnum.develop.toString():
            baseUrlApi = process.env.NEXT_PUBLIC_BASEURL_API_DEV ?? "";
            break;
        case BranchNameEnum.main.toString():
            baseUrlApi = process.env.NEXT_PUBLIC_BASEURL_API_PROD ?? "";
            break;
        default:
            baseUrlApi = "";
            break;
    }

    return baseUrlApi;
}

