//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                              //
//                                                                 NUAGES DE MOTS                                                               //
//                                                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction qui detecte le click sur le bouton submit
document.addEventListener("submit", function (e) {
  // On charge les csv données
  const csvFile = document.getElementById("csvFile");

  // Récupération des code selectionné dans une liste
  let choice = [];

  const sb_chart1 = document.querySelector("#framework1");
  const sb_chart2 = document.querySelector("#framework2");

  choice.push(sb_chart1.selectedIndex - 1);
  choice.push(sb_chart2.selectedIndex - 1);

  console.log(choice);
  // Boucle qui crée les nuages dans le chart 1 et 2
  for (let i = 0; i < choice.length; i++) {
    am5.ready(function () {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var root = am5.Root.new(`chartdiv${i}`);

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root),
        am5themes_Material.new(root),
      ]);

      // Add series
      // https://www.amcharts.com/docs/v5/charts/word-cloud/
      var series = root.container.children.push(
        am5wc.WordCloud.new(root, {
          colors: am5.ColorSet.new(root, {
            colors: [
              am5.color(0x095256),
              am5.color(0x087f8c),
              am5.color(0x5aaa95),
              am5.color(0x86a873),
              am5.color(0xbb9f06),
            ],
          }),
          categoryField: "tag",
          valueField: "weight",
          maxFontSize: am5.percent(40),
        })
      );

      // Toolstip
      series.labels.template.set(
        "tooltipText",
        "{category}: [bold]{value}[bold]%"
      );

      // Configure labels
      series.labels.template.setAll({
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        // fontFamily: "Courier New",
        fontFamily: "Algerian",
        cursorOverStyle: "pointer",
        // fontWeight: "bold"
      });

      // Fonction qui effectue une recherche sur google lors d'un click sur un mot
      series.labels.template.events.on("click", function (ev) {
        category = ev.target.dataItem.get("category");
        window.open(
          "https://www.google.com/search?q=" + encodeURIComponent(category)
        );
      });

      reader = new FileReader();
      e.preventDefault();
      input = csvFile.files[choice[i]];
      if (i == 0) {
        lst_1 = input;
      }else if(i == 1){
        lst_2 = input;
      }

      reader.onload = function (e) {
        text = e.target.result;
        let lst = csvToArray(text); // On convertit le csv en array
        console.log(lst);
        series.data.setAll(lst); // Affichage du nuage mot à partir de l'array
        
        var nb = 5;
        graphiques(lst ,nb , i); // Affichage des graphiques
        console.log("Done");
      };
      reader.readAsText(input);
    });
  }


  // On réaffiche les graphiques au changement de nombre de mot 
  document.getElementById("mySelect").onchange = function(){
    const csvFile = document.getElementById("csvFile");
    const sb_chart1 = document.querySelector("#mySelect");
  
    code_civil = lst_1;
    code_penal = lst_2; 
    
    // On supprime
    document.getElementById("myChart0").remove()
    document.getElementById("myChart1").remove()
  
    // On recrée les élément HTML vide de contenu
    var input0 = document.createElement("canvas");
    input0.setAttribute("id", "myChart0");
    
    var input1= document.createElement("canvas");
    input1.setAttribute("id", "myChart1");
  
    document.getElementById("graphic0").appendChild(input0);
    document.getElementById("graphic1").appendChild(input1);
  
    // On réaffiche les graphiques à jour 
    reader1 = new FileReader();
    reader1.onload = function (e) {
      text2 = e.target.result;
          let lst_civil = csvToArray(text2)
          graphiques(lst_civil, document.getElementById("mySelect").value,0)
    }
    reader1.readAsText(code_civil);
  
    reader2 = new FileReader();
    reader2.onload = function (e) {
      text2 = e.target.result;
          let lst_penal = csvToArray(text2)
          graphiques(lst_penal , document.getElementById("mySelect").value,1)
    }
    reader2.readAsTextnaryString(code_penal);
  };

});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                                 GRAPHIQUE                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction qui crée les graphiques
function graphiques(lst, nb , choice) {

  // Création des listes correspondants aux abscisses (mot) et ordonnés (fréquence)
  lst.sort((a, b) => b.weight - a.weight);
  let name = [];
  let frequence = [];
  for (let i = 0; i < nb; i++) {
    name.push(lst[i]["tag"]);
    frequence.push(lst[i]["weight"]);
  }

  const ctx = document.getElementById(`myChart${choice}`);

  var chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: name,   // mots
      datasets: [
        {
          data: frequence,  // fréquences
          borderWidth: 1,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(255, 205, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(201, 203, 207, 0.8)",
          ],
          borderColor: [
            "rgb(0,0,0)",
          ],
        },
      ],
    },

    options: {
      plugins:{
        legend: {
         display: false
        }
      },
      // Graphique à l'horizontal
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                             DISTANCE DE MOT                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// JAUGE 1
am5.ready(function(e) {
  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("gauge1");
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/radar-chart/
  var chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 180,
      endAngle: 360
    })
  );
  
  // Create axis and its renderer
  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
  var axisRenderer = am5radar.AxisRendererCircular.new(root, {
    innerRadius: -10,
    strokeOpacity: 1,
    strokeWidth: 15,
    strokeGradient: am5.LinearGradient.new(root, {
      rotation: 0,
      stops: [
        { color: am5.color(0x088f44) },
        { color: am5.color(0xf4fb16) },
        { color: am5.color(0xf6d32b) },
        { color: am5.color(0xff0000) }
      ]
    })
  });
  
  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 0.22,
      strictMinMax: true,
      renderer: axisRenderer
    })
  );
  
  // Add clock hand
  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
  var axisDataItem = xAxis.makeDataItem({});
  axisDataItem.set("value", 0);
  
  var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
    sprite: am5radar.ClockHand.new(root,{
      radius: am5.percent(99)
    })
  }));
  
  xAxis.createAxisRange(axisDataItem);
  axisDataItem.get("grid").set("visible", false);

  const myForm = document.getElementById("refresh");
  const csvFile = document.getElementById("csvFile");
  reader1 = new FileReader();
  reader2 = new FileReader();

  myForm.addEventListener("click", function (e) {
    e.preventDefault();

    // Lecture du fichier csv de reference
    input = csvFile.files[0];
    
    reader1.onload = function (e) {
      text = e.target.result;
      let lst_reference = csvToArray(text)

      // Lecture du fichier csv à comparé
      sb_chart = document.querySelector("#framework3");
      input2 = csvFile.files[sb_chart.selectedIndex-1];

      reader2.onload = function (e) {
        text2 = e.target.result;
        let lst_compared = csvToArray(text2)

        // On calcule la distance de mot 
        let distance_value = distance_mot(lst_reference , lst_compared)

        // On affiche le résultat sur la page
        document.getElementById("value_gauge1").innerHTML=distance_value;
        axisDataItem.animate({
          key: "value",
          to: distance_value,
          duration: 800,
          easing: am5.ease.out(am5.ease.cubic)
        });
      };
      reader2.readAsText(input2);
    };
    reader1.readAsText(input);
  });

  // Make stuff animate on load 
  chart.appear(1000, 100);
  
  }); // end am5.ready()


                                        //////////////////////////////////////////////////


