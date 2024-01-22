export default class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    sub(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    mult(vector: Vector2): Vector2 {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }

    div(vector: Vector2): Vector2 {
        return new Vector2(this.x / vector.x, this.y / vector.y);
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const mag: number = this.mag();
        return new Vector2(this.x / mag, this.y / mag);
    }

    limit(max: number): Vector2 {
        if (this.mag() > max) {
            return this.normalize().mult(new Vector2(max, max));
        }
        return this;
    }

    equals(vector: Vector2): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    dist(vector: Vector2): number {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }
}