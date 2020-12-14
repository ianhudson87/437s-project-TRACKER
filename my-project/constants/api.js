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

// submits request to create a pending user
export const createPendingUser = async (name, email, password) =>{
    const res = await fetch(API_PATH + "createPendingUser",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to create new user with specified name and password
export const createUser = async (name, email, password) =>{
    const res = await fetch(API_PATH + "users",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
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

//submits a request to the API to attempt to verify the email of a new user
export const verifyEmail = async (pending_user_id, verification_code) =>{
    const res = await fetch(API_PATH + "verifyEmail",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pending_user_id: pending_user_id,
            verification_code: verification_code
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

export const getObjectsByIDs = async (input) =>{
    const res = await fetch(API_PATH + "getObjectsByIDs",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: input.ids,
            type: input.type
        })
    })
    const data = await res.json();
    // console.log(data);
    return data
}

export const searchObjectsByString = async (input) =>{
    console.log("here3")
    const res = await fetch(API_PATH + "searchObjectsByString",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query_string: input.query_string,
            type: input.type
        })
    })
    const data = await res.json();
    // console.log(data);
    return data
}

export const getGameByID = async (input) =>{
    console.log(input.id)
    const res = await fetch("http://localhost:3000/api/getGameByID",{
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
export const joinGroup = async (user_id, group_code) =>{
    console.log("User: " + user_id)
    console.log("Group: " + group_code)
    const res = await fetch(API_PATH + "joinGroup",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            group_code: group_code
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to add user to game
export const joinGame = async (user_id, game_id) =>{
    console.log("User: " + user_id)
    console.log("Game: " + game_id)
    const res = await fetch("http://localhost:3000/api/games",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            game_id: game_id
        })
    })
    const data = await res.json();
    return data
}

export const fetchGroups = async () =>{
    const req = await fetch(API_PATH + "groups")
    const data = await req.json();
    return data
}

//submits a request to the API to create new group with specified name
export const createGroup = async (name, description, creator_id, games_require_accept) =>{
    console.log(creator_id)
    const res = await fetch(API_PATH + "groups",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            creator_id: creator_id,
            games_require_accept,
        })
    })
    const data = await res.json();
    return data
}


//submits a request to the API to create new game with certain parameters

export const createGame = async (pending, name, user_ids, group_id, game_type, goal_score, requester_id) =>{
    console.log(pending, name, user_ids, group_id, game_type, goal_score)
    if(!pending){
        // group doesn't require acceptance from users
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
                group_id: group_id,
                game_type: game_type,
                goal_score: goal_score,
            })
        })
        const data = await res.json();
        return data
    }
    else{
        // group requires acceptance from users, make pending game
        const res = await fetch(API_PATH + "createPendingGame",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                user_ids: user_ids,
                group_id: group_id,
                game_type: game_type,
                goal_score: goal_score,
                requester_id: requester_id
            })
        })
        const data = await res.json();
        return data
    }
}

//submits a request to the API to change score of certain user
export const changeScore = async (scoreData) =>{
    /*
    scoreData = {
        game_id:  // game that you want to change the score of
        user_id:  // user you want to change the score of
        type:  // how to want to change score. "delta"=>change current score by some amount. "set"=>set score to some amount
        amount:  // that amount that you want to change/set
    }
    */
    const res = await fetch(API_PATH + "changeScore",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            game_id: scoreData.game_id,
            user_id: scoreData.user_id,
            type: scoreData.type,
            amount: scoreData.amount
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to change score of certain user
export const moveToNextRound = async (resultData) =>{
    /*
    resultData = {
        tournament_id:  // tournament that you want to change a result in
        index: // index of the results array that is to be advanced to the next round
    }
    */
    const res = await fetch(API_PATH + "moveToNextRound",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tournament_id: resultData.tournament_id,
            index: resultData.index,
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to add a friend
export const addFriend = async (friendData) =>{
    /*
    friendData = {
        user_friending_id:       // id of user who is sending friend request
        user_being_friended_id:  // id of user who the friend request is sent to
    }
    */
    const res = await fetch(API_PATH + "addFriend",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_friending_id: friendData.user_friending_id,
            user_being_friended_id: friendData.user_being_friended_id,
        })
    })
    const data = await res.json();
    return data
}

//submits a request to the API to add a friend
export const checkFriends = async (checkFriendsData) =>{
    /*
    checkFriendsData = {
        user1_id:  // id of user who is sending friend request
        user2_id:  // id of user who the friend request is sent to
    }
    */
    const res = await fetch(API_PATH + "checkFriends",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user1_id: checkFriendsData.user1_id,
            user2_id: checkFriendsData.user2_id,
        })
    })
    const data = await res.json();
    return data
}

export const getPendingGamesOfUser = async (user_id) =>{
    const res = await fetch(API_PATH + "getPendingGamesOfUser",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
        })
    })
    const data = await res.json();
    return data
}

export const acceptGame = async (user_id, pending_game_id) => {
    console.log("accept game")
    const res = await fetch(API_PATH + "acceptGame",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            pending_game_id: pending_game_id
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
