import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    register: async ({ cookies, request }) => {
        const input = await request.formData();
        console.log('username is :', input.get('username'));
    },
};