// JAUGE 2
am5.ready(function(e) {
  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("gauge2");
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/radar-chart/
  var chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 180,
      endAngle: 360
    })
  );
  
  // Create axis and its renderer
  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
  var axisRenderer = am5radar.AxisRendererCircular.new(root, {
    innerRadius: -10,
    strokeOpacity: 1,
    strokeWidth: 15,
    strokeGradient: am5.LinearGradient.new(root, {
      rotation: 0,
      stops: [
        { color: am5.color(0x088f44) },
        { color: am5.color(0xf4fb16) },
        { color: am5.color(0xf6d32b) },
        { color: am5.color(0xff0000) }
      ]
    })
  });
  
  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 0.22,
      strictMinMax: true,
      renderer: axisRenderer
    })
  );
  
  // Add clock hand
  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
  var axisDataItem = xAxis.makeDataItem({});
  axisDataItem.set("value", 0);
  
  var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
    sprite: am5radar.ClockHand.new(root,{
      radius: am5.percent(99)
    })
  }));
  
  xAxis.createAxisRange(axisDataItem);
  
  axisDataItem.get("grid").set("visible", false);

  const myForm = document.getElementById("refresh");
  const csvFile = document.getElementById("csvFile");
  reader3 = new FileReader();
  reader4 = new FileReader();

  myForm.addEventListener("click", function (e) {
    e.preventDefault();

    // Lecture du fichier csv de reference
    input = csvFile.files[1];
    
    reader3.onload = function (e) {
      text = e.target.result;
      let lst_reference = csvToArray(text)

      // Lecture du fichier csv à comparé
      sb_chart = document.querySelector("#framework3");
      input2 = csvFile.files[sb_chart.selectedIndex-1];

      reader4.onload = function (e) {
        text2 = e.target.result;
        let lst_compared = csvToArray(text2)

        // On calcule la distance de mot 
        let distance_value = distance_mot(lst_reference , lst_compared)

        // On affiche le résultat sur la page
        document.getElementById("value_gauge2").innerHTML=distance_value;
        axisDataItem.animate({
          key: "value",
          to: distance_value,
          duration: 800,
          easing: am5.ease.out(am5.ease.cubic)
        });

      };
      reader4.readAsText(input2);
    };
    reader3.readAsText(input);
  });

  // Make stuff animate on load 
  chart.appear(1000, 100);
  
  }); // end am5.ready()




                                        //////////////////////////////////////////////////



