/**
 * WEBSITE: https://gelistirici.com
 * TWITTER: https://x.com/gelistirici
 * FACEBOOK: https://www.facebook.com/gelistirici.bilisim
 * GITHUB: https://github.com/dolunay
 * LINKEDIN: https://www.linkedin.com/in/gelistirici/
 */

import "../plugins/cookieconsent/cookieconsent.umd.js";

// Enable dark mode
document.documentElement.classList.add('cc--darkmode');

const defaultLang = (window.location.pathname || '').startsWith('/en/') ? 'en' : 'tr';

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom left",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        analytics: {}
    },
    language: {
        default: defaultLang,
        autoDetect: "browser",
        translations: {
            en: {
                consentModal: {
                    title: "Hello visitor, it's cookie time!",
                    description: "We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic.",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    showPreferencesBtn: "Manage preferences",
                    footer: "<a href=\"privacy.html\">Privacy Policy</a>\n<a href=\"terms.html\">Terms and conditions</a>"
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close modal",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Cookie Usage",
                            description: "Cookies are very small text files that are stored on your computer when you visit a website. We use cookies for a variety of purposes and to enhance your online experience on our website (for example, to remember your account login details). You can change your preferences and decline certain types of cookies to be stored on your computer while browsing our website. You can also remove any cookies already stored on your computer, but keep in mind that deleting cookies may prevent you from using parts of our website."
                        },
                        {
                            title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                            description: "These cookies are essential to provide you with services available through our website and to enable you to use certain features of our website. Without these cookies, we cannot provide you certain services on our website.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Analytics Cookies",
                            description: "These cookies are used to show advertising that is likely to be of interest to you based on your browsing habits. These cookies, as served by our content and/or advertising providers, may combine information they collected from our website with other information they have independently collected relating to your web browser's activities across their network of websites. If you choose to remove or disable these targeting or advertising cookies, you will still see adverts but they may not be relevant to you.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "More information",
                            description: "For any query in relation to my policy on cookies and your choices, please <a class=\"cc__link\" href=\"contact.html\">contact me</a>."
                        }
                    ]
                }
            },
            tr: {
                consentModal: {
                    title: "Merhaba! Çerez zamanı",
                    description: "Deneyiminizi iyileştirmek, içerikleri kişiselleştirmek ve trafiğimizi analiz etmek için çerezler kullanıyoruz.",
                    acceptAllBtn: "Tümünü kabul et",
                    acceptNecessaryBtn: "Tümünü reddet",
                    showPreferencesBtn: "Tercihleri yönet",
                    footer: "<a href=\"privacy.html\">Gizlilik Politikası</a>\n<a href=\"terms.html\">Şartlar ve Koşullar</a>"
                },
                preferencesModal: {
                    title: "Çerez Tercih Merkezi",
                    acceptAllBtn: "Tümünü kabul et",
                    acceptNecessaryBtn: "Tümünü reddet",
                    savePreferencesBtn: "Tercihleri kaydet",
                    closeIconLabel: "Pencereyi kapat",
                    serviceCounterLabel: "Servis|Servisler",
                    sections: [
                        {
                            title: "Çerez Kullanımı",
                            description: "Çerezler, bir web sitesini ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır. Çeşitli amaçlarla ve (ör. oturum bilgilerini hatırlamak gibi) deneyiminizi iyileştirmek için kullanılır. Tercihlerinizi değiştirerek bazı çerez türlerini reddedebilirsiniz. Mevcut çerezleri silebilirsiniz; ancak bu işlem sitenin bazı bölümlerinin çalışmasını engelleyebilir."
                        },
                        {
                            title: "Kesinlikle Gerekli Çerezler <span class=\"pm__badge\">Her Zaman Etkin</span>",
                            description: "Bu çerezler, sitedeki temel işlevlerin çalışması için gereklidir. Bu çerezler olmadan belirli hizmetleri sunamayız.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Analitik Çerezler",
                            description: "Bu çerezler, site kullanımını analiz etmeye ve performansı iyileştirmeye yardımcı olur.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Daha fazla bilgi",
                            description: "Çerez politikamız ve tercihlerinizle ilgili sorularınız için lütfen <a class=\"cc__link\" href=\"contact.html\">bizimle iletişime geçin</a>."
                        }
                    ]
                }
            }
        }
    }
});