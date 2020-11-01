// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
// use API_PATH + "route" instead of localhost:3000/api/... LOOK AT  below
// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!


let API_PATH;
if(__DEV__){
    // if build is in development mode, use localhost server
    API_PATH = "http://localhost:3000/api/"
}
else{
    // if build is in production mode, use heroku server
    API_PATH = "https://damp-tor-76670.herokuapp.com/api/"
}

//submits a request to the API to get all users
export const fetchUsers = async () =>{
    const req = await fetch(API_PATH + "users")
    const data = await req.json();
    return data
}

//submits a request to the API to create new user with specified name and password
export const createUser = async (name, password) =>{
    const res = await fetch(API_PATH + "users",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            password: password
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to check whether the user exists and validate their password
export const loginUser = async (name, password) =>{
    const res = await fetch(API_PATH + "loginUser",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            password: password,
        })
    })
    const data = await res.json();
    console.log(data);
    return data
}

export const getObjectByID = async (input) =>{
    const res = await fetch(API_PATH + "getObjectByID",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: input.id,
            type: input.type
        })
    })
    const data = await res.json();
    // console.log(data);
    return data
}

export const getUser = async (name) =>{
    const res = await fetch(API_PATH + "getUser",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name
        })
    })
    const data = await res.json();
    console.log(data);
    return data
}

//submits a request to the API to add user to group
export const joinGroup = async (user_id, group_id) =>{
    console.log("User: " + user_id)
    console.log("Group: " + group_id)
    const res = await fetch(API_PATH + "joinGroup",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            group_id: group_id
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to create new group with specified name
export const createGroup = async (name) =>{
    const res = await fetch(API_PATH + "groups",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to create new game with certain parameters
export const createGame = async (name, user_ids, group_id) =>{
    console.log('send api')
    const res = await fetch(API_PATH + "createGame",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            user_ids: user_ids,
            group_id: group_id
        })
    })
    const data = await res.json();
    return data
}

// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
// use API_PATH + "route" instead of localhost:3000/api/... LOOK AT  above
// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
// CAUTION!!!!!!!!!!!!!!!!!!!
