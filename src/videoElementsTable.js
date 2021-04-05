import React, { Component } from "react";
import VideoElement from "./videoElement";

export default class VideoElementsTable extends Component {
  render() {
    return (
      <table id="videoElementsTable">
        {makeOldTable(this.props.elements, this.props.callback)}
      </table>
    );
  }
}

function makeOldTable(els, callback) {
  return (
    <tbody>
      <tr>
        {els.videoMap.map((v, i) => (
          <td key={i}>
            <VideoElement val={v} callback={callback}></VideoElement>
          </td>
        ))}
      </tr>
    </tbody>
  );
}
