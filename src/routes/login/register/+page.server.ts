import type { PageServerLoad } from './$types';
import { formDataToJson } from '$lib/common';

const apiurl = "http://localhost:8080";

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    register: async ({ cookies, request }) => {
        const input = await request.formData();
        fetch(`${apiurl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataToJson(input)),
        }).then((response) => {
            switch (response.status) {
                case 201:
                    console.log(response.statusText);
                    break;
                case 400:
                    console.log(response.statusText);
                    break;
                case 500:
                    console.log(response.statusText);
                    break;
                default:
                    console.log(`uncaught response ${response}`);
                    break;
            }
        });
    },
}