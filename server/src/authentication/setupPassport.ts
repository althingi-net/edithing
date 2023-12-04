import passport from 'koa-passport';
import auth from '../config/auth';
import User from '../entities/User';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import server from '../config/server';
import Koa from 'koa';

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opts = {} as any;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = auth.jwt.secret;
    opts.issuer = server.host;
    opts.audience = server.host;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        const id = Number(jwt_payload.sub);
        User.findOneBy({ id })
            .then((user) => done(null, user ?? false))
            .catch(done);
    }));

    app.use(passport.initialize());
};

export default setupPassport;