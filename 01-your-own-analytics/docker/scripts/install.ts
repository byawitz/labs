import client from './client';

const dbDefinition =  `CREATE DATABASE IF NOT EXISTS ${process.env.CLICKHOUSE_DB}`;
const tableDefinition = `CREATE TABLE IF NOT EXISTS ${process.env.CLICKHOUSE_DB}.data
(
    appVersion        String,
    browser_name      String,
    browser_version   String,
    city_name         String,
    country_code      String,
    country_name      String,
    device_brand      String,
    device_name       String,
    device_os_name    String,
    device_os_version String,
    device_type       String,
    locale            String,
    path              String,
    type              String,
    project           String,
    session_id        String,
    user_id        String,
    timestamp         DateTime('UTC'),
    details Map(String, String)
    ) ENGINE = MergeTree()
    PRIMARY KEY (session_id, timestamp)`;


    await client.exec({query:dbDefinition});
    await client.exec({query:tableDefinition});


