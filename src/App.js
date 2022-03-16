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
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yoloData: [],
      yoloData2: [],
      fileName1: '',
      fileName2: '',
      imageData1: null,
      imageData2: null,
      isLoggedIn: false,
      username: '',
      password: ''
    };
    this.onUploadImage1 = this.onUploadImage1.bind(this);
    this.onUploadImage2 = this.onUploadImage2.bind(this);
    this.onInputUploadImage1 = this.onInputUploadImage1.bind(this);
    this.onInputUploadImage2 = this.onInputUploadImage2.bind(this);
    this.onYoloDetectionClicked = this.onYoloDetectionClicked.bind(this);
    this.export = this.export.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
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
     * Get your data to look like this from YoloDetection
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
//////////////////////////// start of data entry /////////////////////////////
    const jsonYoloDetection =
    {
      "data":
        [
          {
            "x": 3.752322,
            "y": -7.722432,
            "distance": 7.760108,
          },
          {
            "x": 7.291943,
            "y": -10.397675,
            "distance": 5.463225,
          },
          {
            "x": 13.696383,
            "y": 1.454617,
            "distance": 4.825251,
          }
        ]
    };
    const arrayYoloDetectionData = jsonYoloDetection['data'];
    this.setState((state) => ({ yoloData: arrayYoloDetectionData }));

    const jsonYoloDetection2 =
    {
      "data":
        [
          {
            "average": 'Average',
            "average1": 0.3948,
            "average2": .23847,
            "average3": .20394,

            "median": 'Median',
            "median1": .2937,
            "median2": .2003,
            "median3": .4957,

            "max": 'Max',
            "max1": 3.2974,
            "max2": 5.2398,
            "max3": 4.489,

            "min": 'Min',
            "min1": 3.8279,
            "min2": 8.482,
            "min3": 6.238
          }
        ]
    };
    const arrayYoloDetectionData2 = jsonYoloDetection2['data'];
    this.setState((state) => ({ yoloData2: arrayYoloDetectionData2 }));
