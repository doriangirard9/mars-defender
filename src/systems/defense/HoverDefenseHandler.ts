import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import * as PIXI from "pixi.js";
import {getDefenseData, IDefense} from "../../models/models.ts";

// components
import Tag from "../../components/core/Tag.ts";
import Transform from "../../components/core/Transform.ts";
import Hover from "../../components/core/Hover.ts";
import Defense from "../../components/Defense.ts";
import Shape from "../../components/core/Shape.ts";
import Parent from "../../components/core/Parent.ts";
import Children from "../../components/core/Children.ts";
import Drag from "../../components/core/Drag.ts";

export default class HoverDefenseHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Hover", "Defense", "Transform", "Drag"])) {
            const hoverComponent: Hover = entity.getComponent("Hover") as Hover;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const defenseComponent: Defense = entity.getComponent("Defense") as Defense;
            const dragComponent: Drag = entity.getComponent("Drag") as Drag;

            dragComponent.onPointerMove.push((event: any): void => {
                hoverComponent.isEnable = false;
                this.deleteDefenseRange(entity);
            });

            dragComponent.onPointerUp.push((): void => {
                hoverComponent.isEnable = true;
            });

            hoverComponent.onPointerEnter.push((): void => {
                this.OnDefenseHover(transformComponent, defenseComponent, entity);
            });

            hoverComponent.onPointerLeave.push((): void => {
                this.deleteDefenseRange(entity);
            });
        }
    }

    OnDefenseHover(transformComponent: Transform, defenseComponent: Defense, defense: Entity): void {
        const defenseData: IDefense = getDefenseData(defenseComponent.type);

        const rangeCircle: Entity = new Entity();
        rangeCircle.addComponent(new Tag(rangeCircle, "rangeCircle"));
        rangeCircle.addComponent(new Transform(rangeCircle));
        rangeCircle.addComponent(new Parent(rangeCircle, defense, true, false));

        const graphics: PIXI.Graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000, 0.2);
        graphics.drawCircle(transformComponent.position.x, transformComponent.position.y, defenseData.range);
        graphics.endFill();

        rangeCircle.addComponent(new Shape(rangeCircle, graphics));
        this.entityManager.addEntity(rangeCircle);
    }

    deleteDefenseRange(defense: Entity): void {
        const childrenComponent: Children = defense.getComponent("Children") as Children;

        for (let i: number = childrenComponent.children.length - 1; i >= 0; i--) {
            const child: Entity = childrenComponent.children[i];

            if (!child.hasComponents(["Tag"])) {
                continue;
            }

            const tagComponent: Tag = child.getComponent("Tag") as Tag;
            if (tagComponent.tag !== "rangeCircle") {
                continue;
            }

            this.entityManager.removeEntity(child);
            childrenComponent.children.splice(i, 1);
        }
    }

    update(deltaTime: number): void {}
}