// define function for updating stats of users and groups
import * as Models from './model'

const update_groups_stats = async () => {
    console.log("update group stats")
    let groups = await Models.GroupModel.find()
    groups.forEach( async (group) => update_group_stats(group) )
}

const update_users_stats = async () => {
    console.log("update user stats")
    let users = await Models.UserModel.find()
    users.forEach( async (user) => update_user_stats(user) )
}

const update_group_stats = async (group) => {
    let stats = {}

    // get total number of games
    let total_num_of_games = group.games.length
    stats["total_num_of_games"] = total_num_of_games
    
    // create dictionary of user_id: {wins, user_name}
    let user_wins_dict = {}
    for(const user_id of group.users){
        // populate everyone with 0 wins
        let user = await Models.UserModel.findOne({ '_id': user_id })
        user_wins_dict[user_id] = {"wins": 0, "user_name": user.name}
    }
    for(const game_id of group.games){
        // go through all finished games and populate the dictionary
        let game = await Models.GameModel.findOne({ '_id': game_id })
        if(game.game_ended){
            let winner = game.winner
            user_wins_dict[winner._id]["wins"] += 1
        }
    }
    stats["users_wins_dict"] = user_wins_dict

    //console.log(stats)
}

const update_user_stats = async (user) => {
    //console.log("USERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", user.name)
    let stats = {}

    // get total number of games
    let total_num_of_games = user.games.length
    stats["total_num_of_games"] = total_num_of_games
    
    // find total number of wins, avg score over all games, avg fraction of max_points over all games
    let num_wins = 0
    let scores = []
    let fractions_of_max_points = []
    for(const game_id of user.games){
        // go through all finished games
        let game = await Models.GameModel.findOne({ '_id': game_id })
        if(game.game_ended){
            //console.log(game)
            let winner = game.winner

            // handle num_wins
            if(winner._id.equals(user._id)){
                num_wins += 1
            }

            // handle scores array
            let user_index_in_scores_array = game.users.indexOf(user._id)
            let score_of_user_in_game = game.scores[user_index_in_scores_array]
            scores.push(score_of_user_in_game)

            // handle fraction_of_max_points array
            let max_points_of_game = game.goal_score
            fractions_of_max_points.push(score_of_user_in_game / max_points_of_game)
        }
    }
    stats["total_num_of_wins"] = num_wins
    //console.log("frac2", fractions_of_max_points)
    stats["avg_score_over_all_games"] = scores.length != 0 ? scores.reduce((sum, val) => { return sum + val }) / scores.length : 0
    stats["avg_fraction_of_max_points_over_all_games"] = fractions_of_max_points.length != 0 ? fractions_of_max_points.reduce((sum, val) => { return sum + val }) / fractions_of_max_points.length : 0

    // // match ups against other users

    //console.log(stats)
    await Models.UserModel.updateOne({ '_id': user._id }, { '$set': { stats: stats }})
}

const update = () => {
    update_groups_stats()
    update_users_stats()
}

export default update