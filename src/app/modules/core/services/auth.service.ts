import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { User } from "../models";
import { UrlConsts } from "../constants";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
    
    constructor(private apiService: ApiService) {

    }

    signin(credential: User): Observable<any> {
        return this.apiService.post(UrlConsts.LOGIN, credential);
    }
}