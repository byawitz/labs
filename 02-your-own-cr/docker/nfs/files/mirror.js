export default {set}

const mirror      = 'mirror'
const privateRepo = 'private'

function set(r) {
    let c = mirror;

    if (r.method !== 'GET')
        c = privateRepo;

    r.log(100,"HI");
    r.error(r.method);
    r.error(c);

    return c;
}