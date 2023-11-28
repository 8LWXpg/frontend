import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    register: async ({ cookies, request }) => {
        const input = await request.formData();
        console.log(input.get('username'), input.get('password'), input.get('email'));
    },
};