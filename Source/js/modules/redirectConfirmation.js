/**
 * redirectConfirmation.js – A javascript to handle external links with user confirmation
 *
 * @author Konrad Michalik <kmi@xima.de>
 * @version 1.0.0
 * @depends
 *        jQuery 1.4.1
 *
 */
XIMA.api.redirectConfirmation = (function (window, document, $, undefined) {

    var EXT = {};

    var _namespace = 'XIMA.api.redirectConfirmation';
    var _self = this;

    var _config = {
        // enable logging
        debug: false,
        // selector for link elements
        linkElementSelector: 'a',
        // class for exclusion elements
        excludeSelectorClass: 'xima-js-exclude-from-redirect-confirmation',
        // can also be used to also target internal links
        onlyExternalLinks: true,
        // including a automatic redirection
        timerMode: true,
        // timer duration for automatic redirection
        timerDuration: 5000,
        // optionally suppress target, e.g. _blank, and open link in same window
        suppressTarget: false,
        // callback when showing modal
        onRedirectModal: function () {},
        // modal styling
        modal: {
            // messages
            message: {
                title: 'Sie verlassen nun die Webseite',
                // if option "timerMode" is true, the message field "bodyTimerMode" is displayed, otherwise "bodyClassicMode" is displayed
                bodyTimerMode: 'Sie werden in 5 Sekunden auf den externen Link, den Sie angeklickt haben, umgeleitet. Sollte dies nicht funktionieren, klicken Sie bitte auf den folgenden Link:',
                bodyClassicMode: 'Bitte klicken Sie auf den folgenden Link, um die Weiterleitung zu bestätigen',
                abort: 'Abbrechen'

            },
            // class name for modal
            class: 'xima-js-redirect-confirmation'
        }
    };

    /**
     * Initialize redirectConfirmation.js
     * @return this
     * @param parameters
     */
    EXT.initialize = function (parameters) {

        // load additional parameters
        if (parameters) {
            jQuery.extend(_config, parameters);
        }

        _config.debug ? console.log('[' + _namespace + '] js initialized') : '';

        _self.createModal();
        EXT.initEventListener();

        return this;
    };

    /**
     * Initialize event listener
     */
    EXT.initEventListener = function () {

        // Building specific selector for elements
        var selector = '';
        if (_config.onlyExternalLinks) {
            selector = _config.linkElementSelector + ':not(.' + _config.excludeSelectorClass + ')[href^="http://"], ' +
                _config.linkElementSelector + ':not(.' + _config.excludeSelectorClass + ')[href^="https://"], ' +
                _config.linkElementSelector + ':not(.' + _config.excludeSelectorClass + ')[href^="//"]'
            ;
        } else {
            selector = _config.linkElementSelector + ':not(.' + _config.excludeSelectorClass + ')';
        }

        _config.debug ? console.log('[' + _namespace + '] event listener initialized') : '';


        $(selector).unbind();
        $(selector).on('click', function (event) {
            event.preventDefault();
            var target = $(this).attr('target');
            _self.showModal($(this).attr('href'), target);
        });
    };

    /**
     * Create modal
     */
    this.createModal = function () {
        // Build up specific modal message
        var message = '';
        if (_config.timerMode) {
            message = '<p>' + _config.modal.message.bodyTimerMode + '</p>\n';
            ;
        } else {
            message = '<p>' + _config.modal.message.bodyClassicMode + '</p>\n';
        }
        var modal = '<div class="modal fade ' + _config.modal.class + '" role="dialog">\n' +
            '  <div class="modal-dialog">\n' +
            '    <div class="modal-content">\n' +
            '      <div class="modal-header">\n' +
            '        <button type="button" class="close" data-dismiss="modal">&times;</button>\n' +
            '        <h4 class="modal-title">' + _config.modal.message.title + '</h4>\n' +
            '      </div>\n' +
            '      <div class="modal-body">\n' +
            message +
            '        <p><a href="#" class="' + _config.modal.class + '-link ' + _config.excludeSelectorClass + '"></a></p>\n' +
            '      </div>\n' +
            '      <div class="modal-footer">\n' +
            '        <button type="button" class="btn btn-default ' + _config.modal.class + '-abort" data-dismiss="modal">' + _config.modal.message.abort + '</button>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '</div>'
        ;

        $('body').append(modal);
    };

    /**
     * Showing information modal for redirecting
     */
    this.showModal = function (link, target) {

        _config.onRedirectModal();

        var linkElement = $('.' + _config.modal.class + '-link');
        linkElement.html(link);
        linkElement.attr('href',link);

        !_config.suppressTarget ? linkElement.attr('target',target) : '';

        // Show modal
        $('.' + _config.modal.class).modal('show');

        if (_config.timerMode) {
            _self.redirectTimer(link);
        }

        linkElement.unbind();
        linkElement.click(function() {
            $('.' + _config.modal.class).modal('hide');
        });
    };


    /**
     * Starting a timer for automatic redirection
     */
    this.redirectTimer = function (link) {

        _config.debug ? console.log('[' + _namespace + '] start timer') : '';

        var timer = setTimeout(function() {

            _config.debug ? console.log('[' + _namespace + '] redirect on timer') : '';

            $('.' + _config.modal.class + '-link')[0].click();
        }, _config.timerDuration);

        // Possibility to cancel redirection
        $('.' + _config.modal.class + '-abort').unbind();
        $('.' + _config.modal.class + '-abort').on('click', function (event) {

            _config.debug ? console.log('[' + _namespace + '] cancel timer') : '';

            event.preventDefault();
            clearTimeout(timer);
        });
    };

    return EXT;

})(window, document, jQuery);
