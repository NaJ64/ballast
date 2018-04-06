import * as THREE from 'three';
import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';

export class CameraComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.CameraComponent;
    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {
        // This component will adjust the camera based on user input
    }

}