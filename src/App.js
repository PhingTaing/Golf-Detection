import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';
// import appLogo from './images/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      yoloData: [],
      fileName1: '',
      fileName2: '',
      imageData1: null,
      imageData2: null
    };
    this.onUploadImage1 = this.onUploadImage1.bind(this);
    this.onUploadImage2 = this.onUploadImage2.bind(this);
    this.onInputUploadImage1 = this.onInputUploadImage1.bind(this);
    this.onInputUploadImage2 = this.onInputUploadImage2.bind(this);
    this.onYoloDetectionClicked = this.onYoloDetectionClicked.bind(this);
    this.export = this.export.bind(this);
  }

  componentDidMount() {
    console.log(process.env.PUBLIC_URL);
  }

  // Methods ==================================================================
  onYoloDetectionClicked() {
    // Use axios post method
    /**
     * data = {
     *  x: 123,
     *  y: 123,
     *  distance: 123
     * }
     */

    /**
     * Get your data to look like this
     * 
     * [
     *    {
     *      golfBallNumber: 1,
     *      x: 123,
     *      y: 123,
     *      distance: 123
     *    },
     *    {
     *      golfBallNumber: 1,
     *      x: 123,
     *      y: 123,
     *      distance: 123
     *    }
     * ]
     * 
     */

    const jsonYoloDetection = 
    {
      "data": 
      [
        {
          "average": -0.354535,
          "max": 3.752322,
          "min": -7.722432,
          "distance": 7.760108
        },
        {
          "average": -0.673715,
          "max": 7.291943,
          "min": -10.397675,
          "distance": 5.463225
        },
        {
          "average": 4.935743,
          "max": 13.696383,
          "min": 1.454617,
          "distance": 4.825251
        }
      ]
    };
    const arrayYoloDetectionData = jsonYoloDetection['data'];
    this.setState((state) => ({ yoloData: arrayYoloDetectionData }));
    
    // TODO: Do later
    // fetch('/yolo')
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    // 
    //   Transform data (currently json) into an array
    //   yoloData is expected to be an array
    //   
    // 
    //   this.setState((state) => ({ yoloData: transformedData }))
    // });
  }

  onInputUploadImage1(event){
    console.log('changed1');
    console.log(event);
    const fileName = event.target.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    if (event.target.files.length < 1) {
      return;
    }
    const file = event.target.files[0];
    const objUrl = URL.createObjectURL(file);
    this.setState((state) => ({
      fileName1: fileName, 
      imageData1: objUrl
    }));
  }
  onInputUploadImage2(event){
    console.log('changed2');
    console.log(event);
    const fileName = event.target.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    if (event.target.files.length < 1) {
      return;
    }
    const file = event.target.files[0];
    const objUrl = URL.createObjectURL(file);
    this.setState((state) => ({
      fileName2: fileName,
      imageData2: objUrl
    }));
  }
  onUploadImage1() {
    console.log('onUploadImage1');
  }

  onUploadImage2() {
    console.log('onUploadImage2');
  }

  export() {
    const yoloData = this.state.yoloData;
    if (yoloData.length == 0) return;
    
    const firstJson = yoloData[0];
    const columnNames = ['Max', 'Min', 'Average','Distance'];

    const matrix = [];
    matrix.push(columnNames);
    for (let i = 0; i < yoloData.length; i++ ) {
      const jsonYolo = yoloData[i];
      const max = jsonYolo['max'];
      const min = jsonYolo['min'];
      const avg = jsonYolo['average'];
      const dist = jsonYolo['distance'];

      matrix.push([max, min, avg, dist])
    }

    // matrix to csv
    const csv = matrix.map(row =>
      row
      .map(String)
      .map(v => v.replaceAll('"', '""'))
      .map(v => `"${v}"`)
      .join(',')
    ).join('\r\n');
    console.log('THIS IS THE CSV', csv);

    this.downloadCsv(csv)
  }

  downloadCsv(content) {
    var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
  
    var tempAnchorElement = document.createElement('a');
    tempAnchorElement.href = url;
    tempAnchorElement.setAttribute('download', `exportedYoloData${new Date().getMilliseconds}.csv`);
    tempAnchorElement.click();
  }

  // Render ===================================================================
  render() {
    return (
      <div id="app">
        <header> CALLAWAY GOLF <img className="logo" src={process.env.PUBLIC_URL.concat("/images/navbar-icon.png")} alt="golf-icon" /> </header>
        <div className="app-container">
          <div>
            <h2>Image Upload</h2>
            {/* Image Upload */}
            <div className="image-button-container">
              <div className="image-button-item">
                <input accept="image/*" id="contained-button-file1" multiple type="file" hidden onChange={this.onInputUploadImage1}/>
                <label htmlFor="contained-button-file1">
                  <Button variant="contained" color="primary" component="span" onClick={this.onUploadImage1}>Upload Image 1</Button>
                </label>
                <span id="text1">{this.state.fileName1 === '' ? 'No File Chosen' : this.state.fileName1}</span>
              </div>
              <div className="image-button-item">
                <input accept="image/*" id="contained-button-file2" multiple type="file" hidden onChange={this.onInputUploadImage2}/>
                <label htmlFor="contained-button-file2">
                  <Button variant="contained" color="primary" component="span" onClick={this.onUploadImage2}>Upload Image 2</Button>
                </label>
                <span id="text2">{this.state.fileName2 === '' ? 'No File Chosen' : this.state.fileName2}</span>
              </div>
            </div>

            {/* Image Containers */}
            <div>
              <div className="image-data-container">
                <img src={this.state.imageData1}></img>
              </div>
              <div className='image-data-container'>
                <img src={this.state.imageData2}></img>
              </div>
            </div>
          </div>

          {/* Yolo Detection and Table Output */}
          <div>
            <h2>Calculation</h2>
            <div className="image-button-container">
              <div className="calculation-container">
                <div>
                  <Button variant="contained" color="primary" component="span" onClick={this.onYoloDetectionClicked}> 
                    Yolo Detection
                  </Button>
                </div>
                <div>
                  <Button variant="contained" color="primary" component="span">
                    Edit
                  </Button>
                </div>
                <div>
                  <Button variant="contained" color="primary" component="span" onClick={this.export}> 
                    Export Data
                  </Button>
                </div>
              </div>

              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>Golf Ball #</TableCell>
                      <TableCell align="center">Max.</TableCell>
                      <TableCell align="center">Min.</TableCell>
                      <TableCell align="center">Average</TableCell>
                      <TableCell align="center">Distance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.yoloData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {index}
                        </TableCell>
                        <TableCell align="right">{row.max}</TableCell>
                        <TableCell align="right">{row.min}</TableCell>
                        <TableCell align="right">{row.average}</TableCell>
                        <TableCell align="right">{row.distance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableBody>
                    <TableCell align='left' colSpan={5}>Number of Shots: {this.state.yoloData.length}</TableCell>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <footer>Copyright 2022</footer>
      </div>
    );
  }
}

export default App;
