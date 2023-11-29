export function formDataToJson(formData: FormData) {
    let data = {};
    // @ts-ignore
    formData.forEach((value, key) => { data[key] = value });
    return data;
}