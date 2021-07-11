import { Injectable } from "@angular/core";

@Injectable()
export class SessionService {

    isAuthenticated(): boolean {
        return true;
    }
}