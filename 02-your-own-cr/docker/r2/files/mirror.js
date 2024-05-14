export default {set}

const mirror      = 'mirror'
const privateRepo = 'private'

function set(r) {
    let c = mirror;

    if (r.method !== 'GET')
        c = privateRepo;

    return c;
}