///////////////////// end of data entry ////////////////////////////////////

    // TODO: fetching data from backend 
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

  onInputUploadImage1(event) {
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

  onInputUploadImage2(event) {
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
  
  // Export data to excel
  export() {
    const yoloData = this.state.yoloData;
    if (yoloData.length == 0) return;

    const firstJson = yoloData[0];
    const columnNames = ['', 'x', 'y', 'Distance'];

    const matrix = [];
    matrix.push(columnNames);
    for (let i = 0; i < yoloData.length; i++) {
      const jsonYolo = yoloData[i];
      const blank = '';
      const x = jsonYolo['x'];
      const y = jsonYolo['y'];
      const dist = jsonYolo['distance'];
      matrix.push([blank, x, y, dist]);
    }

    const yoloData2 = this.state.yoloData2;
    if (yoloData2.length == 0) return;

    const average = ['Average', '0.3948', '.23847', '.20394'];
    matrix.push(average);
    const median = ['Median', '.2937', '.2937', '.4957'];
    matrix.push(median);
    const max = ['Max', '3.2974', '5.2398', '4.489'];
    matrix.push(max);
    const min = ['Min', '3.8279', '8.482', '6.238'];
    matrix.push(min);
    const count = ['Number of Shots','3'];
    matrix.push(count);

    // matrix to csv
    const csv = matrix.map(row =>
      row
        .map(String)
        .map(v => v.replaceAll('"', '""'))
        .map(v => `"${v}"`)
        .join(',')
    ).join('\r\n');
    console.log('THIS IS THE CSV', csv);
    this.downloadCsv(csv);
  }

  downloadCsv(content) {
    var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);

    var tempAnchorElement = document.createElement('a');
    tempAnchorElement.href = url;
    tempAnchorElement.setAttribute('download', `exportedYoloData${new Date().getMilliseconds}.csv`);
    tempAnchorElement.click();
  }

  onUsernameChange (event) {
    this.setState((state) => ({
      username: event.target.value
    }));
  }

  onPasswordChange (event) {
    this.setState((state) => ({
      password: event.target.value
    }));
  }

  handleLoginClick(e) {
    e.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    const userCred = {username, password};
    console.log(userCred);

    // axios.post(`http://127.0.0.1:3000/login`, userCred,{
    //   withCredentials: true,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // })
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //     this.setState((state) => ({
    //       isLoggedIn: true
    //     }));
    //   })
  }

  // Render ===================================================================
  render() {
    return (
      <div id="app">
        <header> CALLAWAY GOLF <img className="logo" src={process.env.PUBLIC_URL.concat("/images/navbar-icon.png")} alt="golf-icon" /> </header>
        {/* Login (if user is logged out) */}
        {/* {this.state.isLoggedIn == false &&
          <div>
            <h1>LOGIN FORM</h1>
            <div>
              <form onSubmit={this.handleSubmit}>
                <label>Username</label>
                <input type="text" placeholder="Enter Username" required onChange={this.onUsernameChange}></input>

                <label>Password</label>
                <input type="text" placeholder="Enter Password" required onChange={this.onPasswordChange}></input>

                <Button type="submit" onClick={this.handleLoginClick}>Login</Button>
              </form>
            </div>
          </div>
        } */}

        {/* Add conditional rendering so that only if logged in successfully do you show the app-container */}
        {/* {this.state.isLoggedIn == true && */}
          <div className="app-container">
            <div>
              <h2>Image Upload</h2>
              {/* Image Upload */}
              <div className="image-button-container">
                <div className="image-button-item">
                  <input accept="image/*" id="contained-button-file1" multiple type="file" hidden onChange={this.onInputUploadImage1} />
                  <label htmlFor="contained-button-file1">
                    <Button variant="contained" color="primary" component="span" onClick={this.onUploadImage1}>Upload Image 1</Button>
                  </label>
                  <span id="text1">{this.state.fileName1 === '' ? 'No File Chosen' : this.state.fileName1}</span>
                </div>
                <div className="image-button-item">
                  <input accept="image/*" id="contained-button-file2" multiple type="file" hidden onChange={this.onInputUploadImage2} />
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
                        <TableCell align='center'>Shots #</TableCell>
                        <TableCell align="center">X-Location</TableCell>
                        <TableCell align="center">Y-Location</TableCell>
                        <TableCell align="center">Distance from Hole</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {this.state.yoloData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" align='center'>
                            {index}
                          </TableCell>
                          <TableCell align="center">{row.x}</TableCell>
                          <TableCell align="center">{row.y}</TableCell>
                          <TableCell align="center">{row.distance}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableBody>
                      {this.state.yoloData2.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align='left'>{row.average}</TableCell>
                          <TableCell align="center">{row.average1}</TableCell>
                          <TableCell align="center">{row.average2}</TableCell>
                          <TableCell align="center">{row.average3}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableBody>
                      {this.state.yoloData2.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align='left'>{row.median}</TableCell>
                          <TableCell align="center">{row.median1}</TableCell>
                          <TableCell align="center">{row.median2}</TableCell>
                          <TableCell align="center">{row.median3}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableBody>
                      {this.state.yoloData2.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align='left'>{row.max}</TableCell>
                          <TableCell align="center">{row.max1}</TableCell>
                          <TableCell align="center">{row.max2}</TableCell>
                          <TableCell align="center">{row.max3}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableBody>
                      {this.state.yoloData2.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align='left'>{row.min}</TableCell>
                          <TableCell align="center">{row.min1}</TableCell>
                          <TableCell align="center">{row.min2}</TableCell>
                          <TableCell align="center">{row.min3}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableBody>
                      <TableCell align='left' colSpan={3}>Number of Shots: {this.state.yoloData.length}</TableCell>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        {/* } */}
        <footer>Copyright 2022</footer>
      </div>
    );
  }
}
export default App;
