import { Http } from "../http";
import { EEventT } from "../eEvent";

export class WebRtcServer {
    rtcPeerConnection: RTCPeerConnection;
    http: Http;
    sigServeUrl = 'https://sigserve.azurewebsites.net/v1/';
    public serverName: string;
    connectionCheckInterval: number;
    processes: string[] = [];
    candidateCheckInterval: number;
    processName: string;

    isConnecting = false;
    dataChannel: RTCDataChannel;

    gotDataChannel = new EEventT<RTCDataChannel>();
    constructor() {
        this.http = new Http();
        const configuration = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
        this.rtcPeerConnection = new RTCPeerConnection(configuration);
        this.dataChannel = this.rtcPeerConnection.createDataChannel('chat');
        this.dataChannel.onmessage = (e) => {
            console.log(e);
            this.sendData("answer");
            this.gotDataChannel.dispatchEvent(this.dataChannel);
        }

        this.rtcPeerConnection.onicecandidate = (e) => {
            console.log(' ICE candidate: \n' + (e.candidate ? e.candidate.candidate : '(null)'));
            if (e.candidate) {
                this.addCandidate(e);
            }
        };

        this.rtcPeerConnection.onnegotiationneeded = () => {
            console.log("rtcPeerConnection.onnegotiationneeded");
            if (this.isConnecting) {
                console.log("rtcPeerConnection.onnegotiationneeded is connecting");
                try {
                    this.rtcPeerConnection.createOffer().then(
                        (desc) => {
                        },
                        function (err) {
                            console.log("error: " + err);
                        }
                    );
                } catch (err) {
                    console.error(err);
                }
            }
        };

        this.createSigServe();

    }

    failCounter = 0;

    public getServerUrl = (): string => {
        return window.location.href + "#" + this.serverName;
    }

    private createSigServe() {
        console.log("creating sig serve");

        var serverName = this.makeid();
        this.http.post(
            this.sigServeUrl + "create/" + serverName,
            null,
            (response) => {
                console.log("creating sig serve sucessful");
                this.serverName = serverName;
                console.log(window.location.href + "#" + this.serverName);
                this.waitForConnectStart();
            },
            () => {
                this.failCounter++;
                if (this.failCounter < 5) {
                    console.log("creating sig serve retry");
                    this.createSigServe()
                }
            });
    }

    private waitForConnectStart = () => {
        this.http.get(this.sigServeUrl + "connectstart/" + this.serverName, (response) => {
            this.processName = JSON.parse(response);
            this.rtcPeerConnection.createOffer().then(
                (desc) => {
                    this.rtcPeerConnection.setLocalDescription(desc);
                    this.http.post(
                        this.sigServeUrl + "connectoffer/" + this.serverName + "/" + this.processName,
                        JSON.stringify(JSON.stringify(desc)),
                        (response) => {
                            this.waitForConnectAnswer();
                        })
                },
                function (err) {
                    console.log("error: " + err);
                }
            );
        }, () => {
            console.log("no connectstart");
            console.log("retrying...");
            setTimeout(() => {
                this.waitForConnectStart();
            }, 2000);
        });
    }

    private waitForConnectAnswer = () => {
        this.http.get(this.sigServeUrl + "connectanswer/" + this.serverName + "/" + this.processName, (response) => {
            console.log("got answer");

            this.rtcPeerConnection.setRemoteDescription(JSON.parse(JSON.parse(response))).then(() => {
                console.log("after setRemoteDescription");
                this.checkCandidates();
            }, (err) => {
                console.log(err);
            });
        }, () => {
            console.log("no connectanswer");
            console.log("retrying...");
            setTimeout(() => {
                this.waitForConnectAnswer();
            }, 2000);
        });
    }

    addedCandidates: any[] = [];
    private checkCandidates = () => {
        console.log("checkCandidates");

        if (this.serverName && this.processName) {
            this.http.get(this.sigServeUrl + "clientcandidate/" + this.serverName + "/" + this.processName, (response) => {
                var candidates = JSON.parse(response);
                for (let j = 0; j < candidates.length; j++) {
                    const candidate = JSON.parse(candidates[j]);

                    if (this.addedCandidates.indexOf(candidate) < 0) {
                        console.log("add candidate");

                        this.rtcPeerConnection.addIceCandidate(candidate);
                        this.addedCandidates.push(candidate);
                    }
                }

                // this.sendData("test123server");

                setTimeout(() => {
                    this.checkCandidates();
                }, 2000);
            });
        } else {
            console.log("not configured");
        }
    }

    private addCandidate(e: RTCPeerConnectionIceEvent) {
        if (this.serverName && this.processName) {
            this.http.post(this.sigServeUrl + "servercandidate/" + this.serverName + "/" + this.processName, JSON.stringify(JSON.stringify(e.candidate)));
        } else {
            setTimeout(() => {
                this.addCandidate(e);
            }, 3000);
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