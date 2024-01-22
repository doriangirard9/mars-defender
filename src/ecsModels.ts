export interface IComponent {
    name: string;
    entity: Entity;
}

export class Entity {
    components: Map<string, IComponent> = new Map();
    id: string;

    constructor() {
        this.id = Math.random().toString(36).slice(2);
    }

    addComponent(component: IComponent): void {
        this.components.set(component.name, component);
    }

    removeComponent(name: string): void {
        this.components.delete(name);
    }

    hasComponent(componentName: string): boolean {
        return this.components.has(componentName);
    }

    hasComponents(componentNames: string[]): boolean {
        return componentNames.every((componentName: string): boolean => {
            return this.hasComponent(componentName);
        });
    }

    getComponent(componentName: string): IComponent {
        const component: IComponent | undefined = this.components.get(componentName);

        if (!component) {
            throw new Error(`Component ${componentName} does not exist on entity ${this.id}`);
        }

        return component;
    }
}

export interface ISystem {
    update(deltaTime: number): void;
}