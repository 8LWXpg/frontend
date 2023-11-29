import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

const apiurl = "http://localhost:8080";

export const actions = {
    register: async ({ cookies, request }) => {
        const input = await request.formData();
        console.log(input);
        fetch(`${apiurl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        }).then((response) => {
            switch (response.status) {
                case 200:
                    alert(response.headers.get("status"));
                    break;
                case 400:
                    alert(response.headers.get("error"));
                    break;
                case 500:
                    alert(response.headers.get("error"));
                    break;
                case 401:
                    alert(response.headers.get("error"));
                    break;
                default:
                    alert(`uncaught response ${response}`);
                    break;
            }
            console.log(response);
        });
    },
}