import type { PageServerLoad } from './$types';
import { formDataToJson } from '$lib/common';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

const apiurl = "http://localhost:8080";

export async function load({ cookies }) {
    // TODO: check if user is logged in
}

export const actions = {
    login: async ({ cookies, request }) => {
        const input = await request.formData();
        fetch(`${apiurl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataToJson(input)),
        }).then((response) => {
            switch (response.status) {
                case 200:
                    console.log(response.statusText);
                    break;
                case 400:
                    console.log(response.statusText);
                    break;
                case 401:
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