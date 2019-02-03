export class Player {

    public readonly id: string;
    public readonly name: string;

    private constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

}