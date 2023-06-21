export function GetLastVariableFromPath(url: string) {
    return url.slice(url.lastIndexOf("/") + 1);
}
