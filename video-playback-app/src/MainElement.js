import React, { Component } from "react";
import { Player } from "video-react";
import { Button, Label, Input } from "reactstrap";
import "../node_modules/video-react/dist/video-react.css";
import "./index.css";
import VideoElementsTable from "./videoElementsTable.js";

export default class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playerSource: "",
      videoMap: [],
      isUpdated: false,
    };

    this.handleAddVideo = this.handleAddVideo.bind(this);
    this.changeSelectedVideo = this.changeSelectedVideo.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
  }

  changeSelectedVideo(newUrl) {
    this.setState({
      playerSource: newUrl,
      isUpdated: true,
    });
  }

  addBookmark(newBookmark, currentTime) {
    let newVideoMap = this.state.videoMap;
    for (let i = 0; i < this.state.videoMap.length; i++) {
      if (newVideoMap[i].src === this.state.playerSource) {
        newVideoMap[i].bookmarks.push({
          Label: newBookmark,
          Time: currentTime,
        });
      }
    }
    this.setState({
      videoMap: newVideoMap,
    });
  }

  handleAddVideo(e) {
    const labelInput = document.getElementById("newVideoLabel");
    const newSrcInput = document.getElementById("newVideoSrc");
    const newLabel = labelInput.value;
    const newSrc = newSrcInput.value;

    if (newLabel === "") {
      addError(labelInput);
      return;
    }
    if (!newSrc || newSrc === "" || !isURL(newSrc)) {
      addError(newSrcInput);
      return;
    }
    labelInput.value = "";
    newSrcInput.value = "";
    this.setState({
      videoMap: this.state.videoMap.concat({
        label: newLabel,
        src: newSrc,
        bookmarks: [],
      }),
    });
  }

  render() {
    return (
      <div>
        <div id="addVideoContainer">
          <h1>Add Video</h1>
          <Input
            name="newVideoLabel"
            id="newVideoLabel"
            className="input"
            placeholder="Label"
          />
          <Input
            name="newVideoSrc"
            id="newVideoSrc"
            className="input"
            placeholder="src"
          />
          <Button id="addButton" type="button" onClick={this.handleAddVideo}>
            +
          </Button>
        </div>
        <div id="videosContainer">
          <VideoElementsTable
            elements={this.state}
            callback={this.changeSelectedVideo}
          ></VideoElementsTable>
        </div>
        <PlayerCustom
          state={this.state}
          el={this}
          addBookmarkToEl={this.addBookmark}
        />
      </div>
    );
  }
}
class PlayerCustom extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.seek = this.seek.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
  }
  componentDidMount() {
    // subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }

  handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.setState({
      player: state,
      currentTime: state.currentTime,
    });
  }

  addBookmark() {
    let label = document.getElementById("bookmarkInput");
    let val = label.value;
    if (val) {
      label.value = "";
      const { player } = this.player.getState();
      this.props.addBookmarkToEl(val, player.currentTime);
    } else {
      addError(label);
    }
  }
  seek(seconds) {
    this.player.actions.seek(seconds);
  }

  oldSrc = "";
  render() {
    let src = this.props.state.playerSource;
    if (this.player && this.oldSrc !== src) {
      this.player.load();
    }
    this.oldSrc = src;
    if (src) {
      return (
        <div>
          <Player
            ref={(player) => {
              this.player = player;
            }}
            videoId="video-1"
          >
            <source src={src} />
          </Player>
          <div className="bookmarksListContainer">
            <Label for="bookmarkName">Add New Bookmark</Label>
            <Input
              name="bookmarkInput"
              id="bookmarkInput"
              className="input space"
              placeholder="Label"
            />
            <Button type="button" onClick={this.addBookmark}>
              Bookmark
            </Button>
            <br></br>
            <AddBookmarks
              src={src}
              labels={this.props.state.videoMap}
              seek={this.seek}
            ></AddBookmarks>
          </div>
        </div>
      );
    } else {
      return (
        <Player
          ref={(player) => {
            this.player = player;
          }}
          videoId="video-1"
        ></Player>
      );
    }
  }
}

function AddBookmarks(props) {
  let videoMap = props.labels;
  let src = props.src;
  for (let i = 0; i < videoMap.length; i++) {
    if (videoMap[i].src === src) {
      var bookmarks = videoMap[i].bookmarks;
    }
  }
  const sorted = bookmarks.sort(function (a, b) {
    return a.Time - b.Time;
  });
  return (
    <div>
      {sorted.map((v, i) => (
        <Bookmark key={i} val={v} seek={props.seek}></Bookmark>
      ))}
    </div>
  );
}

function Bookmark(props) {
  return (
    <span
      className="bookmarkContainer"
      onClick={() => {
        props.seek(props.val.Time);
      }}
    >
      <span className="bookmarkText">{props.val.Label}</span>
      <span className="bookmarkTime">
        {Math.round(props.val.Time * 100) / 100}
      </span>
    </span>
  );
}

function addError(el) {
  el.classList.add("err");
  setTimeout(function () {
    el.classList.remove("err");
  }, 2000);
}

// Helper function to check is input url is valid.
function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
}
