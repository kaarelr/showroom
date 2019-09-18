
console.log("adsf");

var hasDragged = false;

$(document).ready(function () {

    var name = getUrlParameter("account");
    console.log(name);

    if (name == undefined) {
        name = "natgeotravel";
    } else {
        name = name.toLowerCase();
    }
	
    var idReq = $.get("https://www.instagram.com/" + name + "/", function(html) {
        var regex = /_sharedData = ({.*);<\/script>/m,
            json = JSON.parse(regex.exec(html)[1]);

        console.log(json);

        id = json.entry_data.ProfilePage[0].graphql.user.id;
        console.log(id);

        if(id === undefined) {
            return;
        }

        var picReq = $.get("https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={\"id\":\"" + id + "\",\"first\":50}", function (html) {
            if (html) {
                var regex = /_sharedData = ({.*);<\/script>/m,
                    json = html,
                    edges = json.data.user.edge_owner_to_timeline_media.edges;

                if (edges.length === 0) {
                    showError("User is private or has no photos");
                }

                $.each(edges, function (n, edge) {
                    console.log("10");
                    var node = edge.node;
                    $('.owl-carousel').append(
                        /*$('<div/>', {
                            class: 'container'
                        }).css({

                        }).append(*/
                        $('<img/>', {
                            href: 'https://instagr.am/p/' + node.shortcode,
                            target: '_blank',
                            src: node.thumbnail_src,
                            alt: ''
                            //onclick:"onImgClick(this)"
                        }).css({}));
                });

                console.log("100");

                var owl = $('.owl-carousel');

                owl.owlCarousel({
                    items: 1,
                    center: true,
                    loop: true,
                    dragBeforeAnimFinish: false,
					dots: false
                });

                owl.owlCarousel();
            }
        });

        picReq.fail(function () {
            showError("No such user exists");
        });
    });

    idReq.fail(function () {
        showError("No such user exists");
    });



    /*var req = $.get("https://images" + ~~(Math.random() * 33) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https://www.instagram.com/" + name + "/", function (html) {
        if (html) {

            var regex = /_sharedData = ({.*);<\/script>/m,
                json = JSON.parse(regex.exec(html)[1]),
                edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;

            console.log(json);

            if(edges.length === 0) {
                showError("User is private or has no photos");
            }

            $.each(edges, function (n, edge) {
                console.log("10");
                var node = edge.node;
                $('.owl-carousel').append(*/
    /*$('<div/>', {
        class: 'container'
    }).css({

    }).append(*/
    /*$('<img/>', {
        href: 'https://instagr.am/p/' + node.shortcode,
        target: '_blank',
        src: node.thumbnail_src,
        alt: ''
    }).css({

    }));
});

console.log("100");

var owl = $('.owl-carousel');

owl.owlCarousel({
items: 1,
center: true,
loop: true
});

owl.owlCarousel();
}
});

req.fail(function() {
showError("No such user exists");
})*/


});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function showError(errorText) {
    $(".hbd-text").hide();
    var error = $("#error-text").show();
    error.text(errorText);
}

function dragStarted() {
    console.log("drag started");
    hasDragged = true;
}

function dragFinished() {
    console.log("drag finished");
    hasDragged = false;
}

function onImgClick(img) {
    if(!hasDragged) {
        href = img.getAttribute("href");
        console.log(href);
        if (href !== undefined) {
            console.log(href);
            window.open(href, '_blank');
        }
    }
}
