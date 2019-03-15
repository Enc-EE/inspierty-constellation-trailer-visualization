import { Http } from "../http";
import { EEventT } from "../eEvent";

export class WebRtcClient {
    rtcPeerConnection: RTCPeerConnection;
    http: Http;
    sigServeUrl = 'https://sigserve.azurewebsites.net/v1/';
    serverName: string;
    processName: string;
    candidateCheckInterval: number;
    dataChannel: RTCDataChannel;
    
    gotDataChannel = new EEventT<RTCDataChannel>();

    constructor(serverName: string) {
        this.serverName = serverName;
        this.http = new Http();
        const configuration = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
        this.rtcPeerConnection = new RTCPeerConnection(configuration);
        
        this.rtcPeerConnection.onicecandidate = (e) => {
            console.log(' ICE candidate: \n' + (e.candidate ? e.candidate.candidate : '(null)'));
            if (e.candidate) {
                this.addCandidate(e);
            }
        };

        this.connectSigServe();

        this.rtcPeerConnection.ondatachannel = (event) => {
            console.log("hi data channel");
            
            this.dataChannel = event.channel;
            this.dataChannel.onmessage = (e) => {
                console.log(e);
                this.gotDataChannel.dispatchEvent(this.dataChannel);
            }
            setTimeout(() => {
                this.sendData("Hi there");
            }, 3000);
        };
    }

    private addCandidate(e: RTCPeerConnectionIceEvent) {
        if (this.serverName && this.processName) {
            this.http.post(this.sigServeUrl + "clientcandidate/" + this.serverName + "/" + this.processName, JSON.stringify(JSON.stringify(e.candidate)));
        } else {
            setTimeout(() => {
                this.addCandidate(e);
            }, 3000);
            console.log("not configured");
        }
    }

    failCounter = 0;
    private connectSigServe = () => {
        var processName = this.makeid();
        this.http.post(
            this.sigServeUrl + "connectstart/" + this.serverName + "/" + processName,
            null,
            (response) => {
                this.processName = processName;
                this.waitForConnectOffer();
            },
            () => {
                this.failCounter++;
                if (this.failCounter < 5) {
                    this.connectSigServe()
                }
            });
    }

    private waitForConnectOffer = () => {
        this.http.get(this.sigServeUrl + "connectoffer/" + this.serverName + "/" + this.processName, (response) => {
            this.rtcPeerConnection.setRemoteDescription(JSON.parse(JSON.parse(response))).then(() => {
                this.rtcPeerConnection.createAnswer().then(
                    (desc) => {
                        this.rtcPeerConnection.setLocalDescription(desc);
                        console.log(JSON.stringify(JSON.stringify(desc)));

                        this.http.post(
                            this.sigServeUrl + "connectanswer/" + this.serverName + "/" + this.processName,
                            JSON.stringify(JSON.stringify(desc)),
                            (response) => {
                                this.checkCandidates()
                            })
                    },
                    (err) => {
                        console.log("error: " + err);
                    }
                )
            });
        }, () => {
            console.log("no connectoffer");
            console.log("retrying...");
            setTimeout(() => {
                this.waitForConnectOffer();
            }, 2000);
        });
    }

    addedCandidates: any[] = [];
    private checkCandidates = () => {
        console.log("checkCandidates");

        if (this.serverName && this.processName) {
            this.http.get(this.sigServeUrl + "servercandidate/" + this.serverName + "/" + this.processName, (response) => {
                var candidates = JSON.parse(response);
                for (let j = 0; j < candidates.length; j++) {
                    const candidate = JSON.parse(candidates[j]);

                    if (this.addedCandidates.indexOf(candidate) < 0) {
                        console.log("add candidate");

                        this.rtcPeerConnection.addIceCandidate(candidate);
                        this.addedCandidates.push(candidate);
                    }
                }

                // this.sendData("test123");

                setTimeout(() => {
                    this.checkCandidates();
                }, 2000);
            });
        } else {
            console.log("not configured");
        }
    }

    sendData(data: string) {
        this.dataChannel.send(data);
    }


    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}