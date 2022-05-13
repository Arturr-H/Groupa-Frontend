/*- Server urls -*/
export class ServerHandler {
    constructor() {
        this.url = "http://192.168.68.112:8082";//192.168.68.112:8082
        this.cdn = "https://artur.red";
    }

    /*- Functions -*/
    get_url() { return this.url; };
    get_cdn() { return this.cdn; };
}