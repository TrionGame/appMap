$(document).ready(function () {
    // 日本の緯度経度の範囲
    var japanExtent = ol.proj.transformExtent(
        [122.93457, 24.396308, 153.986672, 45.551483], // 日本の最小・最大経度・緯度
        'EPSG:4326',
        'EPSG:3857'
    );
    log("日本の緯度経度");
    log(japanExtent);

    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([139.6917, 35.6895]), // 東京の座標
            zoom: 6,
            extent: japanExtent
        })
    });

    // サンプルデータ
    var locations = [
        // { lat: 35.6895, lon: 139.6917 }, // 東京
        // { lat: 34.6937, lon: 135.5023 }, // 大阪
        // { lat: 43.0621, lon: 141.3544 }  // 札幌
        { lat: 35.6895, lon: 139.6917, name: '東京', description: '日本の首都', thumbnail: '../assets/img/tokyo.jpg' },
        { lat: 34.6937, lon: 135.5023, name: '大阪', description: '日本の商業都市', thumbnail: '../assets/img/osaka.jpg' },
        { lat: 43.0621, lon: 141.3544, name: '札幌', description: '北海道の中心都市', thumbnail: 'path/to/../assets/img/hokakido.jpg' }
    ];

    // 現在地を取得してlocationsに追加
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLocation = {
                // lat: position.coords.latitude,
                // lon: position.coords.longitude
                name: '現在地',
                description: 'あなたの現在地',
                thumbnail: '../assets/img/currnet_pos.jpeg'
            };
            locations.push(currentLocation);

            // 現在地を含む全てのロケーションにアイコンを追加
            addMarkers(locations);
        }, function(error) {
            console.error('Error occurred. Error code: ' + error.code);
            addMarkers(locations); // エラー時にも既存のロケーションにアイコンを追加
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        addMarkers(locations); // Geolocationがサポートされていない場合にも既存のロケーションにアイコンを追加
    }

    function addMarkers(locations) {
        // カスタムアイコンを追加
        locations.forEach(function (location) {
            //アイコン設置の座標
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([location.lon, location.lat])),
                name: location.name,
                description: location.description,
                thumbnail: location.thumbnail
            });
            //アイコンの指定とスタイル
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: '../assets/img/icon-flame.png', // アイコン画像のパスを指定
                    scale: 0.1
                }),
            });
            //アイコン座標にアイコン情報をセット
            iconFeature.setStyle(iconStyle);

            var vectorSource = new ol.source.Vector({
                features: [iconFeature],
            });

            var markerVectorLayer = new ol.layer.Vector({
                source: vectorSource,
            });

            map.addLayer(markerVectorLayer);
        });
        ///////////////
        var element = document.getElementById('popup');
        log(element);
        var popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50],
        });
        map.addOverlay(popup);

        map.on('click', function(evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
            log("feature");
            log(feature);
            
            if (feature) {
                var coordinates = feature.getGeometry().getCoordinates();
                log("coordinates");
                log(coordinates);
                popup.setPosition(coordinates);
                $('#popup-content').html('<img src="' + feature.get('thumbnail') + '" width="50" height="50"><br><strong>' + feature.get('name') + '</strong><br>' + feature.get('description'));
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
        ///////////////
    }


    // // PHPからデータを取得
    // $.ajax({
    //     url: 'get-data.php',
    //     method: 'GET',
    //     dataType: 'json'
    // })
    // .done(function(data) {
    //     console.log(data);
    //     // データを使って何かをする (例: 地図上にマーカーを追加)
    //     data.locations.forEach(function(location) {
    //         var marker = new ol.Feature({
    //             geometry: new ol.geom.Point(ol.proj.fromLonLat([location.lon, location.lat])),
    //         });

    //         var vectorSource = new ol.source.Vector({
    //             features: [marker],
    //         });

    //         var markerVectorLayer = new ol.layer.Vector({
    //             source: vectorSource,
    //         });

    //         map.addLayer(markerVectorLayer);
    //     });
    // })
    // .fail(function(jqXHR, textStatus, errorThrown) {
    //     console.error('Error:', textStatus, errorThrown);
    // });
});