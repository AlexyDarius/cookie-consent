window.addEventListener('DOMContentLoaded', function() {

    // Fetch the JSON data from the specified URL
    fetch('https://dariusdev.fr/cookies/config.json')
        .then(response => response.json())
        .then(configData => {
            var privacyPolicyURL = configData.privacyPolicyURL;
            var cookieName = configData.cookieName || 'consentCookie';

            var cookieConsentBar = document.createElement('div');
            cookieConsentBar.setAttribute('id', 'cookie-msg');
            cookieConsentBar.classList.add('fixed-bottom', 'rounded', 'col-md-7', 'col-lg-5', 'col-xl-4', 'col-xxl-3');

            var mainMessage = document.createElement('div');
            mainMessage.innerHTML = configData.mainMessage || "Ce site utilise des cookies que vous pouvez paramétrer.";
            cookieConsentBar.appendChild(mainMessage);

            var privacyMessage = document.createElement('div');
            privacyMessage.innerHTML = "Voir notre <a href='" + privacyPolicyURL + "'>politique de confidentialité</a>";
            cookieConsentBar.appendChild(privacyMessage);

            var consentCookie = mibreitCookieConsent.getConsentCookie(cookieName);

            if (!consentCookie) {
                mibreitCookieConsent.createCookieConsent(
                    cookieConsentBar,
                    [{
                        label: "Google Analytics",
                        cookieName: "GA4_Active",
                        info: "Google Analytics est utilisé pour capturer des informations générales anonymisées à propos de l'utilisation de cette page.",
                        active: true
                    }],
                    function(consentCookie) {
                        console.log("consentCookie:", JSON.stringify(consentCookie));

                        if (consentCookie.GA4_Active) {
                            gtag('config', configData.gtagID, {
                                'cookie_expires': configData.cookieExpiration
                            });
                        }

                        gtag('set', consentCookie);
                        gtag('event', 'ConsentConfiguredEvent');

                        cookieConsentBar.remove();
                    },
                    false,
                    cookieName
                );

                var body = document.querySelector('body');
                body.appendChild(cookieConsentBar);
            } else {
                console.log("consentCookie already present:", JSON.stringify(consentCookie));

                gtag('set', consentCookie);
                gtag('event', 'ConsentConfiguredEvent');
            }
        })
        .catch(error => {
            console.error('Error fetching config.json:', error);
        });
});
