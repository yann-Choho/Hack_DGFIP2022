
        var viz;

        function draw() {
            console.log("draw")
            var config = {
                containerId: "viz",
                neo4j: {
                    serverUrl: "bolt://34.77.218.69:7687",
                    serverUser: "neo4j",
                    serverPassword: "azerty"
                },
                visConfig: {
                    nodes: {
                        shape: "dot",
                        font: {
                            size: 12,
                            face: "Tahoma",
                        },
                        image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
                        shape: "image",
                    },
                    edges: {
                        arrows: {
                            to: { enabled: true },
                        },
                        width: 0.15,
                        color: { inherit: "from" },
                        smooth: {
                            type: "continuous",
                        },
                    },
                    physics: true,
                    interaction: {
                        navigationButtons: true,
                        tooltipDelay: 200,
                        hideEdgesOnDrag: true,
                        hideEdgesOnZoom: true,
                    },
                },
                labels: {
                    Personne: {
                        label: "adresse",
                        // value: "pagerank",
                        // group: "community",
                        // image: 'https://visjs.org/images/visjs_logo.png',
                        [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                            function: {
                                title: NeoVis.objectToTitleHtml
                            },
                        }
                    }
                },
                relationships: {
                    transfert: {
                        // value: "weight",
                        [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                            function: {
                                title: NeoVis.objectToTitleHtml
                            },
                        }
                    }
                },
                initialCypher: 'match n=((:Personne {adresse:"0x974caa59e49682cda0ad2bbe82983419a2ecc400"})-[relatedTo]-(:Personne)) return n limit 20'
            };

            viz = new NeoVis.default(config);
            viz.render();
            console.log(viz);

        }