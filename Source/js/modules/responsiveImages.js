/**
 * respimg.js - A javascript to choose the best fitting image for responsive design
 *
 * @author Sebastian Gierth <sgi@xima.de>
 * @version 1.0.0
 * @depends
 * 		jQuery 1.4.1
 *
 */
XIMA.api.responsiveImages = (function(window, document, $, undefined){

    /**
     * selectors
     * @var object
     */
    var selectors = {};

    /**
     * Set selectors for jQuery objects
     * @param {string} wrapperSelector Selector of element that wraps the <img/>.
     * @param {string} imageSelector   Selector of responsive <img/>.
     * @return void
     */
    function init(wrapperSelector, imageSelector) {

        selectors = {
            wrapper: wrapperSelector || 'body',
            image: imageSelector || 'img'
        };
    }

    /**
     * Get sourceset and set the best fitting source as image.
     * @return void
     */
    function setResponsiveImages() {

        $(selectors.wrapper).each(function(){

            var $this = $(this);

            var wrapElement = {
                width: $this.width()
            };

            // Iterate through all <img/> of wrapper
            $(selectors.image, $this).each(function(){

                var $this = $(this);

                var regex = /([^\s,]+)\s+(\d+)w/g;
                var srcset = $this.data('srcset');
                var images = [];
                var data;

                while ((data = regex.exec(srcset)) !== null){
                    images.push({
                        src: data[1],
                        width: parseInt(data[2])
                    });
                }

                // Sort ascending by width property
                images.sort(function(a, b){
                    return a.width - b.width;
                });

                // Set the best fitting source as src-attribute
                var renderWidth = wrapElement.width * window.devicePixelRatio;
                for (var i=0; i < images.length; i++) {

                    if (images[i].width >= renderWidth){
                        $this.attr('width', wrapElement.width);
                        $this.attr('src', images[i].src);
                        break;
                    }
                    else if (i === images.length -1){
                        $this.attr('width', wrapElement.width);
                        $this.attr('src', images[i].src);
                    }
                }
            });
        });
    }

    /**
     * Event handler on resizing window.
     */
    window.onresize = setResponsiveImages;

    /**
     * Return public object
     */
    return {
        run: function(wrapperSelector, imageSelector){

            init(wrapperSelector, imageSelector);
            setResponsiveImages();
        },
        refresh: function(){

            setResponsiveImages();
        }
    };

})(window, document, jQuery);
