import {createClient} from "@clickhouse/client-web";

const client = createClient({
    url     : `${process.env.CLICKHOUSE_PROTOCOL}://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT}`,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
});

export default client;