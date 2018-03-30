import { Container } from 'inversify';
import { BallastClient } from '../app';

export function configureServices(container: Container, client: BallastClient): Container {
    return container;
}
