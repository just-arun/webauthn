
        const info = document.querySelector("div#info");
        const output = document.querySelector("div#output");
        const error = document.querySelector("div#error");

        // sample arguments for login
        var getCredentialDefaultArgs = {
            publicKey: {
                timeout: 60000,
                // allowCredentials: [newCredential] // see below
                challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                    0x79, 0x50, 0x68, 0x71, 0xDA, 0xEE, 0xEE, 0xB9, 0x94, 0xC3, 0xC2, 0x15, 0x67, 0x65, 0x26, 0x22,
                    0xE3, 0xF3, 0xAB, 0x3B, 0x78, 0x2E, 0xD5, 0x6F, 0x81, 0x26, 0xE2, 0xA6, 0x01, 0x7D, 0x74, 0x50
                ]).buffer
            },
        };

        const login = () => {
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then(function (available) {
                    info.textContent += `\n\n ${available}`
                    if (available) {
                        // We can proceed with the creation of a PublicKeyCredential
                        // with this authenticator
                        return navigator.credentials.get(getCredentialDefaultArgs);
                    } else {
                        // Use another kind of authenticator or a classical login/password
                        // workflow
                        error.textContent = "not supported"
                    }
                }).then((res) => {
                    info.textContent = `${info.textContent} \n\n  assertion ${res.id}`
                }).catch(function (err) {
                    // Something went wrong
                    console.error(err);
                });
        }
        const registerFun = () => {
            navigator.credentials.create({
                publicKey: {
                    // Relying Party (a.k.a. - Service):
                    rp: {
                        name: "Acme",
                        // id: "biom.netlify.app"
                    },

                    // User:
                    user: {
                        id: new Uint8Array(16),
                        name: "john.p.smith@example.com",
                        displayName: "John P. Smith"
                    },

                    pubKeyCredParams: [{
                        type: "public-key",
                        alg: -7
                    }],

                    attestation: "none",

                    timeout: 60000,

                    challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                        0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
                        0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
                    ]).buffer,
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required",
                    }
                },
            })
                .then((cred) => {
                    var idList = [{
                        id: cred.rawId,
                        transports: ["usb", "nfc", "ble"],
                        type: "public-key"
                    }];
                    getCredentialDefaultArgs.publicKey.allowCredentials = idList;
                    info.textContent = `${info.textContent} \n\n ID: ${cred.id} TYPE: ${cred.type} }`
                    localStorage.setItem("finger", cred.rawId)
                })
                .catch(err => {
                    console.log(err);
                    error.textContent = typeof error == "string" ? err : JSON.stringify({ err })
                })
        }