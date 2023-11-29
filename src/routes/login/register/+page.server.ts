import type { PageServerLoad } from './$types';
import { formDataToJson } from '$lib/common';

const apiurl = "http://localhost:8080";

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    register: async ({ cookies, request }) => {
        const input = await request.formData();
        const response = fetch(`${apiurl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataToJson(input)),
        });
        const body = await response.then((res) => res.json());
        switch ((await response).status) {
            case 201:
                console.log(body);
                break;
            case 400:
                console.log(body);
                break;
            case 500:
                console.log(body);
                break;
            default:
                console.log(`uncaught response ${(await response)}`);
                break;
        }
    },
}