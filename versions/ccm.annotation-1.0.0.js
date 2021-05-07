/**
 * @overview ccmjs-based web component for web annotation
 * @author Hajar Menssouri
 * @license The MIT License (MIT)
 */

( () => {

  const component = {
    version: [1,0,0],
    name: 'annotation',
    ccm: 'https://ccmjs.github.io/ccm/versions/ccm-26.4.0.js',
    config: {
      "css": [ "ccm.load",
        "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
        { "context": "head", "url": "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" },
        { "url": "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp", "type": "css" },
        { "url": "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp", "type": "css", "context": "head" },
        "https://hajar808.github.io/annotation/resources/style.css"
      ],
      "helper": [ "ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-7.2.0.mjs" ],
      "html": [ "ccm.load", "https://hajar808.github.io/annotation/resources/templates.html" ],
      "js": [ "ccm.load",
        [
          "https://code.jquery.com/jquery-3.6.0.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/js/preload.js", "type": "text/javascript" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/js/dao.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/external/annotaion-model.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/external/highlighter.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/external/range-util.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/external/adder.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/js/selection.handler.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/js/annotation.card.handler.js" },
          { "context": "head", "url": "https://hajar808.github.io/annotation/resources/js/sidebar.js" }
        ]
      ],
      "title": "Annotation",
      "shadow": "none"
    },

    Instance: function () {
      let $;

      this.init = async () => {

        // set shortcut to help functions
        $ = Object.assign( {}, this.ccm.helper, this.helper ); $.use( this.ccm );

      };

      this.ready = async () => {};

      this.start = async () => {

        let annotation = $.html( this.html.main, {
          title: this.title
        } );
        let text_content = annotation.querySelector('#text-content');
        if (text_content) {
          text_content.innerHTML = `
          
        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
        tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas
        semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien
        ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean
        fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec
        non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque
        egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan
        porttitor, facilisis luctus, metus</p>
    <h1>HTML Ipsum Presents</h1>

    <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis
        egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit
        amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit
        amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>,
        ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis
        tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

    <h2>Header Level 2</h2>

    <ol>
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <li>Aliquam tincidunt mauris eu risus.</li>
    </ol>

    <blockquote>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet
            congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis
            mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.
        </p>
    </blockquote>

    <h3>Header Level 3</h3>

    <ul>
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <li>Aliquam tincidunt mauris eu risus.</li>
    </ul>

    <pre>
        <code>
            #header h1 a {
              display: block;
              width: 300px;
              height: 80px;
            }
        </code>
    </pre>
    <ul>
        <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in,
            diam. Sed arcu. Cras consequat.</li>
        <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
            Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
        <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique
            cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
        <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate,
            nunc.</li>
    </ul>
    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
        tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas
        semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
        <ul>
            <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in,
                diam. Sed arcu. Cras consequat.</li>
            <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
                Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
            <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique
                cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
            <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate,
                nunc.</li>
        </ul>
        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
            tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas
            semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
            <ul>
                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in,
                    diam. Sed arcu. Cras consequat.</li>
                <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
                    Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique
                    cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate,
                    nunc.</li>
            </ul>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas
                semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
                <ul>
                    <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in,
                        diam. Sed arcu. Cras consequat.</li>
                    <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
                        Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
                    <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique
                        cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
                    <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate,
                        nunc.</li>
                </ul>
                <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                    tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas
                    semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
          `;
        }
        $.setContent( this.element, annotation);

      };

    }

  };

  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();