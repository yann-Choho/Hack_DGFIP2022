
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







        // after load


setTimeout(function () {
    viz.network.on("doubleClick", function (params) {
        // Si on double clique, on a des infos sur le noeud et le lien
        params.event = "[original event]";
        if (params["nodes"].length == 1) {
            node_id = params["nodes"][0];
            data = viz.nodes.get(node_id);
            adresse = data.raw.properties.adresse;
            console.log(adresse)
            params["edges"].forEach(element => {
                viz.network.updateEdge(element, { length: 600 });
            });
            cypher = `MATCH n=((:Personne {adresse:'${adresse}'})-[t:transfert]-(:Personne)) RETURN n LIMIT 10`;
            viz.updateWithCypher(cypher);
        } else {
            edge_id = params["edges"][0];
            data = viz.nodes.get(edge_id);
        }
    })
    viz.network.on("click", function (params) {
        // Si on clique, on a des infos sur le noeud et le lien
        params.event = "[original event]";
        if (params["nodes"].length == 1) {
            node_id = params["nodes"][0];
            data = viz.nodes.get(node_id);
        } else {
            edge_id = params["edges"][0];
            data = viz.edges.get(edge_id);
        }
        console.log(params);
        document.getElementById("contenu_info").innerText = JSON.stringify(
            data,
            null,
            4
        );
    })
    // Désactiver le clique droit 
    document.addEventListener('contextmenu', event => event.preventDefault());
    viz.network.on("oncontext", function (params) {
        console.log(params);
        viz.network.deleteSelected();
    });
    function download() {
        var dl = document.getElementById("download");
        var image = document.getElementsByClassName("vis-network")[0].firstChild.toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        dl.setAttribute("href", image);
        //download.setAttribute("download","archive.png");
    };
    console.log("download");
}, 5000);



// after body


    //  0x293964d85c8039e2f8d184d2b310f38ff59495c1    match n=((:Personne {adresse:"0x293964d85c8039e2f8d184d2b310f38ff59495c1"})-[relatedTo]-(:Personne)) return n limit 10
    function nouveau() {
        var cypher = document.getElementById("cypher").value;

        if (cypher.length > 3) {
            viz.renderWithCypher(cypher);
        } else {
            console.log("reload");
            viz.reload();
        }
    }
    function ajouter() {
        var cypher = document.getElementById("cypher").value;

        if (cypher.length > 3) {
            viz.updateWithCypher(cypher);
        } else {
            console.log("reload");
            viz.reload();
        }
    }

    function creation_requete() {
        var cypher = "";

        var adresse = "0x293964d85c8039e2f8d184d2b310f38ff59495c1";
        var type_de_requete = "Tout";
        var block_number_min = 16071333;
        var block_number_max = 16071335;
        var limite = 5;

        // type de requête
        if (type_de_requete == "Tout") {
            cypher = `MATCH n=((:Personne {adresse:'${adresse}'})-[t:transfert]-(:Personne)) `;
        } else if (type_de_requete == "envoie") {
            cypher = `MATCH n=((:Personne {adresse:'${adresse}'})-[t:transfert]->(:Personne)) `;
        } else {
            cypher = `MATCH n=((:Personne)-[t:transfert]->(:Personne {adresse:'${adresse}'})) `;
        }

        // limite
        cypher += `RETURN n LIMIT ${limite}`;

        return cypher;
    }

    function stabilisation() {
        viz.stabilize();
    }

