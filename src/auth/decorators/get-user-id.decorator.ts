import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const getUserId = createParamDecorator((data, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();

    const userId = req.user.id

    if (!userId) throw new InternalServerErrorException('User not found (request)')

    return userId;
})