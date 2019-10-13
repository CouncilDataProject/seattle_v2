export async function fetchJson(url){
    return fetch(url)
        .then(res => res.json())
};

export function isString(s) {
    return typeof(s) === "string" || s instanceof String;
};
