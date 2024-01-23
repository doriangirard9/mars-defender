import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import SpriteBuilder from "../../managers/SpriteBuilder.ts";
import Vector2 from "../../utils/Vector2.ts";
import * as PIXI from "pixi.js";
import {IDefense, SpriteLayer} from "../../models/models.ts";
import {getDefenseData} from "../../models/models.ts";

// components
import Tag from "../../components/core/Tag.ts";
import Click from "../../components/core/Click.ts";
import Transform from "../../components/core/Transform.ts";
import Sprite from "../../components/core/Sprite.ts";
import Children from "../../components/core/Children.ts";
import Parent from "../../components/core/Parent.ts";
import Text from "../../components/core/Text.ts";

export default class CreateDefenseButtonHandler implements ISystem {
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

    OnDefenseClick(type: string): void {
        this.eventManager.notify("OnCreateDefense", type);

        const ui: Entity | null = this.getUI();
        if (ui) {
            this.entityManager.removeEntity(ui);
        }
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Click", "Tag"])) {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const clickComponent: Click = entity.getComponent("Click") as Click;

            if (tagComponent.tag !== "buttonCreateDefense") {
                return;
            }

            clickComponent.onPointerDown.push((): void => {
                this.OnButtonCreateDefenseClick();
            });
        }
    }

    getUI(): Entity | null {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Tag", "Children"]);

        for (let i: number = 0; i < entities.length; i++) {
            const tagComponent: Tag = entities[i].getComponent("Tag") as Tag;
            if (tagComponent.tag === "defenseContainer") {
                return entities[i];
            }
        }

        return null;
    }

    OnButtonCreateDefenseClick(): void {
        const ui: Entity | null = this.getUI();
        if (ui) {
            this.entityManager.removeEntity(ui);
        }
        else {
            this.createUI();
        }
    }

    createUI(): void {
        const defenseContainer: Entity = new Entity();
        defenseContainer.addComponent(new Transform(defenseContainer, new Vector2(2, 55)));
        defenseContainer.addComponent(new Children(defenseContainer));
        defenseContainer.addComponent(new Tag(defenseContainer, "defenseContainer"));
        const defenseContainerSprite: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/longContainer.png"))
            .addEntity(defenseContainer)
            .addScale(new Vector2(0.35, 0.435))
            .addAnchor(new Vector2(0, 0))
            .addZIndex(SpriteLayer.UI)
            .build();
        defenseContainer.addComponent(defenseContainerSprite);
        this.entityManager.addEntity(defenseContainer);

        // create first sprite container
        const spriteContainer: Entity = new Entity();
        spriteContainer.addComponent(new Transform(spriteContainer));
        spriteContainer.addComponent(new Children(spriteContainer));
        spriteContainer.addComponent(
            new Parent(
                spriteContainer,
                defenseContainer,
                true,
                false,
                new Vector2(9, 10)
            )
        );
        const spriteContainerSprite: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/container.png"))
            .addEntity(spriteContainer)
            .addScale(new Vector2(0.3, 0.3))
            .addAnchor(new Vector2(0, 0))
            .addZIndex(SpriteLayer.UI)
            .build();
        spriteContainer.addComponent(spriteContainerSprite);
        spriteContainer.addComponent(new Click(spriteContainer));
        this.entityManager.addEntity(spriteContainer);

        let clickComponent: Click = spriteContainer.getComponent("Click") as Click;
        clickComponent.onPointerDown.push((): void => {
            this.OnDefenseClick("cannon");
        });

        // create defense sprite
        const defenseSprite: Entity = new Entity();
        defenseSprite.addComponent(new Transform(defenseSprite));
        defenseSprite.addComponent(
            new Parent(
                defenseSprite,
                spriteContainer,
                true,
                false,
                new Vector2(60, 58)
            )
        );

        // create defense text
        const defenseText: Entity = new Entity();
        defenseText.addComponent(new Transform(defenseText));
        defenseText.addComponent(new Parent(defenseText, spriteContainer, true, false, new Vector2(65, 95)));
        const defenseData: IDefense = getDefenseData("cannon");
        defenseText.addComponent(new Text(defenseText, new PIXI.Text(defenseData.price), new Vector2(0.7, 0.7)));
        this.entityManager.addEntity(defenseText);

        const defenseSpriteSprite: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/defenses/cannon.png"))
            .addEntity(defenseSprite)
            .addScale(new Vector2(0.35, 0.35))
            .addRotationOffset(Math.PI / 2)
            .addZIndex(SpriteLayer.UI)
            .build();
        defenseSprite.addComponent(defenseSpriteSprite);
        this.entityManager.addEntity(defenseSprite);

        // create dollar icon
        const dollarIcon: Entity = new Entity();
        dollarIcon.addComponent(new Transform(dollarIcon));
        dollarIcon.addComponent(new Parent(dollarIcon, spriteContainer, true, false, new Vector2(40, 95)));
        dollarIcon.addComponent(new Sprite(dollarIcon, PIXI.Sprite.from("img/coins.png"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(dollarIcon);

        // create second sprite container
        const spriteContainer2: Entity = new Entity();
        spriteContainer2.addComponent(new Transform(spriteContainer2));
        spriteContainer2.addComponent(new Children(spriteContainer2));
        spriteContainer2.addComponent(
            new Parent(
                spriteContainer2,
                defenseContainer,
                true,
                false,
                new Vector2(9, 125)
            )
        );
        const spriteContainerSprite2: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/container.png"))
            .addEntity(spriteContainer2)
            .addScale(new Vector2(0.3, 0.3))
            .addAnchor(new Vector2(0, 0))
            .addZIndex(SpriteLayer.UI)
            .build();
        spriteContainer2.addComponent(spriteContainerSprite2);
        spriteContainer2.addComponent(new Click(spriteContainer2));
        this.entityManager.addEntity(spriteContainer2);

        clickComponent = spriteContainer2.getComponent("Click") as Click;
        clickComponent.onPointerDown.push((): void => {
            this.OnDefenseClick("machineGun");
        });

        // create defense sprite 2
        const defenseSprite2: Entity = new Entity();
        defenseSprite2.addComponent(new Transform(defenseSprite2));
        defenseSprite2.addComponent(
            new Parent(
                defenseSprite2,
                spriteContainer2,
                true,
                false,
                new Vector2(60, 58)
            )
        );

        // create dollar icon 2
        const dollarIcon2: Entity = new Entity();
        dollarIcon2.addComponent(new Transform(dollarIcon2));
        dollarIcon2.addComponent(new Parent(dollarIcon2, spriteContainer2, true, false, new Vector2(40, 95)));
        dollarIcon2.addComponent(new Sprite(dollarIcon2, PIXI.Sprite.from("img/coins.png"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(dollarIcon2);

        // create defense text 2
        const defenseText2: Entity = new Entity();
        defenseText2.addComponent(new Transform(defenseText2));
        defenseText2.addComponent(new Parent(defenseText2, spriteContainer2, true, false, new Vector2(65, 95)));
        const defenseData2: IDefense = getDefenseData("machineGun");
        defenseText2.addComponent(new Text(defenseText2, new PIXI.Text(defenseData2.price), new Vector2(0.7, 0.7)));
        this.entityManager.addEntity(defenseText2);

        const defenseSpriteSprite2: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/defenses/machineGun.png"))
            .addEntity(defenseSprite2)
            .addScale(new Vector2(0.35, 0.35))
            .addRotationOffset(Math.PI / 2)
            .addZIndex(SpriteLayer.UI)
            .build();
        defenseSprite2.addComponent(defenseSpriteSprite2);
        this.entityManager.addEntity(defenseSprite2);

        // create third sprite container
        const spriteContainer3: Entity = new Entity();
        spriteContainer3.addComponent(new Transform(spriteContainer3));
        spriteContainer3.addComponent(new Children(spriteContainer3));
        spriteContainer3.addComponent(
            new Parent(
                spriteContainer3,
                defenseContainer,
                true,
                false,
                new Vector2(9, 240)
            )
        );
        const spriteContainerSprite3: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/container.png"))
            .addEntity(spriteContainer3)
            .addScale(new Vector2(0.3, 0.3))
            .addAnchor(new Vector2(0, 0))
            .addZIndex(SpriteLayer.UI)
            .build();
        spriteContainer3.addComponent(spriteContainerSprite3);
        spriteContainer3.addComponent(new Click(spriteContainer3));
        this.entityManager.addEntity(spriteContainer3);

        clickComponent = spriteContainer3.getComponent("Click") as Click;
        clickComponent.onPointerDown.push((): void => {
            this.OnDefenseClick("missileLauncher");
        });

        // create defense sprite 3
        const defenseSprite3: Entity = new Entity();
        defenseSprite3.addComponent(new Transform(defenseSprite3));
        defenseSprite3.addComponent(
            new Parent(
                defenseSprite3,
                spriteContainer3,
                true,
                false,
                new Vector2(60, 58)
            )
        );

        // create dollar icon 3
        const dollarIcon3: Entity = new Entity();
        dollarIcon3.addComponent(new Transform(dollarIcon3));
        dollarIcon3.addComponent(new Parent(dollarIcon3, spriteContainer3, true, false, new Vector2(40, 95)));
        dollarIcon3.addComponent(new Sprite(dollarIcon3, PIXI.Sprite.from("img/coins.png"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(dollarIcon3);

        const defenseSpriteSprite3: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from("img/defenses/missileLauncher.png"))
            .addEntity(defenseSprite3)
            .addScale(new Vector2(0.35, 0.35))
            .addRotationOffset(Math.PI / 2)
            .addZIndex(SpriteLayer.UI)
            .build();
        defenseSprite3.addComponent(defenseSpriteSprite3);
        this.entityManager.addEntity(defenseSprite3);

        // create defense text 3
        const defenseText3: Entity = new Entity();
        defenseText3.addComponent(new Transform(defenseText3));
        defenseText3.addComponent(new Parent(defenseText3, spriteContainer3, true, false, new Vector2(65, 95)));
        const defenseData3: IDefense = getDefenseData("missileLauncher");
        defenseText3.addComponent(new Text(defenseText3, new PIXI.Text(defenseData3.price), new Vector2(0.7, 0.7)));
        this.entityManager.addEntity(defenseText3);
    }

    update(deltaTime: number): void {}
}