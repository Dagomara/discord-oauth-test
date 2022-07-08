const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/DiscordUser');

 passport.serializeUser((user, done) => {
    console.log("Serializing User");
    done(null, user.id);
 });
 passport.deserializeUser(async (id, done) => {
    console.log("Deserializing User");
    // check if user exists in db
    const user = await DiscordUser.findById(id);
    if (user)
        done(null, user);
 });

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'guilds', 'guilds.join']
}, async (accessToken, refreshToken, profile, done) => {
    // accessToken identifies clients as authenticated; expire
    try {
        // see if user already exists in db
        const user = await DiscordUser.findOne({ discordID: profile.id });
        if (user) {
            console.log("user exists.");
            done(null, user); // invokes passport.serializeUser() 
        }
        else {
            console.log("adding new user.");
            const newUser = await DiscordUser.create({
                discordID: profile.id,
                username: profile.username,
                guilds: profile.guilds
            });
            const savedUser = await newUser.save();
            done(null, savedUser); // also serializes User
        }
    }
    catch(err) {
        console.log(err);
        done(err, null); // user becomes null
    }
}));