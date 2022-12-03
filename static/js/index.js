
var viz;
var after_load = true;

// Creation information
function info_edge(data) {
    html = "<h5>Transfert</h5>"
    html += "<p style='margin:0px'><bold>HASH : </bold>" + data["hash"] + "</p>"
    html += "<p style='margin:0px'><bold>Valeur : </bold>" + parseInt(data["value"])/(10**18) + " ETH</p>"
    html += "<p style='margin:0px'><bold>Temps : </bold>" + data["block_timestamp"] + "</p>"
    return html
};
function info_node(data) {
    html = "<h5>Entité</h5>"
    html += "<p style='margin:0px'><bold>Nom : </bold>" + data["name"] + "</p>"
    html += "<p style='margin:0px'><bold>HASH : </bold>" + data["adresse"] + "</p>"
    html += "<p style='margin:0px'><bold>Balance : A venir</bold></p>"
    html += "<p style='margin:0px'><bold>Commentaire DGFiP : A venir</bold></p>"
    return html
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
function setup() {
    // after load
    if (after_load) {
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
                html = info_node(data.raw.properties);
            } else {
                edge_id = params["edges"][0];
                data = viz.edges.get(edge_id);
                html = info_edge(data.raw.properties);
            }
            console.log(params);
            document.getElementById("contenu_info").innerHTML = html
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
        after_load = false;
        console.log("download");

    }
}





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
                // image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
                // shape: "image",
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
                label: "name",
                // value: "pagerank",
                // group: "community",
                // image: 'https://visjs.org/images/visjs_logo.png',
                /*
                [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                    function: {
                        title: NeoVis.objectToTitleHtml
                    },
                }
                */
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
        initialCypher: 'match n=((:Personne {adresse:"0x4976a4a02f38326660d17bf34b431dc6e2eb2327"})-[relatedTo]-(:Personne)) return n limit 20'
    };

    viz = new NeoVis.default(config);
    viz.render();

}




// after body
setInterval(setup, 500)

//  0x293964d85c8039e2f8d184d2b310f38ff59495c1  0x974caa59e49682cda0ad2bbe82983419a2ecc400  match n=((:Personne {adresse:"0x293964d85c8039e2f8d184d2b310f38ff59495c1"})-[relatedTo]-(:Personne)) return n limit 10
function nouveau() {
    var cypher = creation_requete();

    if (cypher.length > 3) {
        viz.renderWithCypher(cypher);
    } else {
        console.log("reload");
        viz.reload();
    }
};
function ajouter() {
    var cypher = document.getElementById("cypher").value;

    if (cypher.length > 3) {
        viz.updateWithCypher(cypher);
    } else {
        console.log("reload");
        viz.reload();
    }
};

function creation_requete() {
    var cypher = "";

    var adresse = document.getElementById("address_entry").value;
    var type_de_requete = document.getElementById("transac_select").value;
    var date_min = document.getElementById("start_date").value;
    var date_max = document.getElementById("end_date").value;
    var date_check = false;
    if (date_min != "" && date_max != "") {
        date_check = true;
        // min
        var annee_lc = parseInt(date_min.substring(0, 5));
        var mois_lc = parseInt(date_min.substring(5, 7));
        var jour_lc = parseInt(date_min.substring(8, 10));
        var heure_lc = parseInt(date_min.substring(11, 13));
        var min_lc = parseInt(date_min.substring(14, 16));
        // max
        var annee_uc = parseInt(date_max.substring(0, 5));
        var mois_uc = parseInt(date_max.substring(5, 7));
        var jour_uc = parseInt(date_max.substring(8, 10));
        var heure_uc = parseInt(date_max.substring(11, 13));
        var min_uc = parseInt(date_max.substring(14, 16));
    }
    var limite_check = document.getElementById("max_node_switch").checked;
    var limite = 5;
    // var max_amount = parseInt(document.getElementById("max_amount").value);

    // type de requête
    if (type_de_requete == "tout") {
        cypher = `MATCH (f:Personne {adresse:'${adresse}'})-[tx:transfert]-(t:Personne) `;
    } else if (type_de_requete == "envoie") {
        cypher = `MATCH (f:Personne {adresse:'${adresse}'})-[tx:transfert]->(t:Personne) `;
    } else {
        cypher = `MATCH (f:Personne)-[tx:transfert]->(t:Personne {adresse:'${adresse}'}) `;
    }

    // date + montant
    if (date_check) {
        cypher += `where toInteger( split(split(tx.block_timestamp,"-")[2], " ")[0] ) * 1440 + toInteger(split(split(tx.block_timestamp,":")[0], " ")[-1]) * 60 + toInteger(split(tx.block_timestamp,":")[1] )  > ${jour_lc} * 1440 + ${heure_lc} * 60+ ${min_lc} - 1         and  toInteger( split(split(tx.block_timestamp,"-")[2], " ")[0] ) * 1440         + toInteger(split(split(tx.block_timestamp,":")[0], " ")[-1]) * 60         + toInteger(split(tx.block_timestamp,":")[1] )  < ${jour_uc} * 1440 + ${heure_uc} * 60 + ${min_uc}  + 1               and toInteger(split(tx.block_timestamp,"-")[0]) > ${annee_lc-1}         and toInteger(split(tx.block_timestamp,"-")[1]) > ${mois_lc-1}         and toInteger(split(tx.block_timestamp,"-")[0]) < ${annee_uc+1}         and toInteger(split(tx.block_timestamp,"-")[1]) < ${mois_uc+1} `

    } 

    // limite
    if (limite_check) {
        cypher += `RETURN f, tx, t LIMIT ${limite}`;
    } else {
        cypher += `RETURN f, tx, t`;
    }


    return cypher;
}

function stabilisation() {
    viz.stabilize();
}

