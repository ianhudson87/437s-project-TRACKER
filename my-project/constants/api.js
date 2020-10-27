// export const fetchUsers = () => {
//     return "http://localhost:3000/api/users"
// }

//submits a request to the API to get all users
export const fetchUsers = async () =>{
    const req = await fetch("http://localhost:3000/api/users")
    const data = await req.json();
    return data
}

//submits a request to the API to create new user with specified name and password
export const createUser = async (name, password) =>{
    const res = await fetch("http://localhost:3000/api/users",{
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
    const res = await fetch("http://localhost:3000/api/loginUser",{
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

export const getGroupByID = async (input) =>{
    console.log(input.id)
    const res = await fetch("http://localhost:3000/api/getGroupByID",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: input.id
        })
    })
    const data = await res.json();
    console.log(data);
    return data
}

export const getUser = async (name) =>{
    const res = await fetch("http://localhost:3000/api/getUser",{
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
    const res = await fetch("http://localhost:3000/api/joinGroup",{
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
    const res = await fetch("http://localhost:3000/api/groups",{
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