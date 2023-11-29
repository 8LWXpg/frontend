import type { PageServerLoad } from './$types';
import { formDataToJson } from '$lib/common';
import { redirect } from '@sveltejs/kit';
import { BACKEND } from '$env/static/private';

export async function load({ cookies }) {
    // TODO: check if user is logged in
}

export const actions = {
    login: async ({ cookies, request }) => {
        const input = await request.formData();
        console.log(BACKEND);
        const response = fetch(`${BACKEND}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataToJson(input)),
        });
        const body = await response.then((res) => res.json());
        switch ((await response).status) {
            case 200:
                console.log(body);
                // @ts-ignore
                cookies.set("session", input.get("username"), { path: "/", maxAge: 60 * 60 * 24 * 7 });
                throw redirect(303, "/");
            case 400:
                console.log(body);
                break;
            case 401:
                console.log(body);
                break;
            case 500: 5
                console.log(body);
                break;
            default:
                console.log(`uncaught response ${await response}`);
                break;
        }
    },
}