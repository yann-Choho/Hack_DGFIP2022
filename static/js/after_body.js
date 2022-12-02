
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

