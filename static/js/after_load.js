
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
}, 1000);