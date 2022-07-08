const router = require('express').Router();

const guildID = process.env.GUILD_ID;

// Middleware function doing checks on users' discord logins. 
function isAuthorized(req, res, next) {
    if (req.user) {
        console.log("Dashboard: User is logged in.");
        next();
    }
    else {
        console.log("Dashboard: User is not logged in.");
        res.redirect('/');
    }
}
// isAuthorized is called with req, res, and the anon. function of res.send(200)
router.get('/', isAuthorized, (req, res) => {
    // check if user is on SquadUP server
    let svr = req.user.guilds.find(obj => obj.id == guildID);
    if (!svr)
    {
        console.log(`PUTting ${res.username} into the SquadUP guild:`);
        let parms = { "access_token": res.access_token };
        router.put(`https://discord.com/api/v9/guilds/${guildID}/members/${res.discordID}`).catch((err) => console.log(err));
    }
    // router.put();
    res.render('dashboard', {
        username: req.user.username, // from the DiscordUser model
        discordID: req.user.discordID,
        guilds: req.user.guilds
    });
});

module.exports = router;