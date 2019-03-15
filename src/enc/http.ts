export class Http {
    public get = (url: string, callback?: (response: string) => void, errorCallback?: () => void) => {
        this.request("GET", url, null, callback, errorCallback)
    }
    public post = (url: string, data: string, callback?: (response: string) => void, errorCallback?: () => void) => {
        this.request("POST", url, data, callback, errorCallback)
    }

    private request = (method: string, url: string, data: string, callback?: (response: string) => void, errorCallback?: () => void) => {
        console.log(method + " " + url);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                console.log("response: " + xhr.status);
                if (xhr.status == 200) {
                    if (callback) {
                        callback(xhr.responseText);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            }
        };
        xhr.open(method, url, true);
        if (method == "POST") {
            xhr.send(data);
        }
        else {
            xhr.send();
        }
    }
}