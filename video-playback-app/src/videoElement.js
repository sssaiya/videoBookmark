import React, { Component } from "react";
export default class VideoElement extends Component {
  constructor(props, context) {
    super(props, context);

    this.changeSelectedVideo = this.changeSelectedVideo.bind(this);
  }
  changeSelectedVideo() {
    this.props.callback(this.props.val.src);
  }
  render() {
    return (
      <div className="videoContainer" onClick={this.changeSelectedVideo}>
        <video width="320" height="240">
          <source src={this.props.val.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h2 className="videoLabel">{this.props.val.label}</h2>
      </div>
    );
  }
}
