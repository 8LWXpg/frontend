import { redirect } from '@sveltejs/kit';

export const actions = {
}

import axios from 'axios';

export const actions = {
    async login(request) {
        const response = await axios.post('http://localhost/zabbix/api_jsonrpc.php', {
            jsonrpc: '2.0',
            method: 'user.login',
            params: {
                username: 'Admin',
                password: 'zabbix'
            },
            id: 1
        }, {
            headers: {
                'Content-Type': 'application/json-rpc'
            }
        });

        return {
            body: response.data
        };
    }
}