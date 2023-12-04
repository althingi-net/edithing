import Koa from 'koa';
import passport from 'koa-passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import auth from '../config/auth';
import server from '../config/server';
import User from '../entities/User';

const setupPassport = (app: Koa) => {
    passport.use(
        new LocalStrategy({
            passwordField: 'password',
            usernameField: 'email',
            session: false,
        },
        function(email, password, done) {
            User.findOne({ where: { email } })
                .then(async (user) => {
                    const error = null;

                    if (!user || !(await user.comparePassword(password))) {
                        return done(error, false);
                    }

                    return done(error, user);
                })
                .catch(done);
        })
    );

    const opts: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: auth.jwt.secret,
        issuer: server.host,
        audience: server.host,
    };

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        const id = Number(jwt_payload.userId);
        User.findOneBy({ id })
            .then((user) => done(null, user ?? false))
            .catch(done);
    }));

    app.use(passport.initialize());
};

export default setupPassport;