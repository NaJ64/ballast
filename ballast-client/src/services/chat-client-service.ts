import { IChatMessage, IChatService } from 'ballast-core';
import { IClientService } from './client-service';

export interface IChatClientService extends IChatService, IClientService { }