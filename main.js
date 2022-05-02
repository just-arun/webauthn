
const info = document.querySelector("div#info");
const output = document.querySelector("div#output");
const error = document.querySelector("div#error");

const chal1 = new Uint8Array(40);
window.crypto.getRandomValues(chal1);
const chal2 = new Uint8Array(40);
window.crypto.getRandomValues(chal2);
console.log(chal1, chal2);

// sample arguments for login
var getCredentialDefaultArgs = {
	publicKey: {
		timeout: 60000,
		// allowCredentials: [newCredential] // see below
		challenge: chal1.buffer
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

			challenge: chal2.buffer,
			authenticatorSelection: {
				authenticatorAttachment: "platform",
				userVerification: "required",
			}
		},
	})
		.then((cred) => {
			var idList = [{
				id: cred.rawId,
				transports: ["usb", "nfc", "ble", "internal"],
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