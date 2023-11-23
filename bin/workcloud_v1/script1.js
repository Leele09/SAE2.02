
// Fonction qui permet de créer le nuages de mots 
am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      // am5themes_Micro.new(root),
      // am5themes_Moonrise.new(root),
      // am5themes_Dark.new(root),
      // am5themes_Dataviz.new(root),
      // am5themes_Frozen.new(root),
      // am5themes_Kelly.new(root),
      am5themes_Material.new(root),
      // am5themes_Responsive.new(root),
      // am5themes_Spirited.new(root),
      
    ]);
    

    // Add series
    // https://www.amcharts.com/docs/v5/charts/word-cloud/
    var series = root.container.children.push(am5wc.WordCloud.new(root, {
      colors: am5.ColorSet.new(root, {}),
      categoryField: "tag",
      valueField: "weight",
      maxFontSize: am5.percent(35)
      
    }));


    // Toolstip
    series.labels.template.set("tooltipText", "{category}: [bold]{value}[/] [bold]/1000 ");


    // Configure labels
    series.labels.template.setAll({
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 3,
      paddingRight: 3,
      fontFamily: "Courier New",
      cursorOverStyle: "pointer"
    });
    

    // Fonction qui effectue une recherche sur google lors d'un click sur un mot
    series.labels.template.events.on("click", function(ev) {
      const category = ev.target.dataItem.get("category");
      window.open("https://www.google.com/search?q="  + encodeURIComponent(category));
    });


    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");

    // Fonction qui detecte le click sur le bouton submit
    myForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const input = csvFile.files[0];
          const reader = new FileReader();

          reader.onload = function (e) {
            const text = e.target.result;

            let lst = csvToArray(text);   // On convertit le csv en array
            series.data.setAll(lst)       // Affichage du nuage mot à partir de l'array
            console.log("Done");
          };
          reader.readAsText(input);


          
    });
}); 


// Fonction qui convertie notre un csv en array
function csvToArray(str, delimiter = ";") {
  // Liste array
  let lst = [];

  // On découpe les lignes
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Fonction qui ajoute dans lst les array de forme {tag:'où',weight:2.418509}
  rows.map(
    function (row) {
      const values = row.split(delimiter);
      const frequence = parseFloat(values[1].slice(0 , -2));
      lst.push({tag: values[0]  , weight: frequence})
    }
  );

  return lst;
}


