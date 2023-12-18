import { redirect } from '@sveltejs/kit';

const url = 'http://localhost/zabbix/api_jsonrpc.php';
const headers = {
    'Content-Type': 'application/json-rpc'
};

let cpuWarning = false;

let settings = {
    cpu: 0,
    mem: 0,
    bw: 0,
    dly: 0,
};

async function timeOut() {
    setInterval(async () => {
        cpuWarning = await getTrigger();
        // console.log(cpuWarning);
    }, 1000);
}

export function load({ cookies }) {
    return {
        settings: settings,
        cpuWarning: cpuWarning
    };
}

export const actions = {
    save: async ({ cookies, request }) => {
        const data = await request.formData();
        settings.cpu = Number(data.get('cpu'));
        settings.mem = Number(data.get('mem'));
        settings.bw = Number(data.get('bw'));
        settings.dly = Number(data.get('dly'));
        console.log(settings);
        throw redirect(302, '/');
    }
}

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
async function getTrigger(): Promise<boolean> {
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
    console.log(Number(body.result[0].value) > settings.cpu);
    return Number(body.result[0].value) > settings.cpu
}

timeOut();
