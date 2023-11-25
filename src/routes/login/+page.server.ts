import type { PageServerLoad } from './$types';

export async function load({ cookies }) {
    // TODO: check if user is logged in
}

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');
        console.log(username, password);
    }
}