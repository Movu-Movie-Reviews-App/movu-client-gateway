import { PassportStrategy } from "@nestjs/passport";
import { NATS_SERVICE } from "src/config";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-custom";
import { firstValueFrom } from "rxjs";

export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {

    constructor(
        @Inject(NATS_SERVICE) private readonly authClient: ClientProxy
    ) {

        super()

    }

    async validate(req: Request) {

        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Missing token');
        }

        const token = authHeader.split(' ')[1];

        // auth-service owns the signing secret, so it is the only place the token
        // can actually be verified. Any failure there means "not authenticated",
        // never a 500.
        let response: { valid: boolean; user: unknown };

        try {
            response = await firstValueFrom(
                this.authClient.send(
                    'auth.check-status',
                    { token },
                ),
            );
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        if (!response?.valid) {
            throw new UnauthorizedException('Invalid token');
        }

        return response.user;
    }

}