export class DemoUserDto {
    id: number;
    name: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, name: string,  deleted: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

