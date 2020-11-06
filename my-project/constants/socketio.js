import io from "socket.io-client";

let SOCKET_PATH;
if(__DEV__){
    // if build is in development mode, use localhost server
    SOCKET_PATH = "http://localhost:3000"
}
else{
    // if build is in production mode, use heroku server
    SOCKET_PATH = "https://damp-tor-76670.herokuapp.com"
}

export const getSocket = () => {
    return io(SOCKET_PATH)
}
