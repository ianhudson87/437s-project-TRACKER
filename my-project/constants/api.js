// export const fetchUsers = () => {
//     return "http://localhost:3000/api/users"
// }

export const fetchUsers = async () =>{
    const req = await fetch("http://localhost:3000/api/users")
    const data = await req.json();
    return data
}

export const createUser = async () =>{
    const res = await fetch("http://localhost:3000/api/users",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "ian",
            password: "oof"
        })
    })
    const data = await res.json();
    return data
}
