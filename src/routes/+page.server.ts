import { as, type P } from "vitest/dist/reporters-5f784f42.js";

const url = 'http://localhost/zabbix/api_jsonrpc.php';
const headers = {
    'Content-Type': 'application/json-rpc'
};

async function getToken(): Promise<string> {
    const data = {
        jsonrpc: '2.0',
        method: 'user.login',
        params: {
            username: 'Admin',
            password: 'zabbix'
        },
        id: 1
    };

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            if (result.result) {
                resolve(result.result);
            } else {
                reject('No result found');
            }
        }).catch(err => {
            console.error('Error:', err);
            reject(err);
        });
    });
}
async function getHistory() {
    const data = {
        jsonrpc: "2.0",
        method: "history.get",
        params: {
            output: "extend",
            history: 0,
            itemids: ["50093"],
            sortfield: "clock",
            sortorder: "DESC",
            limit: 1
        },
        "auth": `${await getToken()}`,
        "id": 1
    };

    const response = fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    });
    const body = await response.then((res) => res.json());
}