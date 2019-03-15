import { WebRtcClient } from "./webRtcClient";
import { WebRtcServer } from "./webRtcServer";

export class WebRtcConnector {
    constructor() {
        console.log(window.location.href);
        if (window.location.href.indexOf('#') > 0) {
            var serverName = decodeURI(window.location.href.split('#')[1]);
            console.log(serverName);
            var client = new WebRtcClient(serverName);
        } else {
            var server = new WebRtcServer();
        }
    }
}