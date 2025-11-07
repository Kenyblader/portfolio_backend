import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext):  Promise<boolean>  {
        const req= context.switchToHttp().getRequest();
        const tocken= this.extractTokenFromHeader(req);
        if(!tocken){
            throw new UnauthorizedException();
        }
        try {
            console.log("le tocken",tocken)
            const payload= await this.jwtService.verifyAsync(tocken,{
                secret: process.env.JWT_KEY,
            });
            req['user'] = payload
        } catch {
            throw new UnauthorizedException()
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}