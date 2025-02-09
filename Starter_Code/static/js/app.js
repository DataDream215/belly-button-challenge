// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata; 



    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(sampleObj => sampleObj.id == sample);
    let sampleNumber = result[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in sampleNumber) {
      panel.append("h6").text(`${key.toUpperCase()}: ${sampleNumber[key]}`);
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples


    // Filter the samples for the object with the desired sample number
    let result = samples.filter(sampleObj => sampleObj.id == sample);
    let sampleNumber = result[0];


    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = sampleNumber.otu_ids;
    let otuLabels = sampleNumber.otu_labels;
    let sampleValues = sampleNumber.sample_values;

    // Build a Bubble Chart
    let bubbleChartLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };


    // Render the Bubble Chart
    let bubbleChartData = [
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let barYTicks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();




    // Build a Bar Chart
    let barChartData = [
      {
        y: barYTicks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    let barChartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barChartData, barChartLayout);
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart


  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleIDs = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");



    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sampleIDs.length; i++) {
      dropdownMenu
        .append("option")
        .text(sampleIDs[i])
        .property("value", sampleIDs[i]);
    }


    // Get the first sample from the list
    let initialSample = sampleIDs[0];


    // Build charts and metadata panel with the first sample
    buildCharts(initialSample)
    buildMetadata(initialSample)

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
