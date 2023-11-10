"use strict";
var Tignino;
(function (Tignino) {
    class Planta {
        constructor(codigo, nombre, color_flor, precio, foto) {
            this.codigo = codigo;
            this.nombre = nombre;
            this.color_flor = color_flor;
            this.precio = precio;
            this.foto = foto ? foto : "";
        }
        GetCodigo() {
            return this.codigo;
        }
        GetNombre() {
            return this.nombre;
        }
        GetColor() {
            return this.color_flor;
        }
        GetPrecio() {
            return this.precio;
        }
        GetFoto() {
            return this.foto;
        }
        SetFoto(foto) {
            this.foto = foto;
        }
        toJSON() {
            // Devuelve un objeto con las propiedades necesarias
            return JSON.stringify({
                codigo: this.codigo,
                nombre: this.nombre,
                color_flor: this.color_flor,
                precio: this.precio,
                foto: this.foto
            });
        }
    }
    Tignino.Planta = Planta;
})(Tignino || (Tignino = {}));
//# sourceMappingURL=planta.js.map