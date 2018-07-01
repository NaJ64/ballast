import { ISignInService } from 'ballast-core';
import { IClientService } from './client-service';

export interface ISignInClientService extends ISignInService, IClientService { }