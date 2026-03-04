import {Resolver, Query} from '@nestjs/graphql';

@Resolver()
export class BeastLockerShopResolver{
    @Query()
    beastLockerInfo(): string{
        return 'Beast Locker backend works!';
    }
}