// JAUGE 3
am5.ready(function(e) {
  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("gauge3");
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/radar-chart/
  var chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 180,
      endAngle: 360
    })
  );
  
  // Create axis and its renderer
  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
  var axisRenderer = am5radar.AxisRendererCircular.new(root, {
    innerRadius: -10,
    strokeOpacity: 1,
    strokeWidth: 15,
    strokeGradient: am5.LinearGradient.new(root, {
      rotation: 0,
      stops: [
        { color: am5.color(0x088f44) },
        { color: am5.color(0xf4fb16) },
        { color: am5.color(0xf6d32b) },
        { color: am5.color(0xff0000) }
      ]
    })
  });
  
  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 0.22,
      strictMinMax: true,
      renderer: axisRenderer
    })
  );
  
  // Add clock hand
  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
  var axisDataItem = xAxis.makeDataItem({});
  axisDataItem.set("value", 0);
  
  var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
    sprite: am5radar.ClockHand.new(root,{
      radius: am5.percent(99)
    })
  }));
  
  xAxis.createAxisRange(axisDataItem);
  
  axisDataItem.get("grid").set("visible", false);

  const myForm = document.getElementById("refresh");
  const csvFile = document.getElementById("csvFile");
  reader5 = new FileReader();
  reader6 = new FileReader();

  myForm.addEventListener("click", function (e) {
    e.preventDefault();

    // Lecture du fichier csv de reference
    input = csvFile.files[2];
    
    reader5.onload = function (e) {
      text = e.target.result;
      let lst_reference = csvToArray(text)

      // Lecture du fichier csv à comparé
      sb_chart = document.querySelector("#framework3");
      input2 = csvFile.files[sb_chart.selectedIndex-1];

      reader6.onload = function (e) {
        text2 = e.target.result;
        let lst_compared = csvToArray(text2)

        // On calcule la distance de mot 
        let distance_value = distance_mot(lst_reference , lst_compared)

        // On affiche le résultat sur la page
        document.getElementById("value_gauge3").innerHTML=distance_value;
        axisDataItem.animate({
          key: "value",
          to: distance_value,
          duration: 800,
          easing: am5.ease.out(am5.ease.cubic)
        });

      };
      reader6.readAsText(input2);
    };
    reader5.readAsText(input);
  });

  // Make stuff animate on load 
  chart.appear(1000, 100);
  
  }); // end am5.ready()



                                        //////////////////////////////////////////////////  


  // JAUGE 4
  am5.ready(function(e) {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("gauge4");
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    var chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 180,
        endAngle: 360
      })
    );
    
    // Create axis and its renderer
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
    var axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -10,
      strokeOpacity: 1,
      strokeWidth: 15,
      strokeGradient: am5.LinearGradient.new(root, {
        rotation: 0,
        stops: [
          { color: am5.color(0x088f44) },
          { color: am5.color(0xf4fb16) },
          { color: am5.color(0xf6d32b) },
          { color: am5.color(0xff0000) }
        ]
      })
    });
    
    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 0.22,
        strictMinMax: true,
        renderer: axisRenderer
      })
    );
    
    // Add clock hand
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
    var axisDataItem = xAxis.makeDataItem({});
    axisDataItem.set("value", 0);
    
    var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: am5radar.ClockHand.new(root,{
        radius: am5.percent(99)
      })
    }));
    
    xAxis.createAxisRange(axisDataItem);
    
    axisDataItem.get("grid").set("visible", false);
  
    const myForm = document.getElementById("refresh");
  const csvFile = document.getElementById("csvFile");
  reader7 = new FileReader();
  reader8 = new FileReader();

  myForm.addEventListener("click", function (e) {
    e.preventDefault();

    // Lecture du fichier csv de reference
    input = csvFile.files[3];
    
    reader7.onload = function (e) {
      text = e.target.result;
      let lst_reference = csvToArray(text)

      // Lecture du fichier csv à comparé
      sb_chart = document.querySelector("#framework3");
      input2 = csvFile.files[sb_chart.selectedIndex-1];

      reader8.onload = function (e) {
        text2 = e.target.result;
        let lst_compared = csvToArray(text2)

        // On calcule la distance de mot 
        let distance_value = distance_mot(lst_reference , lst_compared)

        // On affiche le résultat sur la page
        document.getElementById("value_gauge4").innerHTML=distance_value;
        axisDataItem.animate({
          key: "value",
          to: distance_value,
          duration: 800,
          easing: am5.ease.out(am5.ease.cubic)
        });

      };
      reader8.readAsText(input2);
    };
    reader7.readAsText(input);
  });

  // Make stuff animate on load 
  chart.appear(1000, 100);
    
}); // end am5.ready()



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                                  FONCTION                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Fonction qui convertie notre un csv en array
function csvToArray(str, delimiter = ";") {
  // Liste array
  let lst = [];

  // On découpe les lignes
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  const n_first_rows = rows.slice(0, 180);

  // Fonction qui ajoute dans lst les array de forme {tag:'où',weight:2.418509}
  n_first_rows.map(function (n_first_rows) {
    const values = n_first_rows.split(delimiter);
    const frequence = parseFloat(values[1].slice(0, -2));
    lst.push({ tag: values[0], weight: frequence * 100 });

  });
  return lst;
}



// Fonction qui calcule la distance de mot entre deux code
function distance_mot(reference,compared){
  var distance = 0 ;
  let lst_mot_commun = [];

  for (let i = 0; i < reference.length; i++) {
    for (let k = 0; k < compared.length; k++) {
      if (reference[i]['tag'] == compared[k]['tag']){
        distance += Math.abs(reference[i]['weight']-compared[k]['weight']);
        lst_mot_commun.push(reference[i]['tag'])
      }
    }
  }
  return distance / lst_mot_commun.length
}