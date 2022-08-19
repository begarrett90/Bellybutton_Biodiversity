function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    // buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  // buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var sampledata = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilter = sampledata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleArray = sampleFilter[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = sampleArray.otu_ids;
    var otuLabels = sampleArray.otu_labels;
    var sampleValues = sampleArray.sample_values.map((value) => parseInt(value));

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.slice(0,10).map((id) => "OTU " + id).reverse();
    
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels,
      type: "bar",
      orientation: "h"
      
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Culture Found",
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuIDs,
      y:sampleValues,
      type: "bubble",
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Earth"}
       
    };
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 75,
        r: 50,
        b: 60,
        t: 60,
        pad: 10
      },
      hovermode: "closest"
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataFilter =  metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var sampleArray = sampleFilter[0];
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataArray = metadataFilter[0];
    
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = sampleArray.otu_ids;
    var otuLabels = sampleArray.otu_labels;
    var sampleValues = sampleArray.sample_values.map((value) => parseInt(value));
    
    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(metadataArray.wfreq)
    // Create the yticks for the bar chart.
    
    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar", [barData], barLayout);
        
    // Use Plotly to plot the bubble data and layout.
     Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 
       
        
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: ""},
      gauge: {
        axis: {range: [0,10], dtick:2},
         bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "yellowgreen"},
          {range: [8,10], color: "green"}
        ],}
      }
        
        // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {
        text: "Belly Button Washing Frequency</b><br>Scrubs per Week",
      },
      margin: {
        l: 50,
        r: 50,
        b: 0,
        t: 50,
        pad: 50
      },
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
   });
    
}
    