import { Autor } from "./autor";
import { Genero } from "./genero";
import { Reserva } from "./reserva";

export class Livro {
    id!: number;
    titulo!: string;
    autor!: Autor;
    reservas!: Reserva[];
    generos!: Genero[];
}
