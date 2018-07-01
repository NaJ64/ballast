import { IGameService } from 'ballast-core';
import { IClientService } from './client-service';

export interface IGameClientService extends IGameService, IClientService { }