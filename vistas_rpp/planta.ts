namespace Tignino{
    export class Planta {
        protected codigo: string;
        protected nombre: string;
        protected color_flor: string;
        protected precio: number;
        protected foto: string;

        constructor(codigo: string, nombre: string, color_flor: string, precio: number, foto?: string) {
            this.codigo = codigo;
            this.nombre = nombre;
            this.color_flor = color_flor;
            this.precio = precio;
            this.foto = foto ? foto : "";
        }

        public GetCodigo () : string 
        {
            return this.codigo;    
        }

        public GetNombre() : string
        {
            return this.nombre;
        }    
        
        public GetColor() : string
        {
            return this.color_flor;
        }

        public GetPrecio() : number
        {
            return this.precio;
        }

        public GetFoto() : string
        {
            return this.foto;
        }

        public SetFoto(foto: string): void {
            this.foto = foto;
        }

        toJSON(): string {
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
}