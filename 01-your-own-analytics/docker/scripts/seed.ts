import client from './client';
import {faker} from '@faker-js/faker';
import {customAlphabet} from "nanoid";

let counter      = 0;
const numOfUsers = faker.number.int({min: 1000, max: 5000});
console.log(`Generating info for ${numOfUsers} users`);

const start = (+new Date());
for (let i = 0; i < numOfUsers; i++) {
    const values       = [];
    const path         = faker.internet.url();
    const locale       = faker.helpers.uniqueArray(["en", "ru", "ar", "af", "al", "eu", "uk", "pr"], 1)[0];
    const numOfActions = faker.number.int({min: 50, max: 1500});
    const user_id      = generateID();

    for (let j = 0; j < numOfActions; j++) {

        const day        = faker.date.between({from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(), to: new Date().toISOString()});
        const session_id = generateID();

        for (let k = 0; k < 10; k++) {
            counter++;
            const ts = addMinutes(day, faker.number.int({min: 1, max: 4}));
            values.push({
                appVersion       : `${faker.number.int({min: 0, max: 3})}.0.${faker.number.int({min: 1, max: 15})}`,
                browser_name     : faker.helpers.uniqueArray(["firefox", "chrome", "safari", "edge", "netscape"], 1)[0],
                browser_version  : `${faker.number.int({min: 80, max: 110})}.0`,
                city_name        : faker.location.city(),
                country_code     : faker.location.countryCode(),
                country_name     : faker.location.country(),
                details          : {
                    meta_a: "meta_a",
                    meta_b: "meta_b"
                },
                device_brand     : faker.helpers.uniqueArray(["apple", "google", "rim"], 1)[0],
                device_name      : faker.helpers.uniqueArray(["iphone", "galaxy", "q10"], 1)[0],
                device_os_name   : faker.helpers.uniqueArray(["ios", "android", "blackberry"], 1)[0],
                device_os_version: `${faker.number.int({min: 4, max: 19})}.1.${faker.number.int({min: 1, max: 15})}`,
                device_type      : faker.helpers.uniqueArray(["smartphone", "pc", "tablet"], 1)[0],
                timestamp        : ts.toISOString().slice(0, -5),
                type             : faker.helpers.uniqueArray(["click", "first_visit", "add_to_cart", "purchase", "removed_item"], 1)[0],
                project          : faker.helpers.uniqueArray(["app", "website"], 1)[0],
                locale,
                path,
                session_id,
                user_id,
            });
        }
    }

    await client.insert({
        table : `${process.env.CLICKHOUSE_DB}.data`,
        format: "JSONEachRow",
        values: values,
    });
}

function generateID(): string {
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-', 15)();
}

function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
}

const totalTime = (+new Date()) - start;
console.log(`inserted ${counter} rows in ${totalTime}ms (${totalTime / 1000}s)`);