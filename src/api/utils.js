export async function fetchJson(url){
    return fetch(url)
        .then(res => res.json())
}