import { redirect } from '@sveltejs/kit';

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete("session");
        throw redirect(303, "/");
    }
}