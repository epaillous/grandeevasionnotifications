// ==UserScript==
// @name         LaGrandeEvasionNotification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get notification with title, artist and film title when music changes
// @author       Emilie Paillous
// @match        https://www.lagrandeevasion.fr/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var DesktopNotifications = {
        /**
 * Checks if notifications are supported
 * @return {Boolean}
 */
        isSupported:function() {
            return (window.Notification != 'undefined');
        },
        /**
 * ask use to display desktop notifications
 * @param callback
 */
        requestPermission:function(callback) {
            window.Notification.requestPermission(function() {
                if (typeof(callback) == "function") {
                    callback(window.Notification.permission === "granted");
                }
            });
        },
        /**
 * display a notification
 * @param title title of notification
 * @param img full path of image to be displayed e.g. http://somedomain.com/photo.jpg
 * @param notification_body body of notification
 * @return {Boolean}
 */
        doNotify:function(title, img, notification_body) {
            // permission is ok
            if (window.Notification.permission == "granted") {
                var options = [];
                options.body = notification_body;
                options.icon = img;
                new window.Notification(title, options);
                console.log(options);
                return true;
            }
            return false;
        }
    };
    $(document).ready(function() {
        console.log("script La grande Evasion actif");
        DesktopNotifications.requestPermission(function () {
            DesktopNotifications.doNotify("Bienvenue sur La Grande Evasion !");
        });
        $(document).on('DOMNodeInserted', function(e) {
            if ($(e.target).is('.player__background-wrapper')) {
                var url_image = $(e.target).find('.player__background__scale').css('background-image');
                url_image = url_image.replace('url(','').replace(')','');
                url_image = url_image.replace(/['"]+/g, '');
                // have to wait until title and artist are correclty filled
                setTimeout(function(){
                    var text = "Artiste : " + $('.live__artist').text() + '\n';
                    text += "Titre : " + $('.player__title').text() + '\n';
                    var title = $('.live__footer__movie').text();
                    DesktopNotifications.doNotify(title, url_image, text);
                }, 2000);
            }
        });
    });
})();
