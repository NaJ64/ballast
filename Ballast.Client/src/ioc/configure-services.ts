import { Container } from 'inversify';
import { BallastClient } from '../app/ballast-client';

export function configureServices(container: Container, client: BallastClient): Container {
    return container;
}
