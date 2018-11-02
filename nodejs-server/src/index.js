import React, { Component } from "react";
import ReactDOM from "react-dom";

class Fire extends React.Component {
  constructor(propos) {
      super(propos);
      this.state = {
          fire: []
      };
  }
  componentDidMount() {
      //table
      let self = this;
      fetch('http://127.0.0.1:8080/fire')
          .then(function (response) {
              if (response.status >= 400) {
                  throw new Error("Bad response from server");
              }
              return response.json();
          }).then(function (data) {
              self.setState({ fire: data });
          }).catch(err => {
              console.log('caught it!', err);
          })
  }

  componentDidUpdate(prevProps) {
      //table
      let self = this;
      fetch('http://127.0.0.1:8080/fire')
          .then(function (response) {
              if (response.status >= 400) {
                  throw new Error("Bad response from server");
              }
              return response.json();
          }).then(function (data) {
              self.setState({ fire: data });
          }).catch(err => {
              console.log('caught it!', err);
          })
  }


  render() {
      return (
          <div className="container">
              <div className="panel panel-default p50 uth-panel">
                  <table className="table table-hover" id="table">
                      <thead>
                          <tr>
                              <th>num</th>
                              <th>sensor_id</th>
                              <th>temperature</th>
                              <th>location</th>
                              <th>Time</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.fire.map(firedetect =>
                              <tr key={firedetect.num}>
                                  <td>{firedetect.num} </td>
                                  <td>{firedetect.sensor_id} </td>
                                  <td>{firedetect.temperature} </td>
                                  <td>{firedetect.location} </td>
                                  <td>{firedetect.time}</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  }

}

ReactDOM.render(<Fire />, document.getElementById('index'));