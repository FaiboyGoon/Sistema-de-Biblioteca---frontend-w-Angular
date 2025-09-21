import { Livro } from "./livro";
import { Usuario } from "../auth/usuario";

export class Reserva {
    id!: number;
    dataReserva!: Date;
    usuario!: Usuario;
    livro!: Livro;
}
